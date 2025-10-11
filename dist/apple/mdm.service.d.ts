import { Repository } from 'typeorm';
import { MDMCommand } from './entities/mdm-command.entity';
import { AppleDevice } from './entities/apple-device.entity';
export declare class MDMService {
    private commandRepository;
    private deviceRepository;
    private readonly logger;
    constructor(commandRepository: Repository<MDMCommand>, deviceRepository: Repository<AppleDevice>);
    sendDeviceInformationCommand(deviceId: string): Promise<MDMCommand>;
    private sendCommand;
    getPendingCommands(udid: string): Promise<any[]>;
}
