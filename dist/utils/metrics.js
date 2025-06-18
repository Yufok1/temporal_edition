"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsService = exports.MetricsService = void 0;
const prom_client_1 = require("prom-client");
class MetricsService {
    constructor() {
        this.registry = new prom_client_1.Registry();
        this.alignmentScore = new prom_client_1.Gauge({
            name: 'solar_alignment_score',
            help: 'System alignment score',
            labelNames: ['systemId']
        });
        this.stabilityIndex = new prom_client_1.Gauge({
            name: 'solar_system_stability',
            help: 'System stability index',
            labelNames: ['systemId']
        });
        this.responseTime = new prom_client_1.Histogram({
            name: 'system_performance_response_time',
            help: 'System response time in milliseconds',
            labelNames: ['systemId', 'operation'],
            buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000]
        });
        this.throughput = new prom_client_1.Counter({
            name: 'system_performance_throughput',
            help: 'System throughput in operations per second',
            labelNames: ['systemId', 'operation']
        });
        this.errorRate = new prom_client_1.Gauge({
            name: 'system_performance_error_rate',
            help: 'System error rate',
            labelNames: ['systemId', 'errorType']
        });
        this.complianceScore = new prom_client_1.Gauge({
            name: 'system_compliance_score',
            help: 'System compliance score',
            labelNames: ['systemId']
        });
        this.violations = new prom_client_1.Counter({
            name: 'system_governance_violations',
            help: 'Count of governance violations',
            labelNames: ['systemId', 'severity']
        });
        this.remediationCount = new prom_client_1.Counter({
            name: 'system_remediation_count',
            help: 'Count of remediation actions taken',
            labelNames: ['systemId', 'actionType']
        });
        this.registry.registerMetric(this.alignmentScore);
        this.registry.registerMetric(this.stabilityIndex);
        this.registry.registerMetric(this.responseTime);
        this.registry.registerMetric(this.throughput);
        this.registry.registerMetric(this.errorRate);
        this.registry.registerMetric(this.complianceScore);
        this.registry.registerMetric(this.violations);
        this.registry.registerMetric(this.remediationCount);
    }
    registerSystem(systemId) {
        this.alignmentScore.set({ systemId }, 1.0);
        this.stabilityIndex.set({ systemId }, 1.0);
        this.complianceScore.set({ systemId }, 1.0);
    }
    updateSystemMetrics(systemId, metrics) {
        this.alignmentScore.set({ systemId }, metrics.alignmentScore);
        this.stabilityIndex.set({ systemId }, metrics.stabilityIndex);
        this.responseTime.observe({ systemId, operation: 'default' }, metrics.performanceMetrics.responseTime);
        this.throughput.inc({ systemId, operation: 'default' }, metrics.performanceMetrics.throughput);
        this.errorRate.set({ systemId, errorType: 'total' }, metrics.performanceMetrics.errorRate);
    }
    updateAnalysisResult(systemId, result) {
        this.alignmentScore.set({ systemId }, result.metrics.alignmentScore);
        this.stabilityIndex.set({ systemId }, result.metrics.stabilityIndex);
    }
    updateGovernanceStatus(systemId, status) {
        this.complianceScore.set({ systemId }, status.complianceScore);
        // Count violations by severity
        const violationsBySeverity = status.violations.reduce((acc, violation) => {
            acc[violation.severity] = (acc[violation.severity] || 0) + 1;
            return acc;
        }, {});
        Object.entries(violationsBySeverity).forEach(([severity, count]) => {
            this.violations.inc({ systemId, severity }, count);
        });
    }
    incrementRemediationCount(systemId, actionType) {
        this.remediationCount.inc({ systemId, actionType });
    }
    getMetrics() {
        return this.registry.metrics();
    }
}
exports.MetricsService = MetricsService;
exports.metricsService = new MetricsService();
//# sourceMappingURL=metrics.js.map