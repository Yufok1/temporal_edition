"use strict";
exports.__esModule = true;
exports.WhaleTranslationTool = void 0;
var whaleVocabulary_1 = require("../data/whaleVocabulary");
var WhaleTranslationTool = /** @class */ (function () {
    function WhaleTranslationTool() {
        this.VOCAL_FREQUENCY_THRESHOLD = 1000; // Hz
        this.MOVEMENT_SPEED_THRESHOLD = 5; // m/s
        this.TEMPERATURE_THRESHOLD = 20; // °C
        this.DEPTH_THRESHOLD = 100; // meters
        this.vocabularyMapping = {
            whale_call_1: "Human communication system is aware of your call.",
            whale_call_2: "Translation system initiated.",
            whale_call_3: "Understanding of human vocalizations initiated.",
            whale_call_4: "Environmental change detected, initiating system response.",
            whale_call_5: "Request for system analysis."
        };
        this.supportedLanguages = [
            'English',
            'Spanish',
            'French',
            'German',
            'Chinese',
            'Japanese',
            'Portuguese',
            'Russian'
        ];
    }
    // Translate any type of whale signal into a standardized format
    WhaleTranslationTool.prototype.translateWhaleSignal = function (signal, options) {
        if (options === void 0) { options = { targetLanguage: 'English' }; }
        var translatedSignal = this.translateSignal(signal);
        var confidence = this.calculateConfidence(translatedSignal);
        var emotionalTone = this.detectEmotionalTone(signal);
        // Get the appropriate vocabulary entry based on the signal type and emotional tone
        var vocabularyEntry = this.getVocabularyEntry(signal, emotionalTone, options.targetLanguage);
        return {
            originalSignal: JSON.stringify(signal),
            translatedText: this.adjustMessageForContext(vocabularyEntry.message, signal, options),
            confidence: confidence,
            language: options.targetLanguage,
            timestamp: new Date(),
            emotionalTone: vocabularyEntry.emotionalTone,
            context: options.includeContext ? this.extractContext(signal, vocabularyEntry) : undefined
        };
    };
    WhaleTranslationTool.prototype.translateSignal = function (signal) {
        if (this.isVocalSignal(signal)) {
            return this.translateVocalSignal(signal);
        }
        else if (this.isMovementPattern(signal)) {
            return this.translateMovementPattern(signal);
        }
        else {
            return this.translateEnvironmentalData(signal);
        }
    };
    WhaleTranslationTool.prototype.detectEmotionalTone = function (signal) {
        if (this.isVocalSignal(signal)) {
            var vocalSignal = signal;
            if (vocalSignal.intensity > 0.8) {
                return 'alerting';
            }
            else if (vocalSignal.intensity < 0.3) {
                return 'contemplative';
            }
        }
        return 'neutral';
    };
    WhaleTranslationTool.prototype.getVocabularyEntry = function (signal, emotionalTone, targetLanguage) {
        // Determine the appropriate whale call type based on the signal and emotional tone
        var callType = 'whale_call_greeting'; // default
        if (emotionalTone === 'alerting') {
            callType = 'whale_call_warning';
        }
        else if (emotionalTone === 'spiritual') {
            callType = 'whale_call_spiritual';
        }
        else if (emotionalTone === 'encouraging') {
            callType = 'whale_call_encouragement';
        }
        var vocabulary = whaleVocabulary_1.whaleVocabulary[callType];
        if (!vocabulary || !vocabulary[targetLanguage]) {
            throw new Error("Translation not found for call type ".concat(callType, " in language ").concat(targetLanguage));
        }
        return vocabulary[targetLanguage];
    };
    WhaleTranslationTool.prototype.adjustMessageForContext = function (message, signal, options) {
        var adjustedMessage = message;
        // Adjust based on emotional state if provided
        if (options.emotionalState) {
            adjustedMessage = this.adjustForEmotionalState(adjustedMessage, options.emotionalState);
        }
        // Adjust based on environmental context if provided
        if (options.environmentalContext) {
            adjustedMessage = this.adjustForEnvironmentalContext(adjustedMessage, options.environmentalContext);
        }
        return adjustedMessage;
    };
    WhaleTranslationTool.prototype.adjustForEmotionalState = function (message, emotionalState) {
        switch (emotionalState.toLowerCase()) {
            case 'calm':
                return message.replace(/keep moving forward/g, 'stay at peace');
            case 'anxious':
                return message.replace(/we are connected/g, 'find your grounding');
            case 'reflective':
                return message.replace(/keep moving forward/g, 'ponder deeply');
            default:
                return message;
        }
    };
    WhaleTranslationTool.prototype.adjustForEnvironmentalContext = function (message, environmentalContext) {
        if (environmentalContext.includes('storm')) {
            return message.replace(/ocean/g, 'stormy ocean');
        }
        if (environmentalContext.includes('deep')) {
            return message.replace(/ocean/g, 'deep ocean');
        }
        return message;
    };
    WhaleTranslationTool.prototype.extractContext = function (signal, vocabularyEntry) {
        return {
            environmentalContext: this.getEnvironmentalContext(signal, vocabularyEntry),
            emotionalContext: this.getEmotionalContext(signal, vocabularyEntry),
            socialContext: this.getSocialContext(signal, vocabularyEntry),
            spiritualContext: this.getSpiritualContext(signal, vocabularyEntry)
        };
    };
    WhaleTranslationTool.prototype.getEnvironmentalContext = function (signal, vocabularyEntry) {
        var _a;
        var contexts = [];
        if ('waterTemperature' in signal) {
            contexts.push("Water temperature: ".concat(signal.waterTemperature, "\u00B0C"));
        }
        if ((_a = vocabularyEntry.context) === null || _a === void 0 ? void 0 : _a.environmental) {
            contexts.push.apply(contexts, vocabularyEntry.context.environmental);
        }
        return contexts.join(', ') || 'No environmental context available';
    };
    WhaleTranslationTool.prototype.getEmotionalContext = function (signal, vocabularyEntry) {
        var _a;
        var contexts = [];
        if ('intensity' in signal) {
            contexts.push("Signal intensity: ".concat(signal.intensity));
        }
        if ((_a = vocabularyEntry.context) === null || _a === void 0 ? void 0 : _a.emotional) {
            contexts.push.apply(contexts, vocabularyEntry.context.emotional);
        }
        return contexts.join(', ') || 'No emotional context available';
    };
    WhaleTranslationTool.prototype.getSocialContext = function (signal, vocabularyEntry) {
        var _a;
        var contexts = [];
        if ('behaviorType' in signal) {
            contexts.push("Behavior type: ".concat(signal.behaviorType));
        }
        if ((_a = vocabularyEntry.context) === null || _a === void 0 ? void 0 : _a.social) {
            contexts.push.apply(contexts, vocabularyEntry.context.social);
        }
        return contexts.join(', ') || 'No social context available';
    };
    WhaleTranslationTool.prototype.getSpiritualContext = function (signal, vocabularyEntry) {
        if (vocabularyEntry.emotionalTone === 'spiritual') {
            return 'Spiritual connection detected';
        }
        return 'No spiritual context available';
    };
    WhaleTranslationTool.prototype.translateToLanguage = function (text, targetLanguage) {
        // In a real implementation, this would use a translation service
        // For now, we'll return the English text
        return text;
    };
    // Analyze a translated signal
    WhaleTranslationTool.prototype.analyzeSignal = function (signal) {
        var confidence = this.calculateConfidence(signal);
        var impact = this.calculateImpact(signal);
        var metadata = this.extractMetadata(signal);
        return {
            signalType: signal.type,
            confidence: confidence,
            impact: impact,
            metadata: metadata,
            timestamp: new Date()
        };
    };
    // Private helper methods
    WhaleTranslationTool.prototype.isVocalSignal = function (signal) {
        return 'signalType' in signal && 'frequency' in signal;
    };
    WhaleTranslationTool.prototype.isMovementPattern = function (signal) {
        return 'behaviorType' in signal && 'speed' in signal;
    };
    WhaleTranslationTool.prototype.translateVocalSignal = function (signal) {
        var interpretation = this.interpretVocalSignal(signal);
        return {
            type: 'vocal',
            content: signal,
            systemInterpretation: interpretation,
            timestamp: new Date()
        };
    };
    WhaleTranslationTool.prototype.translateMovementPattern = function (signal) {
        var interpretation = this.interpretMovementPattern(signal);
        return {
            type: 'movement',
            content: signal,
            systemInterpretation: interpretation,
            timestamp: new Date()
        };
    };
    WhaleTranslationTool.prototype.translateEnvironmentalData = function (data) {
        var interpretation = this.interpretEnvironmentalData(data);
        return {
            type: 'environmental',
            content: data,
            systemInterpretation: interpretation,
            timestamp: new Date()
        };
    };
    WhaleTranslationTool.prototype.interpretVocalSignal = function (signal) {
        var frequency = signal.frequency;
        var duration = signal.duration;
        var intensity = signal.intensity;
        var interpretation = "Vocal signal detected: ".concat(signal.signalType);
        if (frequency > this.VOCAL_FREQUENCY_THRESHOLD) {
            interpretation += ' (High frequency)';
        }
        if (duration > 5) {
            interpretation += ' (Long duration)';
        }
        if (intensity > 0.8) {
            interpretation += ' (High intensity)';
        }
        return interpretation;
    };
    WhaleTranslationTool.prototype.interpretMovementPattern = function (signal) {
        var speed = signal.speed;
        var direction = signal.direction;
        var depth = signal.depth;
        var interpretation = "Movement pattern: ".concat(signal.behaviorType);
        if (speed > this.MOVEMENT_SPEED_THRESHOLD) {
            interpretation += ' (Rapid movement)';
        }
        if (depth > this.DEPTH_THRESHOLD) {
            interpretation += ' (Deep dive)';
        }
        return interpretation;
    };
    WhaleTranslationTool.prototype.interpretEnvironmentalData = function (data) {
        var temperature = data.waterTemperature;
        var depth = data.waterDepth;
        var salinity = data.salinity;
        var interpretation = 'Environmental conditions:';
        if (temperature > this.TEMPERATURE_THRESHOLD) {
            interpretation += ' (Warm water)';
        }
        if (depth > this.DEPTH_THRESHOLD) {
            interpretation += ' (Deep water)';
        }
        if (salinity > 35) {
            interpretation += ' (High salinity)';
        }
        return interpretation;
    };
    WhaleTranslationTool.prototype.calculateConfidence = function (signal) {
        var confidence = 0.5; // Base confidence
        if (signal.type === 'vocal') {
            var content = signal.content;
            confidence += (content.intensity * 0.3);
            confidence += (content.duration / 10) * 0.2;
        }
        else if (signal.type === 'movement') {
            var content = signal.content;
            confidence += (content.speed / this.MOVEMENT_SPEED_THRESHOLD) * 0.3;
            confidence += (content.depth / this.DEPTH_THRESHOLD) * 0.2;
        }
        else {
            var content = signal.content;
            confidence += (content.waterTemperature / this.TEMPERATURE_THRESHOLD) * 0.3;
            confidence += (content.waterDepth / this.DEPTH_THRESHOLD) * 0.2;
        }
        return Math.min(Math.max(confidence, 0), 1);
    };
    WhaleTranslationTool.prototype.calculateImpact = function (signal) {
        var impact = 0.3; // Base impact
        if (signal.type === 'vocal') {
            var content = signal.content;
            impact += (content.intensity * 0.4);
            impact += (content.duration / 10) * 0.3;
        }
        else if (signal.type === 'movement') {
            var content = signal.content;
            impact += (content.speed / this.MOVEMENT_SPEED_THRESHOLD) * 0.4;
            impact += (content.depth / this.DEPTH_THRESHOLD) * 0.3;
        }
        else {
            var content = signal.content;
            impact += (content.waterTemperature / this.TEMPERATURE_THRESHOLD) * 0.4;
            impact += (content.waterDepth / this.DEPTH_THRESHOLD) * 0.3;
        }
        return Math.min(Math.max(impact, 0), 1);
    };
    WhaleTranslationTool.prototype.extractMetadata = function (signal) {
        var metadata = {
            pattern: this.detectPattern(signal),
            prediction: this.predictNextValue(signal),
            error: this.calculateError(signal)
        };
        return metadata;
    };
    WhaleTranslationTool.prototype.detectPattern = function (signal) {
        // Implement pattern detection logic
        return 'unknown';
    };
    WhaleTranslationTool.prototype.predictNextValue = function (signal) {
        // Implement prediction logic
        return 0;
    };
    WhaleTranslationTool.prototype.calculateError = function (signal) {
        // Implement error calculation logic
        return 0;
    };
    return WhaleTranslationTool;
}());
exports.WhaleTranslationTool = WhaleTranslationTool;
