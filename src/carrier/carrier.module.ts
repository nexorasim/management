import { Module } from '@nestjs/common';
import { CarrierService } from './carrier.service';
import { CarrierController } from './carrier.controller';

@Module({
  providers: [CarrierService],
  controllers: [CarrierController],
  exports: [CarrierService],
})
export class CarrierModule {}