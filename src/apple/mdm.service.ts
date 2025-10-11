import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MDMCommand } from './entities/mdm-command.entity';
import { AppleDevice } from './entities/apple-device.entity';
import * as crypto from 'crypto';

@Injectable()
export class MDMService {
  private readonly logger = new Logger(MDMService.name);

  constructor(
    @InjectRepository(MDMCommand)
    private commandRepository: Repository<MDMCommand>,
    @InjectRepository(AppleDevice)
    private deviceRepository: Repository<AppleDevice>,
  ) {}

  async sendDeviceInformationCommand(deviceId: string): Promise<MDMCommand> {
    const command = {
      RequestType: 'DeviceInformation',
      Queries: ['UDID', 'DeviceName', 'OSVersion', 'Model', 'SerialNumber'],
    };

    return this.sendCommand(deviceId, command);
  }

  private async sendCommand(deviceId: string, command: any): Promise<MDMCommand> {
    const commandUUID = crypto.randomUUID();
    const mdmCommand = this.commandRepository.create({
      commandUUID,
      requestType: command.RequestType,
      command,
      deviceId,
      status: 'pending',
      scheduledAt: new Date(),
    });

    return this.commandRepository.save(mdmCommand);
  }

  async getPendingCommands(udid: string): Promise<any[]> {
    const device = await this.deviceRepository.findOne({ where: { udid } });
    if (!device) return [];

    const commands = await this.commandRepository.find({
      where: { deviceId: device.id, status: 'sent' },
      order: { createdAt: 'ASC' },
    });

    return commands.map(cmd => ({
      CommandUUID: cmd.commandUUID,
      Command: cmd.command,
    }));
  }
}