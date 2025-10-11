import { AppleDevice } from './apple-device.entity';
export declare class MDMCommand {
    id: string;
    commandUUID: string;
    requestType: string;
    command: any;
    status: string;
    response: any;
    errorChain: string;
    retryCount: number;
    scheduledAt: Date;
    sentAt: Date;
    completedAt: Date;
    device: AppleDevice;
    deviceId: string;
    createdAt: Date;
    updatedAt: Date;
}
