"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreathMirrorAnalysis = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
class BreathMirrorAnalysis extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.logger = (0, logger_1.createLogger)('BreathMirrorAnalysis');
        this.config = {
            stabilityThreshold: config.stabilityThreshold ?? 0.8,
            performanceThreshold: config.performanceThreshold ?? 0.7,
            alignmentThreshold: config.alignmentThreshold ?? 0.9,
            checkInterval: config.checkInterval ?? 5000
        };
        this.analysisResults = new Map();
        this.analysisIntervals = new Map();
    }
    startAnalysis(systemId, initialMetrics) {
        if (this.analysisIntervals.has(systemId)) {
            throw new Error(`Analysis already running for system ${systemId}`);
        }
        this.analysisResults.set(systemId, []);
        this.performAnalysis(systemId, initialMetrics);
        const interval = setInterval(() => {
            this.emit('analysisRequested', systemId);
        }, this.config.checkInterval);
        this.analysisIntervals.set(systemId, interval);
        this.logger.info(`Started analysis for system ${systemId}`);
    }
    stopAnalysis(systemId) {
        const interval = this.analysisIntervals.get(systemId);
        if (interval) {
            clearInterval(interval);
            this.analysisIntervals.delete(systemId);
            this.logger.info(`Stopped analysis for system ${systemId}`);
        }
    }
    updateMetrics(systemId, metrics) {
        this.performAnalysis(systemId, metrics);
    }
    performAnalysis(systemId, metrics) {
        const recommendations = [];
        const warnings = [];
        // Analyze stability
        if (metrics.stabilityIndex < this.config.stabilityThreshold) {
            warnings.push(`System stability below threshold: ${metrics.stabilityIndex}`);
            recommendations.push('Consider implementing additional error handling and recovery mechanisms');
        }
        // Analyze performance
        if (metrics.performanceMetrics.errorRate > (1 - this.config.performanceThreshold)) {
            warnings.push(`Error rate above threshold: ${metrics.performanceMetrics.errorRate}`);
            recommendations.push('Review error handling and implement performance optimizations');
        }
        // Calculate alignment progress
        const alignmentProgress = this.calculateAlignmentProgress(metrics);
        const result = {
            timestamp: new Date(),
            systemId,
            metrics,
            recommendations,
            warnings,
            alignmentProgress
        };
        const results = this.analysisResults.get(systemId) || [];
        results.push(result);
        this.analysisResults.set(systemId, results);
        this.emit('analysisComplete', result);
        this.logger.info(`Analysis complete for system ${systemId}`, { alignmentProgress });
    }
    calculateAlignmentProgress(metrics) {
        const weights = {
            alignmentScore: 0.4,
            stabilityIndex: 0.3,
            performance: 0.3
        };
        const performanceScore = 1 - metrics.performanceMetrics.errorRate;
        return (metrics.alignmentScore * weights.alignmentScore +
            metrics.stabilityIndex * weights.stabilityIndex +
            performanceScore * weights.performance);
    }
    getAnalysisHistory(systemId) {
        return this.analysisResults.get(systemId) || [];
    }
    getLatestAnalysis(systemId) {
        const results = this.analysisResults.get(systemId);
        return results ? results[results.length - 1] : undefined;
    }
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        this.logger.info('Analysis configuration updated', { newConfig });
    }
}
exports.BreathMirrorAnalysis = BreathMirrorAnalysis;
//# sourceMappingURL=BreathMirrorAnalysis.js.map