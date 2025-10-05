import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CarrierService } from './carrier.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Carriers')
@ApiBearerAuth()
@Controller('carriers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarrierController {
  constructor(private carrierService: CarrierService) {}

  @Get()
  @Roles('admin', 'operator', 'auditor')
  @ApiOperation({ summary: 'Get all carriers' })
  async getCarriers() {
    return this.carrierService.getAll();
  }

  @Get(':id')
  @Roles('admin', 'operator', 'auditor')
  @ApiOperation({ summary: 'Get carrier by ID' })
  async getCarrier(@Param('id') id: string) {
    return this.carrierService.getById(id);
  }
}