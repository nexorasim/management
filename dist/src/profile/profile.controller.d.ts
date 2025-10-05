import { ProfileService } from './profile.service';
import { CarrierType } from './profile.entity';
export declare class ProfileController {
    private profileService;
    constructor(profileService: ProfileService);
    getProfiles(carrier?: CarrierType): Promise<import("./profile.entity").Profile[]>;
    getAnalytics(carrier?: CarrierType): Promise<{
        total: number;
        active: number;
        inactive: number;
        carrier: CarrierType;
    }>;
    getProfile(id: string): Promise<import("./profile.entity").Profile>;
    activateProfile(id: string, req: any): Promise<import("./profile.entity").Profile>;
    deactivateProfile(id: string, req: any): Promise<import("./profile.entity").Profile>;
    importProfiles(file: Express.Multer.File, req: any): Promise<{
        message: string;
        filename: any;
    }>;
}
