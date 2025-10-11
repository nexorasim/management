import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppleController } from './apple.controller';
import { AppleService } from './apple.service';
import { ABMService } from './abm.service';
import { MDMService } from './mdm.service';
import { APNsService } from './apns.service';
import { ESIMService } from './esim.service';
import { AppleDevice } from './entities/apple-device.entity';
import { MDMCommand } from './entities/mdm-command.entity';
import { ABMToken } from './entities/abm-token.entity';
import { ESIMProfile } from './entities/esim-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppleDevice,
      MDMCommand,
      ABMToken,
      ESIMProfile,
    ]),
  ],
  controllers: [AppleController],
  providers: [
    AppleService,
    ABMService,
    MDMService,
    APNsService,
    ESIMService,
  ],
  exports: [
    AppleService,
    ABMService,
    MDMService,
    APNsService,
    ESIMService,
  ],
})
export class AppleModule {}