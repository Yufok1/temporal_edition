import { WhaleAnalysisResult } from '../types/whale';
import { PoseidonSystem } from '../services/PoseidonSystem';
import { WhaleStewardSystem } from '../services/WhaleStewardSystem';
interface MonitoringMetrics {
    timestamp: Date;
    signalProcessingTime: number;
    ecosystemUpdateTime: number;
    signalType: string;
    confidence: number;
    impact: number;
    adaptationLevel: number;
    ecosystemStatus: string;
    error?: string;
}
interface PerformanceMetrics {
    signalProcessingTime: number;
    analysisTime: number;
    ecosystemUpdateTime: number;
    totalProcessingTime: number;
}
interface SignalMetrics {
    totalSignals: number;
    validSignals: number;
    invalidSignals: number;
    signalTypes: Map<string, number>;
    averageIntensity: number;
    averageFrequency: number;
}
interface PatternMetrics {
    patternsDetected: number;
    patternTypes: Map<string, number>;
    patternConfidence: number;
    seasonalPatterns: number;
    trendPatterns: number;
}
export declare class IntegrationMonitor {
    private metrics;
    private readonly MAX_METRICS_HISTORY;
    private readonly whaleSteward;
    private readonly poseidonSystem;
    private performanceMetrics;
    private signalMetrics;
    private patternMetrics;
    private alertConditions;
    private startTime;
    constructor(whaleSteward: WhaleStewardSystem, poseidonSystem: PoseidonSystem);
    private initializeMetrics;
    private setupAlertConditions;
    trackSignalProcessing(signal: any): Promise<void>;
    trackAnalysis(analysis: WhaleAnalysisResult): Promise<void>;
    private updateSignalMetrics;
    private updatePatternMetrics;
    checkAlerts(): {
        metric: string;
        severity: string;
        value: number;
    }[];
    private getMetricValue;
    private evaluateCondition;
    getPerformanceReport(): PerformanceMetrics;
    getSignalReport(): SignalMetrics;
    getPatternReport(): PatternMetrics;
    getUptime(): number;
    resetMetrics(): void;
    private addMetrics;
    private calculateAverage;
    shouldAlertHighProcessingTime(metrics: MonitoringMetrics): boolean;
    shouldAlertHighUpdateTime(metrics: MonitoringMetrics): boolean;
    shouldAlertLowConfidence(metrics: MonitoringMetrics): boolean;
    shouldAlertHighImpact(metrics: MonitoringMetrics): boolean;
    shouldAlertEcosystemStatus(metrics: MonitoringMetrics): boolean;
    generateReport(): string;
    private getAdaptationLevelTrend;
    private getConfidenceTrend;
    private getImpactTrend;
    getRecentMetrics(count?: number): MonitoringMetrics[];
    getMetricsByType(signalType: string): MonitoringMetrics[];
    getErrorMetrics(): MonitoringMetrics[];
}
export {};
