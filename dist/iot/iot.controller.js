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
exports.IoTController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const iot_service_1 = require("./iot.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let IoTController = class IoTController {
    constructor(iotService) {
        this.iotService = iotService;
    }
    async updateShadow(body) {
        return this.iotService.updateProfileShadow(body.profileId, body.status);
    }
};
exports.IoTController = IoTController;
__decorate([
    (0, common_1.Post)('shadow/update'),
    (0, roles_decorator_1.Roles)('admin', 'operator'),
    (0, swagger_1.ApiOperation)({ summary: 'Update device shadow' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoTController.prototype, "updateShadow", null);
exports.IoTController = IoTController = __decorate([
    (0, swagger_1.ApiTags)('IoT'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('iot'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [iot_service_1.IoTService])
], IoTController);
//# sourceMappingURL=iot.controller.js.map