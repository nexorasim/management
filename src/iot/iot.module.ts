import { Module } from '@nestjs/common';
import { IoTService } from './iot.service';
import { IoTController } from './iot.controller';

@Module({
  providers: [IoTService],
  controllers: [IoTController],
  exports: [IoTService],
})
export class IoTModule {}