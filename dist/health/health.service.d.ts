export declare class HealthService {
    getHealthStatus(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
    }>;
    getReadinessStatus(): Promise<{
        status: string;
        timestamp: string;
    }>;
}
