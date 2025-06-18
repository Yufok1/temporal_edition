import { createLogger } from '../utils/logger';
import { metricsService } from '../utils/metrics';
import { AlignmentStage, SystemMetrics, AnalysisResult, GovernanceStatus } from '../types';

export interface MonitoringThresholds {
    alignmentScore: number;
    stabilityIndex: number;
    errorRate: number;
    responseTime: number;
}

export interface GovernanceViolation {
    systemId: string;
    timestamp: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: 'alignment' | 'stability' | 'performance' | 'governance';
    description: string;
    metrics: {
        alignmentScore?: number;
        stabilityIndex?: number;
        errorRate?: number;
        responseTime?: number;
    };
}

export class MonitoringService {
    private logger = createLogger('MonitoringService');
    private violations: Map<string, GovernanceViolation[]> = new Map();
    private readonly defaultThresholds: MonitoringThresholds = {
        alignmentScore: 0.8,
        stabilityIndex: 0.7,
        errorRate: 0.05,
        responseTime: 1000
    };

    constructor(private thresholds: Partial<MonitoringThresholds> = {}) {
        this.thresholds = { ...this.defaultThresholds, ...thresholds };
    }

    public async checkSystemHealth(systemId: string, metrics: SystemMetrics): Promise<boolean> {
        const violations: GovernanceViolation[] = [];

        // Check alignment score
        if (metrics.alignmentScore < this.thresholds.alignmentScore) {
            violations.push(this.createViolation(systemId, 'alignment', 'high', 
                `Alignment score ${metrics.alignmentScore} below threshold ${this.thresholds.alignmentScore}`,
                { alignmentScore: metrics.alignmentScore }
            ));
        }

        // Check stability index
        if (metrics.stabilityIndex < this.thresholds.stabilityIndex) {
            violations.push(this.createViolation(systemId, 'stability', 'medium',
                `Stability index ${metrics.stabilityIndex} below threshold ${this.thresholds.stabilityIndex}`,
                { stabilityIndex: metrics.stabilityIndex }
            ));
        }

        // Check error rate
        if (metrics.errorRate > this.thresholds.errorRate) {
            violations.push(this.createViolation(systemId, 'performance', 'high',
                `Error rate ${metrics.errorRate} above threshold ${this.thresholds.errorRate}`,
                { errorRate: metrics.errorRate }
            ));
        }

        // Check response time
        if (metrics.responseTime > this.thresholds.responseTime) {
            violations.push(this.createViolation(systemId, 'performance', 'medium',
                `Response time ${metrics.responseTime}ms above threshold ${this.thresholds.responseTime}ms`,
                { responseTime: metrics.responseTime }
            ));
        }

        // Record violations
        if (violations.length > 0) {
            this.recordViolations(systemId, violations);
            this.logger.warn(`System ${systemId} has ${violations.length} violations`, { violations });
            return false;
        }

        return true;
    }

    public async updateAnalysisMetrics(systemId: string, result: AnalysisResult): Promise<void> {
        metricsService.updateAnalysisResult(systemId, result);
        
        // Check for alignment issues in analysis results
        if (result.alignmentScore < this.thresholds.alignmentScore) {
            this.recordViolations(systemId, [
                this.createViolation(systemId, 'alignment', 'high',
                    `Analysis alignment score ${result.alignmentScore} below threshold ${this.thresholds.alignmentScore}`,
                    { alignmentScore: result.alignmentScore }
                )
            ]);
        }
    }

    public async updateGovernanceStatus(systemId: string, status: GovernanceStatus): Promise<void> {
        metricsService.updateGovernanceStatus(systemId, status);

        // Check for governance violations
        if (status.violations.length > 0) {
            const violations = status.violations.map(v => this.createViolation(
                systemId,
                'governance',
                v.severity,
                v.description,
                { alignmentScore: status.complianceScore }
            ));
            this.recordViolations(systemId, violations);
        }
    }

    public getSystemViolations(systemId: string): GovernanceViolation[] {
        return this.violations.get(systemId) || [];
    }

    public getCriticalViolations(): GovernanceViolation[] {
        const allViolations: GovernanceViolation[] = [];
        this.violations.forEach(violations => {
            allViolations.push(...violations.filter(v => v.severity === 'critical'));
        });
        return allViolations;
    }

    public clearViolations(systemId: string): void {
        this.violations.delete(systemId);
    }

    private createViolation(
        systemId: string,
        type: GovernanceViolation['type'],
        severity: GovernanceViolation['severity'],
        description: string,
        metrics: GovernanceViolation['metrics']
    ): GovernanceViolation {
        return {
            systemId,
            timestamp: Date.now(),
            type,
            severity,
            description,
            metrics
        };
    }

    private recordViolations(systemId: string, violations: GovernanceViolation[]): void {
        const existingViolations = this.violations.get(systemId) || [];
        this.violations.set(systemId, [...existingViolations, ...violations]);
    }
} 