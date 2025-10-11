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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ABMService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABMService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const abm_token_entity_1 = require("./entities/abm-token.entity");
const crypto = __importStar(require("crypto"));
const https = __importStar(require("https"));
const querystring = __importStar(require("querystring"));
let ABMService = ABMService_1 = class ABMService {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
        this.logger = new common_1.Logger(ABMService_1.name);
        this.ABM_BASE_URL = 'https://mdmenrollment.apple.com';
    }
    async registerServerToken(tokenData) {
        this.logger.log(`Registering ABM server token for org: ${tokenData.orgName}`);
        const { accessToken, accessSecret } = await this.generateOAuthTokens(tokenData.consumerKey, tokenData.consumerSecret);
        const token = this.tokenRepository.create({
            ...tokenData,
            accessToken,
            accessSecret,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isActive: true,
        });
        const savedToken = await this.tokenRepository.save(token);
        try {
            await this.getAccount(savedToken.id);
            this.logger.log(`ABM token registered successfully for ${tokenData.orgName}`);
        }
        catch (error) {
            this.logger.error(`Failed to validate ABM token: ${error.message}`);
            await this.tokenRepository.update(savedToken.id, { isActive: false });
            throw error;
        }
        return savedToken;
    }
    async refreshToken(tokenId) {
        const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
        if (!token) {
            throw new Error('Token not found');
        }
        try {
            const { accessToken, accessSecret } = await this.generateOAuthTokens(token.consumerKey, token.consumerSecret);
            await this.tokenRepository.update(tokenId, {
                accessToken,
                accessSecret,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                isActive: true,
            });
            this.logger.log(`ABM token refreshed for org: ${token.orgName}`);
        }
        catch (error) {
            this.logger.error(`Failed to refresh ABM token: ${error.message}`);
            await this.tokenRepository.update(tokenId, { isActive: false });
            throw error;
        }
    }
    async getAccount(tokenId) {
        const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
        if (!token || !token.isActive) {
            throw new Error('Invalid or inactive token');
        }
        const response = await this.makeAuthenticatedRequest(token, 'GET', '/account');
        return response;
    }
    async getDevices(tokenId, cursor) {
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
    async assignDevice(tokenId, deviceSerialNumber, profileUuid) {
        const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
        if (!token || !token.isActive) {
            throw new Error('Invalid or inactive token');
        }
        const body = {
            devices: [deviceSerialNumber],
            profile_uuid: profileUuid,
        };
        const response = await this.makeAuthenticatedRequest(token, 'PUT', '/profile/devices', JSON.stringify(body));
        return response;
    }
    async unassignDevice(tokenId, deviceSerialNumber) {
        const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
        if (!token || !token.isActive) {
            throw new Error('Invalid or inactive token');
        }
        const body = {
            devices: [deviceSerialNumber],
        };
        const response = await this.makeAuthenticatedRequest(token, 'DELETE', '/profile/devices', JSON.stringify(body));
        return response;
    }
    async getProfiles(tokenId) {
        const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
        if (!token || !token.isActive) {
            throw new Error('Invalid or inactive token');
        }
        const response = await this.makeAuthenticatedRequest(token, 'GET', '/profile');
        return response;
    }
    async createProfile(tokenId, profileData) {
        const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
        if (!token || !token.isActive) {
            throw new Error('Invalid or inactive token');
        }
        const response = await this.makeAuthenticatedRequest(token, 'POST', '/profile', JSON.stringify(profileData));
        return response;
    }
    async generateOAuthTokens(consumerKey, consumerSecret) {
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
                            accessToken: parsed.oauth_token,
                            accessSecret: parsed.oauth_token_secret,
                        });
                    }
                    else {
                        reject(new Error(`OAuth token generation failed: ${res.statusCode} ${data}`));
                    }
                });
            });
            req.on('error', reject);
            req.write(postData);
            req.end();
        });
    }
    async makeAuthenticatedRequest(token, method, path, body) {
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
        const authHeader = `OAuth ${Object.entries({ ...oauthParams, oauth_signature: signature })
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
                        }
                        catch {
                            resolve(data);
                        }
                    }
                    else {
                        reject(new Error(`ABM API request failed: ${res.statusCode} ${data}`));
                    }
                });
            });
            req.on('error', reject);
            if (body)
                req.write(body);
            req.end();
        });
    }
    createSignatureBaseString(method, url, params) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        return `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    }
};
exports.ABMService = ABMService;
exports.ABMService = ABMService = ABMService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(abm_token_entity_1.ABMToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ABMService);
//# sourceMappingURL=abm.service.js.map