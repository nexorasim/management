import { Profile, CarrierType } from './profile.entity';
import { ProfileService } from './profile.service';
export declare class ProfileResolver {
    private profileService;
    constructor(profileService: ProfileService);
    profiles(carrier?: CarrierType): Promise<Profile[]>;
    profile(id: string): Promise<Profile>;
    activateProfile(id: string, context: any): Promise<Profile>;
    deactivateProfile(id: string, context: any): Promise<Profile>;
    profileAnalytics(carrier?: CarrierType): Promise<string>;
}
