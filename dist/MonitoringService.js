"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const prom_client_1 = require("prom-client");
const logger_1 = __importDefault(require("./logger"));
class MonitoringService {
    constructor() {
        this.ALERT_THRESHOLDS = {
            queueSize: 1000,
            errorRate: 0.1,
            processingTime: 30000,
            retryRate: 0.2 // 20% retry rate
        };
        // Initialize Prometheus metrics
        this.systemHealthGauge = new prom_client_1.Gauge({
            name: 'system_health',
            help: 'Overall system health status (1 = healthy, 0 = unhealthy)',
            labelNames: ['component']
        });
        this.alertCounter = new prom_client_1.Counter({
            name: 'system_alerts_total',
            help: 'Total number of system alerts',
            labelNames: ['severity', 'component', 'type']
        });
        this.queueHealthGauge = new prom_client_1.Gauge({
            name: 'queue_health',
            help: 'Queue health metrics',
            labelNames: ['metric']
        });
        this.processingTimeGauge = new prom_client_1.Gauge({
            name: 'job_processing_time',
            help: 'Average job processing time in milliseconds',
            labelNames: ['priority']
        });
        this.errorRateGauge = new prom_client_1.Gauge({
            name: 'error_rate',
            help: 'Error rate per priority level',
            labelNames: ['priority']
        });
        logger_1.default.info('MonitoringService initialized');
    }
    updateSystemHealth(component, isHealthy) {
        this.systemHealthGauge.set({ component }, isHealthy ? 1 : 0);
        if (!isHealthy) {
            this.recordAlert('critical', component, 'health_check_failed');
            logger_1.default.error(`System health check failed for component: ${component}`);
        }
    }
    updateQueueMetrics(metrics) {
        // Update queue size
        this.queueHealthGauge.set({ metric: 'size' }, metrics.size);
        if (metrics.size > this.ALERT_THRESHOLDS.queueSize) {
            this.recordAlert('warning', 'queue', 'size_threshold_exceeded');
            logger_1.default.warn(`Queue size threshold exceeded: ${metrics.size}`);
        }
        // Update processing time
        this.queueHealthGauge.set({ metric: 'processing_time' }, metrics.processingTime);
        if (metrics.processingTime > this.ALERT_THRESHOLDS.processingTime) {
            this.recordAlert('warning', 'queue', 'processing_time_threshold_exceeded');
            logger_1.default.warn(`Processing time threshold exceeded: ${metrics.processingTime}ms`);
        }
        // Update error rate
        this.queueHealthGauge.set({ metric: 'error_rate' }, metrics.errorRate);
        if (metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            this.recordAlert('error', 'queue', 'error_rate_threshold_exceeded');
            logger_1.default.error(`Error rate threshold exceeded: ${metrics.errorRate}`);
        }
        // Update retry rate
        this.queueHealthGauge.set({ metric: 'retry_rate' }, metrics.retryRate);
        if (metrics.retryRate > this.ALERT_THRESHOLDS.retryRate) {
            this.recordAlert('warning', 'queue', 'retry_rate_threshold_exceeded');
            logger_1.default.warn(`Retry rate threshold exceeded: ${metrics.retryRate}`);
        }
    }
    updatePriorityMetrics(priority, metrics) {
        this.processingTimeGauge.set({ priority }, metrics.processingTime);
        this.errorRateGauge.set({ priority }, metrics.errorRate);
        if (metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            this.recordAlert('error', 'priority', `error_rate_${priority.toLowerCase()}`);
            logger_1.default.error(`Error rate threshold exceeded for priority ${priority}: ${metrics.errorRate}`);
        }
    }
    recordAlert(severity, component, type) {
        this.alertCounter.inc({ severity, component, type });
    }
    async getMetrics() {
        return prom_client_1.register.metrics();
    }
}
exports.MonitoringService = MonitoringService;
//# sourceMappingURL=MonitoringService.js.map