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

import { EmailQueueService } from '../EmailQueueService';
import { EmailService } from '../EmailService';
import { QueueMetricsService } from '../QueueMetricsService';
import { RetryStrategyService } from '../RetryStrategyService';
import { NotificationPriority } from '../notification_types';
import Queue from 'bull';

// Mock dependencies
jest.mock('../EmailService');
jest.mock('../QueueMetricsService');
jest.mock('../RetryStrategyService');
jest.mock('bull');

describe('EmailQueueService', () => {
    let emailQueue: EmailQueueService;
    let mockEmailService: jest.Mocked<EmailService>;
    let mockMetricsService: jest.Mocked<QueueMetricsService>;
    let mockRetryStrategyService: jest.Mocked<RetryStrategyService>;
    let mockQueue: jest.Mocked<Queue.Queue>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Initialize mocked services
        mockEmailService = new EmailService({
            apiKey: 'test-key',
            fromEmail: 'test@example.com'
        }) as jest.Mocked<EmailService>;

        mockMetricsService = new QueueMetricsService() as jest.Mocked<QueueMetricsService>;
        mockRetryStrategyService = new RetryStrategyService() as jest.Mocked<RetryStrategyService>;

        // Mock Bull queue
        mockQueue = {
            add: jest.fn(),
            process: jest.fn(),
            on: jest.fn(),
            getWaitingCount: jest.fn(),
            getActiveCount: jest.fn(),
            getCompletedCount: jest.fn(),
            getFailedCount: jest.fn(),
            getDelayedCount: jest.fn(),
            getFailed: jest.fn(),
            getJob: jest.fn(),
            clean: jest.fn(),
            close: jest.fn(),
        } as unknown as jest.Mocked<Queue.Queue>;

        (Queue as jest.Mock).mockImplementation(() => mockQueue);

        // Initialize EmailQueueService with mocked dependencies
        emailQueue = new EmailQueueService(
            mockEmailService,
            mockMetricsService,
            mockRetryStrategyService,
            {
                host: 'localhost',
                port: 6379
            }
        );
    });

    describe('addToQueue', () => {
        it('should add a job to the queue with correct priority', async () => {
            const jobData = {
                recipient: 'test@example.com',
                subject: 'Test Subject',
                text: 'Test Content',
                html: '<p>Test Content</p>',
                type: 'notification',
                priority: NotificationPriority.HIGH
            };

            const mockJob = { id: '1', data: jobData };
            mockQueue.add.mockResolvedValue(mockJob as any);
            mockQueue.count.mockResolvedValue(1);

            const result = await emailQueue.addToQueue(jobData);

            expect(mockQueue.add).toHaveBeenCalledWith(jobData, {
                priority: 2 // HIGH priority
            });
            expect(mockMetricsService.recordJobAdded).toHaveBeenCalledWith(NotificationPriority.HIGH);
            expect(mockMetricsService.updateQueueSize).toHaveBeenCalledWith(1);
            expect(result).toBe(mockJob);
        });

        it('should handle queue errors', async () => {
            const jobData = {
                recipient: 'test@example.com',
                subject: 'Test Subject',
                text: 'Test Content',
                html: '<p>Test Content</p>',
                type: 'notification',
                priority: NotificationPriority.MEDIUM
            };

            mockQueue.add.mockRejectedValue(new Error('Queue error'));

            await expect(emailQueue.addToQueue(jobData)).rejects.toThrow('Queue error');
        });
    });

    describe('getQueueStatus', () => {
        it('should return correct queue status', async () => {
            mockQueue.getWaitingCount.mockResolvedValue(1);
            mockQueue.getActiveCount.mockResolvedValue(2);
            mockQueue.getCompletedCount.mockResolvedValue(3);
            mockQueue.getFailedCount.mockResolvedValue(4);
            mockQueue.getDelayedCount.mockResolvedValue(5);

            const status = await emailQueue.getQueueStatus();

            expect(status).toEqual({
                waiting: 1,
                active: 2,
                completed: 3,
                failed: 4,
                delayed: 5
            });
        });
    });

    describe('retryFailedJob', () => {
        it('should retry a failed job', async () => {
            const jobId = '1';
            const mockJob = {
                retry: jest.fn().mockResolvedValue(undefined)
            };
            mockQueue.getJob.mockResolvedValue(mockJob as any);

            await emailQueue.retryFailedJob(jobId);

            expect(mockQueue.getJob).toHaveBeenCalledWith(jobId);
            expect(mockJob.retry).toHaveBeenCalled();
        });

        it('should handle non-existent job', async () => {
            const jobId = '1';
            mockQueue.getJob.mockResolvedValue(null);

            await emailQueue.retryFailedJob(jobId);

            expect(mockQueue.getJob).toHaveBeenCalledWith(jobId);
        });
    });

    describe('cleanQueue', () => {
        it('should clean completed and failed jobs', async () => {
            await emailQueue.cleanQueue();

            expect(mockQueue.clean).toHaveBeenCalledTimes(2);
            expect(mockQueue.clean).toHaveBeenCalledWith(0, 'completed');
            expect(mockQueue.clean).toHaveBeenCalledWith(0, 'failed');
        });
    });
}); 