import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MDMCommand } from './entities/mdm-command.entity';
import { AppleDevice } from './entities/apple-device.entity';
import { APNsService } from './apns.service';
import * as crypto from 'crypto';

@Injectable()
export class MDMService {
  private readonly logger = new Logger(MDMService.name);

  constructor(
    @InjectRepository(MDMCommand)
    private commandRepository: Repository<MDMCommand>,
    @InjectRepository(AppleDevice)
    private deviceRepository: Repository<AppleDevice>,
    private apnsService: APNsService,
  ) {}

  async sendDeviceInformationCommand(deviceId: string): Promise<MDMCommand> {
    const command = {
      RequestType: 'DeviceInformation',
      Queries: [
        'UDID', 'DeviceName', 'OSVersion', 'BuildVersion', 'ModelName',
        'Model', 'ProductName', 'SerialNumber', 'DeviceCapacity',
        'AvailableDeviceCapacity', 'BatteryLevel', 'CellularTechnology',
        'IMEI', 'MEID', 'ModemFirmwareVersion', 'IsSupervised',
        'IsDeviceLocatorServiceEnabled', 'IsActivationLockEnabled',
        'IsDoNotDisturbInEffect', 'EID', 'IsCloudBackupEnabled',
        'OSUpdateSettings', 'LocalHostName', 'HostName', 'SystemIntegrityProtectionEnabled',
        'IsActivationLockSupported', 'MaximumResidentUsers'
      ],
    };

    return this.sendCommand(deviceId, command);
  }

  async sendInstallProfileCommand(deviceId: string, payload: any): Promise<MDMCommand> {
    const command = {
      RequestType: 'InstallProfile',
      Payload: Buffer.from(this.createMobileConfigXML(payload)).toString('base64'),
    };

    return this.sendCommand(deviceId, command);
  }

  async sendRemoveProfileCommand(deviceId: string, identifier: string): Promise<MDMCommand> {
    const command = {
      RequestType: 'RemoveProfile',
      Identifier: identifier,
    };

    return this.sendCommand(deviceId, command);
  }

  async sendRestrictionsCommand(deviceId: string, restrictions: any): Promise<MDMCommand> {
    const command = {
      RequestType: 'Settings',
      Settings: [
        {
          Item: 'Restrictions',
          Restrictions: restrictions,
        },
      ],
    };

    return this.sendCommand(deviceId, command);
  }

  async sendSecurityInfoCommand(deviceId: string): Promise<MDMCommand> {
    const command = {
      RequestType: 'SecurityInfo',
    };

    return this.sendCommand(deviceId, command);
  }

  async sendClearPasscodeCommand(deviceId: string, unlockToken?: string): Promise<MDMCommand> {
    const command: any = {
      RequestType: 'ClearPasscode',
    };

    if (unlockToken) {
      command.UnlockToken = Buffer.from(unlockToken, 'base64');
    }

    return this.sendCommand(deviceId, command);
  }

  async sendEraseDeviceCommand(deviceId: string, pin?: string): Promise<MDMCommand> {
    const command: any = {
      RequestType: 'EraseDevice',
      PreserveDataPlan: true,
      DisallowProximitySetup: true,
    };

    if (pin) {
      command.PIN = pin;
    }

    return this.sendCommand(deviceId, command);
  }

  private async sendCommand(deviceId: string, command: any): Promise<MDMCommand> {
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new Error('Device not found');
    }

    const commandUUID = crypto.randomUUID();
    const mdmCommand = this.commandRepository.create({
      commandUUID,
      requestType: command.RequestType,
      command,
      deviceId,
      status: 'pending',
      scheduledAt: new Date(),
    });

    const savedCommand = await this.commandRepository.save(mdmCommand);

    // Send push notification to device
    try {
      await this.apnsService.sendPushNotification(device.pushToken, device.pushMagic);
      await this.commandRepository.update(savedCommand.id, {
        status: 'sent',
        sentAt: new Date(),
      });
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
      await this.commandRepository.update(savedCommand.id, {
        status: 'failed',
        errorChain: error.message,
      });
    }

    return savedCommand;
  }

  async processCommandResponse(commandUUID: string, response: any): Promise<void> {
    const command = await this.commandRepository.findOne({
      where: { commandUUID },
      relations: ['device'],
    });

    if (!command) {
      this.logger.warn(`Command not found: ${commandUUID}`);
      return;
    }

    await this.commandRepository.update(command.id, {
      status: response.Status === 'Acknowledged' ? 'completed' : 'failed',
      response,
      completedAt: new Date(),
      errorChain: response.ErrorChain,
    });

    // Process specific command responses
    if (command.requestType === 'DeviceInformation' && response.Status === 'Acknowledged') {
      await this.deviceRepository.update(command.device.id, {
        deviceInformation: response.QueryResponses,
        eid: response.QueryResponses.EID,
        imei: response.QueryResponses.IMEI,
        lastSeen: new Date(),
      });
    }

    if (command.requestType === 'SecurityInfo' && response.Status === 'Acknowledged') {
      await this.deviceRepository.update(command.device.id, {
        securityInfo: response.SecurityInfo,
      });
    }
  }

  async getPendingCommands(udid: string): Promise<any[]> {
    const device = await this.deviceRepository.findOne({ where: { udid } });
    if (!device) {
      return [];
    }

    const commands = await this.commandRepository.find({
      where: { deviceId: device.id, status: 'sent' },
      order: { createdAt: 'ASC' },
    });

    return commands.map(cmd => ({
      CommandUUID: cmd.commandUUID,
      Command: cmd.command,
    }));
  }

  private createMobileConfigXML(payload: any): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key>
      <string>${payload.PayloadType}</string>
      <key>PayloadIdentifier</key>
      <string>${payload.PayloadIdentifier}</string>
      <key>PayloadUUID</key>
      <string>${payload.PayloadUUID}</string>
      <key>PayloadDisplayName</key>
      <string>${payload.PayloadDisplayName}</string>
      <key>PayloadDescription</key>
      <string>${payload.PayloadDescription}</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      ${this.serializePayloadContent(payload)}
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>${payload.PayloadDisplayName}</string>
  <key>PayloadIdentifier</key>
  <string>${payload.PayloadIdentifier}</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${crypto.randomUUID()}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;

    return xml;
  }

  private serializePayloadContent(payload: any): string {
    let content = '';
    
    if (payload.AttachAPN) {
      content += `
      <key>AttachAPN</key>
      <dict>
        <key>Name</key>
        <string>${payload.AttachAPN.Name}</string>
        <key>AuthenticationType</key>
        <string>${payload.AttachAPN.AuthenticationType}</string>
        <key>Username</key>
        <string>${payload.AttachAPN.Username}</string>
        <key>Password</key>
        <string>${payload.AttachAPN.Password}</string>
      </dict>`;
    }

    if (payload.CellularData) {
      content += `
      <key>CellularData</key>
      <array>`;
      
      payload.CellularData.forEach(data => {
        content += `
        <dict>
          <key>SMDP</key>
          <string>${data.SMDP}</string>
          <key>ICCID</key>
          <string>${data.ICCID}</string>
          <key>PIN</key>
          <string>${data.PIN}</string>
        </dict>`;
      });
      
      content += `
      </array>`;
    }

    return content;
  }
}