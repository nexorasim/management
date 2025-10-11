"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const apple_controller_1 = require("./apple.controller");
const apple_service_1 = require("./apple.service");
const apple_device_entity_1 = require("./entities/apple-device.entity");
const mdm_command_entity_1 = require("./entities/mdm-command.entity");
const abm_token_entity_1 = require("./entities/abm-token.entity");
const esim_profile_entity_1 = require("./entities/esim-profile.entity");
let AppleModule = class AppleModule {
};
exports.AppleModule = AppleModule;
exports.AppleModule = AppleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                apple_device_entity_1.AppleDevice,
                mdm_command_entity_1.MDMCommand,
                abm_token_entity_1.ABMToken,
                esim_profile_entity_1.ESIMProfile,
            ]),
        ],
        controllers: [apple_controller_1.AppleController],
        providers: [apple_service_1.AppleService],
        exports: [apple_service_1.AppleService],
    })
], AppleModule);
//# sourceMappingURL=apple.module.js.map