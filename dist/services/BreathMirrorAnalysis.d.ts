/// <reference types="node" />
import { EventEmitter } from 'events';
import { SystemMetrics } from './TemporalSequencer';
export interface AnalysisResult {
    timestamp: Date;
    systemId: string;
    metrics: SystemMetrics;
    recommendations: string[];
    warnings: string[];
    alignmentProgress: number;
}
export interface AnalysisConfig {
    stabilityThreshold: number;
    performanceThreshold: number;
    alignmentThreshold: number;
    checkInterval: number;
}
export declare class BreathMirrorAnalysis extends EventEmitter {
    private logger;
    private config;
    private analysisResults;
    private analysisIntervals;
    constructor(config?: Partial<AnalysisConfig>);
    startAnalysis(systemId: string, initialMetrics: SystemMetrics): void;
    stopAnalysis(systemId: string): void;
    updateMetrics(systemId: string, metrics: SystemMetrics): void;
    private performAnalysis;
    private calculateAlignmentProgress;
    getAnalysisHistory(systemId: string): AnalysisResult[];
    getLatestAnalysis(systemId: string): AnalysisResult | undefined;
    updateConfig(newConfig: Partial<AnalysisConfig>): void;
}
