import { Registry, Counter, Gauge, Histogram } from 'prom-client';
import { register } from './system-metrics';

// Queue Health Metrics
export const queueMetrics = {
  queueSize: new Gauge({
    name: 'queue_size',
    help: 'Current number of items in the queue',
    registers: [register],
  }),
  processingTime: new Histogram({
    name: 'queue_processing_time_seconds',
    help: 'Time taken to process queue items',
    buckets: [0.1, 0.5, 1, 2, 5, 10],
    registers: [register],
  }),
  failedJobs: new Counter({
    name: 'queue_failed_jobs_total',
    help: 'Total number of failed queue jobs',
    registers: [register],
  }),
  retryCount: new Counter({
    name: 'queue_retry_count_total',
    help: 'Total number of job retries',
    registers: [register],
  }),
  activeWorkers: new Gauge({
    name: 'queue_active_workers',
    help: 'Number of active queue workers',
    registers: [register],
  }),
};

// Data Integrity Metrics
export const dataIntegrityMetrics = {
  dataValidationErrors: new Counter({
    name: 'data_validation_errors_total',
    help: 'Total number of data validation errors',
    registers: [register],
  }),
  dataCorruptionDetected: new Counter({
    name: 'data_corruption_detected_total',
    help: 'Total number of data corruption events detected',
    registers: [register],
  }),
  dataRepairAttempts: new Counter({
    name: 'data_repair_attempts_total',
    help: 'Total number of data repair attempts',
    registers: [register],
  }),
  dataRepairSuccess: new Counter({
    name: 'data_repair_success_total',
    help: 'Total number of successful data repairs',
    registers: [register],
  }),
  dataConsistencyScore: new Gauge({
    name: 'data_consistency_score',
    help: 'Data consistency score (0-1)',
    registers: [register],
  }),
};

// Service Health Metrics
export const serviceHealthMetrics = {
  serviceUptime: new Gauge({
    name: 'service_uptime_seconds',
    help: 'Service uptime in seconds',
    registers: [register],
  }),
  serviceHealthScore: new Gauge({
    name: 'service_health_score',
    help: 'Overall service health score (0-1)',
    registers: [register],
  }),
  dependencyHealth: new Gauge({
    name: 'service_dependency_health',
    help: 'Health status of service dependencies (0-1)',
    labelNames: ['dependency'],
    registers: [register],
  }),
  serviceErrors: new Counter({
    name: 'service_errors_total',
    help: 'Total number of service errors',
    labelNames: ['error_type'],
    registers: [register],
  }),
  serviceLatency: new Histogram({
    name: 'service_latency_seconds',
    help: 'Service request latency in seconds',
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
    registers: [register],
  }),
}; 