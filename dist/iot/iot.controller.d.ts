import { IoTService } from './iot.service';
export declare class IoTController {
    private iotService;
    constructor(iotService: IoTService);
    updateShadow(body: {
        profileId: string;
        status: string;
    }): Promise<any>;
}
