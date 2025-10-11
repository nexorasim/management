import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AppleService } from './apple.service';
import { ABMService } from './abm.service';
import { MDMService } from './mdm.service';
import { ESIMService } from './esim.service';
import { APNsService } from './apns.service';

@ApiTags('apple')
@Controller('apple')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AppleController {
  private readonly logger = new Logger(AppleController.name);

  constructor(
    private appleService: AppleService,
    private abmService: ABMService,
    private mdmService: MDMService,
    private esimService: ESIMService,
    private apnsService: APNsService,
  ) {}

  // MDM Enrollment Endpoint
  @Post('mdm/enroll')
  @ApiOperation({ summary: 'Handle MDM device enrollment' })
  async handleEnrollment(@Body() enrollmentData: any) {
    this.logger.log(`MDM enrollment request from device: ${enrollmentData.UDID}`);
    return this.appleService.enrollDevice(enrollmentData);
  }

  // MDM Check-in Endpoint
  @Post('mdm/checkin')
  @ApiOperation({ summary: 'Handle MDM device check-in' })
  async handleCheckin(@Body() checkinData: any) {
    this.logger.log(`MDM check-in from device: ${checkinData.UDID}`);
    
    if (checkinData.MessageType === 'Authenticate') {
      return { Status: 'Acknowledged' };
    }
    
    if (checkinData.MessageType === 'TokenUpdate') {
      const device = await this.appleService.getDeviceByUDID(checkinData.UDID);
      if (device) {
        await this.appleService.updateDeviceInformation(checkinData.UDID, {
          pushToken: checkinData.Token,
          pushMagic: checkinData.PushMagic,
        });
      }
      return { Status: 'Acknowledged' };
    }

    return { Status: 'NotNow' };
  }

  // MDM Command Polling Endpoint
  @Post('mdm/connect/:udid')
  @ApiOperation({ summary: 'Handle MDM command polling' })
  async handleConnect(@Param('udid') udid: string, @Body() response?: any) {
    if (response && response.CommandUUID) {
      // Process command response
      await this.mdmService.processCommandResponse(response.CommandUUID, response);
    }

    // Return pending commands
    const commands = await this.mdmService.getPendingCommands(udid);
    return commands.length > 0 ? commands[0] : null;
  }

  // Device Management
  @Get('devices')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Get all enrolled devices' })
  async getDevices() {
    return this.appleService.getAllDevices();
  }

  @Get('devices/:id')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Get device details' })
  async getDevice(@Param('id') id: string) {
    return this.appleService.getDeviceByUDID(id);
  }

  @Post('devices/:id/commands/device-info')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Query device information' })
  async queryDeviceInfo(@Param('id') deviceId: string) {
    return this.mdmService.sendDeviceInformationCommand(deviceId);
  }

  @Post('devices/:id/commands/security-info')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Query device security information' })
  async querySecurityInfo(@Param('id') deviceId: string) {
    return this.mdmService.sendSecurityInfoCommand(deviceId);
  }

  @Post('devices/:id/commands/restrictions')
  @Roles('admin')
  @ApiOperation({ summary: 'Apply device restrictions' })
  async applyRestrictions(@Param('id') deviceId: string, @Body() restrictions: any) {
    return this.mdmService.sendRestrictionsCommand(deviceId, restrictions);
  }

  @Post('devices/:id/commands/clear-passcode')
  @Roles('admin')
  @ApiOperation({ summary: 'Clear device passcode' })
  async clearPasscode(@Param('id') deviceId: string, @Body() body: { unlockToken?: string }) {
    return this.mdmService.sendClearPasscodeCommand(deviceId, body.unlockToken);
  }

  @Post('devices/:id/commands/erase')
  @Roles('admin')
  @ApiOperation({ summary: 'Erase device' })
  async eraseDevice(@Param('id') deviceId: string, @Body() body: { pin?: string }) {
    return this.mdmService.sendEraseDeviceCommand(deviceId, body.pin);
  }

  @Get('devices/:id/compliance')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Check device compliance' })
  async checkCompliance(@Param('id') deviceId: string) {
    return this.appleService.checkCompliance(deviceId);
  }

  // eSIM Management
  @Post('esim/profiles')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Create eSIM profile' })
  async createESIMProfile(@Body() profileData: any) {
    return this.esimService.createProfile(profileData);
  }

  @Post('esim/profiles/:id/install')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Install eSIM profile on device' })
  async installESIMProfile(@Param('id') profileId: string, @Body() body: { deviceId: string }) {
    return this.esimService.installProfile(profileId, body.deviceId);
  }

  @Post('esim/profiles/:id/activate')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Activate eSIM profile' })
  async activateESIMProfile(@Param('id') profileId: string) {
    return this.esimService.activateProfile(profileId);
  }

  @Post('esim/profiles/:id/suspend')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Suspend eSIM profile' })
  async suspendESIMProfile(@Param('id') profileId: string) {
    return this.esimService.suspendProfile(profileId);
  }

  @Delete('esim/profiles/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete eSIM profile' })
  async deleteESIMProfile(@Param('id') profileId: string) {
    return this.esimService.deleteProfile(profileId);
  }

  @Post('esim/profiles/:id/transfer')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Transfer eSIM profile between devices' })
  async transferESIMProfile(
    @Param('id') profileId: string,
    @Body() body: { sourceDeviceId: string; targetDeviceId: string }
  ) {
    return this.esimService.transferProfile(profileId, body.sourceDeviceId, body.targetDeviceId);
  }

  @Get('esim/profiles')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'List eSIM profiles' })
  async listESIMProfiles(@Query('deviceId') deviceId?: string) {
    return this.esimService.listProfiles(deviceId);
  }

  @Get('esim/profiles/:id/status')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Get eSIM profile status' })
  async getESIMProfileStatus(@Param('id') profileId: string) {
    return this.esimService.getProfileStatus(profileId);
  }

  // Apple Business Manager
  @Post('abm/tokens')
  @Roles('admin')
  @ApiOperation({ summary: 'Register ABM server token' })
  async registerABMToken(@Body() tokenData: any) {
    return this.abmService.registerServerToken(tokenData);
  }

  @Post('abm/tokens/:id/refresh')
  @Roles('admin')
  @ApiOperation({ summary: 'Refresh ABM token' })
  async refreshABMToken(@Param('id') tokenId: string) {
    return this.abmService.refreshToken(tokenId);
  }

  @Get('abm/tokens/:id/account')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Get ABM account information' })
  async getABMAccount(@Param('id') tokenId: string) {
    return this.abmService.getAccount(tokenId);
  }

  @Get('abm/tokens/:id/devices')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Get ABM devices' })
  async getABMDevices(@Param('id') tokenId: string, @Query('cursor') cursor?: string) {
    return this.abmService.getDevices(tokenId, cursor);
  }

  @Post('abm/tokens/:id/devices/assign')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Assign device to MDM profile' })
  async assignABMDevice(
    @Param('id') tokenId: string,
    @Body() body: { deviceSerialNumber: string; profileUuid: string }
  ) {
    return this.abmService.assignDevice(tokenId, body.deviceSerialNumber, body.profileUuid);
  }

  @Post('abm/tokens/:id/devices/unassign')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Unassign device from MDM profile' })
  async unassignABMDevice(
    @Param('id') tokenId: string,
    @Body() body: { deviceSerialNumber: string }
  ) {
    return this.abmService.unassignDevice(tokenId, body.deviceSerialNumber);
  }

  @Get('abm/tokens/:id/profiles')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Get ABM enrollment profiles' })
  async getABMProfiles(@Param('id') tokenId: string) {
    return this.abmService.getProfiles(tokenId);
  }

  // APNs Management
  @Post('apns/test')
  @Roles('admin')
  @ApiOperation({ summary: 'Test APNs connectivity' })
  async testAPNs(@Body() body: { deviceToken: string; pushMagic: string }) {
    return this.apnsService.sendPushNotification(body.deviceToken, body.pushMagic);
  }

  @Get('apns/status')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Get APNs connection status' })
  async getAPNsStatus() {
    return this.apnsService.getConnectionStatus();
  }

  @Get('apns/certificates/validate')
  @Roles('admin')
  @ApiOperation({ summary: 'Validate APNs certificates' })
  async validateAPNsCertificates() {
    return this.apnsService.validateCertificates();
  }

  @Post('apns/certificates/renew')
  @Roles('admin')
  @ApiOperation({ summary: 'Renew APNs certificates' })
  async renewAPNsCertificates(@Body() body: { certPath: string; keyPath: string }) {
    return this.apnsService.renewCertificate(body.certPath, body.keyPath);
  }
}