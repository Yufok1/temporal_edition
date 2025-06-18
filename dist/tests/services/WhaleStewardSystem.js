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
exports.WhaleStewardSystem = void 0;
var WhaleTranslationTool_1 = require("./WhaleTranslationTool");
var WhaleSignalFeedbackLoop_1 = require("./WhaleSignalFeedbackLoop");
var WhaleStewardSystem = /** @class */ (function () {
    function WhaleStewardSystem(riddler, steward) {
        this.MAX_HISTORY_LENGTH = 1000;
        this.signalHistory = [];
        this.riddler = riddler;
        this.steward = steward;
        this.whaleTranslator = new WhaleTranslationTool_1.WhaleTranslationTool();
        this.whaleFeedbackLoop = new WhaleSignalFeedbackLoop_1.WhaleSignalFeedbackLoop();
        this.riddler.requestRecognition({
            id: steward.id,
            type: steward.type,
            name: steward.name
        });
    }
    // Process incoming whale signal
    WhaleStewardSystem.prototype.handleIncomingWhaleSignal = function (signal, options) {
        if (options === void 0) { options = { targetLanguage: 'English' }; }
        var translationResult = this.whaleTranslator.translateWhaleSignal(signal, options);
        console.log("Received whale signal: ".concat(translationResult.translatedText));
        console.log("Confidence: ".concat(translationResult.confidence));
        console.log("Language: ".concat(translationResult.language));
        if (translationResult.context) {
            console.log('Context:', translationResult.context);
        }
        // Store signal in history
        this.signalHistory.push(translationResult);
        this.cleanupHistory();
        // Process feedback and adapt the system
        this.whaleFeedbackLoop.processFeedback(translationResult);
        // Analyze the signal
        var analysis = this.analyzeSignal(translationResult);
        this.handleAnalysis(analysis);
    };
    WhaleStewardSystem.prototype.cleanupHistory = function () {
        if (this.signalHistory.length > this.MAX_HISTORY_LENGTH) {
            this.signalHistory = this.signalHistory.slice(-this.MAX_HISTORY_LENGTH);
        }
    };
    WhaleStewardSystem.prototype.analyzeSignal = function (translationResult) {
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
    };
    WhaleStewardSystem.prototype.calculateImpact = function (translationResult) {
        var impact = 0.3; // Base impact
        impact += translationResult.confidence * 0.4;
        if (translationResult.context) {
            if (translationResult.context.environmentalContext)
                impact += 0.1;
            if (translationResult.context.emotionalContext)
                impact += 0.1;
            if (translationResult.context.socialContext)
                impact += 0.1;
        }
        return Math.min(Math.max(impact, 0), 1);
    };
    WhaleStewardSystem.prototype.handleAnalysis = function (analysis) {
        // Implement analysis handling logic
        console.log('Analysis result:', analysis);
    };
    WhaleStewardSystem.prototype.getSignalHistory = function () {
        return __spreadArray([], this.signalHistory, true);
    };
    WhaleStewardSystem.prototype.executeCommand = function (command, args) {
        if (!this.riddler.checkpoint(this.steward.id, 'executeCommand', { command: command, args: args })) {
            // Optionally log or handle denied command
            return false;
        }
        // ... existing command execution logic ...
        return true;
    };
    WhaleStewardSystem.prototype.requestData = function (dataType, params) {
        if (!this.riddler.checkpoint(this.steward.id, 'requestData', { dataType: dataType, params: params })) {
            // Optionally log or handle denied data request
            return null;
        }
        // ... existing data request logic ...
        return {}; // Replace with actual data
    };
    return WhaleStewardSystem;
}());
exports.WhaleStewardSystem = WhaleStewardSystem;
