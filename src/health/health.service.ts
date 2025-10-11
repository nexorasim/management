import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async getHealthStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  async getReadinessStatus() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }
}