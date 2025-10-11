import { Repository } from 'typeorm';
import { ESIMProfile } from './entities/esim-profile.entity';
import { AppleDevice } from './entities/apple-device.entity';
import { MDMService } from './mdm.service';
export declare class ESIMService {
    private profileRepository;
    private deviceRepository;
    private mdmService;
    private readonly logger;
    constructor(profileRepository: Repository<ESIMProfile>, deviceRepository: Repository<AppleDevice>, mdmService: MDMService);
    createProfile(profileData: {
        deviceId?: string;
        iccid: string;
        eid?: string;
        smdpAddress: string;
        activationCode: string;
        confirmationCode: string;
        carrier: string;
        plan: string;
    }): Promise<ESIMProfile>;
    installProfile(profileId: string, deviceId: string): Promise<void>;
    activateProfile(profileId: string): Promise<void>;
    suspendProfile(profileId: string): Promise<void>;
    deleteProfile(profileId: string): Promise<void>;
    transferProfile(profileId: string, sourceDeviceId: string, targetDeviceId: string): Promise<void>;
    getProfileStatus(profileId: string): Promise<any>;
    listProfiles(deviceId?: string): Promise<ESIMProfile[]>;
    private sendSMDPCommand;
    private querySMDPStatus;
    private generateTransferActivationCode;
    private getAPNForCarrier;
}
