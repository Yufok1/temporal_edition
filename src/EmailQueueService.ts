import Queue from 'bull';
import { EmailService } from './EmailService';
import { QueueMetricsService } from './QueueMetricsService';
import { RetryStrategyService } from './RetryStrategyService';
import { EmailJobData, NotificationPriority } from './notification_types';
import { config } from './config';
import logger from './logger';

export class EmailQueueService {
    private queue: Queue.Queue;
    private emailService: EmailService;
    private metricsService: QueueMetricsService;
    private retryStrategyService: RetryStrategyService;

    constructor(
        emailService: EmailService,
        metricsService: QueueMetricsService,
        retryStrategyService: RetryStrategyService,
        redisConfig?: {
            host: string;
            port: number;
            password?: string;
        }
    ) {
        this.emailService = emailService;
        this.metricsService = metricsService;
        this.retryStrategyService = retryStrategyService;

        this.queue = new Queue('email-queue', {
            redis: redisConfig || config.redis,
            defaultJobOptions: {
                attempts: config.retry.maxRetries,
                backoff: {
                    type: 'exponential',
                    delay: config.retry.baseDelay,
                },
                removeOnComplete: true,
                removeOnFail: false,
            },
        });

        this.setupQueueHandlers();
        logger.info('EmailQueueService initialized');
    }

    private setupQueueHandlers(): void {
        this.queue.process(async (job: Queue.Job<EmailJobData>) => {
            try {
                await this.emailService.sendEmail({
                    to: job.data.recipient,
                    subject: job.data.subject,
                    text: job.data.text,
                    html: job.data.html,
                    metadata: job.data.metadata,
                });

                this.metricsService.recordJobCompleted(job, job.processedOn! - job.timestamp);
            } catch (error) {
                this.metricsService.recordJobFailed(job, error as Error);

                const jobId = job.id?.toString() || 'unknown';
                const retryResult = this.retryStrategyService.calculateRetryDelay(
                    jobId,
                    job.data.priority,
                    error as Error
                );

                if (retryResult.shouldRetry) {
                    await job.update({
                        ...job.data,
                        retryCount: (job.data.retryCount || 0) + 1,
                    });
                    throw error;
                } else {
                    this.metricsService.recordRetryExhausted(jobId, job.data.priority, error as Error);
                }
            }
        });

        this.queue.on('completed', (job: Queue.Job) => {
            this.metricsService.recordJobCompleted(job, job.processedOn! - job.timestamp);
        });

        this.queue.on('failed', (job: Queue.Job, error: Error) => {
            this.metricsService.recordJobFailed(job, error);
            if (job.attemptsMade < job.opts.attempts!) {
                const jobId = job.id?.toString() || 'unknown';
                const retryResult = this.retryStrategyService.calculateRetryDelay(
                    jobId,
                    job.data.priority,
                    error
                );
                this.metricsService.recordRetryAttempt(
                    jobId,
                    job.data.priority,
                    retryResult.delay,
                    error
                );
            }
        });

        this.queue.on('stalled', (job: Queue.Job) => {
            this.metricsService.recordQueueError(new Error('Job stalled'));
        });

        this.queue.on('error', (error: Error) => {
            this.metricsService.recordQueueError(error);
        });
    }

    async addToQueue(data: EmailJobData): Promise<Queue.Job> {
        const job = await this.queue.add(data, {
            priority: this.getJobPriority(data.priority),
        });

        this.metricsService.recordJobAdded(data.priority);
        this.metricsService.updateQueueSize(await this.queue.count());

        return job;
    }

    private getJobPriority(priority: NotificationPriority): number {
        return config.queue.priorities[priority] || config.queue.priorities[NotificationPriority.MEDIUM];
    }

    async getQueueStatus(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    }> {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.queue.getWaitingCount(),
            this.queue.getActiveCount(),
            this.queue.getCompletedCount(),
            this.queue.getFailedCount(),
            this.queue.getDelayedCount(),
        ]);

        return { waiting, active, completed, failed, delayed };
    }

    async getFailedJobs(): Promise<Queue.Job[]> {
        return this.queue.getFailed();
    }

    async retryFailedJob(jobId: string): Promise<void> {
        const job = await this.queue.getJob(jobId);
        if (job) {
            await job.retry();
        }
    }

    async cleanQueue(): Promise<void> {
        await Promise.all([
            this.queue.clean(0, 'completed'),
            this.queue.clean(0, 'failed'),
        ]);
    }

    async close(): Promise<void> {
        await this.queue.close();
    }
} 