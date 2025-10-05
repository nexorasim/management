import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { ProfileController } from './profile.controller';
import { AuditModule } from '../audit/audit.module';
import { IoTModule } from '../iot/iot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    AuditModule,
    IoTModule,
  ],
  providers: [ProfileService, ProfileResolver],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}