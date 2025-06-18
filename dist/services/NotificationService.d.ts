export interface Alert {
    severity: 'critical' | 'warning' | 'info';
    message: string;
    details?: Record<string, any>;
}
export declare class NotificationService {
    private slackWebhookUrl;
    constructor();
    sendAlert(alert: Alert): Promise<void>;
    private getSeverityColor;
}
