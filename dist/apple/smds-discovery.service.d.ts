export declare class SMDSDiscoveryService {
    private readonly logger;
    private readonly SMDS_SERVERS;
    discoverProfiles(eid: string): Promise<any[]>;
    private querySMDS;
}
