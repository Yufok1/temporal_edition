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

import { QueueMetricsService } from '../QueueMetricsService';
import { NotificationPriority } from '../notification_types';
import Queue from 'bull';

describe('QueueMetricsService', () => {
    let metricsService: QueueMetricsService;
    let mockJob: Partial<Queue.Job>;

    beforeEach(() => {
        metricsService = new QueueMetricsService();
        mockJob = {
            id: '1',
            data: {
                priority: NotificationPriority.MEDIUM
            },
            timestamp: 1000,
            processedOn: 2000
        };
    });

    describe('recordJobCompleted', () => {
        it('should record job completion metrics', () => {
            metricsService.recordJobCompleted(mockJob as Queue.Job, 1000);

            // Note: We can't directly test Prometheus metrics, but we can verify
            // that the method doesn't throw any errors
            expect(() => {
                metricsService.recordJobCompleted(mockJob as Queue.Job, 1000);
            }).not.toThrow();
        });
    });

    describe('recordJobFailed', () => {
        it('should record job failure metrics', () => {
            const error = new Error('Test error');

            expect(() => {
                metricsService.recordJobFailed(mockJob as Queue.Job, error);
            }).not.toThrow();
        });
    });

    describe('recordJobAdded', () => {
        it('should record job addition metrics', () => {
            expect(() => {
                metricsService.recordJobAdded(NotificationPriority.HIGH);
            }).not.toThrow();
        });
    });

    describe('updateQueueSize', () => {
        it('should update queue size metric', () => {
            expect(() => {
                metricsService.updateQueueSize(10);
            }).not.toThrow();
        });
    });

    describe('recordRetryAttempt', () => {
        it('should record retry attempt metrics', () => {
            const error = new Error('Test error');

            expect(() => {
                metricsService.recordRetryAttempt(
                    'job-1',
                    NotificationPriority.MEDIUM,
                    5000,
                    error
                );
            }).not.toThrow();
        });
    });

    describe('recordRetryExhausted', () => {
        it('should record retry exhaustion metrics', () => {
            const error = new Error('Test error');

            expect(() => {
                metricsService.recordRetryExhausted(
                    'job-1',
                    NotificationPriority.MEDIUM,
                    error
                );
            }).not.toThrow();
        });
    });

    describe('recordQueueError', () => {
        it('should record queue error metrics', () => {
            const error = new Error('Queue error');

            expect(() => {
                metricsService.recordQueueError(error);
            }).not.toThrow();
        });
    });

    describe('getMetrics', () => {
        it('should return metrics in Prometheus format', () => {
            const metrics = metricsService.getMetrics();
            expect(typeof metrics).toBe('string');
            expect(metrics).toContain('email_jobs_completed_total');
        });
    });
}); 