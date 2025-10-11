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
exports.IoTService = void 0;
const common_1 = require("@nestjs/common");
const client_iot_data_plane_1 = require("@aws-sdk/client-iot-data-plane");
let IoTService = class IoTService {
    constructor() {
        this.iotClient = new client_iot_data_plane_1.IoTDataPlaneClient({
            region: 'us-east-1',
            endpoint: 'https://a1t1uoy03yaopf-ats.iot.us-east-1.amazonaws.com',
        });
    }
    async updateProfileShadow(profileId, status) {
        const payload = {
            state: {
                reported: {
                    NexoraSIM: {
                        version: 1,
                        profileId,
                        status,
                        timestamp: Date.now(),
                    }
                }
            }
        };
        const command = new client_iot_data_plane_1.UpdateThingShadowCommand({
            thingName: `nexorasim-profile-${profileId}`,
            payload: JSON.stringify(payload),
        });
        return this.iotClient.send(command);
    }
};
exports.IoTService = IoTService;
exports.IoTService = IoTService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], IoTService);
//# sourceMappingURL=iot.service.js.map