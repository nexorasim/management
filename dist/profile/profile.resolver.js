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
exports.ProfileResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const profile_entity_1 = require("./profile.entity");
const profile_service_1 = require("./profile.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let ProfileResolver = class ProfileResolver {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async profiles(carrier) {
        return this.profileService.findAll(carrier);
    }
    async profile(id) {
        return this.profileService.findById(id);
    }
    async activateProfile(id, context) {
        return this.profileService.activate(id, context.req.user.id);
    }
    async deactivateProfile(id, context) {
        return this.profileService.deactivate(id, context.req.user.id);
    }
    async profileAnalytics(carrier) {
        const analytics = await this.profileService.getAnalytics(carrier);
        return JSON.stringify(analytics);
    }
};
exports.ProfileResolver = ProfileResolver;
__decorate([
    (0, graphql_1.Query)(() => [profile_entity_1.Profile]),
    (0, roles_decorator_1.Roles)('admin', 'operator', 'auditor'),
    __param(0, (0, graphql_1.Args)('carrier', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "profiles", null);
__decorate([
    (0, graphql_1.Query)(() => profile_entity_1.Profile),
    (0, roles_decorator_1.Roles)('admin', 'operator', 'auditor'),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "profile", null);
__decorate([
    (0, graphql_1.Mutation)(() => profile_entity_1.Profile),
    (0, roles_decorator_1.Roles)('admin', 'operator'),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "activateProfile", null);
__decorate([
    (0, graphql_1.Mutation)(() => profile_entity_1.Profile),
    (0, roles_decorator_1.Roles)('admin', 'operator'),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "deactivateProfile", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    (0, roles_decorator_1.Roles)('admin', 'operator', 'auditor'),
    __param(0, (0, graphql_1.Args)('carrier', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "profileAnalytics", null);
exports.ProfileResolver = ProfileResolver = __decorate([
    (0, graphql_1.Resolver)(() => profile_entity_1.Profile),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileResolver);
//# sourceMappingURL=profile.resolver.js.map