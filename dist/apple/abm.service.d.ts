import { Repository } from 'typeorm';
import { ABMToken } from './entities/abm-token.entity';
export declare class ABMService {
    private tokenRepository;
    private readonly logger;
    private readonly ABM_BASE_URL;
    constructor(tokenRepository: Repository<ABMToken>);
    registerServerToken(tokenData: {
        orgId: string;
        orgName: string;
        serverToken: string;
        consumerKey: string;
        consumerSecret: string;
    }): Promise<ABMToken>;
    refreshToken(tokenId: string): Promise<void>;
    getAccount(tokenId: string): Promise<any>;
    getDevices(tokenId: string, cursor?: string): Promise<any>;
    assignDevice(tokenId: string, deviceSerialNumber: string, profileUuid: string): Promise<any>;
    unassignDevice(tokenId: string, deviceSerialNumber: string): Promise<any>;
    getProfiles(tokenId: string): Promise<any>;
    createProfile(tokenId: string, profileData: any): Promise<any>;
    private generateOAuthTokens;
    private makeAuthenticatedRequest;
    private createSignatureBaseString;
}
