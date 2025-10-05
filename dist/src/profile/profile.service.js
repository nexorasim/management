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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profile_entity_1 = require("./profile.entity");
const audit_service_1 = require("../audit/audit.service");
const iot_service_1 = require("../iot/iot.service");
let ProfileService = class ProfileService {
    constructor(profileRepository, auditService, iotService) {
        this.profileRepository = profileRepository;
        this.auditService = auditService;
        this.iotService = iotService;
    }
    async findAll(carrier) {
        const where = carrier ? { carrier } : {};
        return this.profileRepository.find({ where });
    }
    async findById(id) {
        const profile = await this.profileRepository.findOne({ where: { id } });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        return profile;
    }
    async activate(id, userId) {
        const profile = await this.findById(id);
        profile.status = profile_entity_1.ProfileStatus.ACTIVE;
        profile.lastActivatedAt = new Date();
        await this.auditService.log({
            action: 'PROFILE_ACTIVATED',
            entityId: id,
            userId,
            metadata: { carrier: profile.carrier, iccid: profile.iccid },
        });
        await this.iotService.updateProfileShadow(id, 'active');
        return this.profileRepository.save(profile);
    }
    async deactivate(id, userId) {
        const profile = await this.findById(id);
        profile.status = profile_entity_1.ProfileStatus.INACTIVE;
        await this.auditService.log({
            action: 'PROFILE_DEACTIVATED',
            entityId: id,
            userId,
            metadata: { carrier: profile.carrier, iccid: profile.iccid },
        });
        await this.iotService.updateProfileShadow(id, 'inactive');
        return this.profileRepository.save(profile);
    }
    async getAnalytics(carrier) {
        const where = carrier ? { carrier } : {};
        const [total, active, inactive] = await Promise.all([
            this.profileRepository.count({ where }),
            this.profileRepository.count({ where: { ...where, status: profile_entity_1.ProfileStatus.ACTIVE } }),
            this.profileRepository.count({ where: { ...where, status: profile_entity_1.ProfileStatus.INACTIVE } }),
        ]);
        return { total, active, inactive, carrier };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService,
        iot_service_1.IoTService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map