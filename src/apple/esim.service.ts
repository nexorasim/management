import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ESIMProfile } from './entities/esim-profile.entity';
import { AppleDevice } from './entities/apple-device.entity';
import { MDMService } from './mdm.service';
import * as crypto from 'crypto';

@Injectable()
export class ESIMService {
  private readonly logger = new Logger(ESIMService.name);

  constructor(
    @InjectRepository(ESIMProfile)
    private profileRepository: Repository<ESIMProfile>,
    @InjectRepository(AppleDevice)
    private deviceRepository: Repository<AppleDevice>,
    private mdmService: MDMService,
  ) {}

  async createProfile(profileData: {
    deviceId?: string;
    iccid: string;
    eid?: string;
    smdpAddress: string;
    activationCode: string;
    confirmationCode: string;
    carrier: string;
    plan: string;
  }): Promise<ESIMProfile> {
    this.logger.log(`Creating eSIM profile for ICCID: ${profileData.iccid}`);

    const profile = this.profileRepository.create({
      ...profileData,
      status: 'pending',
    });

    return this.profileRepository.save(profile);
  }

  async installProfile(profileId: string, deviceId: string): Promise<void> {
    const profile = await this.profileRepository.findOne({ where: { id: profileId } });
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });

    if (!profile || !device) {
      throw new Error('Profile or device not found');
    }

    this.logger.log(`Installing eSIM profile ${profileId} on device ${deviceId}`);

    // Create cellular configuration payload
    const cellularPayload = {
      PayloadType: 'com.apple.cellular',
      PayloadIdentifier: `com.myesimplus.esim.${profileId}`,
      PayloadUUID: profileId,
      PayloadDisplayName: `${profile.carrier} eSIM`,
      PayloadDescription: `eSIM profile for ${profile.carrier} - ${profile.plan}`,
      PayloadVersion: 1,
      CellularData: [{
        SMDP: profile.smdpAddress,
        ICCID: profile.iccid,
        PIN: profile.confirmationCode,
        ActivationCode: profile.activationCode,
      }],
      AttachAPN: {
        Name: this.getAPNForCarrier(profile.carrier),
        AuthenticationType: 'CHAP',
        Username: 'user',
        Password: 'pass',
      },
    };

    // Send MDM install command
    await this.mdmService.sendInstallProfileCommand(deviceId, cellularPayload);

    // Update profile status
    await this.profileRepository.update(profileId, {
      deviceId,
      status: 'installing',
      installationDate: new Date(),
    });
  }

  async activateProfile(profileId: string): Promise<void> {
    this.logger.log(`Activating eSIM profile: ${profileId}`);

    const profile = await this.profileRepository.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Send activation command to SM-DP+
    await this.sendSMDPCommand(profile.smdpAddress, 'activate', {
      iccid: profile.iccid,
      eid: profile.eid,
      confirmationCode: profile.confirmationCode,
    });

    await this.profileRepository.update(profileId, {
      status: 'active',
      activationDate: new Date(),
    });
  }

  async suspendProfile(profileId: string): Promise<void> {
    this.logger.log(`Suspending eSIM profile: ${profileId}`);

    const profile = await this.profileRepository.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new Error('Profile not found');
    }

    await this.sendSMDPCommand(profile.smdpAddress, 'suspend', {
      iccid: profile.iccid,
      eid: profile.eid,
    });

    await this.profileRepository.update(profileId, {
      status: 'suspended',
      suspensionDate: new Date(),
    });
  }

  async deleteProfile(profileId: string): Promise<void> {
    this.logger.log(`Deleting eSIM profile: ${profileId}`);

    const profile = await this.profileRepository.findOne({ 
      where: { id: profileId },
      relations: ['device']
    });
    
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Remove from device if installed
    if (profile.device) {
      await this.mdmService.sendRemoveProfileCommand(
        profile.device.id,
        `com.myesimplus.esim.${profileId}`
      );
    }

    // Delete from SM-DP+
    await this.sendSMDPCommand(profile.smdpAddress, 'delete', {
      iccid: profile.iccid,
      eid: profile.eid,
    });

    await this.profileRepository.update(profileId, {
      status: 'deleted',
      deletionDate: new Date(),
      deviceId: null,
    });
  }

  async transferProfile(profileId: string, sourceDeviceId: string, targetDeviceId: string): Promise<void> {
    this.logger.log(`Transferring eSIM profile ${profileId} from ${sourceDeviceId} to ${targetDeviceId}`);

    const profile = await this.profileRepository.findOne({ where: { id: profileId } });
    const sourceDevice = await this.deviceRepository.findOne({ where: { id: sourceDeviceId } });
    const targetDevice = await this.deviceRepository.findOne({ where: { id: targetDeviceId } });

    if (!profile || !sourceDevice || !targetDevice) {
      throw new Error('Profile or devices not found');
    }

    // Validate transfer eligibility
    if (!profile.isTransferEligible) {
      throw new Error('Profile is not eligible for transfer');
    }

    // Generate transfer request ID
    const transferRequestId = crypto.randomUUID();

    try {
      // Step 1: Suspend profile on source device
      await this.suspendProfile(profileId);

      // Step 2: Remove profile from source device
      await this.mdmService.sendRemoveProfileCommand(
        sourceDeviceId,
        `com.myesimplus.esim.${profileId}`
      );

      // Step 3: Create new activation code for target device
      const newActivationCode = await this.generateTransferActivationCode(profile, targetDevice.eid);

      // Step 4: Install on target device
      await this.profileRepository.update(profileId, {
        activationCode: newActivationCode,
        deviceId: targetDeviceId,
        status: 'transferring',
        transferRequestId,
      });

      await this.installProfile(profileId, targetDeviceId);

      // Step 5: Activate on target device
      await this.activateProfile(profileId);

      this.logger.log(`eSIM profile transfer completed: ${profileId}`);
    } catch (error) {
      this.logger.error(`eSIM profile transfer failed: ${error.message}`);
      
      // Rollback: reactivate on source device
      await this.profileRepository.update(profileId, {
        deviceId: sourceDeviceId,
        status: 'active',
        transferRequestId: null,
      });

      throw error;
    }
  }

  async getProfileStatus(profileId: string): Promise<any> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['device'],
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Query SM-DP+ for current status
    const smdpStatus = await this.querySMDPStatus(profile.smdpAddress, profile.iccid);

    return {
      id: profile.id,
      iccid: profile.iccid,
      status: profile.status,
      carrier: profile.carrier,
      plan: profile.plan,
      device: profile.device ? {
        id: profile.device.id,
        name: profile.device.deviceName,
        udid: profile.device.udid,
      } : null,
      installationDate: profile.installationDate,
      activationDate: profile.activationDate,
      smdpStatus,
      isTransferEligible: profile.isTransferEligible,
    };
  }

  async listProfiles(deviceId?: string): Promise<ESIMProfile[]> {
    const query = this.profileRepository.createQueryBuilder('profile')
      .leftJoinAndSelect('profile.device', 'device');

    if (deviceId) {
      query.where('profile.deviceId = :deviceId', { deviceId });
    }

    return query.orderBy('profile.createdAt', 'DESC').getMany();
  }

  private async sendSMDPCommand(smdpAddress: string, command: string, params: any): Promise<any> {
    // SM-DP+ API implementation
    // This is a simplified implementation - actual SM-DP+ integration would use proper HTTPS/TLS
    this.logger.log(`Sending SM-DP+ command: ${command} to ${smdpAddress}`);

    const payload = {
      command,
      timestamp: new Date().toISOString(),
      ...params,
    };

    // In production, this would make actual HTTPS requests to the SM-DP+ server
    // with proper authentication and certificate validation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success', commandId: crypto.randomUUID() });
      }, 1000);
    });
  }

  private async querySMDPStatus(smdpAddress: string, iccid: string): Promise<any> {
    // Query SM-DP+ for profile status
    this.logger.log(`Querying SM-DP+ status for ICCID: ${iccid}`);

    // Simplified implementation
    return {
      profileState: 'ENABLED',
      downloadCounter: 1,
      lastStatusChange: new Date().toISOString(),
    };
  }

  private async generateTransferActivationCode(profile: ESIMProfile, targetEID: string): Promise<string> {
    // Generate new activation code for transfer
    const timestamp = Date.now().toString();
    const hash = crypto.createHash('sha256')
      .update(`${profile.iccid}${targetEID}${timestamp}`)
      .digest('hex');
    
    return `LPA:1$${profile.smdpAddress}$${hash.substring(0, 16)}`;
  }

  private getAPNForCarrier(carrier: string): string {
    const apnMap = {
      'MPT': 'internet',
      'ATOM': 'internet.atom',
      'OOREDOO': 'internet',
      'MYTEL': 'mytelinternet',
    };

    return apnMap[carrier.toUpperCase()] || 'internet';
  }
}