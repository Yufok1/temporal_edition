"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhaleSignalProcessing = void 0;
// Use require for fft-js since @types/fft-js is not available
const fft = require('fft-js');
class WhaleSignalProcessing {
    constructor(environmentalIntegrator) {
        this.signalHistory = [];
        this.adaptiveThresholds = {};
        this.environmentalIntegrator = environmentalIntegrator;
    }
    // Add a whale signal, integrating environmental context
    addWhaleSignal(signal) {
        const enrichedSignal = this.environmentalIntegrator.integrateWithWhaleSignal(signal);
        this.signalHistory.push(enrichedSignal);
        this.updateAdaptiveThresholds(enrichedSignal);
    }
    // Add an environmental signal
    addEnvironmentalSignal(signal) {
        this.environmentalIntegrator.addEnvironmentalSignal(signal);
    }
    // Update adaptive thresholds based on environmental context
    updateAdaptiveThresholds(signal) {
        // Example: adapt vocalization frequency threshold based on temperature
        if (signal.temperature !== undefined) {
            this.adaptiveThresholds['frequency'] = 20 + (signal.temperature - 10) * 0.5;
        }
        // Example: adapt migration speed threshold based on currentSpeed
        if (signal.currentSpeed !== undefined) {
            this.adaptiveThresholds['migrationSpeed'] = 5 + signal.currentSpeed * 0.8;
        }
        // Add more adaptive logic as needed
    }
    // Analyze signals using Fourier Transform
    analyzePatternsWithFourier() {
        if (this.signalHistory.length === 0) {
            return { dominantFrequencies: [], seasonalPatterns: [], trendPatterns: [] };
        }
        // Extract frequency data from signal history (e.g., using frequency property)
        const frequencies = this.signalHistory.map(s => s.frequency ?? 0);
        // Perform FFT
        const fftResult = fft.fft(frequencies);
        // Extract dominant frequencies (e.g., top 3)
        const dominantFrequencies = fftResult.slice(0, 3);
        return {
            dominantFrequencies,
            seasonalPatterns: [],
            trendPatterns: [] // Placeholder for trend analysis
        };
    }
    // Bayesian analysis for behavior prediction
    analyzeWithBayesianModel() {
        if (this.signalHistory.length === 0) {
            return { predictedBehavior: null, confidence: 0.0 };
        }
        // Simple Bayesian prediction: average of recent behavior types
        const recentBehaviors = this.signalHistory.slice(-5).map(s => s.behaviorType ?? 'unknown');
        const behaviorCounts = {};
        recentBehaviors.forEach(b => {
            behaviorCounts[b] = (behaviorCounts[b] || 0) + 1;
        });
        let maxCount = 0;
        let predictedBehavior = null;
        for (const [behavior, count] of Object.entries(behaviorCounts)) {
            if (count > maxCount) {
                maxCount = count;
                predictedBehavior = behavior;
            }
        }
        const confidence = maxCount / recentBehaviors.length;
        return { predictedBehavior, confidence };
    }
    // Get current adaptive thresholds
    getAdaptiveThresholds() {
        return { ...this.adaptiveThresholds };
    }
    // Get signal history
    getSignalHistory() {
        return [...this.signalHistory];
    }
}
exports.WhaleSignalProcessing = WhaleSignalProcessing;
//# sourceMappingURL=WhaleSignalProcessing.js.map