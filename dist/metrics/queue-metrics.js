"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceHealthMetrics = exports.dataIntegrityMetrics = exports.queueMetrics = void 0;
const prom_client_1 = require("prom-client");
const system_metrics_1 = require("./system-metrics");
// Queue Health Metrics
exports.queueMetrics = {
    queueSize: new prom_client_1.Gauge({
        name: 'queue_size',
        help: 'Current number of items in the queue',
        registers: [system_metrics_1.register],
    }),
    processingTime: new prom_client_1.Histogram({
        name: 'queue_processing_time_seconds',
        help: 'Time taken to process queue items',
        buckets: [0.1, 0.5, 1, 2, 5, 10],
        registers: [system_metrics_1.register],
    }),
    failedJobs: new prom_client_1.Counter({
        name: 'queue_failed_jobs_total',
        help: 'Total number of failed queue jobs',
        registers: [system_metrics_1.register],
    }),
    retryCount: new prom_client_1.Counter({
        name: 'queue_retry_count_total',
        help: 'Total number of job retries',
        registers: [system_metrics_1.register],
    }),
    activeWorkers: new prom_client_1.Gauge({
        name: 'queue_active_workers',
        help: 'Number of active queue workers',
        registers: [system_metrics_1.register],
    }),
};
// Data Integrity Metrics
exports.dataIntegrityMetrics = {
    dataValidationErrors: new prom_client_1.Counter({
        name: 'data_validation_errors_total',
        help: 'Total number of data validation errors',
        registers: [system_metrics_1.register],
    }),
    dataCorruptionDetected: new prom_client_1.Counter({
        name: 'data_corruption_detected_total',
        help: 'Total number of data corruption events detected',
        registers: [system_metrics_1.register],
    }),
    dataRepairAttempts: new prom_client_1.Counter({
        name: 'data_repair_attempts_total',
        help: 'Total number of data repair attempts',
        registers: [system_metrics_1.register],
    }),
    dataRepairSuccess: new prom_client_1.Counter({
        name: 'data_repair_success_total',
        help: 'Total number of successful data repairs',
        registers: [system_metrics_1.register],
    }),
    dataConsistencyScore: new prom_client_1.Gauge({
        name: 'data_consistency_score',
        help: 'Data consistency score (0-1)',
        registers: [system_metrics_1.register],
    }),
};
// Service Health Metrics
exports.serviceHealthMetrics = {
    serviceUptime: new prom_client_1.Gauge({
        name: 'service_uptime_seconds',
        help: 'Service uptime in seconds',
        registers: [system_metrics_1.register],
    }),
    serviceHealthScore: new prom_client_1.Gauge({
        name: 'service_health_score',
        help: 'Overall service health score (0-1)',
        registers: [system_metrics_1.register],
    }),
    dependencyHealth: new prom_client_1.Gauge({
        name: 'service_dependency_health',
        help: 'Health status of service dependencies (0-1)',
        labelNames: ['dependency'],
        registers: [system_metrics_1.register],
    }),
    serviceErrors: new prom_client_1.Counter({
        name: 'service_errors_total',
        help: 'Total number of service errors',
        labelNames: ['error_type'],
        registers: [system_metrics_1.register],
    }),
    serviceLatency: new prom_client_1.Histogram({
        name: 'service_latency_seconds',
        help: 'Service request latency in seconds',
        buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
        registers: [system_metrics_1.register],
    }),
};
//# sourceMappingURL=queue-metrics.js.map