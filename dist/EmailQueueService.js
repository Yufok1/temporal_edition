"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const bull_1 = __importDefault(require("bull"));
const notification_types_1 = require("./notification_types");
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
class EmailQueueService {
    constructor(emailService, metricsService, retryStrategyService, redisConfig) {
        this.emailService = emailService;
        this.metricsService = metricsService;
        this.retryStrategyService = retryStrategyService;
        this.queue = new bull_1.default('email-queue', {
            redis: redisConfig || config_1.config.redis,
            defaultJobOptions: {
                attempts: config_1.config.retry.maxRetries,
                backoff: {
                    type: 'exponential',
                    delay: config_1.config.retry.baseDelay,
                },
                removeOnComplete: true,
                removeOnFail: false,
            },
        });
        this.setupQueueHandlers();
        logger_1.default.info('EmailQueueService initialized');
    }
    setupQueueHandlers() {
        this.queue.process(async (job) => {
            try {
                await this.emailService.sendEmail({
                    to: job.data.recipient,
                    subject: job.data.subject,
                    text: job.data.text,
                    html: job.data.html,
                    metadata: job.data.metadata,
                });
                this.metricsService.recordJobCompleted(job, job.processedOn - job.timestamp);
            }
            catch (error) {
                this.metricsService.recordJobFailed(job, error);
                const jobId = job.id?.toString() || 'unknown';
                const retryResult = this.retryStrategyService.calculateRetryDelay(jobId, job.data.priority, error);
                if (retryResult.shouldRetry) {
                    await job.update({
                        ...job.data,
                        retryCount: (job.data.retryCount || 0) + 1,
                    });
                    throw error;
                }
                else {
                    this.metricsService.recordRetryExhausted(jobId, job.data.priority, error);
                }
            }
        });
        this.queue.on('completed', (job) => {
            this.metricsService.recordJobCompleted(job, job.processedOn - job.timestamp);
        });
        this.queue.on('failed', (job, error) => {
            this.metricsService.recordJobFailed(job, error);
            if (job.attemptsMade < job.opts.attempts) {
                const jobId = job.id?.toString() || 'unknown';
                const retryResult = this.retryStrategyService.calculateRetryDelay(jobId, job.data.priority, error);
                this.metricsService.recordRetryAttempt(jobId, job.data.priority, retryResult.delay, error);
            }
        });
        this.queue.on('stalled', (job) => {
            this.metricsService.recordQueueError(new Error('Job stalled'));
        });
        this.queue.on('error', (error) => {
            this.metricsService.recordQueueError(error);
        });
    }
    async addToQueue(data) {
        const job = await this.queue.add(data, {
            priority: this.getJobPriority(data.priority),
        });
        this.metricsService.recordJobAdded(data.priority);
        this.metricsService.updateQueueSize(await this.queue.count());
        return job;
    }
    getJobPriority(priority) {
        return config_1.config.queue.priorities[priority] || config_1.config.queue.priorities[notification_types_1.NotificationPriority.MEDIUM];
    }
    async getQueueStatus() {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.queue.getWaitingCount(),
            this.queue.getActiveCount(),
            this.queue.getCompletedCount(),
            this.queue.getFailedCount(),
            this.queue.getDelayedCount(),
        ]);
        return { waiting, active, completed, failed, delayed };
    }
    async getFailedJobs() {
        return this.queue.getFailed();
    }
    async retryFailedJob(jobId) {
        const job = await this.queue.getJob(jobId);
        if (job) {
            await job.retry();
        }
    }
    async cleanQueue() {
        await Promise.all([
            this.queue.clean(0, 'completed'),
            this.queue.clean(0, 'failed'),
        ]);
    }
    async close() {
        await this.queue.close();
    }
}
exports.EmailQueueService = EmailQueueService;
//# sourceMappingURL=EmailQueueService.js.map