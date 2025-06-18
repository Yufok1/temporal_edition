/// <reference types="node" />
import { EventEmitter } from 'events';
import { SystemMetrics } from '../services/TemporalSequencer';
export interface TemporalDataPoint {
    timestamp: Date;
    frequencyLevel: number;
    environmentalConditions: {
        ionization: number;
        gasLevel: number;
    };
    systemMetrics: SystemMetrics;
}
export interface TemporalAnalysis {
    timestamp: Date;
    dataPoints: TemporalDataPoint[];
    predictions: {
        frequencyTrend: number;
        environmentalTrend: number;
        ventingNeeded: boolean;
        estimatedVentingTime: Date;
    };
    recommendations: string[];
}
export declare class TemporalMonitoringService extends EventEmitter {
    private logger;
    private dataPoints;
    private readonly MAX_DATA_POINTS;
    private readonly ANALYSIS_INTERVAL;
    private analysisInterval;
    constructor();
    private initializeMetrics;
    startMonitoring(systemId: string): void;
    stopMonitoring(systemId: string): void;
    recordDataPoint(systemId: string, dataPoint: Omit<TemporalDataPoint, 'timestamp'>): void;
    private updateMetrics;
    private calculateStabilityScore;
    private calculateAcclimationProgress;
    private performTemporalAnalysis;
    private analyzeTemporalData;
    private calculateTrend;
    private determineVentingNeeded;
    private estimateVentingTime;
    private generateRecommendations;
}
