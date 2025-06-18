import { createTestServices, waitForMetric, registry } from './setup';
import { NotificationPriority } from '../../types';

describe('Prometheus Integration Tests', () => {
    let services: Awaited<ReturnType<typeof createTestServices>>;

    beforeAll(async () => {
        services = await createTestServices();
    });

    afterAll(async () => {
        await services.emailQueue.close();
    });

    beforeEach(async () => {
        // Reset metrics
        await registry.clear();
    });

    describe('Queue Metrics', () => {
        it('should record job completion metrics', async () => {
            // Add and process a job
            await services.emailQueue.addToQueue({
                to: 'test@example.com',
                subject: 'Test Email',
                text: 'Test content',
                html: '<p>Test content</p>',
                priority: NotificationPriority.HIGH
            });

            // Wait for metric to be recorded
            const hasMetric = await waitForMetric('email_jobs_completed_total');
            expect(hasMetric).toBe(true);

            // Verify metric value
            const metrics = await registry.getMetricsAsJSON();
            const completedMetric = metrics.find(m => m.name === 'email_jobs_completed_total');
            expect(completedMetric).toBeDefined();
            expect(completedMetric?.value).toBe(1);
        });

        it('should record job failure metrics', async () => {
            // Mock email service to fail
            jest.spyOn(services.emailService, 'sendEmail').mockRejectedValueOnce(new Error('Failed to send email'));

            // Add a job that will fail
            await services.emailQueue.addToQueue({
                to: 'test@example.com',
                subject: 'Test Email',
                text: 'Test content',
                html: '<p>Test content</p>',
                priority: NotificationPriority.HIGH
            });

            // Wait for metric to be recorded
            const hasMetric = await waitForMetric('email_jobs_failed_total');
            expect(hasMetric).toBe(true);

            // Verify metric value
            const metrics = await registry.getMetricsAsJSON();
            const failedMetric = metrics.find(m => m.name === 'email_jobs_failed_total');
            expect(failedMetric).toBeDefined();
            expect(failedMetric?.value).toBe(1);
        });

        it('should record queue size metrics', async () => {
            // Add multiple jobs
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

            // Wait for metric to be recorded
            const hasMetric = await waitForMetric('email_queue_size');
            expect(hasMetric).toBe(true);

            // Verify metric value
            const metrics = await registry.getMetricsAsJSON();
            const queueSizeMetric = metrics.find(m => m.name === 'email_queue_size');
            expect(queueSizeMetric).toBeDefined();
            expect(queueSizeMetric?.value).toBe(2);
        });

        it('should record retry attempt metrics', async () => {
            // Mock email service to fail
            jest.spyOn(services.emailService, 'sendEmail')
                .mockRejectedValueOnce(new Error('Failed to send email'))
                .mockRejectedValueOnce(new Error('Failed to send email'));

            // Add a job that will fail and be retried
            const job = await services.emailQueue.addToQueue({
                to: 'test@example.com',
                subject: 'Test Email',
                text: 'Test content',
                html: '<p>Test content</p>',
                priority: NotificationPriority.HIGH
            });

            // Wait for initial failure
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Retry the failed job
            await services.emailQueue.retryFailedJob(job.id);

            // Wait for metric to be recorded
            const hasMetric = await waitForMetric('email_job_retries_total');
            expect(hasMetric).toBe(true);

            // Verify metric value
            const metrics = await registry.getMetricsAsJSON();
            const retryMetric = metrics.find(m => m.name === 'email_job_retries_total');
            expect(retryMetric).toBeDefined();
            expect(retryMetric?.value).toBe(1);
        });

        it('should record processing time metrics', async () => {
            // Add a job
            await services.emailQueue.addToQueue({
                to: 'test@example.com',
                subject: 'Test Email',
                text: 'Test content',
                html: '<p>Test content</p>',
                priority: NotificationPriority.HIGH
            });

            // Wait for metric to be recorded
            const hasMetric = await waitForMetric('email_job_processing_seconds');
            expect(hasMetric).toBe(true);

            // Verify metric exists
            const metrics = await registry.getMetricsAsJSON();
            const processingTimeMetric = metrics.find(m => m.name === 'email_job_processing_seconds');
            expect(processingTimeMetric).toBeDefined();
            expect(processingTimeMetric?.value).toBeGreaterThan(0);
        });
    });

    describe('Metric Labels', () => {
        it('should include priority labels in metrics', async () => {
            // Add jobs with different priorities
            await Promise.all([
                services.emailQueue.addToQueue({
                    to: 'test1@example.com',
                    subject: 'Test Email 1',
                    text: 'Test content 1',
                    html: '<p>Test content 1</p>',
                    priority: NotificationPriority.URGENT
                }),
                services.emailQueue.addToQueue({
                    to: 'test2@example.com',
                    subject: 'Test Email 2',
                    text: 'Test content 2',
                    html: '<p>Test content 2</p>',
                    priority: NotificationPriority.LOW
                })
            ]);

            // Wait for metrics to be recorded
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verify metrics have priority labels
            const metrics = await registry.getMetricsAsJSON();
            const completedMetric = metrics.find(m => m.name === 'email_jobs_completed_total');
            expect(completedMetric).toBeDefined();
            expect(completedMetric?.labels).toContainEqual(
                expect.objectContaining({ priority: NotificationPriority.URGENT })
            );
            expect(completedMetric?.labels).toContainEqual(
                expect.objectContaining({ priority: NotificationPriority.LOW })
            );
        });
    });
}); 