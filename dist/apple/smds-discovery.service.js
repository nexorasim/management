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
var SMDSDiscoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMDSDiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const https = __importStar(require("https"));
let SMDSDiscoveryService = SMDSDiscoveryService_1 = class SMDSDiscoveryService {
    constructor() {
        this.logger = new common_1.Logger(SMDSDiscoveryService_1.name);
        this.SMDS_SERVERS = {
            'GSMA': {
                address: 'lpa.ds.gsma.com',
                keyId: '81370f5125d0b1d408d4c3b232e6d25e795bebfb',
                provider: 'Thales'
            },
            'ESIM_DISCOVERY_PROD': {
                address: 'lpa.live.esimdiscovery.com',
                keyId: '81370f5125d0b1d408d4c3b232e6d25e795bebfb',
                provider: 'Thales'
            },
            'ESIM_DISCOVERY_STAGING': {
                address: 'lpa.live.esimdiscovery.dev',
                keyId: '81370f5125d0b1d408d4c3b232e6d25e795bebfb',
                provider: 'Thales'
            }
        };
    }
    async discoverProfiles(eid) {
        const discoveries = await Promise.allSettled(Object.values(this.SMDS_SERVERS).map(server => this.querySMDS(server.address, eid)));
        return discoveries
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value)
            .flat();
    }
    async querySMDS(address, eid) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: address,
                port: 443,
                path: `/gsma/rsp2/es9plus/discovery/${eid}`,
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            };
            https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch {
                        resolve([]);
                    }
                });
            }).on('error', reject).end();
        });
    }
};
exports.SMDSDiscoveryService = SMDSDiscoveryService;
exports.SMDSDiscoveryService = SMDSDiscoveryService = SMDSDiscoveryService_1 = __decorate([
    (0, common_1.Injectable)()
], SMDSDiscoveryService);
//# sourceMappingURL=smds-discovery.service.js.map