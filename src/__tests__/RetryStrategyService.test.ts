// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

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