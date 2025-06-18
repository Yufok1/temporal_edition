import { WhaleVocalSignal, WhaleMovementPattern, WhaleEnvironmentalData, TranslatedWhaleSignal, WhaleAnalysisResult } from '../types/whale';
export declare class WhaleTranslationTool {
    private readonly VOCAL_FREQUENCY_THRESHOLD;
    private readonly MOVEMENT_SPEED_THRESHOLD;
    private readonly TEMPERATURE_THRESHOLD;
    private readonly DEPTH_THRESHOLD;
    translateWhaleSignal(signal: WhaleVocalSignal | WhaleMovementPattern | WhaleEnvironmentalData): TranslatedWhaleSignal;
    analyzeSignal(signal: TranslatedWhaleSignal): WhaleAnalysisResult;
    private isVocalSignal;
    private isMovementPattern;
    private translateVocalSignal;
    private translateMovementPattern;
    private translateEnvironmentalData;
    private interpretVocalSignal;
    private interpretMovementPattern;
    private interpretEnvironmentalData;
    private calculateConfidence;
    private calculateImpact;
    private extractMetadata;
    private detectPattern;
    private predictNextValue;
    private calculateError;
}
