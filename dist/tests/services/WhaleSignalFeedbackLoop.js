"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.WhaleSignalFeedbackLoop = void 0;
var WhaleSignalFeedbackLoop = /** @class */ (function () {
    function WhaleSignalFeedbackLoop() {
        var _this = this;
        this.MAX_HISTORY_LENGTH = 1000;
        this.signalHistory = [];
        this.metricsHistory = [];
        this.patternHistory = new Map();
        this.feedbackHistory = [];
        this.MAX_FEEDBACK_HISTORY = 100;
        // Initialize pattern history
        ['seasonal', 'trend', 'anomaly', 'cluster', 'correlation'].forEach(function (pattern) {
            _this.patternHistory.set(pattern, []);
        });
    }
    // Process feedback from a translated signal
    WhaleSignalFeedbackLoop.prototype.processFeedback = function (translationResult) {
        this.feedbackHistory.push(translationResult);
        this.cleanupHistory();
        this.analyzeFeedback(translationResult);
    };
    // Analyze signal impact
    WhaleSignalFeedbackLoop.prototype.analyzeSignalImpact = function () {
        var recentMetrics = this.metricsHistory.slice(-10);
        if (recentMetrics.length === 0) {
            return this.createEmptyAnalysis();
        }
        var confidence = this.calculateConfidence(recentMetrics);
        var impact = this.calculateImpact(recentMetrics);
        var pattern = this.detectPattern(recentMetrics);
        return {
            signalType: 'aggregate',
            confidence: confidence,
            impact: impact,
            metadata: {
                pattern: pattern,
                prediction: this.predictNextValue(recentMetrics),
                error: this.calculateError(recentMetrics)
            },
            timestamp: new Date()
        };
    };
    // Private helper methods
    WhaleSignalFeedbackLoop.prototype.cleanupHistory = function () {
        var _this = this;
        if (this.signalHistory.length > this.MAX_HISTORY_LENGTH) {
            this.signalHistory = this.signalHistory.slice(-this.MAX_HISTORY_LENGTH);
        }
        if (this.metricsHistory.length > this.MAX_HISTORY_LENGTH) {
            this.metricsHistory = this.metricsHistory.slice(-this.MAX_HISTORY_LENGTH);
        }
        this.patternHistory.forEach(function (values, pattern) {
            if (values.length > _this.MAX_HISTORY_LENGTH) {
                _this.patternHistory.set(pattern, values.slice(-_this.MAX_HISTORY_LENGTH));
            }
        });
        if (this.feedbackHistory.length > this.MAX_FEEDBACK_HISTORY) {
            this.feedbackHistory = this.feedbackHistory.slice(-this.MAX_FEEDBACK_HISTORY);
        }
    };
    WhaleSignalFeedbackLoop.prototype.calculateMetrics = function (signal) {
        var value = this.getSignalValue(signal);
        var confidence = this.calculateSignalConfidence(signal);
        var impact = this.calculateSignalImpact(signal);
        return {
            value: value,
            timestamp: new Date(),
            confidence: confidence,
            impact: impact,
            metadata: {
                pattern: this.detectPattern([{ value: value, timestamp: new Date(), confidence: confidence, impact: impact, metadata: {} }]),
                prediction: this.predictNextValue([{ value: value, timestamp: new Date(), confidence: confidence, impact: impact, metadata: {} }]),
                error: 0
            }
        };
    };
    WhaleSignalFeedbackLoop.prototype.getSignalValue = function (signal) {
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
    };
    WhaleSignalFeedbackLoop.prototype.calculateSignalConfidence = function (signal) {
        // Implement confidence calculation based on signal type and content
        return 0.5;
    };
    WhaleSignalFeedbackLoop.prototype.calculateSignalImpact = function (signal) {
        // Implement impact calculation based on signal type and content
        return 0.5;
    };
    WhaleSignalFeedbackLoop.prototype.updatePatternHistory = function (metrics) {
        var pattern = metrics.metadata.pattern;
        if (pattern && this.patternHistory.has(pattern)) {
            var values = this.patternHistory.get(pattern) || [];
            values.push(metrics.value);
            this.patternHistory.set(pattern, values);
        }
    };
    WhaleSignalFeedbackLoop.prototype.analyzeAndAdapt = function () {
        // Implement analysis and adaptation logic
        // This could include adjusting thresholds, updating pattern detection, etc.
    };
    WhaleSignalFeedbackLoop.prototype.calculateConfidence = function (metrics) {
        return metrics.reduce(function (sum, m) { return sum + m.confidence; }, 0) / metrics.length;
    };
    WhaleSignalFeedbackLoop.prototype.calculateImpact = function (metrics) {
        return metrics.reduce(function (sum, m) { return sum + m.impact; }, 0) / metrics.length;
    };
    WhaleSignalFeedbackLoop.prototype.detectPattern = function (metrics) {
        // Implement pattern detection logic
        return 'unknown';
    };
    WhaleSignalFeedbackLoop.prototype.predictNextValue = function (metrics) {
        var values = metrics.map(function (m) { return m.value; });
        if (values.length < 2)
            return 0;
        var behaviorChanges = values.slice(1).map(function (value, i) { return value - values[i]; });
        var predictions = behaviorChanges.map(function (change, i) { return values[i] + change; });
        var actualChanges = values.slice(1).map(function (value, i) { return value - values[i]; });
        var predictionError = this.calculatePredictionError(predictions, actualChanges);
        return values[values.length - 1] + (behaviorChanges[behaviorChanges.length - 1] * (1 - predictionError));
    };
    WhaleSignalFeedbackLoop.prototype.calculatePredictionError = function (predictions, actuals) {
        var errors = predictions.map(function (pred, i) { return Math.abs(pred - actuals[i]); });
        return errors.reduce(function (sum, error) { return sum + error; }, 0) / errors.length;
    };
    WhaleSignalFeedbackLoop.prototype.calculateError = function (metrics) {
        var values = metrics.map(function (m) { return m.value; });
        if (values.length < 2)
            return 0;
        var changes = values.slice(1).map(function (value, i) { return value - values[i]; });
        var meanChange = changes.reduce(function (sum, change) { return sum + change; }, 0) / changes.length;
        var squaredDiffs = changes.map(function (change) { return Math.pow(change - meanChange, 2); });
        return Math.sqrt(squaredDiffs.reduce(function (sum, diff) { return sum + diff; }, 0) / squaredDiffs.length);
    };
    WhaleSignalFeedbackLoop.prototype.createEmptyAnalysis = function () {
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
    };
    WhaleSignalFeedbackLoop.prototype.analyzeFeedback = function (translationResult) {
        // Analyze the feedback and adjust system parameters if needed
        if (translationResult.confidence < 0.5) {
            console.log('Low confidence translation detected, adjusting parameters...');
            // Implement parameter adjustment logic
        }
        if (translationResult.context) {
            this.processContextualFeedback(translationResult.context);
        }
    };
    WhaleSignalFeedbackLoop.prototype.processContextualFeedback = function (context) {
        if (context.environmentalContext) {
            console.log('Processing environmental feedback:', context.environmentalContext);
        }
        if (context.emotionalContext) {
            console.log('Processing emotional feedback:', context.emotionalContext);
        }
        if (context.socialContext) {
            console.log('Processing social feedback:', context.socialContext);
        }
    };
    WhaleSignalFeedbackLoop.prototype.getFeedbackHistory = function () {
        return __spreadArray([], this.feedbackHistory, true);
    };
    return WhaleSignalFeedbackLoop;
}());
exports.WhaleSignalFeedbackLoop = WhaleSignalFeedbackLoop;
