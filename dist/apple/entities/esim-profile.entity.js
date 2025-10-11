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
exports.ESIMProfile = void 0;
const typeorm_1 = require("typeorm");
const apple_device_entity_1 = require("./apple-device.entity");
let ESIMProfile = class ESIMProfile {
};
exports.ESIMProfile = ESIMProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ESIMProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], ESIMProfile.prototype, "iccid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ESIMProfile.prototype, "eid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ESIMProfile.prototype, "smdpAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ESIMProfile.prototype, "activationCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ESIMProfile.prototype, "confirmationCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ESIMProfile.prototype, "carrier", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ESIMProfile.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], ESIMProfile.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ESIMProfile.prototype, "installationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ESIMProfile.prototype, "activationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ESIMProfile.prototype, "suspensionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ESIMProfile.prototype, "deletionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ESIMProfile.prototype, "profileData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ESIMProfile.prototype, "installationResponse", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ESIMProfile.prototype, "isTransferEligible", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ESIMProfile.prototype, "transferRequestId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => apple_device_entity_1.AppleDevice, device => device.esimProfiles, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'deviceId' }),
    __metadata("design:type", apple_device_entity_1.AppleDevice)
], ESIMProfile.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ESIMProfile.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ESIMProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ESIMProfile.prototype, "updatedAt", void 0);
exports.ESIMProfile = ESIMProfile = __decorate([
    (0, typeorm_1.Entity)('esim_profiles')
], ESIMProfile);
//# sourceMappingURL=esim-profile.entity.js.map