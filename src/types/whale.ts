// Basic whale signal types
export interface WhaleVocalSignal {
    signalType: string;
    frequency: number;  // Hz
    duration: number;   // seconds
    intensity: number;  // 0-1
    timestamp: Date;
}

export interface WhaleMovementPattern {
    behaviorType: string;
    speed: number;      // m/s
    direction: number;  // degrees
    depth: number;      // meters
    timestamp: Date;
}

export interface WhaleEnvironmentalData {
    waterTemperature: number;  // °C
    waterDepth: number;        // meters
    salinity: number;          // ppt
    timestamp: Date;
}

// Translated signal type
export interface TranslatedWhaleSignal {
    type: 'vocal' | 'movement' | 'environmental';
    content: WhaleVocalSignal | WhaleMovementPattern | WhaleEnvironmentalData;
    systemInterpretation: string;
    timestamp: Date;
}

// Analysis result type
export interface WhaleAnalysisResult {
    signalType: string;
    confidence: number;  // 0-1
    impact: number;      // 0-1
    metadata: {
        pattern?: string;
        prediction?: number;
        error?: number;
        [key: string]: any;
    };
    timestamp: Date;
}

// Pattern types
export type WhalePatternType = 
    | 'seasonal'
    | 'trend'
    | 'anomaly'
    | 'cluster'
    | 'correlation';

// Severity levels
export type SeverityLevel = 
    | 'low'
    | 'medium'
    | 'high'
    | 'critical';

// Alert type
export interface WhaleAlert {
    type: string;
    severity: SeverityLevel;
    message: string;
    timestamp: Date;
    metadata: Record<string, any>;
}

// System metrics
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

// Analysis configuration
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

// Environmental signal type for standalone environmental data
export interface EnvironmentalSignal {
    timestamp: Date;
    temperature: number; // in Celsius
    salinity: number;    // PSU (Practical Salinity Units)
    currentSpeed: number; // m/s
    currentDirection?: number; // degrees, optional
    depth?: number; // meters, optional
    [key: string]: any; // for extensibility
}

// Extend WhaleSignal to include environmental context
export interface WhaleSignal {
    type: 'vocalization' | 'behavioral' | 'environmental' | 'farewell';
    timestamp: Date;
    frequency: number;
    duration: number;
    intensity: number;
    confidence: number;
    emotionalContext: WhaleEmotionalContext;
    behavioralContext: WhaleBehavioralContext;
    environmentalContext: WhaleEnvironmentalContext;
}

import { EmotionalTone } from './translation';

export interface EnvironmentalContext {
    waterConditions: {
        temperature: number;
        salinity: number;
        pressure: number;
    };
    socialContext: {
        groupSize: number;
        proximity: number;
    };
}

export interface WhaleSignalContext {
    environmental: EnvironmentalContext;
    social: {
        groupSize: number;
        proximityToGroup: number;
        interactionIntensity: number;
    };
}

export interface FarewellSignal {
    type: string;
    intensity: number;
    duration: number;
}

export interface WhaleEmotionalContext {
    primaryEmotion: WhaleEmotion;
    secondaryEmotions: WhaleEmotion[];
    intensity: number;
    stability: number;
    confidence: number;
    vocalizationPattern: VocalizationPattern;
    behavioralIndicators: BehavioralIndicator[];
    environmentalTriggers: EnvironmentalTrigger[];
}

export interface WhaleBehavioralContext {
    movementPattern: MovementPattern;
    socialInteraction: SocialInteraction;
    environmentalResponse: EnvironmentalResponse;
    temporalContext: TemporalContext;
}

export interface WhaleEnvironmentalContext {
    waterConditions: WaterConditions;
    spatialContext: SpatialContext;
    temporalContext: TemporalContext;
    socialContext: SocialContext;
}

export type WhaleEmotion = 
    | 'peaceful' 
    | 'joyful' 
    | 'contemplative' 
    | 'curious' 
    | 'playful'
    | 'anxious'
    | 'stressed'
    | 'excited'
    | 'calm'
    | 'distressed'
    | 'social'
    | 'solitary';

export type VocalizationPattern = 
    | 'descending_whistle'
    | 'ascending_whistle'
    | 'click_sequence'
    | 'pulse_train'
    | 'social_squeak'
    | 'feeding_buzz'
    | 'alarm_call'
    | 'contact_call'
    | 'separation_call'
    | 'greeting_call';

export type BehavioralIndicator = 
    | 'slowing_movement'
    | 'increasing_distance'
    | 'tail_slapping'
    | 'breaching'
    | 'spyhopping'
    | 'social_rubbing'
    | 'synchronized_swimming'
    | 'feeding_behavior'
    | 'resting_behavior'
    | 'mating_behavior';

export interface EmotionalScore {
    baseScore: number;
    modifiers: {
        environmental: number;
        social: number;
        behavioral: number;
        vocal: number;
    };
    confidence: number;
    stability: number;
    trend: 'improving' | 'stable' | 'declining';
}

export interface EmotionalAnalysis {
    primaryEmotion: string;
    intensity: number;
    secondaryEmotions: string[];
    confidence: number;
    recoveryRate: number;
}

export interface WaterConditions {
    temperature: number;
    currentSpeed: number;
    visibility: number;
    depth: number;
    salinity: number;
    lightLevel: number;
    turbulence: number;
    oxygenLevel: number;
}

export interface SpatialContext {
    depth: number;
    location: string;
    proximityToGroup: number;
    proximityToSteward: number;
}

export interface TemporalContext {
    timeOfDay: string;
    season: string;
    duration: number;
    frequency: number;
}

export interface SocialContext {
    groupSize: number;
    groupCohesion: number;
    interactionIntensity: number;
    socialHierarchy: number;
    proximityToGroup: number;
    socialBonds: {
        strength: number;
        type: string;
    }[];
}

export interface ReengagementReadiness {
    emotionalStability: number;
    environmentalSuitability: number;
    socialReadiness: number;
    overallScore: number;
    recommendedActions: string[];
    confidence: number;
}

export interface RecoveryMetrics {
    emotionalRecovery: number;
    environmentalAdaptation: number;
    socialIntegration: number;
    readinessScore: number;
}

export interface MovementPattern {
    type: string;
    speed: number;
    direction: number;
    depth: number;
    duration: number;
    confidence: number;
}

export interface SocialInteraction {
    type: string;
    participants: number;
    intensity: number;
    duration: number;
    confidence: number;
}

export interface EnvironmentalResponse {
    type: string;
    intensity: number;
    duration: number;
    confidence: number;
}

export interface EnvironmentalTrigger {
    type: string;
    intensity: number;
    duration: number;
    impact: number;
    confidence: number;
} 