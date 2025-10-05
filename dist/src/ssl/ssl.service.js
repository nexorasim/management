"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSLService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let SSLService = class SSLService {
    constructor() {
        this.loadCertificates();
    }
    loadCertificates() {
        const certsPath = path.join(process.cwd(), 'certs');
        try {
            this.caCert = fs.readFileSync(path.join(certsPath, 'ca.cert'), 'utf8');
            this.clientCert = fs.readFileSync(path.join(certsPath, 'client.cert'), 'utf8');
            this.clientKey = fs.readFileSync(path.join(certsPath, 'client.key'), 'utf8');
        }
        catch (error) {
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
    validateOAuthCallback(url) {
        const allowedCallbacks = [
            'https://oauth.ez-es.net/oauth_callback',
            'https://inbound.ez-es.net',
            process.env.OAUTH_CALLBACK_URL,
        ];
        return allowedCallbacks.includes(url);
    }
};
exports.SSLService = SSLService;
exports.SSLService = SSLService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SSLService);
//# sourceMappingURL=ssl.service.js.map