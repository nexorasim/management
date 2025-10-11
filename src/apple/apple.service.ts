import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppleDevice } from './entities/apple-device.entity';
import { MDMService } from './mdm.service';
import { ABMService } from './abm.service';
import { ESIMService } from './esim.service';
import { APNsService } from './apns.service';

@Injectable()
export class AppleService {
  private readonly logger = new Logger(AppleService.name);

  constructor(
    @InjectRepository(AppleDevice)
    private deviceRepository: Repository<AppleDevice>,
    private mdmService: MDMService,
    private abmService: ABMService,
    private esimService: ESIMService,
    private apnsService: APNsService,
  ) {}

  async enrollDevice(enrollmentData: any): Promise<AppleDevice> {
    this.logger.log(`Enrolling device: ${enrollmentData.UDID}`);

    const device = this.deviceRepository.create({
      udid: enrollmentData.UDID,
      serialNumber: enrollmentData.SerialNumber,
      imei: enrollmentData.IMEI,
      deviceName: enrollmentData.DeviceName,
      model: enrollmentData.Model,
      osVersion: enrollmentData.OSVersion,
      isSupervised: enrollmentData.IsSupervised || false,
      pushMagic: enrollmentData.PushMagic,
      pushToken: enrollmentData.Token,
      unlockToken: enrollmentData.UnlockToken,
      bootstrapToken: enrollmentData.BootstrapToken,
      enrollmentStatus: 'enrolled',
      lastSeen: new Date(),
    });

    const savedDevice = await this.deviceRepository.save(device);

    // Query device information immediately after enrollment
    await this.mdmService.sendDeviceInformationCommand(savedDevice.id);

    return savedDevice;
  }

  async getDeviceByUDID(udid: string): Promise<AppleDevice> {
    return this.deviceRepository.findOne({
      where: { udid },
      relations: ['commands', 'esimProfiles'],
    });
  }

  async getAllDevices(): Promise<AppleDevice[]> {
    return this.deviceRepository.find({
      relations: ['commands', 'esimProfiles'],
      order: { lastSeen: 'DESC' },
    });
  }

  async updateDeviceInformation(udid: string, deviceInfo: any): Promise<void> {
    await this.deviceRepository.update(
      { udid },
      {
        deviceInformation: deviceInfo,
        eid: deviceInfo.EID,
        imei: deviceInfo.IMEI,
        lastSeen: new Date(),
      }
    );
  }

  async installESIMProfile(deviceId: string, profileData: any): Promise<void> {
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new Error('Device not found');
    }

    // Create eSIM profile record
    const profile = await this.esimService.createProfile({
      deviceId,
      ...profileData,
    });

    // Send MDM command to install profile
    await this.mdmService.sendInstallProfileCommand(deviceId, {
      PayloadType: 'com.apple.cellular',
      PayloadIdentifier: `com.myesimplus.esim.${profile.id}`,
      PayloadUUID: profile.id,
      PayloadDisplayName: `${profileData.carrier} eSIM`,
      PayloadDescription: `eSIM profile for ${profileData.carrier}`,
      AttachAPN: {
        Name: profileData.apnName,
        AuthenticationType: 'CHAP',
        Username: profileData.username,
        Password: profileData.password,
      },
      CellularData: [{
        SMDP: profileData.smdpAddress,
        ICCID: profileData.iccid,
        PIN: profileData.confirmationCode,
      }],
    });
  }

  async transferESIMProfile(sourceDeviceId: string, targetDeviceId: string, profileId: string): Promise<void> {
    this.logger.log(`Transferring eSIM profile ${profileId} from ${sourceDeviceId} to ${targetDeviceId}`);

    // Validate devices
    const sourceDevice = await this.deviceRepository.findOne({ where: { id: sourceDeviceId } });
    const targetDevice = await this.deviceRepository.findOne({ where: { id: targetDeviceId } });

    if (!sourceDevice || !targetDevice) {
      throw new Error('Source or target device not found');
    }

    // Execute transfer workflow
    await this.esimService.transferProfile(profileId, sourceDeviceId, targetDeviceId);
  }

  async checkCompliance(deviceId: string): Promise<any> {
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new Error('Device not found');
    }

    const compliance = {
      isCompliant: true,
      violations: [],
      lastChecked: new Date(),
    };

    // Check OS version
    if (device.osVersion && this.compareVersions(device.osVersion, '15.0') < 0) {
      compliance.isCompliant = false;
      compliance.violations.push('iOS version below minimum requirement (15.0)');
    }

    // Check supervision status
    if (!device.isSupervised) {
      compliance.violations.push('Device is not supervised');
    }

    // Check jailbreak status from security info
    if (device.securityInfo?.IsJailbroken) {
      compliance.isCompliant = false;
      compliance.violations.push('Device is jailbroken');
    }

    return compliance;
  }

  private compareVersions(version1: string, version2: string): number {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    const maxLength = Math.max(v1parts.length, v2parts.length);

    for (let i = 0; i < maxLength; i++) {
      const v1part = v1parts[i] || 0;
      const v2part = v2parts[i] || 0;
      
      if (v1part < v2part) return -1;
      if (v1part > v2part) return 1;
    }
    
    return 0;
  }
}