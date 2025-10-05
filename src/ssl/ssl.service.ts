import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SSLService {
  private caCert: string;
  private clientCert: string;
  private clientKey: string;

  constructor() {
    this.loadCertificates();
  }

  private loadCertificates() {
    const certsPath = path.join(process.cwd(), 'certs');
    
    try {
      this.caCert = fs.readFileSync(path.join(certsPath, 'ca.cert'), 'utf8');
      this.clientCert = fs.readFileSync(path.join(certsPath, 'client.cert'), 'utf8');
      this.clientKey = fs.readFileSync(path.join(certsPath, 'client.key'), 'utf8');
    } catch (error) {
      console.warn('SSL certificates not found, using development mode');
    }
  }

  getSSLConfig() {
    return {
      ca: this.caCert,
      cert: this.clientCert,
      key: this.clientKey,
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    };
  }

  validateOAuthCallback(url: string): boolean {
    const allowedCallbacks = [
      'https://oauth.ez-es.net/oauth_callback',
      'https://inbound.ez-es.net',
      process.env.OAUTH_CALLBACK_URL,
    ];
    
    return allowedCallbacks.includes(url);
  }
}