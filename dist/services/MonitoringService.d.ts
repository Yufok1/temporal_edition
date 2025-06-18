import { SystemMetrics, AnalysisResult, GovernanceStatus } from '../types';
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
export declare class MonitoringService {
    private thresholds;
    private logger;
    private violations;
    private readonly defaultThresholds;
    constructor(thresholds?: Partial<MonitoringThresholds>);
    checkSystemHealth(systemId: string, metrics: SystemMetrics): Promise<boolean>;
    updateAnalysisMetrics(systemId: string, result: AnalysisResult): Promise<void>;
    updateGovernanceStatus(systemId: string, status: GovernanceStatus): Promise<void>;
    getSystemViolations(systemId: string): GovernanceViolation[];
    getCriticalViolations(): GovernanceViolation[];
    clearViolations(systemId: string): void;
    private createViolation;
    private recordViolations;
}
