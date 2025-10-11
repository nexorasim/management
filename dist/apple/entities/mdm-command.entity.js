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
exports.MDMCommand = void 0;
const typeorm_1 = require("typeorm");
const apple_device_entity_1 = require("./apple-device.entity");
let MDMCommand = class MDMCommand {
};
exports.MDMCommand = MDMCommand;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MDMCommand.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], MDMCommand.prototype, "commandUUID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MDMCommand.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], MDMCommand.prototype, "command", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], MDMCommand.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], MDMCommand.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MDMCommand.prototype, "errorChain", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MDMCommand.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MDMCommand.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MDMCommand.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MDMCommand.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => apple_device_entity_1.AppleDevice, device => device.commands),
    (0, typeorm_1.JoinColumn)({ name: 'deviceId' }),
    __metadata("design:type", apple_device_entity_1.AppleDevice)
], MDMCommand.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MDMCommand.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MDMCommand.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MDMCommand.prototype, "updatedAt", void 0);
exports.MDMCommand = MDMCommand = __decorate([
    (0, typeorm_1.Entity)('mdm_commands')
], MDMCommand);
//# sourceMappingURL=mdm-command.entity.js.map