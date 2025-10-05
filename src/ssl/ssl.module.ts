import { Module } from '@nestjs/common';
import { SSLService } from './ssl.service';

@Module({
  providers: [SSLService],
  exports: [SSLService],
})
export class SSLModule {}