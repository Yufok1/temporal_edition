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