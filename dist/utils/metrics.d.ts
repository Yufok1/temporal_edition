import { SystemMetrics } from '../services/TemporalSequencer';
import { AnalysisResult } from '../services/BreathMirrorAnalysis';
import { GovernanceStatus } from '../services/GovernanceTracker';
export declare class MetricsService {
    private registry;
    private alignmentScore;
    private stabilityIndex;
    private responseTime;
    private throughput;
    private errorRate;
    private complianceScore;
    private violations;
    private remediationCount;
    constructor();
    registerSystem(systemId: string): void;
    updateSystemMetrics(systemId: string, metrics: SystemMetrics): void;
    updateAnalysisResult(systemId: string, result: AnalysisResult): void;
    updateGovernanceStatus(systemId: string, status: GovernanceStatus): void;
    incrementRemediationCount(systemId: string, actionType: string): void;
    getMetrics(): Promise<string>;
}
export declare const metricsService: MetricsService;
