import { Controller, Get, Post, Put, Param, Query, UseGuards, Req, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CarrierType } from './profile.entity';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @Roles('admin', 'operator', 'auditor')
  @ApiOperation({ summary: 'Get all profiles' })
  async getProfiles(@Query('carrier') carrier?: CarrierType) {
    return this.profileService.findAll(carrier);
  }

  @Get('analytics')
  @Roles('admin', 'operator', 'auditor')
  @ApiOperation({ summary: 'Get profile analytics' })
  async getAnalytics(@Query('carrier') carrier?: CarrierType) {
    return this.profileService.getAnalytics(carrier);
  }

  @Get(':id')
  @Roles('admin', 'operator', 'auditor')
  @ApiOperation({ summary: 'Get profile by ID' })
  async getProfile(@Param('id') id: string) {
    return this.profileService.findById(id);
  }

  @Put(':id/activate')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Activate profile' })
  async activateProfile(@Param('id') id: string, @Req() req: any) {
    return this.profileService.activate(id, req.user.id);
  }

  @Put(':id/deactivate')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Deactivate profile' })
  async deactivateProfile(@Param('id') id: string, @Req() req: any) {
    return this.profileService.deactivate(id, req.user.id);
  }

  @Post('import')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import profiles from CSV' })
  async importProfiles(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    // CSV import logic would be implemented here
    return { message: 'Import functionality ready', filename: file.originalname };
  }
}