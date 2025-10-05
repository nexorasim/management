import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile, ProfileStatus, CarrierType } from './profile.entity';
import { AuditService } from '../audit/audit.service';
import { IoTService } from '../iot/iot.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private auditService: AuditService,
    private iotService: IoTService,
  ) {}

  async findAll(carrier?: CarrierType): Promise<Profile[]> {
    const where = carrier ? { carrier } : {};
    return this.profileRepository.find({ where });
  }

  async findById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async activate(id: string, userId: string): Promise<Profile> {
    const profile = await this.findById(id);
    profile.status = ProfileStatus.ACTIVE;
    profile.lastActivatedAt = new Date();
    
    await this.auditService.log({
      action: 'PROFILE_ACTIVATED',
      entityId: id,
      userId,
      metadata: { carrier: profile.carrier, iccid: profile.iccid },
    });

    await this.iotService.updateProfileShadow(id, 'active');
    return this.profileRepository.save(profile);
  }

  async deactivate(id: string, userId: string): Promise<Profile> {
    const profile = await this.findById(id);
    profile.status = ProfileStatus.INACTIVE;
    
    await this.auditService.log({
      action: 'PROFILE_DEACTIVATED',
      entityId: id,
      userId,
      metadata: { carrier: profile.carrier, iccid: profile.iccid },
    });

    await this.iotService.updateProfileShadow(id, 'inactive');
    return this.profileRepository.save(profile);
  }

  async getAnalytics(carrier?: CarrierType) {
    const where = carrier ? { carrier } : {};
    
    const [total, active, inactive] = await Promise.all([
      this.profileRepository.count({ where }),
      this.profileRepository.count({ where: { ...where, status: ProfileStatus.ACTIVE } }),
      this.profileRepository.count({ where: { ...where, status: ProfileStatus.INACTIVE } }),
    ]);

    return { total, active, inactive, carrier };
  }
}