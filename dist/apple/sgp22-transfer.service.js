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
var SGP22TransferService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SGP22TransferService = void 0;
const common_1 = require("@nestjs/common");
const esim_service_1 = require("./esim.service");
const crypto = __importStar(require("crypto"));
let SGP22TransferService = SGP22TransferService_1 = class SGP22TransferService {
    constructor(esimService) {
        this.esimService = esimService;
        this.logger = new common_1.Logger(SGP22TransferService_1.name);
    }
    async initiateDeviceChange(profileId, sourceEid, targetEid) {
        const transferId = crypto.randomUUID();
        const transferRequest = {
            transferId,
            sourceEid,
            targetEid,
            profileId,
            timestamp: new Date().toISOString(),
            status: 'initiated'
        };
        await this.esimService.updateProfile(profileId, {
            transferRequestId: transferId,
            status: 'transfer_pending'
        });
        return transferId;
    }
    async executeProfileRecovery(transferId) {
        const profile = await this.esimService.getProfileByTransferId(transferId);
        if (!profile) {
            throw new Error('Transfer request not found');
        }
        const recoveryCode = this.generateRecoveryCode(profile.iccid, transferId);
        await this.esimService.updateProfile(profile.id, {
            activationCode: recoveryCode,
            status: 'recovery_ready'
        });
    }
    generateRecoveryCode(iccid, transferId) {
        const hash = crypto.createHash('sha256')
            .update(`${iccid}${transferId}${Date.now()}`)
            .digest('hex');
        return `LPA:1$recovery$${hash.substring(0, 16)}`;
    }
};
exports.SGP22TransferService = SGP22TransferService;
exports.SGP22TransferService = SGP22TransferService = SGP22TransferService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [esim_service_1.ESIMService])
], SGP22TransferService);
//# sourceMappingURL=sgp22-transfer.service.js.map