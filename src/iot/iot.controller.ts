import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IoTService } from './iot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('IoT')
@ApiBearerAuth()
@Controller('iot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IoTController {
  constructor(private iotService: IoTService) {}

  @Post('shadow/update')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Update device shadow' })
  async updateShadow(@Body() body: { profileId: string; status: string }) {
    return this.iotService.updateProfileShadow(body.profileId, body.status);
  }
}