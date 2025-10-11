import { Repository } from 'typeorm';
import { Profile, CarrierType } from './profile.entity';
import { AuditService } from '../audit/audit.service';
import { IoTService } from '../iot/iot.service';
export declare class ProfileService {
    private profileRepository;
    private auditService;
    private iotService;
    constructor(profileRepository: Repository<Profile>, auditService: AuditService, iotService: IoTService);
    findAll(carrier?: CarrierType): Promise<Profile[]>;
    findById(id: string): Promise<Profile>;
    activate(id: string, userId: string): Promise<Profile>;
    deactivate(id: string, userId: string): Promise<Profile>;
    getAnalytics(carrier?: CarrierType): Promise<{
        total: number;
        active: number;
        inactive: number;
        carrier: CarrierType;
    }>;
}
