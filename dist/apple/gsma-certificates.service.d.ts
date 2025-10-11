export declare class GSMACertificatesService {
    private readonly logger;
    private readonly GSMA_ROOT_CIS;
    validateESIMCertificate(certificateChain: string[]): Promise<{
        isValid: boolean;
        rootCI?: string;
    }>;
    private verifyCertificateChain;
    private extractKeyId;
    checkCRL(ciName: string): Promise<boolean>;
    getSupportedSpecs(): string[];
    supportsDeviceChange(spec: string): boolean;
}
