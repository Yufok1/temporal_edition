import Queue from 'bull';
import { NotificationPriority } from './notification_types';
export declare class QueueMetricsService {
    private readonly jobCompletedCounter;
    private readonly jobFailedCounter;
    private readonly jobProcessingTime;
    private readonly queueSizeGauge;
    private readonly retryCounter;
    private readonly errorCounter;
    constructor();
    recordJobCompleted(job: Queue.Job, processingTime: number): void;
    recordJobFailed(job: Queue.Job, error: Error): void;
    recordJobAdded(priority: NotificationPriority): void;
    updateQueueSize(size: number): void;
    recordRetryAttempt(jobId: string, priority: NotificationPriority, delay: number, error: Error): void;
    recordRetryExhausted(jobId: string, priority: NotificationPriority, error: Error): void;
    recordQueueError(error: Error): void;
    getMetrics(): string;
}
