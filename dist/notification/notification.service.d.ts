export declare class NotificationService {
    private readonly logger;
    sendNotification(type: string, recipient: string, data: any): Promise<void>;
}
