import { AppleDevice } from './apple-device.entity';
export declare class ESIMProfile {
    id: string;
    iccid: string;
    eid: string;
    smdpAddress: string;
    activationCode: string;
    confirmationCode: string;
    carrier: string;
    plan: string;
    status: string;
    installationDate: Date;
    activationDate: Date;
    suspensionDate: Date;
    deletionDate: Date;
    profileData: any;
    installationResponse: any;
    isTransferEligible: boolean;
    transferRequestId: string;
    device: AppleDevice;
    deviceId: string;
    createdAt: Date;
    updatedAt: Date;
}
