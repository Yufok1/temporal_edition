import { Counter, Gauge, Histogram } from 'prom-client';
export declare const queueMetrics: {
    queueSize: Gauge<string>;
    processingTime: Histogram<string>;
    failedJobs: Counter<string>;
    retryCount: Counter<string>;
    activeWorkers: Gauge<string>;
};
export declare const dataIntegrityMetrics: {
    dataValidationErrors: Counter<string>;
    dataCorruptionDetected: Counter<string>;
    dataRepairAttempts: Counter<string>;
    dataRepairSuccess: Counter<string>;
    dataConsistencyScore: Gauge<string>;
};
export declare const serviceHealthMetrics: {
    serviceUptime: Gauge<string>;
    serviceHealthScore: Gauge<string>;
    dependencyHealth: Gauge<"dependency">;
    serviceErrors: Counter<"error_type">;
    serviceLatency: Histogram<string>;
};
