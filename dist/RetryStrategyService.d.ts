import { NotificationPriority, RetryStrategy } from './notification_types';
export declare class RetryStrategyService {
    constructor();
    calculateRetryDelay(jobId: string, priority: NotificationPriority, error: Error): RetryStrategy;
    private calculateExponentialBackoff;
    private getPriorityMultiplier;
}
