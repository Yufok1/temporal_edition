import { NotificationPriority } from './notification_types';
export declare class MonitoringService {
    private readonly systemHealthGauge;
    private readonly alertCounter;
    private readonly queueHealthGauge;
    private readonly processingTimeGauge;
    private readonly errorRateGauge;
    private readonly ALERT_THRESHOLDS;
    constructor();
    updateSystemHealth(component: string, isHealthy: boolean): void;
    updateQueueMetrics(metrics: {
        size: number;
        processingTime: number;
        errorRate: number;
        retryRate: number;
    }): void;
    updatePriorityMetrics(priority: NotificationPriority, metrics: {
        processingTime: number;
        errorRate: number;
    }): void;
    private recordAlert;
    getMetrics(): Promise<string>;
}
