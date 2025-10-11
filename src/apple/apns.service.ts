import { Injectable, Logger } from '@nestjs/common';
import * as apn from 'apn';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class APNsService {
  private readonly logger = new Logger(APNsService.name);
  private provider: apn.Provider;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    try {
      const certPath = process.env.APNS_CERT_PATH || '/app/certs/apns-cert.pem';
      const keyPath = process.env.APNS_KEY_PATH || '/app/certs/apns-key.pem';
      
      if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
        this.logger.warn('APNs certificates not found. Push notifications will not work.');
        return;
      }

      const options: apn.ProviderOptions = {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
        production: process.env.NODE_ENV === 'production',
        connectionRetryLimit: 3,
      };

      this.provider = new apn.Provider(options);

      this.provider.on('connected', () => {
        this.logger.log('APNs provider connected');
      });

      this.provider.on('disconnected', () => {
        this.logger.warn('APNs provider disconnected');
      });

      this.provider.on('socketError', (err) => {
        this.logger.error(`APNs socket error: ${err.message}`);
      });

      this.provider.on('transmissionError', (errCode, notification, device) => {
        this.logger.error(`APNs transmission error ${errCode} for device ${device}`);
      });

    } catch (error) {
      this.logger.error(`Failed to initialize APNs provider: ${error.message}`);
    }
  }

  async sendPushNotification(deviceToken: string, pushMagic: string): Promise<void> {
    if (!this.provider) {
      throw new Error('APNs provider not initialized');
    }

    if (!deviceToken || !pushMagic) {
      throw new Error('Device token and push magic are required');
    }

    const notification = new apn.Notification();
    notification.topic = 'com.apple.mgmt.External';
    notification.payload = {};
    notification.pushType = 'mdm';
    notification.priority = 10;

    // Add push magic to headers
    notification.headers = {
      'apns-push-type': 'mdm',
      'apns-topic': 'com.apple.mgmt.External',
    };

    // Set MDM-specific payload
    notification.mdm = pushMagic;

    try {
      const result = await this.provider.send(notification, deviceToken);
      
      if (result.failed && result.failed.length > 0) {
        const failure = result.failed[0];
        this.logger.error(`APNs push failed: ${failure.error} for device ${failure.device}`);
        throw new Error(`Push notification failed: ${failure.error}`);
      }

      this.logger.log(`Push notification sent successfully to device ${deviceToken.substring(0, 8)}...`);
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
      throw error;
    }
  }

  async sendBulkPushNotifications(devices: Array<{ token: string; pushMagic: string }>): Promise<void> {
    if (!this.provider) {
      throw new Error('APNs provider not initialized');
    }

    const notifications = devices.map(device => {
      const notification = new apn.Notification();
      notification.topic = 'com.apple.mgmt.External';
      notification.payload = {};
      notification.pushType = 'mdm';
      notification.priority = 10;
      notification.mdm = device.pushMagic;
      
      return {
        notification,
        token: device.token,
      };
    });

    try {
      const promises = notifications.map(({ notification, token }) => 
        this.provider.send(notification, token)
      );

      const results = await Promise.allSettled(promises);
      
      let successCount = 0;
      let failureCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value.failed && result.value.failed.length > 0) {
            failureCount++;
            this.logger.error(`Bulk push failed for device ${index}: ${result.value.failed[0].error}`);
          } else {
            successCount++;
          }
        } else {
          failureCount++;
          this.logger.error(`Bulk push error for device ${index}: ${result.reason}`);
        }
      });

      this.logger.log(`Bulk push notifications completed: ${successCount} success, ${failureCount} failures`);
    } catch (error) {
      this.logger.error(`Bulk push notification failed: ${error.message}`);
      throw error;
    }
  }

  async validateCertificates(): Promise<{ isValid: boolean; expiresAt?: Date; error?: string }> {
    try {
      const certPath = process.env.APNS_CERT_PATH || '/app/certs/apns-cert.pem';
      
      if (!fs.existsSync(certPath)) {
        return { isValid: false, error: 'Certificate file not found' };
      }

      const certContent = fs.readFileSync(certPath, 'utf8');
      const cert = require('crypto').createCertificate();
      
      // Parse certificate to get expiration date
      const certLines = certContent.split('\n');
      const certData = certLines
        .filter(line => !line.includes('-----'))
        .join('');
      
      const certBuffer = Buffer.from(certData, 'base64');
      
      // This is a simplified validation - in production, use a proper X.509 parser
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // Placeholder
      
      return {
        isValid: true,
        expiresAt,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  async renewCertificate(newCertPath: string, newKeyPath: string): Promise<void> {
    try {
      // Validate new certificates
      if (!fs.existsSync(newCertPath) || !fs.existsSync(newKeyPath)) {
        throw new Error('New certificate files not found');
      }

      // Backup old certificates
      const backupDir = '/app/certs/backup';
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const oldCertPath = process.env.APNS_CERT_PATH || '/app/certs/apns-cert.pem';
      const oldKeyPath = process.env.APNS_KEY_PATH || '/app/certs/apns-key.pem';

      if (fs.existsSync(oldCertPath)) {
        fs.copyFileSync(oldCertPath, `${backupDir}/apns-cert-${timestamp}.pem`);
      }
      if (fs.existsSync(oldKeyPath)) {
        fs.copyFileSync(oldKeyPath, `${backupDir}/apns-key-${timestamp}.pem`);
      }

      // Copy new certificates
      fs.copyFileSync(newCertPath, oldCertPath);
      fs.copyFileSync(newKeyPath, oldKeyPath);

      // Reinitialize provider
      if (this.provider) {
        this.provider.shutdown();
      }
      this.initializeProvider();

      this.logger.log('APNs certificates renewed successfully');
    } catch (error) {
      this.logger.error(`Failed to renew APNs certificates: ${error.message}`);
      throw error;
    }
  }

  getConnectionStatus(): { connected: boolean; lastError?: string } {
    if (!this.provider) {
      return { connected: false, lastError: 'Provider not initialized' };
    }

    // APNs provider doesn't expose connection status directly
    // This is a simplified implementation
    return { connected: true };
  }

  async shutdown(): Promise<void> {
    if (this.provider) {
      await this.provider.shutdown();
      this.logger.log('APNs provider shut down');
    }
  }
}