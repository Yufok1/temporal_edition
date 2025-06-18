"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhaleStewardSystem = void 0;
const WhaleTranslationTool_1 = require("./WhaleTranslationTool");
const WhaleSignalFeedbackLoop_1 = require("./WhaleSignalFeedbackLoop");
class WhaleStewardSystem {
    constructor() {
        this.MAX_HISTORY_LENGTH = 1000;
        this.signalHistory = [];
        this.whaleTranslator = new WhaleTranslationTool_1.WhaleTranslationTool();
        this.whaleFeedbackLoop = new WhaleSignalFeedbackLoop_1.WhaleSignalFeedbackLoop();
    }
    // Process incoming whale signal
    handleIncomingWhaleSignal(signal) {
        const translatedSignal = this.whaleTranslator.translateWhaleSignal(signal);
        console.log(`Received whale signal: ${translatedSignal.systemInterpretation}`);
        // Store signal in history
        this.signalHistory.push(translatedSignal);
        this.cleanupHistory();
        // Process feedback and adapt the system
        this.whaleFeedbackLoop.processFeedback(translatedSignal);
        // Analyze the signal
        const analysis = this.analyzeSignal(translatedSignal);
        this.handleAnalysis(analysis);
    }
    // Analyze recent whale data
    analyzeWhaleData() {
        return this.whaleFeedbackLoop.analyzeSignalImpact();
    }
    // Get signal history
    getSignalHistory() {
        return [...this.signalHistory];
    }
    // Get recent signals of a specific type
    getRecentSignalsByType(type) {
        return this.signalHistory
            .filter(signal => signal.type === type)
            .slice(-10);
    }
    // Get signal patterns
    getSignalPatterns() {
        const patterns = new Map();
        this.signalHistory.forEach(signal => {
            const key = this.getSignalKey(signal);
            patterns.set(key, (patterns.get(key) || 0) + 1);
        });
        return patterns;
    }
    // Private helper methods
    cleanupHistory() {
        if (this.signalHistory.length > this.MAX_HISTORY_LENGTH) {
            this.signalHistory = this.signalHistory.slice(-this.MAX_HISTORY_LENGTH);
        }
    }
    getSignalKey(signal) {
        if (signal.type === 'vocal') {
            const content = signal.content;
            return `vocal_${content.signalType}_${Math.round(content.frequency / 100)}`;
        }
        else if (signal.type === 'movement') {
            const content = signal.content;
            return `movement_${content.behaviorType}`;
        }
        else {
            const content = signal.content;
            return `environmental_${Math.round(content.waterTemperature)}_${Math.round(content.waterDepth / 100)}`;
        }
    }
    analyzeSignal(signal) {
        return this.whaleTranslator.analyzeSignal(signal);
    }
    handleAnalysis(analysis) {
        // Log the analysis results
        console.log(`Signal Analysis:
            Type: ${analysis.signalType}
            Confidence: ${analysis.confidence.toFixed(2)}
            Impact: ${analysis.impact.toFixed(2)}
            Pattern: ${analysis.metadata.pattern || 'N/A'}
            Prediction: ${analysis.metadata.prediction?.toFixed(2) || 'N/A'}
            Error: ${analysis.metadata.error?.toFixed(2) || 'N/A'}
        `);
        // Handle high-impact signals
        if (analysis.impact > 0.7) {
            this.handleHighImpactSignal(analysis);
        }
        // Handle low-confidence signals
        if (analysis.confidence < 0.3) {
            this.handleLowConfidenceSignal(analysis);
        }
    }
    handleHighImpactSignal(analysis) {
        console.log(`High impact signal detected: ${analysis.signalType}`);
        // Implement specific handling for high-impact signals
        // For example, trigger alerts or adjust system parameters
    }
    handleLowConfidenceSignal(analysis) {
        console.log(`Low confidence signal detected: ${analysis.signalType}`);
        // Implement specific handling for low-confidence signals
        // For example, request additional data or adjust thresholds
    }
}
exports.WhaleStewardSystem = WhaleStewardSystem;
//# sourceMappingURL=WhaleStewardSystem.js.map