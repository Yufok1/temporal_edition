import { PatternAnalysisResult, SystemMetrics as ImportedSystemMetrics, TimeSeriesPoint, TrendVisualizationData as ImportedTrendVisualizationData, VisualizationMetrics as ImportedVisualizationMetrics, LawfulMetrics, AlignmentMetrics, EvolutionMetrics, LoadMetrics as ImportedLoadMetrics, ResourceMetrics, SystemState, BehaviorMetrics as ImportedBehaviorMetrics, AnomalyPoint } from './types';
export declare class DjinnCouncilService {
    private readonly alignmentGauge;
    private readonly evolutionCounter;
    private readonly stabilityGauge;
    private readonly purposeGauge;
    private readonly interactionHistogram;
    private readonly feedbackCounter;
    private componentHealthGauge;
    private networkLatencyHistogram;
    private dataIntegrityGauge;
    private dependencyHealthGauge;
    private jobProcessingRate;
    private errorDistributionCounter;
    private readonly LAWFUL_THRESHOLDS;
    private patternData;
    private componentData;
    private historicalData;
    private readonly MAX_HISTORY_LENGTH;
    private readonly TIME_WINDOW;
    private readonly CLUSTERING_CONFIG;
    private readonly PATTERN_TYPES;
    private readonly SEVERITY_LEVELS;
    private readonly PATTERN_SEVERITY_MAP;
    private readonly ALERT_CHANNELS;
    private readonly ALERT_THRESHOLDS;
    private readonly adaptationCounter;
    private readonly HMM_CONFIG;
    private readonly RECURSIVE_MODEL_CONFIG;
    private readonly NEURAL_NETWORK_CONFIG;
    private readonly AUTOENCODER_CONFIG;
    private readonly DTW_CONFIG;
    private readonly priorityMultipliers;
    private readonly anomalyDetector;
    constructor();
    recordSystemMetrics(metrics: LawfulMetrics): void;
    recordInteraction(type: string, duration: number): void;
    private recordFeedback;
    calculateLawfulMetrics(queueMetrics: {
        size: number;
        processingTime: number;
        errorRate: number;
        retryRate: number;
    }): LawfulMetrics;
    private calculateAlignment;
    private calculateEvolution;
    private calculateStability;
    private calculatePurpose;
    getMetrics(): Promise<string>;
    recordComponentHealth(component: string, status: string, value: number): void;
    recordNetworkLatency(endpoint: string, duration: number): void;
    recordDataIntegrity(dataType: string, score: number): void;
    recordDependencyHealth(dependency: string, type: string, health: number): void;
    recordJobProcessing(type: string, priority: string, status: string): void;
    recordError(errorType: string, priority: string, component: string): void;
    getComponentHealth(): Promise<Record<string, any>>;
    getNetworkLatency(): Promise<Record<string, any>>;
    getDataIntegrity(): Promise<Record<string, any>>;
    getDependencyHealth(): Promise<Record<string, any>>;
    getJobProcessingStats(): Promise<Record<string, any>>;
    getErrorDistribution(): Promise<Record<string, any>>;
    enforceAlignmentThreshold(metrics: AlignmentMetrics): Promise<{
        violation: boolean;
        threshold: number;
        currentAlignment: number;
    }>;
    enforceStabilityRequirements(metrics: StabilityMetrics): Promise<{
        stable: boolean;
        violations: string[];
    }>;
    validateEvolutionRate(metrics: EvolutionMetrics): Promise<{
        valid: boolean;
        rate: number;
        direction: string;
    }>;
    handleExtremeLoad(metrics: ImportedLoadMetrics): Promise<{
        actions: string[];
        degradedServices: string[];
    }>;
    handleNetworkPartition(scenario: PartitionScenario): Promise<{
        isolation: boolean;
        fallbackMode: boolean;
        affectedServices: string[];
    }>;
    handleDataCorruption(scenario: CorruptionScenario): Promise<{
        recovery: boolean;
        backupRestore: boolean;
        validatedData: boolean;
    }>;
    handleCascadeFailure(scenario: CascadeScenario): Promise<{
        isolation: boolean;
        recovery: boolean;
        affectedServices: string[];
    }>;
    implementCircuitBreaker(metrics: {
        errorRate: number;
        latency: number;
        timeoutRate: number;
    }): Promise<{
        breakerState: string;
        isolated: boolean;
        recoveryTime: number;
    }>;
    handleResourceExhaustion(metrics: ResourceMetrics): Promise<{
        actions: string[];
        priority: string;
    }>;
    prioritizeResources(request: ResourceRequest): Promise<{
        approved: boolean;
        allocated: any;
        priority: string;
    }>;
    adjustGovernanceRules(state: SystemState): Promise<{
        rules: any;
        thresholds: any;
        actions: string[];
    }>;
    learnFromBehavior(metrics: ImportedBehaviorMetrics): Promise<{
        adaptations: PatternAnalysisResult;
        predictions: TrendPredictions;
    }>;
    private createSystemMetrics;
    private calculatePatternImpact;
    private analyzePatterns;
    private getImpactValue;
    private predictTrends;
    private predictTrendsByType;
    private calculateTrendPrediction;
    private analyzeTrendDirection;
    private calculateVolatility;
    private detectSeasonality;
    private calculateCorrelation;
    private getPatternCount;
    private getAffectedComponents;
    private getTotalComponents;
    private getPatternDuration;
    private getHistoricalData;
    private getComponentsAtTime;
    recordPattern(pattern: string, component: string): void;
    recordMetric(trend: string, value: number): void;
    private cleanupOldData;
    private generateRecommendations;
    private calculateRecoveryTime;
    private calculateResourceAllocation;
    private calculateAdjustedRules;
    private calculateAdjustedThresholds;
    private determineRequiredActions;
    private identifyDegradedServices;
    private validateAffectedData;
    private validateUserData;
    private validateQueueData;
    private validateConfigData;
    generateVisualizationData(pattern: string): VisualizationData;
    private formatTimeSeriesData;
    private formatAnomalyData;
    private formatSeasonalityData;
    private formatTrendData;
    private calculateVisualizationMetrics;
    private generateSeasonalPattern;
    checkAndAlert(pattern: string, metrics: ImportedSystemMetrics): void;
    private determineAlertSeverity;
    private isCriticalSeverity;
    private isHighSeverity;
    private isMediumSeverity;
    private isLowSeverity;
    private generateAlert;
    private generateAlertId;
    private generateAlertMessage;
    private sendAlert;
    private sendSlackAlert;
    private sendEmailAlert;
    private sendPagerDutyAlert;
    private sendLogAlert;
    private logAlert;
    private recordAlert;
    private analyzeAnomalies;
    private analyzeSeasonality;
    private analyzeTrend;
    private calculateSeasonalPeriod;
    private calculateSeasonalStrength;
    private calculateAutocorrelation;
    private calculateSlope;
    private generateForecast;
    private calculateMean;
    private calculateStandardDeviation;
    private determineSeverity;
    private analyzeClusters;
    private analyzeCorrelation;
    private findClusters;
    private calculateDistances;
    private findNeighbors;
    private calculateClusterDistance;
    private calculateMetricDistance;
}
interface TrendPredictions {
    load: Record<string, number>;
    errors: Record<string, number>;
    performance: Record<string, number>;
}
interface VisualizationData {
    timeSeries: TimeSeriesPoint[];
    anomalies: AnomalyPoint[];
    seasonality: SeasonalityData;
    trend: ImportedTrendVisualizationData;
    metrics: ImportedVisualizationMetrics;
}
interface SeasonalityData {
    hasSeasonality: boolean;
    period: number;
    strength: number;
    pattern: number[];
}
export interface LoadMetrics {
    cpuLoad: number;
    memoryLoad: number;
    networkLoad: number;
    diskLoad: number;
    requestsPerSecond: number;
    memoryUsage: number;
    cpuUsage: number;
    queueSize: number;
    latency?: number;
    resourceUsage?: number;
    anomalyDeviation?: number;
}
export interface PartitionScenario {
    affected: {
        service: string;
    }[];
    affectedServices: string[];
}
export interface CorruptionScenario {
    affected: {
        service: string;
    }[];
    affectedData: string[];
}
export interface CascadeScenario {
    affected: {
        service: string;
    }[];
}
export interface BehaviorMetrics {
    patterns: string[];
    trends: string[];
}
export interface ResourceRequest {
    resources: {
        [key: string]: number;
    };
    priority: string;
}
export interface StabilityMetrics {
    systemStability: string;
    variance: number;
    fluctuation: number;
    consistency: number;
}
export {};
