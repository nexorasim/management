export declare class AuditLog {
    id: string;
    action: string;
    entityId: string;
    userId: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
