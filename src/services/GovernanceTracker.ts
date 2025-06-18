import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { createLogger } from '../utils/logger';
import { AlignmentStage, SystemMetrics } from './TemporalSequencer';
import { AnalysisResult } from './BreathMirrorAnalysis';

export interface GovernanceRule {
    id: string;
    name: string;
    description: string;
    requiredStage: AlignmentStage;
    checkFn: (metrics: SystemMetrics, analysis: AnalysisResult) => boolean;
    severity: 'warning' | 'error' | 'critical';
}

export interface GovernanceViolation {
    ruleId: string;
    systemId: string;
    timestamp: Date;
    severity: 'warning' | 'error' | 'critical';
    description: string;
    metrics: SystemMetrics;
    analysis: AnalysisResult;
}

export interface GovernanceStatus {
    systemId: string;
    currentStage: AlignmentStage;
    violations: GovernanceViolation[];
    lastCheck: Date;
    complianceScore: number;
}

export class GovernanceTracker extends EventEmitter {
    private logger: Logger;
    private rules: GovernanceRule[];
    private systemStatuses: Map<string, GovernanceStatus>;
    private violationHistory: Map<string, GovernanceViolation[]>;

    constructor() {
        super();
        this.logger = createLogger('GovernanceTracker');
        this.systemStatuses = new Map();
        this.violationHistory = new Map();
        this.rules = this.initializeDefaultRules();
    }

    private initializeDefaultRules(): GovernanceRule[] {
        return [
            {
                id: 'stability-threshold',
                name: 'Minimum Stability Requirement',
                description: 'System must maintain minimum stability index',
                requiredStage: AlignmentStage.ASSESSMENT,
                checkFn: (metrics, analysis) => metrics.stabilityIndex >= 0.7,
                severity: 'error'
            },
            {
                id: 'error-rate-limit',
                name: 'Error Rate Limit',
                description: 'System must maintain error rate below threshold',
                requiredStage: AlignmentStage.INTEGRATION,
                checkFn: (metrics, analysis) => metrics.performanceMetrics.errorRate < 0.1,
                severity: 'error'
            },
            {
                id: 'alignment-progress',
                name: 'Alignment Progress',
                description: 'System must show continuous alignment progress',
                requiredStage: AlignmentStage.VALIDATION,
                checkFn: (metrics, analysis) => analysis.alignmentProgress >= 0.8,
                severity: 'warning'
            }
        ];
    }

    public registerSystem(systemId: string, initialStage: AlignmentStage): void {
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

    public checkCompliance(systemId: string, metrics: SystemMetrics, analysis: AnalysisResult): GovernanceStatus {
        const status = this.systemStatuses.get(systemId);
        if (!status) {
            throw new Error(`System ${systemId} not found`);
        }

        const violations: GovernanceViolation[] = [];
        const applicableRules = this.rules.filter(rule => 
            this.isStageGreaterOrEqual(status.currentStage, rule.requiredStage)
        );

        for (const rule of applicableRules) {
            if (!rule.checkFn(metrics, analysis)) {
                const violation: GovernanceViolation = {
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

    private calculateComplianceScore(violations: GovernanceViolation[], totalRules: number): number {
        if (totalRules === 0) return 1;

        const weights = {
            warning: 0.3,
            error: 0.6,
            critical: 1.0
        };

        const violationScore = violations.reduce((score, violation) => 
            score + weights[violation.severity], 0);

        return Math.max(0, 1 - (violationScore / totalRules));
    }

    private isStageGreaterOrEqual(current: AlignmentStage, required: AlignmentStage): boolean {
        const stages = [
            AlignmentStage.INITIALIZATION,
            AlignmentStage.ASSESSMENT,
            AlignmentStage.INTEGRATION,
            AlignmentStage.VALIDATION,
            AlignmentStage.ALIGNMENT
        ];
        return stages.indexOf(current) >= stages.indexOf(required);
    }

    public getSystemStatus(systemId: string): GovernanceStatus | undefined {
        return this.systemStatuses.get(systemId);
    }

    public getViolationHistory(systemId: string): GovernanceViolation[] {
        return this.violationHistory.get(systemId) || [];
    }

    public addRule(rule: GovernanceRule): void {
        if (this.rules.some(r => r.id === rule.id)) {
            throw new Error(`Rule with ID ${rule.id} already exists`);
        }
        this.rules.push(rule);
        this.logger.info(`New governance rule added: ${rule.name}`);
    }

    public updateSystemStage(systemId: string, newStage: AlignmentStage): void {
        const status = this.systemStatuses.get(systemId);
        if (!status) {
            throw new Error(`System ${systemId} not found`);
        }
        status.currentStage = newStage;
        this.logger.info(`System ${systemId} stage updated to ${newStage}`);
        this.emit('stageUpdated', systemId, newStage);
    }
} 