import { Registry, Counter, Gauge, Histogram } from 'prom-client';
import { SystemMetrics } from '../services/TemporalSequencer';
import { AnalysisResult } from '../services/BreathMirrorAnalysis';
import { GovernanceStatus } from '../services/GovernanceTracker';

export class MetricsService {
    private registry: Registry;
    private alignmentScore: Gauge;
    private stabilityIndex: Gauge;
    private responseTime: Histogram;
    private throughput: Counter;
    private errorRate: Gauge;
    private complianceScore: Gauge;
    private violations: Counter;
    private remediationCount: Counter;

    constructor() {
        this.registry = new Registry();

        this.alignmentScore = new Gauge({
            name: 'solar_alignment_score',
            help: 'System alignment score',
            labelNames: ['systemId']
        });

        this.stabilityIndex = new Gauge({
            name: 'solar_system_stability',
            help: 'System stability index',
            labelNames: ['systemId']
        });

        this.responseTime = new Histogram({
            name: 'system_performance_response_time',
            help: 'System response time in milliseconds',
            labelNames: ['systemId', 'operation'],
            buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000]
        });

        this.throughput = new Counter({
            name: 'system_performance_throughput',
            help: 'System throughput in operations per second',
            labelNames: ['systemId', 'operation']
        });

        this.errorRate = new Gauge({
            name: 'system_performance_error_rate',
            help: 'System error rate',
            labelNames: ['systemId', 'errorType']
        });

        this.complianceScore = new Gauge({
            name: 'system_compliance_score',
            help: 'System compliance score',
            labelNames: ['systemId']
        });

        this.violations = new Counter({
            name: 'system_governance_violations',
            help: 'Count of governance violations',
            labelNames: ['systemId', 'severity']
        });

        this.remediationCount = new Counter({
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

    public registerSystem(systemId: string): void {
        this.alignmentScore.set({ systemId }, 1.0);
        this.stabilityIndex.set({ systemId }, 1.0);
        this.complianceScore.set({ systemId }, 1.0);
    }

    public updateSystemMetrics(systemId: string, metrics: SystemMetrics): void {
        this.alignmentScore.set({ systemId }, metrics.alignmentScore);
        this.stabilityIndex.set({ systemId }, metrics.stabilityIndex);
        this.responseTime.observe({ systemId, operation: 'default' }, metrics.performanceMetrics.responseTime);
        this.throughput.inc({ systemId, operation: 'default' }, metrics.performanceMetrics.throughput);
        this.errorRate.set({ systemId, errorType: 'total' }, metrics.performanceMetrics.errorRate);
    }

    public updateAnalysisResult(systemId: string, result: AnalysisResult): void {
        this.alignmentScore.set({ systemId }, result.metrics.alignmentScore);
        this.stabilityIndex.set({ systemId }, result.metrics.stabilityIndex);
    }

    public updateGovernanceStatus(systemId: string, status: GovernanceStatus): void {
        this.complianceScore.set({ systemId }, status.complianceScore);

        // Count violations by severity
        const violationsBySeverity = status.violations.reduce((acc, violation) => {
            acc[violation.severity] = (acc[violation.severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(violationsBySeverity).forEach(([severity, count]) => {
            this.violations.inc({ systemId, severity }, count);
        });
    }

    public incrementRemediationCount(systemId: string, actionType: string): void {
        this.remediationCount.inc({ systemId, actionType });
    }

    public getMetrics(): Promise<string> {
        return this.registry.metrics();
    }
}

export const metricsService = new MetricsService(); 