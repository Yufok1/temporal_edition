import { NotificationPriority, RetryStrategy } from './notification_types';
import { config } from './config';
import logger from './logger';

export class RetryStrategyService {
    constructor() {
        logger.info('RetryStrategyService initialized', {
            maxRetries: config.retry.maxRetries,
            baseDelay: config.retry.baseDelay
        });
    }

    calculateRetryDelay(
        jobId: string,
        priority: NotificationPriority,
        error: Error
    ): RetryStrategy {
        const retryCount = parseInt(jobId.split('-')[1] || '0');
        
        if (retryCount >= config.retry.maxRetries) {
            logger.warn('Retry attempts exhausted', { jobId, priority, error });
            return {
                shouldRetry: false,
                delay: 0,
                maxRetries: config.retry.maxRetries
            };
        }

        const delay = this.calculateExponentialBackoff(retryCount, priority);
        logger.info('Calculated retry delay', { jobId, priority, retryCount, delay });

        return {
            shouldRetry: true,
            delay,
            maxRetries: config.retry.maxRetries
        };
    }

    private calculateExponentialBackoff(retryCount: number, priority: NotificationPriority): number {
        const priorityMultiplier = this.getPriorityMultiplier(priority);
        const exponentialDelay = config.retry.baseDelay * Math.pow(2, retryCount);
        return Math.min(exponentialDelay * priorityMultiplier, 300000); // Max 5 minutes
    }

    private getPriorityMultiplier(priority: NotificationPriority): number {
        switch (priority) {
            case NotificationPriority.URGENT:
                return 0.5; // Faster retries for urgent
            case NotificationPriority.HIGH:
                return 0.75;
            case NotificationPriority.MEDIUM:
                return 1;
            case NotificationPriority.LOW:
                return 1.5; // Slower retries for low priority
            default:
                return 1;
        }
    }
} 