"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhaleSignalFeedbackLoop = void 0;
class WhaleSignalFeedbackLoop {
    constructor() {
        this.MAX_HISTORY_LENGTH = 1000;
        this.signalHistory = [];
        this.metricsHistory = [];
        this.patternHistory = new Map();
        // Initialize pattern history
        ['seasonal', 'trend', 'anomaly', 'cluster', 'correlation'].forEach(pattern => {
            this.patternHistory.set(pattern, []);
        });
    }
    // Process feedback from a translated signal
    processFeedback(signal) {
        // Store signal in history
        this.signalHistory.push(signal);
        this.cleanupHistory();
        // Update metrics
        const metrics = this.calculateMetrics(signal);
        this.metricsHistory.push(metrics);
        // Update pattern history
        this.updatePatternHistory(metrics);
        // Analyze and adapt
        this.analyzeAndAdapt();
    }
    // Analyze signal impact
    analyzeSignalImpact() {
        const recentMetrics = this.metricsHistory.slice(-10);
        if (recentMetrics.length === 0) {
            return this.createEmptyAnalysis();
        }
        const confidence = this.calculateConfidence(recentMetrics);
        const impact = this.calculateImpact(recentMetrics);
        const pattern = this.detectPattern(recentMetrics);
        return {
            signalType: 'aggregate',
            confidence,
            impact,
            metadata: {
                pattern,
                prediction: this.predictNextValue(recentMetrics),
                error: this.calculateError(recentMetrics)
            },
            timestamp: new Date()
        };
    }
    // Private helper methods
    cleanupHistory() {
        if (this.signalHistory.length > this.MAX_HISTORY_LENGTH) {
            this.signalHistory = this.signalHistory.slice(-this.MAX_HISTORY_LENGTH);
        }
        if (this.metricsHistory.length > this.MAX_HISTORY_LENGTH) {
            this.metricsHistory = this.metricsHistory.slice(-this.MAX_HISTORY_LENGTH);
        }
        this.patternHistory.forEach((values, pattern) => {
            if (values.length > this.MAX_HISTORY_LENGTH) {
                this.patternHistory.set(pattern, values.slice(-this.MAX_HISTORY_LENGTH));
            }
        });
    }
    calculateMetrics(signal) {
        const value = this.getSignalValue(signal);
        const confidence = this.calculateSignalConfidence(signal);
        const impact = this.calculateSignalImpact(signal);
        return {
            value,
            timestamp: new Date(),
            confidence,
            impact,
            metadata: {
                pattern: this.detectPattern([{ value, timestamp: new Date(), confidence, impact, metadata: {} }]),
                prediction: this.predictNextValue([{ value, timestamp: new Date(), confidence, impact, metadata: {} }]),
                error: 0
            }
        };
    }
    getSignalValue(signal) {
        if (signal.type === 'vocal' && 'frequency' in signal.content) {
            return signal.content.frequency;
        }
        if (signal.type === 'movement' && 'speed' in signal.content) {
            return signal.content.speed;
        }
        if (signal.type === 'environmental' && 'waterTemperature' in signal.content) {
            return signal.content.waterTemperature;
        }
        return 0;
    }
    calculateSignalConfidence(signal) {
        // Implement confidence calculation based on signal type and content
        return 0.5;
    }
    calculateSignalImpact(signal) {
        // Implement impact calculation based on signal type and content
        return 0.5;
    }
    updatePatternHistory(metrics) {
        const pattern = metrics.metadata.pattern;
        if (pattern && this.patternHistory.has(pattern)) {
            const values = this.patternHistory.get(pattern) || [];
            values.push(metrics.value);
            this.patternHistory.set(pattern, values);
        }
    }
    analyzeAndAdapt() {
        // Implement analysis and adaptation logic
        // This could include adjusting thresholds, updating pattern detection, etc.
    }
    calculateConfidence(metrics) {
        return metrics.reduce((sum, m) => sum + m.confidence, 0) / metrics.length;
    }
    calculateImpact(metrics) {
        return metrics.reduce((sum, m) => sum + m.impact, 0) / metrics.length;
    }
    detectPattern(metrics) {
        // Implement pattern detection logic
        return 'unknown';
    }
    predictNextValue(metrics) {
        const values = metrics.map(m => m.value);
        if (values.length < 2)
            return 0;
        const behaviorChanges = values.slice(1).map((value, i) => value - values[i]);
        const predictions = behaviorChanges.map((change, i) => values[i] + change);
        const actualChanges = values.slice(1).map((value, i) => value - values[i]);
        const predictionError = this.calculatePredictionError(predictions, actualChanges);
        return values[values.length - 1] + (behaviorChanges[behaviorChanges.length - 1] * (1 - predictionError));
    }
    calculatePredictionError(predictions, actuals) {
        const errors = predictions.map((pred, i) => Math.abs(pred - actuals[i]));
        return errors.reduce((sum, error) => sum + error, 0) / errors.length;
    }
    calculateError(metrics) {
        const values = metrics.map(m => m.value);
        if (values.length < 2)
            return 0;
        const changes = values.slice(1).map((value, i) => value - values[i]);
        const meanChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        const squaredDiffs = changes.map(change => Math.pow(change - meanChange, 2));
        return Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length);
    }
    createEmptyAnalysis() {
        return {
            signalType: 'empty',
            confidence: 0,
            impact: 0,
            metadata: {
                pattern: 'unknown',
                prediction: 0,
                error: 0
            },
            timestamp: new Date()
        };
    }
}
exports.WhaleSignalFeedbackLoop = WhaleSignalFeedbackLoop;
//# sourceMappingURL=WhaleSignalFeedbackLoop.js.map