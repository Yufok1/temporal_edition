/// <reference types="node" />
import { EventEmitter } from 'events';
import { AlignmentStage, SystemMetrics } from './TemporalSequencer';
import { AnalysisResult } from './BreathMirrorAnalysis';
import { GovernanceStatus } from './GovernanceTracker';
export interface SystemConfig {
    systemId: string;
    initialStage: AlignmentStage;
    analysisConfig?: {
        stabilityThreshold?: number;
        performanceThreshold?: number;
        alignmentThreshold?: number;
        checkInterval?: number;
    };
}
export declare class SystemOrchestrator extends EventEmitter {
    private logger;
    private temporalSequencer;
    private breathMirrorAnalysis;
    private codexAccess;
    private governanceTracker;
    private systemConfigs;
    constructor();
    private setupEventListeners;
    registerSystem(config: SystemConfig): void;
    updateSystemMetrics(systemId: string, metrics: SystemMetrics): void;
    private handleStageTransition;
    private handleAnalysisComplete;
    private handleComplianceCheck;
    getSystemStatus(systemId: string): {
        temporalStatus: any;
        analysisStatus: AnalysisResult | undefined;
        governanceStatus: GovernanceStatus | undefined;
        accessLevel: number;
    };
    requestResourceAccess(systemId: string, resourceId: string): any;
    getSystemHistory(systemId: string): {
        analysisHistory: AnalysisResult[];
        governanceHistory: any[];
        accessHistory: any[];
    };
}
