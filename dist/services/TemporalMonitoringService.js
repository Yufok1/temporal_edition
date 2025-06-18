"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalMonitoringService = void 0;
const events_1 = require("events");
const logger_1 = __importDefault(require("../logger"));
const system_metrics_1 = require("../metrics/system-metrics");
class TemporalMonitoringService extends events_1.EventEmitter {
    constructor() {
        super();
        this.logger = logger_1.default;
        this.dataPoints = new Map();
        this.MAX_DATA_POINTS = 1000;
        this.ANALYSIS_INTERVAL = 60000; // 1 minute
        this.analysisInterval = null;
        this.initializeMetrics();
    }
    initializeMetrics() {
        // Initialize RUG metrics
        system_metrics_1.rugMetrics.currentDepth.set(0);
        system_metrics_1.rugMetrics.stabilityScore.set(1.0);
        system_metrics_1.rugMetrics.acclimationProgress.set(0);
        // Initialize REB metrics
        system_metrics_1.rebMetrics.boundaryViolations.reset();
        system_metrics_1.rebMetrics.cooldownActive.set(0);
        system_metrics_1.rebMetrics.stabilityViolations.reset();
        // Initialize health metrics
        system_metrics_1.healthMetrics.cpuUsage.set(0);
        system_metrics_1.healthMetrics.memoryUsage.set(0);
        system_metrics_1.healthMetrics.uptime.set(0);
    }
    startMonitoring(systemId) {
        this.logger.info(`Starting temporal monitoring for system ${systemId}`);
        this.dataPoints.set(systemId, []);
        if (!this.analysisInterval) {
            this.analysisInterval = setInterval(() => {
                this.performTemporalAnalysis();
            }, this.ANALYSIS_INTERVAL);
        }
    }
    stopMonitoring(systemId) {
        this.logger.info(`Stopping temporal monitoring for system ${systemId}`);
        this.dataPoints.delete(systemId);
        if (this.dataPoints.size === 0 && this.analysisInterval) {
            clearInterval(this.analysisInterval);
            this.analysisInterval = null;
        }
    }
    recordDataPoint(systemId, dataPoint) {
        const points = this.dataPoints.get(systemId) || [];
        const newDataPoint = {
            ...dataPoint,
            timestamp: new Date()
        };
        points.push(newDataPoint);
        // Maintain maximum data points
        if (points.length > this.MAX_DATA_POINTS) {
            points.shift();
        }
        this.dataPoints.set(systemId, points);
        this.updateMetrics(systemId, newDataPoint);
    }
    updateMetrics(systemId, dataPoint) {
        // Update RUG metrics
        system_metrics_1.rugMetrics.stabilityScore.set(this.calculateStabilityScore(dataPoint));
        system_metrics_1.rugMetrics.acclimationProgress.set(this.calculateAcclimationProgress(dataPoint));
        // Update health metrics
        const memoryUsage = process.memoryUsage();
        system_metrics_1.healthMetrics.cpuUsage.set(process.cpuUsage().user / 1000000); // Convert to percentage
        system_metrics_1.healthMetrics.memoryUsage.set(memoryUsage.heapUsed);
    }
    calculateStabilityScore(dataPoint) {
        const { frequencyLevel, environmentalConditions, systemMetrics } = dataPoint;
        // Calculate stability based on multiple factors
        const frequencyStability = 1 - Math.min(frequencyLevel / 100, 1);
        const environmentalStability = 1 - ((environmentalConditions.ionization + environmentalConditions.gasLevel) / 200);
        const systemStability = systemMetrics.stabilityIndex;
        return (frequencyStability + environmentalStability + systemStability) / 3;
    }
    calculateAcclimationProgress(dataPoint) {
        const { systemMetrics } = dataPoint;
        return systemMetrics.alignmentScore;
    }
    async performTemporalAnalysis() {
        for (const [systemId, points] of this.dataPoints.entries()) {
            if (points.length < 2)
                continue;
            const analysis = this.analyzeTemporalData(systemId, points);
            this.emit('analysisComplete', { systemId, analysis });
            // Check for venting needs
            if (analysis.predictions.ventingNeeded) {
                this.emit('ventingRequired', {
                    systemId,
                    estimatedTime: analysis.predictions.estimatedVentingTime,
                    recommendations: analysis.recommendations
                });
            }
        }
    }
    analyzeTemporalData(systemId, points) {
        const latestPoint = points[points.length - 1];
        const frequencyTrend = this.calculateTrend(points.map(p => p.frequencyLevel));
        const environmentalTrend = this.calculateTrend(points.map(p => (p.environmentalConditions.ionization + p.environmentalConditions.gasLevel) / 2));
        const ventingNeeded = this.determineVentingNeeded(frequencyTrend, environmentalTrend);
        const estimatedVentingTime = this.estimateVentingTime(points, frequencyTrend);
        const recommendations = this.generateRecommendations(frequencyTrend, environmentalTrend, ventingNeeded);
        return {
            timestamp: new Date(),
            dataPoints: points,
            predictions: {
                frequencyTrend,
                environmentalTrend,
                ventingNeeded,
                estimatedVentingTime
            },
            recommendations
        };
    }
    calculateTrend(values) {
        if (values.length < 2)
            return 0;
        const xMean = (values.length - 1) / 2;
        const yMean = values.reduce((a, b) => a + b, 0) / values.length;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < values.length; i++) {
            const xDiff = i - xMean;
            const yDiff = values[i] - yMean;
            numerator += xDiff * yDiff;
            denominator += xDiff * xDiff;
        }
        return denominator === 0 ? 0 : numerator / denominator;
    }
    determineVentingNeeded(frequencyTrend, environmentalTrend) {
        return frequencyTrend > 0.1 || environmentalTrend > 0.1;
    }
    estimateVentingTime(points, frequencyTrend) {
        const latestPoint = points[points.length - 1];
        const currentLevel = latestPoint.frequencyLevel;
        const threshold = 80; // Example threshold
        if (frequencyTrend <= 0)
            return new Date(Date.now() + 3600000); // No venting needed soon
        const timeToThreshold = (threshold - currentLevel) / frequencyTrend;
        return new Date(Date.now() + timeToThreshold * 60000); // Convert to milliseconds
    }
    generateRecommendations(frequencyTrend, environmentalTrend, ventingNeeded) {
        const recommendations = [];
        if (ventingNeeded) {
            recommendations.push('Prepare venting system for upcoming frequency release');
        }
        if (frequencyTrend > 0.05) {
            recommendations.push('Monitor frequency buildup closely');
        }
        if (environmentalTrend > 0.05) {
            recommendations.push('Check environmental control systems');
        }
        return recommendations;
    }
}
exports.TemporalMonitoringService = TemporalMonitoringService;
//# sourceMappingURL=TemporalMonitoringService.js.map