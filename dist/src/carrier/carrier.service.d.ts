export interface CarrierConfig {
    id: string;
    name: string;
    pmsEndpoint: string;
    entitlementEndpoint?: string;
    apiKey: string;
    isActive: boolean;
}
export declare class CarrierService {
    private carriers;
    getAll(): CarrierConfig[];
    getById(id: string): CarrierConfig | undefined;
    syncWithPMS(carrierId: string, profileData: any): Promise<{
        success: boolean;
        carrier: string;
    }>;
}
