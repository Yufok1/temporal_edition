"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const logger_1 = require("../utils/logger");
const metrics_1 = require("../utils/metrics");
class MonitoringService {
    constructor(thresholds = {}) {
        this.thresholds = thresholds;
        this.logger = (0, logger_1.createLogger)('MonitoringService');
        this.violations = new Map();
        this.defaultThresholds = {
            alignmentScore: 0.8,
            stabilityIndex: 0.7,
            errorRate: 0.05,
            responseTime: 1000
        };
        this.thresholds = { ...this.defaultThresholds, ...thresholds };
    }
    async checkSystemHealth(systemId, metrics) {
        const violations = [];
        // Check alignment score
        if (metrics.alignmentScore < this.thresholds.alignmentScore) {
            violations.push(this.createViolation(systemId, 'alignment', 'high', `Alignment score ${metrics.alignmentScore} below threshold ${this.thresholds.alignmentScore}`, { alignmentScore: metrics.alignmentScore }));
        }
        // Check stability index
        if (metrics.stabilityIndex < this.thresholds.stabilityIndex) {
            violations.push(this.createViolation(systemId, 'stability', 'medium', `Stability index ${metrics.stabilityIndex} below threshold ${this.thresholds.stabilityIndex}`, { stabilityIndex: metrics.stabilityIndex }));
        }
        // Check error rate
        if (metrics.errorRate > this.thresholds.errorRate) {
            violations.push(this.createViolation(systemId, 'performance', 'high', `Error rate ${metrics.errorRate} above threshold ${this.thresholds.errorRate}`, { errorRate: metrics.errorRate }));
        }
        // Check response time
        if (metrics.responseTime > this.thresholds.responseTime) {
            violations.push(this.createViolation(systemId, 'performance', 'medium', `Response time ${metrics.responseTime}ms above threshold ${this.thresholds.responseTime}ms`, { responseTime: metrics.responseTime }));
        }
        // Record violations
        if (violations.length > 0) {
            this.recordViolations(systemId, violations);
            this.logger.warn(`System ${systemId} has ${violations.length} violations`, { violations });
            return false;
        }
        return true;
    }
    async updateAnalysisMetrics(systemId, result) {
        metrics_1.metricsService.updateAnalysisResult(systemId, result);
        // Check for alignment issues in analysis results
        if (result.alignmentScore < this.thresholds.alignmentScore) {
            this.recordViolations(systemId, [
                this.createViolation(systemId, 'alignment', 'high', `Analysis alignment score ${result.alignmentScore} below threshold ${this.thresholds.alignmentScore}`, { alignmentScore: result.alignmentScore })
            ]);
        }
    }
    async updateGovernanceStatus(systemId, status) {
        metrics_1.metricsService.updateGovernanceStatus(systemId, status);
        // Check for governance violations
        if (status.violations.length > 0) {
            const violations = status.violations.map(v => this.createViolation(systemId, 'governance', v.severity, v.description, { alignmentScore: status.complianceScore }));
            this.recordViolations(systemId, violations);
        }
    }
    getSystemViolations(systemId) {
        return this.violations.get(systemId) || [];
    }
    getCriticalViolations() {
        const allViolations = [];
        this.violations.forEach(violations => {
            allViolations.push(...violations.filter(v => v.severity === 'critical'));
        });
        return allViolations;
    }
    clearViolations(systemId) {
        this.violations.delete(systemId);
    }
    createViolation(systemId, type, severity, description, metrics) {
        return {
            systemId,
            timestamp: Date.now(),
            type,
            severity,
            description,
            metrics
        };
    }
    recordViolations(systemId, violations) {
        const existingViolations = this.violations.get(systemId) || [];
        this.violations.set(systemId, [...existingViolations, ...violations]);
    }
}
exports.MonitoringService = MonitoringService;
//# sourceMappingURL=MonitoringService.js.map