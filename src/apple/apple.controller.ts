import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppleService } from './apple.service';

@ApiTags('apple')
@Controller('apple')
export class AppleController {
  constructor(private appleService: AppleService) {}

  @Post('mdm/enroll')
  @ApiOperation({ summary: 'Handle MDM device enrollment' })
  async handleEnrollment(@Body() enrollmentData: any) {
    return this.appleService.enrollDevice(enrollmentData);
  }

  @Get('devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enrolled devices' })
  async getDevices() {
    return this.appleService.getAllDevices();
  }

  @Get('devices/:udid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get device details' })
  async getDevice(@Param('udid') udid: string) {
    return this.appleService.getDeviceByUDID(udid);
  }
}