import { ESIMService } from './esim.service';
export declare class SGP22TransferService {
    private esimService;
    private readonly logger;
    constructor(esimService: ESIMService);
    initiateDeviceChange(profileId: string, sourceEid: string, targetEid: string): Promise<string>;
    executeProfileRecovery(transferId: string): Promise<void>;
    private generateRecoveryCode;
}
