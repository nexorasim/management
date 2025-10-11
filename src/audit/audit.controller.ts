import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @Roles('admin', 'auditor')
  @ApiOperation({ summary: 'Get audit logs' })
  async getAuditLogs(@Query('limit') limit?: number) {
    return this.auditService.findAll(limit);
  }

  @Get('user')
  @Roles('admin', 'auditor')
  @ApiOperation({ summary: 'Get audit logs by user' })
  async getAuditLogsByUser(
    @Query('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.findByUser(userId, limit);
  }

  @Get('action')
  @Roles('admin', 'auditor')
  @ApiOperation({ summary: 'Get audit logs by action' })
  async getAuditLogsByAction(
    @Query('action') action: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.findByAction(action, limit);
  }
}