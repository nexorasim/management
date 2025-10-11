"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EUICCAppletsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EUICCAppletsService = void 0;
const common_1 = require("@nestjs/common");
let EUICCAppletsService = EUICCAppletsService_1 = class EUICCAppletsService {
    constructor() {
        this.logger = new common_1.Logger(EUICCAppletsService_1.name);
        this.APPLET_IDS = {
            ECASD: 'A0000005591010FFFFFFFF8900000200',
            ISD_R: 'A0000005591010FFFFFFFF8900000100',
            ISD_P: 'A0000005591010FFFFFFFF89000001XX'
        };
    }
    validateAppletId(aid, type) {
        if (type === 'ISD_P') {
            return aid.startsWith('A0000005591010FFFFFFFF890000010');
        }
        return aid === this.APPLET_IDS[type];
    }
    getAppletInfo(aid) {
        if (aid === this.APPLET_IDS.ECASD) {
            return { type: 'ECASD', description: 'Secure credential storage', spec: 'SGP.22 v2.3 (2.4.2)' };
        }
        if (aid === this.APPLET_IDS.ISD_R) {
            return { type: 'ISD-R', description: 'Profile lifecycle management', spec: 'SGP.22 v2.3 (2.4.3)' };
        }
        if (aid.startsWith('A0000005591010FFFFFFFF890000010')) {
            return { type: 'ISD-P', description: 'Profile container', spec: 'SGP.22 v2.3 (2.4.4)' };
        }
        return null;
    }
};
exports.EUICCAppletsService = EUICCAppletsService;
exports.EUICCAppletsService = EUICCAppletsService = EUICCAppletsService_1 = __decorate([
    (0, common_1.Injectable)()
], EUICCAppletsService);
//# sourceMappingURL=euicc-applets.service.js.map