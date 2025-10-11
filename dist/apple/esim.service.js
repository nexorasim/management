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
var ESIMService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESIMService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const esim_profile_entity_1 = require("./entities/esim-profile.entity");
const apple_device_entity_1 = require("./entities/apple-device.entity");
const mdm_service_1 = require("./mdm.service");
const crypto = __importStar(require("crypto"));
let ESIMService = ESIMService_1 = class ESIMService {
    constructor(profileRepository, deviceRepository, mdmService) {
        this.profileRepository = profileRepository;
        this.deviceRepository = deviceRepository;
        this.mdmService = mdmService;
        this.logger = new common_1.Logger(ESIMService_1.name);
    }
    async createProfile(profileData) {
        this.logger.log(`Creating eSIM profile for ICCID: ${profileData.iccid}`);
        const profile = this.profileRepository.create({
            ...profileData,
            status: 'pending',
        });
        return this.profileRepository.save(profile);
    }
    async installProfile(profileId, deviceId) {
        const profile = await this.profileRepository.findOne({ where: { id: profileId } });
        const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
        if (!profile || !device) {
            throw new Error('Profile or device not found');
        }
        this.logger.log(`Installing eSIM profile ${profileId} on device ${deviceId}`);
        const cellularPayload = {
            PayloadType: 'com.apple.cellular',
            PayloadIdentifier: `com.myesimplus.esim.${profileId}`,
            PayloadUUID: profileId,
            PayloadDisplayName: `${profile.carrier} eSIM`,
            PayloadDescription: `eSIM profile for ${profile.carrier} - ${profile.plan}`,
            PayloadVersion: 1,
            CellularData: [{
                    SMDP: profile.smdpAddress,
                    ICCID: profile.iccid,
                    PIN: profile.confirmationCode,
                    ActivationCode: profile.activationCode,
                }],
            AttachAPN: {
                Name: this.getAPNForCarrier(profile.carrier),
                AuthenticationType: 'CHAP',
                Username: 'user',
                Password: 'pass',
            },
        };
        await this.mdmService.sendInstallProfileCommand(deviceId, cellularPayload);
        await this.profileRepository.update(profileId, {
            deviceId,
            status: 'installing',
            installationDate: new Date(),
        });
    }
    async activateProfile(profileId) {
        this.logger.log(`Activating eSIM profile: ${profileId}`);
        const profile = await this.profileRepository.findOne({ where: { id: profileId } });
        if (!profile) {
            throw new Error('Profile not found');
        }
        await this.sendSMDPCommand(profile.smdpAddress, 'activate', {
            iccid: profile.iccid,
            eid: profile.eid,
            confirmationCode: profile.confirmationCode,
        });
        await this.profileRepository.update(profileId, {
            status: 'active',
            activationDate: new Date(),
        });
    }
    async suspendProfile(profileId) {
        this.logger.log(`Suspending eSIM profile: ${profileId}`);
        const profile = await this.profileRepository.findOne({ where: { id: profileId } });
        if (!profile) {
            throw new Error('Profile not found');
        }
        await this.sendSMDPCommand(profile.smdpAddress, 'suspend', {
            iccid: profile.iccid,
            eid: profile.eid,
        });
        await this.profileRepository.update(profileId, {
            status: 'suspended',
            suspensionDate: new Date(),
        });
    }
    async deleteProfile(profileId) {
        this.logger.log(`Deleting eSIM profile: ${profileId}`);
        const profile = await this.profileRepository.findOne({
            where: { id: profileId },
            relations: ['device']
        });
        if (!profile) {
            throw new Error('Profile not found');
        }
        if (profile.device) {
            await this.mdmService.sendRemoveProfileCommand(profile.device.id, `com.myesimplus.esim.${profileId}`);
        }
        await this.sendSMDPCommand(profile.smdpAddress, 'delete', {
            iccid: profile.iccid,
            eid: profile.eid,
        });
        await this.profileRepository.update(profileId, {
            status: 'deleted',
            deletionDate: new Date(),
            deviceId: null,
        });
    }
    async transferProfile(profileId, sourceDeviceId, targetDeviceId) {
        this.logger.log(`Transferring eSIM profile ${profileId} from ${sourceDeviceId} to ${targetDeviceId}`);
        const profile = await this.profileRepository.findOne({ where: { id: profileId } });
        const sourceDevice = await this.deviceRepository.findOne({ where: { id: sourceDeviceId } });
        const targetDevice = await this.deviceRepository.findOne({ where: { id: targetDeviceId } });
        if (!profile || !sourceDevice || !targetDevice) {
            throw new Error('Profile or devices not found');
        }
        if (!profile.isTransferEligible) {
            throw new Error('Profile is not eligible for transfer');
        }
        const transferRequestId = crypto.randomUUID();
        try {
            await this.suspendProfile(profileId);
            await this.mdmService.sendRemoveProfileCommand(sourceDeviceId, `com.myesimplus.esim.${profileId}`);
            const newActivationCode = await this.generateTransferActivationCode(profile, targetDevice.eid);
            await this.profileRepository.update(profileId, {
                activationCode: newActivationCode,
                deviceId: targetDeviceId,
                status: 'transferring',
                transferRequestId,
            });
            await this.installProfile(profileId, targetDeviceId);
            await this.activateProfile(profileId);
            this.logger.log(`eSIM profile transfer completed: ${profileId}`);
        }
        catch (error) {
            this.logger.error(`eSIM profile transfer failed: ${error.message}`);
            await this.profileRepository.update(profileId, {
                deviceId: sourceDeviceId,
                status: 'active',
                transferRequestId: null,
            });
            throw error;
        }
    }
    async getProfileStatus(profileId) {
        const profile = await this.profileRepository.findOne({
            where: { id: profileId },
            relations: ['device'],
        });
        if (!profile) {
            throw new Error('Profile not found');
        }
        const smdpStatus = await this.querySMDPStatus(profile.smdpAddress, profile.iccid);
        return {
            id: profile.id,
            iccid: profile.iccid,
            status: profile.status,
            carrier: profile.carrier,
            plan: profile.plan,
            device: profile.device ? {
                id: profile.device.id,
                name: profile.device.deviceName,
                udid: profile.device.udid,
            } : null,
            installationDate: profile.installationDate,
            activationDate: profile.activationDate,
            smdpStatus,
            isTransferEligible: profile.isTransferEligible,
        };
    }
    async listProfiles(deviceId) {
        const query = this.profileRepository.createQueryBuilder('profile')
            .leftJoinAndSelect('profile.device', 'device');
        if (deviceId) {
            query.where('profile.deviceId = :deviceId', { deviceId });
        }
        return query.orderBy('profile.createdAt', 'DESC').getMany();
    }
    async sendSMDPCommand(smdpAddress, command, params) {
        this.logger.log(`Sending SM-DP+ command: ${command} to ${smdpAddress}`);
        const payload = {
            command,
            timestamp: new Date().toISOString(),
            ...params,
        };
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: 'success', commandId: crypto.randomUUID() });
            }, 1000);
        });
    }
    async querySMDPStatus(smdpAddress, iccid) {
        this.logger.log(`Querying SM-DP+ status for ICCID: ${iccid}`);
        return {
            profileState: 'ENABLED',
            downloadCounter: 1,
            lastStatusChange: new Date().toISOString(),
        };
    }
    async generateTransferActivationCode(profile, targetEID) {
        const timestamp = Date.now().toString();
        const hash = crypto.createHash('sha256')
            .update(`${profile.iccid}${targetEID}${timestamp}`)
            .digest('hex');
        return `LPA:1$${profile.smdpAddress}$${hash.substring(0, 16)}`;
    }
    getAPNForCarrier(carrier) {
        const apnMap = {
            'MPT': 'internet',
            'ATOM': 'internet.atom',
            'OOREDOO': 'internet',
            'MYTEL': 'mytelinternet',
        };
        return apnMap[carrier.toUpperCase()] || 'internet';
    }
};
exports.ESIMService = ESIMService;
exports.ESIMService = ESIMService = ESIMService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(esim_profile_entity_1.ESIMProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(apple_device_entity_1.AppleDevice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mdm_service_1.MDMService])
], ESIMService);
//# sourceMappingURL=esim.service.js.map