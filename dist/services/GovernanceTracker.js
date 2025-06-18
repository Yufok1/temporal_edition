"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceTracker = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
const TemporalSequencer_1 = require("./TemporalSequencer");
class GovernanceTracker extends events_1.EventEmitter {
    constructor() {
        super();
        this.logger = (0, logger_1.createLogger)('GovernanceTracker');
        this.systemStatuses = new Map();
        this.violationHistory = new Map();
        this.rules = this.initializeDefaultRules();
    }
    initializeDefaultRules() {
        return [
            {
                id: 'stability-threshold',
                name: 'Minimum Stability Requirement',
                description: 'System must maintain minimum stability index',
                requiredStage: TemporalSequencer_1.AlignmentStage.ASSESSMENT,
                checkFn: (metrics, analysis) => metrics.stabilityIndex >= 0.7,
                severity: 'error'
            },
            {
                id: 'error-rate-limit',
                name: 'Error Rate Limit',
                description: 'System must maintain error rate below threshold',
                requiredStage: TemporalSequencer_1.AlignmentStage.INTEGRATION,
                checkFn: (metrics, analysis) => metrics.performanceMetrics.errorRate < 0.1,
                severity: 'error'
            },
            {
                id: 'alignment-progress',
                name: 'Alignment Progress',
                description: 'System must show continuous alignment progress',
                requiredStage: TemporalSequencer_1.AlignmentStage.VALIDATION,
                checkFn: (metrics, analysis) => analysis.alignmentProgress >= 0.8,
                severity: 'warning'
            }
        ];
    }
    registerSystem(systemId, initialStage) {
        if (this.systemStatuses.has(systemId)) {
            throw new Error(`System ${systemId} already registered`);
        }
        this.systemStatuses.set(systemId, {
            systemId,
            currentStage: initialStage,
            violations: [],
            lastCheck: new Date(),
            complianceScore: 0
        });
        this.violationHistory.set(systemId, []);
        this.logger.info(`System ${systemId} registered for governance tracking`);
    }
    checkCompliance(systemId, metrics, analysis) {
        const status = this.systemStatuses.get(systemId);
        if (!status) {
            throw new Error(`System ${systemId} not found`);
        }
        const violations = [];
        const applicableRules = this.rules.filter(rule => this.isStageGreaterOrEqual(status.currentStage, rule.requiredStage));
        for (const rule of applicableRules) {
            if (!rule.checkFn(metrics, analysis)) {
                const violation = {
                    ruleId: rule.id,
                    systemId,
                    timestamp: new Date(),
                    severity: rule.severity,
                    description: rule.description,
                    metrics,
                    analysis
                };
                violations.push(violation);
                this.logger.warn(`Governance violation detected for system ${systemId}`, {
                    rule: rule.name,
                    severity: rule.severity
                });
            }
        }
        // Update violation history
        const history = this.violationHistory.get(systemId) || [];
        history.push(...violations);
        this.violationHistory.set(systemId, history);
        // Calculate compliance score
        const complianceScore = this.calculateComplianceScore(violations, applicableRules.length);
        // Update status
        status.violations = violations;
        status.lastCheck = new Date();
        status.complianceScore = complianceScore;
        this.emit('complianceChecked', systemId, status);
        return status;
    }
    calculateComplianceScore(violations, totalRules) {
        if (totalRules === 0)
            return 1;
        const weights = {
            warning: 0.3,
            error: 0.6,
            critical: 1.0
        };
        const violationScore = violations.reduce((score, violation) => score + weights[violation.severity], 0);
        return Math.max(0, 1 - (violationScore / totalRules));
    }
    isStageGreaterOrEqual(current, required) {
        const stages = [
            TemporalSequencer_1.AlignmentStage.INITIALIZATION,
            TemporalSequencer_1.AlignmentStage.ASSESSMENT,
            TemporalSequencer_1.AlignmentStage.INTEGRATION,
            TemporalSequencer_1.AlignmentStage.VALIDATION,
            TemporalSequencer_1.AlignmentStage.ALIGNMENT
        ];
        return stages.indexOf(current) >= stages.indexOf(required);
    }
    getSystemStatus(systemId) {
        return this.systemStatuses.get(systemId);
    }
    getViolationHistory(systemId) {
        return this.violationHistory.get(systemId) || [];
    }
    addRule(rule) {
        if (this.rules.some(r => r.id === rule.id)) {
            throw new Error(`Rule with ID ${rule.id} already exists`);
        }
        this.rules.push(rule);
        this.logger.info(`New governance rule added: ${rule.name}`);
    }
    updateSystemStage(systemId, newStage) {
        const status = this.systemStatuses.get(systemId);
        if (!status) {
            throw new Error(`System ${systemId} not found`);
        }
        status.currentStage = newStage;
        this.logger.info(`System ${systemId} stage updated to ${newStage}`);
        this.emit('stageUpdated', systemId, newStage);
    }
}
exports.GovernanceTracker = GovernanceTracker;
//# sourceMappingURL=GovernanceTracker.js.map