import { AppleService } from './apple.service';
export declare class AppleController {
    private appleService;
    constructor(appleService: AppleService);
    handleEnrollment(enrollmentData: any): Promise<import("./entities/apple-device.entity").AppleDevice>;
    getDevices(): Promise<import("./entities/apple-device.entity").AppleDevice[]>;
    getDevice(udid: string): Promise<import("./entities/apple-device.entity").AppleDevice>;
}
