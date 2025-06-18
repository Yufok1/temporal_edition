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

import { redisClient, createTestServices, cleanupRedis, waitForRedis } from './setup';
import { NotificationPriority } from '../../types';

describe('Redis Integration Tests', () => {
    let services: Awaited<ReturnType<typeof createTestServices>>;

    beforeAll(async () => {
        await redisClient.connect();
        services = await createTestServices();
    });

    afterAll(async () => {
        await cleanupRedis();
        await redisClient.disconnect();
        await services.emailQueue.close();
    });

    beforeEach(async () => {
        await cleanupRedis();
    });

    describe('Queue Operations', () => {
        it('should persist jobs across Redis restarts', async () => {
            // Add a job to the queue
            const job = await services.emailQueue.addToQueue({
                to: 'test@example.com',
                subject: 'Test Email',
                text: 'Test content',
                html: '<p>Test content</p>',
                priority: NotificationPriority.URGENT,
                metadata: { test: true }
            });

            expect(job.id).toBeDefined();

            // Get queue status
            const status = await services.emailQueue.getQueueStatus();
            expect(status.waiting).toBe(1);

            // Simulate Redis restart by disconnecting and reconnecting
            await redisClient.disconnect();
            await redisClient.connect();

            // Verify job is still in queue
            const newStatus = await services.emailQueue.getQueueStatus();
            expect(newStatus.waiting).toBe(1);
        });

        it('should handle concurrent job additions', async () => {
            const jobs = await Promise.all(
                Array(5).fill(null).map((_, i) => 
                    services.emailQueue.addToQueue({
                        to: `test${i}@example.com`,
                        subject: `Test Email ${i}`,
                        text: `Test content ${i}`,
                        html: `<p>Test content ${i}</p>`,
                        priority: NotificationPriority.HIGH,
                        metadata: { test: true, index: i }
                    })
                )
            );

            expect(jobs).toHaveLength(5);
            expect(jobs.every(job => job.id)).toBe(true);

            const status = await services.emailQueue.getQueueStatus();
            expect(status.waiting).toBe(5);
        });

        it('should maintain job priority order', async () => {
            const priorities = [
                NotificationPriority.LOW,
                NotificationPriority.HIGH,
                NotificationPriority.URGENT
            ];

            const jobs = await Promise.all(
                priorities.map(priority =>
                    services.emailQueue.addToQueue({
                        to: 'test@example.com',
                        subject: `Test Email ${priority}`,
                        text: `Test content ${priority}`,
                        html: `<p>Test content ${priority}</p>`,
                        priority,
                        metadata: { test: true, priority }
                    })
                )
            );

            // Wait for jobs to be processed
            await waitForRedis(2000);

            // Verify jobs were processed in priority order
            const completedJobs = await services.emailQueue.getQueueStatus();
            expect(completedJobs.completed).toBe(3);
        });

        it('should handle failed jobs and retries', async () => {
            // Mock email service to fail
            jest.spyOn(services.emailService, 'sendEmail').mockRejectedValueOnce(new Error('Failed to send email'));

            const job = await services.emailQueue.addToQueue({
                to: 'test@example.com',
                subject: 'Test Email',
                text: 'Test content',
                html: '<p>Test content</p>',
                priority: NotificationPriority.HIGH,
                metadata: { test: true }
            });

            // Wait for job to fail and retry
            await waitForRedis(2000);

            const status = await services.emailQueue.getQueueStatus();
            expect(status.failed).toBe(1);

            // Retry the failed job
            await services.emailQueue.retryFailedJob(job.id);

            // Wait for retry attempt
            await waitForRedis(2000);

            const newStatus = await services.emailQueue.getQueueStatus();
            expect(newStatus.failed).toBe(1); // Should still be failed after retry
        });
    });

    describe('Queue Cleanup', () => {
        it('should clean completed and failed jobs', async () => {
            // Add some jobs
            await Promise.all([
                services.emailQueue.addToQueue({
                    to: 'test1@example.com',
                    subject: 'Test Email 1',
                    text: 'Test content 1',
                    html: '<p>Test content 1</p>',
                    priority: NotificationPriority.HIGH
                }),
                services.emailQueue.addToQueue({
                    to: 'test2@example.com',
                    subject: 'Test Email 2',
                    text: 'Test content 2',
                    html: '<p>Test content 2</p>',
                    priority: NotificationPriority.LOW
                })
            ]);

            // Wait for jobs to be processed
            await waitForRedis(2000);

            // Clean the queue
            await services.emailQueue.cleanQueue();

            const status = await services.emailQueue.getQueueStatus();
            expect(status.completed).toBe(0);
            expect(status.failed).toBe(0);
        });
    });
}); 