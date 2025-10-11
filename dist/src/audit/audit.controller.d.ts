import { AuditService } from './audit.service';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
    getAuditLogs(limit?: number): Promise<import("./audit.entity").AuditLog[]>;
    getAuditLogsByUser(userId: string, limit?: number): Promise<import("./audit.entity").AuditLog[]>;
    getAuditLogsByAction(action: string, limit?: number): Promise<import("./audit.entity").AuditLog[]>;
}
