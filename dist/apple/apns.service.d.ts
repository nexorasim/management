export declare class APNsService {
    private readonly logger;
    private provider;
    constructor();
    private initializeProvider;
    sendPushNotification(deviceToken: string, pushMagic: string): Promise<void>;
    sendBulkPushNotifications(devices: Array<{
        token: string;
        pushMagic: string;
    }>): Promise<void>;
    validateCertificates(): Promise<{
        isValid: boolean;
        expiresAt?: Date;
        error?: string;
    }>;
    renewCertificate(newCertPath: string, newKeyPath: string): Promise<void>;
    getConnectionStatus(): {
        connected: boolean;
        lastError?: string;
    };
    shutdown(): Promise<void>;
}
