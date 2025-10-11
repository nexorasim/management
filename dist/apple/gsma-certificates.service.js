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
var GSMACertificatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSMACertificatesService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const https = __importStar(require("https"));
let GSMACertificatesService = GSMACertificatesService_1 = class GSMACertificatesService {
    constructor() {
        this.logger = new common_1.Logger(GSMACertificatesService_1.name);
        this.GSMA_ROOT_CIS = {
            'RSP2_ROOT_CI1': {
                keyId: '81370f5125d0b1d408d4c3b232e6d25e795bebfb',
                specs: ['SGP.21', 'SGP.22v2', 'SGP.22v3'],
                ca: 'DigiCert',
                expiresAt: '2052-02-21',
                crl: 'http://gsma-crl.symauth.com/offlineca/gsma-rsp2-root-ci1.crl'
            },
            'M2M31_ROOT_CI2': {
                keyId: 'd7a7d0c7c04ea76076e3f44faebde8779e2948d4',
                specs: ['SGP.01', 'SGP.02'],
                ca: 'Cybertrust',
                expiresAt: '2052-03-15',
                crl: null
            },
            'OISITE_GSMA_CI_G1': {
                keyId: '4c27967ad20c14b391e9601e41e604ad57c0222f',
                specs: ['SGP.21', 'SGP.22v2', 'SGP.22v3'],
                ca: 'WISeKey',
                expiresAt: '2059-01-07',
                crl: 'http://public.wisekey.com/crl/ogsmacig1.crl'
            }
        };
    }
    async validateESIMCertificate(certificateChain) {
        for (const [ciName, ciInfo] of Object.entries(this.GSMA_ROOT_CIS)) {
            try {
                const isValid = await this.verifyCertificateChain(certificateChain, ciInfo.keyId);
                if (isValid) {
                    return { isValid: true, rootCI: ciName };
                }
            }
            catch (error) {
                this.logger.debug(`Certificate validation failed for ${ciName}: ${error.message}`);
            }
        }
        return { isValid: false };
    }
    async verifyCertificateChain(chain, rootKeyId) {
        const rootCert = chain[chain.length - 1];
        const certKeyId = this.extractKeyId(rootCert);
        return certKeyId === rootKeyId;
    }
    extractKeyId(certificate) {
        const cert = crypto.createCertificate();
        return crypto.createHash('sha1').update(certificate).digest('hex');
    }
    async checkCRL(ciName) {
        const ci = this.GSMA_ROOT_CIS[ciName];
        if (!ci?.crl)
            return true;
        return new Promise((resolve) => {
            https.get(ci.crl, (res) => {
                resolve(res.statusCode === 200);
            }).on('error', () => resolve(false));
        });
    }
    getSupportedSpecs() {
        return ['SGP.01', 'SGP.02', 'SGP.21', 'SGP.22v2', 'SGP.22v3', 'SGP.22v3.1'];
    }
    supportsDeviceChange(spec) {
        return ['SGP.22v3', 'SGP.22v3.1'].includes(spec);
    }
};
exports.GSMACertificatesService = GSMACertificatesService;
exports.GSMACertificatesService = GSMACertificatesService = GSMACertificatesService_1 = __decorate([
    (0, common_1.Injectable)()
], GSMACertificatesService);
//# sourceMappingURL=gsma-certificates.service.js.map