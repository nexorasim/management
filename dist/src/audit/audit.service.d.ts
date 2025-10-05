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
export declare class AuditService {
    private auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    log(data: AuditLogData): Promise<AuditLog>;
    findAll(limit?: number): Promise<AuditLog[]>;
    findByUser(userId: string, limit?: number): Promise<AuditLog[]>;
    findByAction(action: string, limit?: number): Promise<AuditLog[]>;
}
export {};
