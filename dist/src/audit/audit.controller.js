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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_service_1 = require("./audit.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async getAuditLogs(limit) {
        return this.auditService.findAll(limit);
    }
    async getAuditLogsByUser(userId, limit) {
        return this.auditService.findByUser(userId, limit);
    }
    async getAuditLogsByAction(action, limit) {
        return this.auditService.findByAction(action, limit);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'auditor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, roles_decorator_1.Roles)('admin', 'auditor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs by user' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditLogsByUser", null);
__decorate([
    (0, common_1.Get)('action'),
    (0, roles_decorator_1.Roles)('admin', 'auditor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs by action' }),
    __param(0, (0, common_1.Query)('action')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditLogsByAction", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)('Audit'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('audit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map