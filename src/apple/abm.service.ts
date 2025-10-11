import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ABMToken } from './entities/abm-token.entity';
import * as crypto from 'crypto';
import * as https from 'https';
import * as querystring from 'querystring';

@Injectable()
export class ABMService {
  private readonly logger = new Logger(ABMService.name);
  private readonly ABM_BASE_URL = 'https://mdmenrollment.apple.com';

  constructor(
    @InjectRepository(ABMToken)
    private tokenRepository: Repository<ABMToken>,
  ) {}

  async registerServerToken(tokenData: {
    orgId: string;
    orgName: string;
    serverToken: string;
    consumerKey: string;
    consumerSecret: string;
  }): Promise<ABMToken> {
    this.logger.log(`Registering ABM server token for org: ${tokenData.orgName}`);

    // Generate initial OAuth tokens
    const { accessToken, accessSecret } = await this.generateOAuthTokens(
      tokenData.consumerKey,
      tokenData.consumerSecret
    );

    const token = this.tokenRepository.create({
      ...tokenData,
      accessToken,
      accessSecret,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: true,
    });

    const savedToken = await this.tokenRepository.save(token);

    // Test the connection
    try {
      await this.getAccount(savedToken.id);
      this.logger.log(`ABM token registered successfully for ${tokenData.orgName}`);
    } catch (error) {
      this.logger.error(`Failed to validate ABM token: ${error.message}`);
      await this.tokenRepository.update(savedToken.id, { isActive: false });
      throw error;
    }

    return savedToken;
  }

  async refreshToken(tokenId: string): Promise<void> {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (!token) {
      throw new Error('Token not found');
    }

    try {
      const { accessToken, accessSecret } = await this.generateOAuthTokens(
        token.consumerKey,
        token.consumerSecret
      );

      await this.tokenRepository.update(tokenId, {
        accessToken,
        accessSecret,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      });

      this.logger.log(`ABM token refreshed for org: ${token.orgName}`);
    } catch (error) {
      this.logger.error(`Failed to refresh ABM token: ${error.message}`);
      await this.tokenRepository.update(tokenId, { isActive: false });
      throw error;
    }
  }

  async getAccount(tokenId: string): Promise<any> {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (!token || !token.isActive) {
      throw new Error('Invalid or inactive token');
    }

    const response = await this.makeAuthenticatedRequest(token, 'GET', '/account');
    return response;
  }

  async getDevices(tokenId: string, cursor?: string): Promise<any> {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (!token || !token.isActive) {
      throw new Error('Invalid or inactive token');
    }

    let url = '/devices';
    if (cursor) {
      url += `?cursor=${encodeURIComponent(cursor)}`;
    }

    const response = await this.makeAuthenticatedRequest(token, 'GET', url);
    return response;
  }

  async assignDevice(tokenId: string, deviceSerialNumber: string, profileUuid: string): Promise<any> {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (!token || !token.isActive) {
      throw new Error('Invalid or inactive token');
    }

    const body = {
      devices: [deviceSerialNumber],
      profile_uuid: profileUuid,
    };

    const response = await this.makeAuthenticatedRequest(
      token,
      'PUT',
      '/profile/devices',
      JSON.stringify(body)
    );

    return response;
  }

  async unassignDevice(tokenId: string, deviceSerialNumber: string): Promise<any> {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (!token || !token.isActive) {
      throw new Error('Invalid or inactive token');
    }

    const body = {
      devices: [deviceSerialNumber],
    };

    const response = await this.makeAuthenticatedRequest(
      token,
      'DELETE',
      '/profile/devices',
      JSON.stringify(body)
    );

    return response;
  }

  async getProfiles(tokenId: string): Promise<any> {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (!token || !token.isActive) {
      throw new Error('Invalid or inactive token');
    }

    const response = await this.makeAuthenticatedRequest(token, 'GET', '/profile');
    return response;
  }

  async createProfile(tokenId: string, profileData: any): Promise<any> {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (!token || !token.isActive) {
      throw new Error('Invalid or inactive token');
    }

    const response = await this.makeAuthenticatedRequest(
      token,
      'POST',
      '/profile',
      JSON.stringify(profileData)
    );

    return response;
  }

  private async generateOAuthTokens(consumerKey: string, consumerSecret: string): Promise<{
    accessToken: string;
    accessSecret: string;
  }> {
    // OAuth 1.0a implementation for Apple Business Manager
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');

    const oauthParams = {
      oauth_consumer_key: consumerKey,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA256',
      oauth_timestamp: timestamp,
      oauth_version: '1.0',
    };

    const baseString = this.createSignatureBaseString('POST', `${this.ABM_BASE_URL}/session`, oauthParams);
    const signingKey = `${encodeURIComponent(consumerSecret)}&`;
    const signature = crypto.createHmac('sha256', signingKey).update(baseString).digest('base64');

    oauthParams['oauth_signature'] = signature;

    return new Promise((resolve, reject) => {
      const postData = querystring.stringify(oauthParams);
      const options = {
        hostname: 'mdmenrollment.apple.com',
        port: 443,
        path: '/session',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const parsed = querystring.parse(data);
            resolve({
              accessToken: parsed.oauth_token as string,
              accessSecret: parsed.oauth_token_secret as string,
            });
          } else {
            reject(new Error(`OAuth token generation failed: ${res.statusCode} ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  private async makeAuthenticatedRequest(
    token: ABMToken,
    method: string,
    path: string,
    body?: string
  ): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');

    const oauthParams = {
      oauth_consumer_key: token.consumerKey,
      oauth_token: token.accessToken,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA256',
      oauth_timestamp: timestamp,
      oauth_version: '1.0',
    };

    const baseString = this.createSignatureBaseString(method, `${this.ABM_BASE_URL}${path}`, oauthParams);
    const signingKey = `${encodeURIComponent(token.consumerSecret)}&${encodeURIComponent(token.accessSecret)}`;
    const signature = crypto.createHmac('sha256', signingKey).update(baseString).digest('base64');

    const authHeader = `OAuth ${Object.entries({...oauthParams, oauth_signature: signature})
      .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
      .join(', ')}`;

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'mdmenrollment.apple.com',
        port: 443,
        path,
        method,
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          ...(body && { 'Content-Length': Buffer.byteLength(body) }),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve(data);
            }
          } else {
            reject(new Error(`ABM API request failed: ${res.statusCode} ${data}`));
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    });
  }

  private createSignatureBaseString(method: string, url: string, params: any): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    return `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  }
}