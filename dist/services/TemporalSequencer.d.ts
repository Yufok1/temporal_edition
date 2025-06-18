/// <reference types="node" />
import { EventEmitter } from 'events';
export declare enum AlignmentStage {
    INITIALIZATION = "INITIALIZATION",
    ASSESSMENT = "ASSESSMENT",
    INTEGRATION = "INTEGRATION",
    VALIDATION = "VALIDATION",
    ALIGNMENT = "ALIGNMENT"
}
export interface SystemMetrics {
    alignmentScore: number;
    stabilityIndex: number;
    performanceMetrics: {
        responseTime: number;
        throughput: number;
        errorRate: number;
    };
    lastUpdated: Date;
}
export interface AlignmentStatus {
    systemId: string;
    currentStage: AlignmentStage;
    metrics: SystemMetrics;
    history: {
        stage: AlignmentStage;
        timestamp: Date;
        metrics: SystemMetrics;
    }[];
}
export declare class TemporalSequencer extends EventEmitter {
    private logger;
    private alignmentStatuses;
    private readonly stageSequence;
    constructor();
    registerSystem(systemId: string): void;
    updateSystemMetrics(systemId: string, metrics: Partial<SystemMetrics>): void;
    private evaluateStageTransition;
    private evaluateStageCriteria;
    private initializeMetrics;
    getSystemStatus(systemId: string): AlignmentStatus | undefined;
    getAllSystemStatuses(): AlignmentStatus[];
}
