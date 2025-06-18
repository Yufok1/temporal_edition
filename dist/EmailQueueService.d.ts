import Queue from 'bull';
import { EmailService } from './EmailService';
import { QueueMetricsService } from './QueueMetricsService';
import { RetryStrategyService } from './RetryStrategyService';
import { EmailJobData } from './notification_types';
export declare class EmailQueueService {
    private queue;
    private emailService;
    private metricsService;
    private retryStrategyService;
    constructor(emailService: EmailService, metricsService: QueueMetricsService, retryStrategyService: RetryStrategyService, redisConfig?: {
        host: string;
        port: number;
        password?: string;
    });
    private setupQueueHandlers;
    addToQueue(data: EmailJobData): Promise<Queue.Job>;
    private getJobPriority;
    getQueueStatus(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    }>;
    getFailedJobs(): Promise<Queue.Job[]>;
    retryFailedJob(jobId: string): Promise<void>;
    cleanQueue(): Promise<void>;
    close(): Promise<void>;
}
