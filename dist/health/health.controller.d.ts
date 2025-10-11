import { HealthService } from './health.service';
export declare class HealthController {
    private healthService;
    constructor(healthService: HealthService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
    }>;
    getReadiness(): Promise<{
        status: string;
        timestamp: string;
    }>;
}
