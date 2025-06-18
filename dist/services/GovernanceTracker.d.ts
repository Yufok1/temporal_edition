/// <reference types="node" />
import { EventEmitter } from 'events';
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
export declare class GovernanceTracker extends EventEmitter {
    private logger;
    private rules;
    private systemStatuses;
    private violationHistory;
    constructor();
    private initializeDefaultRules;
    registerSystem(systemId: string, initialStage: AlignmentStage): void;
    checkCompliance(systemId: string, metrics: SystemMetrics, analysis: AnalysisResult): GovernanceStatus;
    private calculateComplianceScore;
    private isStageGreaterOrEqual;
    getSystemStatus(systemId: string): GovernanceStatus | undefined;
    getViolationHistory(systemId: string): GovernanceViolation[];
    addRule(rule: GovernanceRule): void;
    updateSystemStage(systemId: string, newStage: AlignmentStage): void;
}
