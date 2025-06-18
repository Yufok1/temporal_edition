"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueMetricsService = void 0;
const prom_client_1 = require("prom-client");
class QueueMetricsService {
    constructor() {
        // Initialize Prometheus metrics
        this.jobCompletedCounter = new prom_client_1.Counter({
            name: 'email_jobs_completed_total',
            help: 'Total number of completed email jobs',
            labelNames: ['priority']
        });
        this.jobFailedCounter = new prom_client_1.Counter({
            name: 'email_jobs_failed_total',
            help: 'Total number of failed email jobs',
            labelNames: ['priority', 'error_type']
        });
        this.jobProcessingTime = new prom_client_1.Histogram({
            name: 'email_job_processing_seconds',
            help: 'Time spent processing email jobs',
            labelNames: ['priority'],
            buckets: [0.1, 0.5, 1, 2, 5, 10, 30]
        });
        this.queueSizeGauge = new prom_client_1.Gauge({
            name: 'email_queue_size',
            help: 'Current size of the email queue'
        });
        this.retryCounter = new prom_client_1.Counter({
            name: 'email_job_retries_total',
            help: 'Total number of job retries',
            labelNames: ['priority']
        });
        this.errorCounter = new prom_client_1.Counter({
            name: 'email_queue_errors_total',
            help: 'Total number of queue errors'
        });
    }
    recordJobCompleted(job, processingTime) {
        const priority = job.data.priority;
        this.jobCompletedCounter.inc({ priority });
        this.jobProcessingTime.observe({ priority }, processingTime / 1000); // Convert to seconds
    }
    recordJobFailed(job, error) {
        const priority = job.data.priority;
        this.jobFailedCounter.inc({
            priority,
            error_type: error.name || 'UnknownError'
        });
    }
    recordJobAdded(priority) {
        this.jobCompletedCounter.inc({ priority });
    }
    updateQueueSize(size) {
        this.queueSizeGauge.set(size);
    }
    recordRetryAttempt(jobId, priority, delay, error) {
        this.retryCounter.inc({ priority });
    }
    recordRetryExhausted(jobId, priority, error) {
        this.jobFailedCounter.inc({
            priority,
            error_type: 'RetryExhausted'
        });
    }
    recordQueueError(error) {
        this.errorCounter.inc();
    }
    getMetrics() {
        return this.jobCompletedCounter.registry.metrics();
    }
}
exports.QueueMetricsService = QueueMetricsService;
//# sourceMappingURL=QueueMetricsService.js.map