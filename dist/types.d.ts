export interface MemoryMetrics {
    start: {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
    };
    end: {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
    };
    peak: {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
    };
}
export interface BenchmarkResult {
    operation: string;
    jobsProcessed: number;
    duration: number;
    throughput: number;
    averageLatency: number;
    errors: number;
    memoryMetrics: MemoryMetrics;
}
export interface Pattern {
    type: string;
    confidence: number;
    impact: number;
    metadata: {
        period?: number;
        direction?: 'stable' | 'increasing' | 'decreasing';
        points?: SystemMetrics[];
        prediction?: number;
        actual?: number;
        error?: number;
        reconstruction?: number[];
        original?: number[];
        distance?: number;
        similarity?: number;
        sequence1?: number[];
        sequence2?: number[];
        correlation?: number;
        pValue?: number;
        clusterSizes?: number[];
        clusterDensities?: number[];
    };
}
export interface PatternAnalysisResult {
    patterns: Pattern[];
    confidence: number;
    impact: number;
}
export interface SystemMetrics {
    value: number;
    timestamp: number;
    latency?: number;
    alignmentScore: number;
    stabilityIndex: number;
    errorRate: number;
    responseTime: number;
    throughput: number;
    purpose?: number;
    variance?: number;
    fluctuation?: number;
    consistency?: number;
    direction?: string;
    impact?: number;
    rate?: number;
    resourceUsage?: number;
    anomalyDeviation?: number;
    metadata?: {
        index?: number;
        deviation?: number;
        isAnomaly?: boolean;
        error?: number;
        reconstruction?: number;
        original?: number;
        distance?: number;
        similarity?: number;
        sequence1?: number[];
        sequence2?: number[];
    };
}
export interface Alert {
    id: string;
    severity: string;
    message: string;
    timestamp: number;
    metadata?: {
        patternType?: string;
        confidence?: number;
        impact?: number;
        threshold?: number;
        value?: number;
    };
}
export interface AlertChannel {
    type: string;
    config: {
        url?: string;
        apiKey?: string;
        recipients?: string[];
        template?: string;
    };
}
export interface AlertRule {
    id: string;
    condition: string;
    severity: string;
    message: string;
    channels: string[];
}
export interface PatternType {
    SEASONAL: string;
    TREND: string;
    ANOMALY: string;
    CLUSTER: string;
    CORRELATION: string;
    NEURAL_NETWORK: string;
    AUTOENCODER: string;
    DTW: string;
}
export interface SeverityLevel {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
    INFO: number;
}
export interface SeasonalAnalysisResult {
    hasSeasonality: boolean;
    period: number;
    strength: number;
    severity: string;
}
export interface TrendAnalysisResult {
    direction: 'stable' | 'increasing' | 'decreasing';
    magnitude: number;
    confidence: number;
    severity: string;
}
export interface AnomalyPoint {
    timestamp: number;
    value: number;
    deviation: number;
    threshold: number;
    isAnomaly: boolean;
}
export interface AnomalyAnalysisResult {
    isAnomaly: boolean;
    score: number;
    threshold: number;
    severity: string;
    anomalies: AnomalyPoint[];
    mean: number;
    stdDev: number;
}
export interface AnomalyDetectionResult {
    anomalies: AnomalyPoint[];
    mean: number;
    stdDev: number;
    threshold: number;
}
export interface ClusterAnalysisResult {
    clusterCount: number;
    clusterSizes: number[];
    clusterDensities: number[];
    severity: string;
}
export interface CorrelationAnalysisResult {
    correlation: number;
    pValue: number;
    significance: string;
    severity: string;
}
export interface TimeSeriesPoint {
    timestamp: number;
    value: number;
}
export interface TrendVisualizationData {
    direction: 'stable' | 'increasing' | 'decreasing';
    slope: number;
    confidence: number;
    forecast: TimeSeriesPoint[];
}
export interface VisualizationMetrics {
    currentValue: number;
    averageValue: number;
    standardDeviation: number;
    anomalyCount: number;
    seasonalityStrength: number;
    trendStrength: number;
    predictionConfidence: number;
}
export interface LawfulMetrics {
    alignment: number;
    evolution: number;
    stability: number;
    purpose: number;
    lastUpdated: number;
}
export interface AlignmentMetrics {
    lawfulAlignment: number;
    chaoticAlignment: number;
    neutralAlignment: number;
}
export interface StabilityMetrics {
    systemStability: number;
    componentStability: number;
    resourceStability: number;
    variance: number;
    fluctuation: number;
    consistency: number;
}
export interface EvolutionMetrics {
    adaptationRate: number;
    mutationRate: number;
    selectionPressure: number;
    direction: string;
    impact: number;
    rate: number;
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
}
export interface ResourceMetrics {
    cpu: number;
    memory: number;
    network: number;
    disk: number;
}
export interface ResourceRequest {
    type: string;
    amount: number;
    priority: number;
    timeout: number;
}
export interface SystemState {
    metrics: SystemMetrics[];
    resources: ResourceMetrics;
    load: LoadMetrics;
    stability: StabilityMetrics;
    evolution: EvolutionMetrics;
    alignment: AlignmentMetrics;
}
export interface BehaviorMetrics {
    patternCount: number;
    anomalyCount: number;
    stabilityScore: number;
    evolutionScore: number;
    alignmentScore: number;
    patterns: string[];
    trends: string[];
}
export declare enum AlignmentStage {
    INITIAL = "initial",
    ALIGNING = "aligning",
    STABLE = "stable",
    DEGRADING = "degrading",
    CRITICAL = "critical"
}
export interface AnalysisResult {
    systemId: string;
    alignmentScore: number;
    stabilityIndex: number;
    errorRate: number;
    responseTime: number;
    timestamp: number;
    details: {
        alignmentFactors: string[];
        stabilityFactors: string[];
        performanceFactors: string[];
    };
}
export interface GovernanceViolation {
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: number;
    type: 'alignment' | 'stability' | 'performance' | 'governance';
}
export interface GovernanceStatus {
    systemId: string;
    complianceScore: number;
    violations: GovernanceViolation[];
    lastCheck: number;
    status: 'compliant' | 'warning' | 'violation' | 'critical';
}
export interface SystemConfig {
    systemId: string;
    initialStage: AlignmentStage;
    analysisConfig?: {
        alignmentThreshold: number;
        stabilityThreshold: number;
        errorRateThreshold: number;
        responseTimeThreshold: number;
    };
}
export interface SystemStatus {
    systemId: string;
    currentStage: AlignmentStage;
    metrics: SystemMetrics;
    governance: GovernanceStatus;
    lastUpdate: number;
    isHealthy: boolean;
}
export interface SystemHistory {
    systemId: string;
    events: Array<{
        timestamp: number;
        type: 'stage_change' | 'metrics_update' | 'governance_violation' | 'health_check';
        details: any;
    }>;
}
export interface MetricsCalculations {
    calculateMean(data: number[]): number;
    calculateStandardDeviation(data: number[], mean: number): number;
    calculateSlope(x: number[], y: number[], xMean: number, yMean: number): number;
}
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
