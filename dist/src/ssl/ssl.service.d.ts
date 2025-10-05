export declare class SSLService {
    private caCert;
    private clientCert;
    private clientKey;
    constructor();
    private loadCertificates;
    getSSLConfig(): {
        ca: string;
        cert: string;
        key: string;
        rejectUnauthorized: boolean;
    };
    validateOAuthCallback(url: string): boolean;
}
