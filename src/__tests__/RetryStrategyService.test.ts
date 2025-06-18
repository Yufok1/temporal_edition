import { RetryStrategyService } from '../RetryStrategyService';
import { NotificationPriority } from '../notification_types';

describe('RetryStrategyService', () => {
    let retryStrategy: RetryStrategyService;

    beforeEach(() => {
        retryStrategy = new RetryStrategyService(3, 5000);
    });

    describe('calculateRetryDelay', () => {
        it('should return shouldRetry false when max retries reached', () => {
            const result = retryStrategy.calculateRetryDelay(
                'job-3',
                NotificationPriority.MEDIUM,
                new Error('Test error')
            );

            expect(result.shouldRetry).toBe(false);
            expect(result.delay).toBe(0);
            expect(result.maxRetries).toBe(3);
        });

        it('should calculate correct delay for URGENT priority', () => {
            const result = retryStrategy.calculateRetryDelay(
                'job-1',
                NotificationPriority.URGENT,
                new Error('Test error')
            );

            expect(result.shouldRetry).toBe(true);
            expect(result.delay).toBeLessThanOrEqual(300000); // Max 5 minutes
            expect(result.maxRetries).toBe(3);
        });

        it('should calculate correct delay for LOW priority', () => {
            const result = retryStrategy.calculateRetryDelay(
                'job-1',
                NotificationPriority.LOW,
                new Error('Test error')
            );

            expect(result.shouldRetry).toBe(true);
            expect(result.delay).toBeLessThanOrEqual(300000); // Max 5 minutes
            expect(result.maxRetries).toBe(3);
        });

        it('should handle invalid job ID format', () => {
            const result = retryStrategy.calculateRetryDelay(
                'invalid-job-id',
                NotificationPriority.MEDIUM,
                new Error('Test error')
            );

            expect(result.shouldRetry).toBe(true);
            expect(result.delay).toBeLessThanOrEqual(300000);
            expect(result.maxRetries).toBe(3);
        });
    });

    describe('exponential backoff', () => {
        it('should increase delay exponentially with retry count', () => {
            const result1 = retryStrategy.calculateRetryDelay(
                'job-1',
                NotificationPriority.MEDIUM,
                new Error('Test error')
            );

            const result2 = retryStrategy.calculateRetryDelay(
                'job-2',
                NotificationPriority.MEDIUM,
                new Error('Test error')
            );

            expect(result2.delay).toBeGreaterThan(result1.delay);
        });

        it('should respect priority multipliers', () => {
            const urgentResult = retryStrategy.calculateRetryDelay(
                'job-1',
                NotificationPriority.URGENT,
                new Error('Test error')
            );

            const lowResult = retryStrategy.calculateRetryDelay(
                'job-1',
                NotificationPriority.LOW,
                new Error('Test error')
            );

            expect(urgentResult.delay).toBeLessThan(lowResult.delay);
        });
    });
}); 