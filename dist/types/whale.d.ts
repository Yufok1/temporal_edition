export interface WhaleVocalSignal {
    signalType: string;
    frequency: number;
    duration: number;
    intensity: number;
    timestamp: Date;
}
export interface WhaleMovementPattern {
    behaviorType: string;
    speed: number;
    direction: number;
    depth: number;
    timestamp: Date;
}
export interface WhaleEnvironmentalData {
    waterTemperature: number;
    waterDepth: number;
    salinity: number;
    timestamp: Date;
}
export interface TranslatedWhaleSignal {
    type: 'vocal' | 'movement' | 'environmental';
    content: WhaleVocalSignal | WhaleMovementPattern | WhaleEnvironmentalData;
    systemInterpretation: string;
    timestamp: Date;
}
export interface WhaleAnalysisResult {
    signalType: string;
    confidence: number;
    impact: number;
    metadata: {
        pattern?: string;
        prediction?: number;
        error?: number;
        [key: string]: any;
    };
    timestamp: Date;
}
export type WhalePatternType = 'seasonal' | 'trend' | 'anomaly' | 'cluster' | 'correlation';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export interface WhaleAlert {
    type: string;
    severity: SeverityLevel;
    message: string;
    timestamp: Date;
    metadata: Record<string, any>;
}
export interface WhaleSystemMetrics {
    value: number;
    timestamp: Date;
    confidence: number;
    impact: number;
    metadata: {
        pattern?: string;
        prediction?: number;
        error?: number;
        [key: string]: any;
    };
}
export interface WhaleAnalysisConfig {
    minConfidence: number;
    minImpact: number;
    patternThresholds: {
        seasonal: number;
        trend: number;
        anomaly: number;
        cluster: number;
        correlation: number;
    };
    alertThresholds: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
}
export interface EnvironmentalSignal {
    timestamp: Date;
    temperature: number;
    salinity: number;
    currentSpeed: number;
    currentDirection?: number;
    depth?: number;
    [key: string]: any;
}
export interface WhaleSignal {
    signalType: 'vocal' | 'movement' | 'environmental';
    timestamp: Date;
    frequency?: number;
    duration?: number;
    intensity?: number;
    behaviorType?: string;
    speed?: number;
    direction?: number;
    depth?: number;
    temperature?: number;
    salinity?: number;
    currentSpeed?: number;
    currentDirection?: number;
    environmentalContext?: EnvironmentalSignal;
    [key: string]: any;
}
