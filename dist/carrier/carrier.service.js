"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarrierService = void 0;
const common_1 = require("@nestjs/common");
let CarrierService = class CarrierService {
    constructor() {
        this.carriers = [
            {
                id: 'mpt-mm',
                name: 'MPT Myanmar',
                pmsEndpoint: 'https://pms.mpt.com.mm/api',
                entitlementEndpoint: 'https://entitlement.mpt.com.mm/api',
                apiKey: process.env.MPT_API_KEY || 'mpt-key',
                isActive: true,
            },
            {
                id: 'atom-mm',
                name: 'ATOM Myanmar',
                pmsEndpoint: 'https://pms.atom.com.mm/api',
                entitlementEndpoint: 'https://entitlement.atom.com.mm/api',
                apiKey: process.env.ATOM_API_KEY || 'atom-key',
                isActive: true,
            },
            {
                id: 'ooredoo-mm',
                name: 'Ooredoo Myanmar',
                pmsEndpoint: 'https://pms.ooredoo.com.mm/api',
                entitlementEndpoint: 'https://entitlement.ooredoo.com.mm/api',
                apiKey: process.env.OOREDOO_API_KEY || 'ooredoo-key',
                isActive: true,
            },
            {
                id: 'mytel-mm',
                name: 'Mytel Myanmar',
                pmsEndpoint: 'https://pms.mytel.com.mm/api',
                entitlementEndpoint: 'https://entitlement.mytel.com.mm/api',
                apiKey: process.env.MYTEL_API_KEY || 'mytel-key',
                isActive: true,
            },
        ];
    }
    getAll() {
        return this.carriers.filter(c => c.isActive);
    }
    getById(id) {
        return this.carriers.find(c => c.id === id && c.isActive);
    }
    async syncWithPMS(carrierId, profileData) {
        const carrier = this.getById(carrierId);
        if (!carrier)
            throw new Error('Carrier not found');
        console.log(`Syncing with ${carrier.name} PMS:`, profileData);
        return { success: true, carrier: carrier.name };
    }
};
exports.CarrierService = CarrierService;
exports.CarrierService = CarrierService = __decorate([
    (0, common_1.Injectable)()
], CarrierService);
//# sourceMappingURL=carrier.service.js.map