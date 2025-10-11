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
exports.AppleDevice = void 0;
const typeorm_1 = require("typeorm");
const mdm_command_entity_1 = require("./mdm-command.entity");
const esim_profile_entity_1 = require("./esim-profile.entity");
let AppleDevice = class AppleDevice {
};
exports.AppleDevice = AppleDevice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AppleDevice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], AppleDevice.prototype, "udid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppleDevice.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppleDevice.prototype, "imei", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppleDevice.prototype, "eid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppleDevice.prototype, "deviceName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppleDevice.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppleDevice.prototype, "osVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AppleDevice.prototype, "isSupervised", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AppleDevice.prototype, "isUserApprovedMDM", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'enrolled' }),
    __metadata("design:type", String)
], AppleDevice.prototype, "enrollmentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppleDevice.prototype, "pushMagic", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppleDevice.prototype, "pushToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppleDevice.prototype, "unlockToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppleDevice.prototype, "bootstrapToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AppleDevice.prototype, "deviceInformation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AppleDevice.prototype, "securityInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AppleDevice.prototype, "restrictions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AppleDevice.prototype, "lastSeen", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => mdm_command_entity_1.MDMCommand, command => command.device),
    __metadata("design:type", Array)
], AppleDevice.prototype, "commands", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => esim_profile_entity_1.ESIMProfile, profile => profile.device),
    __metadata("design:type", Array)
], AppleDevice.prototype, "esimProfiles", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AppleDevice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AppleDevice.prototype, "updatedAt", void 0);
exports.AppleDevice = AppleDevice = __decorate([
    (0, typeorm_1.Entity)('apple_devices')
], AppleDevice);
//# sourceMappingURL=apple-device.entity.js.map