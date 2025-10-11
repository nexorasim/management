import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppleDevice } from './entities/apple-device.entity';

@Injectable()
export class AppleService {
  private readonly logger = new Logger(AppleService.name);

  constructor(
    @InjectRepository(AppleDevice)
    private deviceRepository: Repository<AppleDevice>,
  ) {}

  async enrollDevice(enrollmentData: any): Promise<AppleDevice> {
    this.logger.log(`Enrolling device: ${enrollmentData.UDID}`);

    const device = this.deviceRepository.create({
      udid: enrollmentData.UDID,
      serialNumber: enrollmentData.SerialNumber,
      deviceName: enrollmentData.DeviceName,
      model: enrollmentData.Model,
      osVersion: enrollmentData.OSVersion,
      enrollmentStatus: 'enrolled',
      lastSeen: new Date(),
    });

    return this.deviceRepository.save(device);
  }

  async getAllDevices(): Promise<AppleDevice[]> {
    return this.deviceRepository.find({
      order: { lastSeen: 'DESC' },
    });
  }

  async getDeviceByUDID(udid: string): Promise<AppleDevice> {
    return this.deviceRepository.findOne({ where: { udid } });
  }
}