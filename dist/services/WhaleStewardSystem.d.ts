import { WhaleVocalSignal, WhaleMovementPattern, WhaleEnvironmentalData, TranslatedWhaleSignal, WhaleAnalysisResult } from '../types/whale';
export declare class WhaleStewardSystem {
    private whaleTranslator;
    private whaleFeedbackLoop;
    private readonly MAX_HISTORY_LENGTH;
    private signalHistory;
    constructor();
    handleIncomingWhaleSignal(signal: WhaleVocalSignal | WhaleMovementPattern | WhaleEnvironmentalData): void;
    analyzeWhaleData(): WhaleAnalysisResult;
    getSignalHistory(): TranslatedWhaleSignal[];
    getRecentSignalsByType(type: 'vocal' | 'movement' | 'environmental'): TranslatedWhaleSignal[];
    getSignalPatterns(): Map<string, number>;
    private cleanupHistory;
    private getSignalKey;
    private analyzeSignal;
    private handleAnalysis;
    private handleHighImpactSignal;
    private handleLowConfidenceSignal;
}
