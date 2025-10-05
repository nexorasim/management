import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';

interface AuditLogData {
  action: string;
  entityId: string;
  userId: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(data: AuditLogData): Promise<AuditLog> {
    const auditLog = this.auditRepository.create(data);
    return this.auditRepository.save(auditLog);
  }

  async findAll(limit = 100): Promise<AuditLog[]> {
    return this.auditRepository.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async findByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async findByAction(action: string, limit = 50): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: { action },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}