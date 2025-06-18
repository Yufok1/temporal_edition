import { TranslatedWhaleSignal, WhaleAnalysisResult } from '../types/whale';
export declare class WhaleSignalFeedbackLoop {
    private readonly MAX_HISTORY_LENGTH;
    private signalHistory;
    private metricsHistory;
    private patternHistory;
    constructor();
    processFeedback(signal: TranslatedWhaleSignal): void;
    analyzeSignalImpact(): WhaleAnalysisResult;
    private cleanupHistory;
    private calculateMetrics;
    private getSignalValue;
    private calculateSignalConfidence;
    private calculateSignalImpact;
    private updatePatternHistory;
    private analyzeAndAdapt;
    private calculateConfidence;
    private calculateImpact;
    private detectPattern;
    private predictNextValue;
    private calculatePredictionError;
    private calculateError;
    private createEmptyAnalysis;
}
