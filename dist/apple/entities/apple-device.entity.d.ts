import { MDMCommand } from './mdm-command.entity';
import { ESIMProfile } from './esim-profile.entity';
export declare class AppleDevice {
    id: string;
    udid: string;
    serialNumber: string;
    imei: string;
    eid: string;
    deviceName: string;
    model: string;
    osVersion: string;
    isSupervised: boolean;
    isUserApprovedMDM: boolean;
    enrollmentStatus: string;
    pushMagic: string;
    pushToken: string;
    unlockToken: string;
    bootstrapToken: string;
    deviceInformation: any;
    securityInfo: any;
    restrictions: any;
    lastSeen: Date;
    commands: MDMCommand[];
    esimProfiles: ESIMProfile[];
    createdAt: Date;
    updatedAt: Date;
}
