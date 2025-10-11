import { Repository } from 'typeorm';
import { AppleDevice } from './entities/apple-device.entity';
export declare class AppleService {
    private deviceRepository;
    private readonly logger;
    constructor(deviceRepository: Repository<AppleDevice>);
    enrollDevice(enrollmentData: any): Promise<AppleDevice>;
    getAllDevices(): Promise<AppleDevice[]>;
    getDeviceByUDID(udid: string): Promise<AppleDevice>;
}
