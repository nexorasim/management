"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var APNsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APNsService = void 0;
const common_1 = require("@nestjs/common");
const apn = __importStar(require("apn"));
const fs = __importStar(require("fs"));
let APNsService = APNsService_1 = class APNsService {
    constructor() {
        this.logger = new common_1.Logger(APNsService_1.name);
        this.initializeProvider();
    }
    initializeProvider() {
        try {
            const certPath = process.env.APNS_CERT_PATH || '/app/certs/apns-cert.pem';
            const keyPath = process.env.APNS_KEY_PATH || '/app/certs/apns-key.pem';
            if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
                this.logger.warn('APNs certificates not found. Push notifications will not work.');
                return;
            }
            const options = {
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
        }
        catch (error) {
            this.logger.error(`Failed to initialize APNs provider: ${error.message}`);
        }
    }
    async sendPushNotification(deviceToken, pushMagic) {
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
        notification.headers = {
            'apns-push-type': 'mdm',
            'apns-topic': 'com.apple.mgmt.External',
        };
        notification.mdm = pushMagic;
        try {
            const result = await this.provider.send(notification, deviceToken);
            if (result.failed && result.failed.length > 0) {
                const failure = result.failed[0];
                this.logger.error(`APNs push failed: ${failure.error} for device ${failure.device}`);
                throw new Error(`Push notification failed: ${failure.error}`);
            }
            this.logger.log(`Push notification sent successfully to device ${deviceToken.substring(0, 8)}...`);
        }
        catch (error) {
            this.logger.error(`Failed to send push notification: ${error.message}`);
            throw error;
        }
    }
    async sendBulkPushNotifications(devices) {
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
            const promises = notifications.map(({ notification, token }) => this.provider.send(notification, token));
            const results = await Promise.allSettled(promises);
            let successCount = 0;
            let failureCount = 0;
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    if (result.value.failed && result.value.failed.length > 0) {
                        failureCount++;
                        this.logger.error(`Bulk push failed for device ${index}: ${result.value.failed[0].error}`);
                    }
                    else {
                        successCount++;
                    }
                }
                else {
                    failureCount++;
                    this.logger.error(`Bulk push error for device ${index}: ${result.reason}`);
                }
            });
            this.logger.log(`Bulk push notifications completed: ${successCount} success, ${failureCount} failures`);
        }
        catch (error) {
            this.logger.error(`Bulk push notification failed: ${error.message}`);
            throw error;
        }
    }
    async validateCertificates() {
        try {
            const certPath = process.env.APNS_CERT_PATH || '/app/certs/apns-cert.pem';
            if (!fs.existsSync(certPath)) {
                return { isValid: false, error: 'Certificate file not found' };
            }
            const certContent = fs.readFileSync(certPath, 'utf8');
            const cert = require('crypto').createCertificate();
            const certLines = certContent.split('\n');
            const certData = certLines
                .filter(line => !line.includes('-----'))
                .join('');
            const certBuffer = Buffer.from(certData, 'base64');
            const now = new Date();
            const expiresAt = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));
            return {
                isValid: true,
                expiresAt,
            };
        }
        catch (error) {
            return {
                isValid: false,
                error: error.message,
            };
        }
    }
    async renewCertificate(newCertPath, newKeyPath) {
        try {
            if (!fs.existsSync(newCertPath) || !fs.existsSync(newKeyPath)) {
                throw new Error('New certificate files not found');
            }
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
            fs.copyFileSync(newCertPath, oldCertPath);
            fs.copyFileSync(newKeyPath, oldKeyPath);
            if (this.provider) {
                this.provider.shutdown();
            }
            this.initializeProvider();
            this.logger.log('APNs certificates renewed successfully');
        }
        catch (error) {
            this.logger.error(`Failed to renew APNs certificates: ${error.message}`);
            throw error;
        }
    }
    getConnectionStatus() {
        if (!this.provider) {
            return { connected: false, lastError: 'Provider not initialized' };
        }
        return { connected: true };
    }
    async shutdown() {
        if (this.provider) {
            await this.provider.shutdown();
            this.logger.log('APNs provider shut down');
        }
    }
};
exports.APNsService = APNsService;
exports.APNsService = APNsService = APNsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], APNsService);
//# sourceMappingURL=apns.service.js.map