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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const profile_service_1 = require("./profile.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const profile_entity_1 = require("./profile.entity");
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getProfiles(carrier) {
        return this.profileService.findAll(carrier);
    }
    async getAnalytics(carrier) {
        return this.profileService.getAnalytics(carrier);
    }
    async getProfile(id) {
        return this.profileService.findById(id);
    }
    async activateProfile(id, req) {
        return this.profileService.activate(id, req.user.id);
    }
    async deactivateProfile(id, req) {
        return this.profileService.deactivate(id, req.user.id);
    }
    async importProfiles(file, req) {
        return { message: 'Import functionality ready', filename: file.originalname };
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'operator', 'auditor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all profiles' }),
    __param(0, (0, common_1.Query)('carrier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfiles", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, roles_decorator_1.Roles)('admin', 'operator', 'auditor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profile analytics' }),
    __param(0, (0, common_1.Query)('carrier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'operator', 'auditor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profile by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, roles_decorator_1.Roles)('admin', 'operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate profile' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "activateProfile", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, roles_decorator_1.Roles)('admin', 'operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate profile' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "deactivateProfile", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Import profiles from CSV' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "importProfiles", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('Profiles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('profiles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map