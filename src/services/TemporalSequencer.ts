import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { createLogger } from '../utils/logger';

export enum AlignmentStage {
    INITIALIZATION = 'INITIALIZATION',
    ASSESSMENT = 'ASSESSMENT',
    INTEGRATION = 'INTEGRATION',
    VALIDATION = 'VALIDATION',
    ALIGNMENT = 'ALIGNMENT'
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

export class TemporalSequencer extends EventEmitter {
    private logger: Logger;
    private alignmentStatuses: Map<string, AlignmentStatus>;
    private readonly stageSequence: AlignmentStage[] = [
        AlignmentStage.INITIALIZATION,
        AlignmentStage.ASSESSMENT,
        AlignmentStage.INTEGRATION,
        AlignmentStage.VALIDATION,
        AlignmentStage.ALIGNMENT
    ];

    constructor() {
        super();
        this.logger = createLogger('TemporalSequencer');
        this.alignmentStatuses = new Map();
    }

    public registerSystem(systemId: string): void {
        if (this.alignmentStatuses.has(systemId)) {
            throw new Error(`System ${systemId} is already registered`);
        }

        this.alignmentStatuses.set(systemId, {
            systemId,
            currentStage: AlignmentStage.INITIALIZATION,
            metrics: this.initializeMetrics(),
            history: []
        });

        this.logger.info(`System ${systemId} registered for alignment sequencing`);
        this.emit('systemRegistered', systemId);
    }

    public updateSystemMetrics(systemId: string, metrics: Partial<SystemMetrics>): void {
        const status = this.alignmentStatuses.get(systemId);
        if (!status) {
            throw new Error(`System ${systemId} not found`);
        }

        status.metrics = {
            ...status.metrics,
            ...metrics,
            lastUpdated: new Date()
        };

        this.evaluateStageTransition(systemId);
        this.emit('metricsUpdated', systemId, status.metrics);
    }

    private evaluateStageTransition(systemId: string): void {
        const status = this.alignmentStatuses.get(systemId);
        if (!status) return;

        const currentStageIndex = this.stageSequence.indexOf(status.currentStage);
        if (currentStageIndex === -1 || currentStageIndex === this.stageSequence.length - 1) return;

        const metrics = status.metrics;
        const shouldAdvance = this.evaluateStageCriteria(status.currentStage, metrics);

        if (shouldAdvance) {
            const nextStage = this.stageSequence[currentStageIndex + 1];
            status.history.push({
                stage: status.currentStage,
                timestamp: new Date(),
                metrics: { ...metrics }
            });
            status.currentStage = nextStage;
            this.logger.info(`System ${systemId} advanced to stage ${nextStage}`);
            this.emit('stageTransition', systemId, nextStage);
        }
    }

    private evaluateStageCriteria(stage: AlignmentStage, metrics: SystemMetrics): boolean {
        switch (stage) {
            case AlignmentStage.INITIALIZATION:
                return metrics.alignmentScore >= 0.5;
            case AlignmentStage.ASSESSMENT:
                return metrics.stabilityIndex >= 0.7 && metrics.performanceMetrics.errorRate < 0.1;
            case AlignmentStage.INTEGRATION:
                return metrics.alignmentScore >= 0.8 && metrics.stabilityIndex >= 0.9;
            case AlignmentStage.VALIDATION:
                return metrics.alignmentScore >= 0.95 && metrics.performanceMetrics.errorRate < 0.01;
            default:
                return false;
        }
    }

    private initializeMetrics(): SystemMetrics {
        return {
            alignmentScore: 0,
            stabilityIndex: 0,
            performanceMetrics: {
                responseTime: 0,
                throughput: 0,
                errorRate: 1
            },
            lastUpdated: new Date()
        };
    }

    public getSystemStatus(systemId: string): AlignmentStatus | undefined {
        return this.alignmentStatuses.get(systemId);
    }

    public getAllSystemStatuses(): AlignmentStatus[] {
        return Array.from(this.alignmentStatuses.values());
    }
} 