import {
    WhaleVocalSignal,
    WhaleMovementPattern,
    WhaleEnvironmentalData,
    WhaleAnalysisResult
} from '../types/whale';
import { WhaleTranslationTool } from './WhaleTranslationTool';
import { WhaleSignalFeedbackLoop } from './WhaleSignalFeedbackLoop';
import { TranslationOptions, TranslationResult } from '../types/translation';
import { RiddlerExplorerService, Steward } from './RiddlerExplorerService';

export class WhaleStewardSystem {
    private whaleTranslator: WhaleTranslationTool;
    private whaleFeedbackLoop: WhaleSignalFeedbackLoop;
    private readonly MAX_HISTORY_LENGTH = 1000;
    private signalHistory: TranslationResult[] = [];
    private riddler: RiddlerExplorerService;
    private steward: Steward;

    constructor(riddler: RiddlerExplorerService, steward: Steward) {
        this.riddler = riddler;
        this.steward = steward;
        this.whaleTranslator = new WhaleTranslationTool();
        this.whaleFeedbackLoop = new WhaleSignalFeedbackLoop();
        this.riddler.requestRecognition({
            id: steward.id,
            type: steward.type,
            name: steward.name
        });
    }

    // Process incoming whale signal
    handleIncomingWhaleSignal(
        signal: WhaleVocalSignal | WhaleMovementPattern | WhaleEnvironmentalData,
        options: TranslationOptions = { targetLanguage: 'English' }
    ): void {
        const translationResult = this.whaleTranslator.translateWhaleSignal(signal, options);
        console.log(`Received whale signal: ${translationResult.translatedText}`);
        console.log(`Confidence: ${translationResult.confidence}`);
        console.log(`Language: ${translationResult.language}`);

        if (translationResult.context) {
            console.log('Context:', translationResult.context);
        }

        // Store signal in history
        this.signalHistory.push(translationResult);
        this.cleanupHistory();

        // Process feedback and adapt the system
        this.whaleFeedbackLoop.processFeedback(translationResult);

        // Analyze the signal
        const analysis = this.analyzeSignal(translationResult);
        this.handleAnalysis(analysis);
    }

    private cleanupHistory(): void {
        if (this.signalHistory.length > this.MAX_HISTORY_LENGTH) {
            this.signalHistory = this.signalHistory.slice(-this.MAX_HISTORY_LENGTH);
        }
    }

    private analyzeSignal(translationResult: TranslationResult): WhaleAnalysisResult {
        return {
            signalType: 'translation',
            confidence: translationResult.confidence,
            impact: this.calculateImpact(translationResult),
            metadata: {
                language: translationResult.language,
                timestamp: translationResult.timestamp,
                context: translationResult.context
            },
            timestamp: new Date()
        };
    }

    private calculateImpact(translationResult: TranslationResult): number {
        let impact = 0.3; // Base impact
        impact += translationResult.confidence * 0.4;
        
        if (translationResult.context) {
            if (translationResult.context.environmentalContext) impact += 0.1;
            if (translationResult.context.emotionalContext) impact += 0.1;
            if (translationResult.context.socialContext) impact += 0.1;
        }

        return Math.min(Math.max(impact, 0), 1);
    }

    private handleAnalysis(analysis: WhaleAnalysisResult): void {
        // Implement analysis handling logic
        console.log('Analysis result:', analysis);
    }

    getSignalHistory(): TranslationResult[] {
        return [...this.signalHistory];
    }

    public executeCommand(command: string, args?: any): boolean {
        if (!this.riddler.checkpoint(this.steward.id, 'executeCommand', { command, args })) {
            // Optionally log or handle denied command
            return false;
        }
        // ... existing command execution logic ...
        return true;
    }

    public requestData(dataType: string, params?: any): any {
        if (!this.riddler.checkpoint(this.steward.id, 'requestData', { dataType, params })) {
            // Optionally log or handle denied data request
            return null;
        }
        // ... existing data request logic ...
        return {}; // Replace with actual data
    }
} 