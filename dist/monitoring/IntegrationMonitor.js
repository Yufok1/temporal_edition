"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMonitor = void 0;
class IntegrationMonitor {
    constructor(whaleSteward, poseidonSystem) {
        this.metrics = [];
        this.MAX_METRICS_HISTORY = 1000;
        this.whaleSteward = whaleSteward;
        this.poseidonSystem = poseidonSystem;
        this.startTime = Date.now();
        this.initializeMetrics();
        this.setupAlertConditions();
    }
    initializeMetrics() {
        this.performanceMetrics = {
            signalProcessingTime: 0,
            analysisTime: 0,
            ecosystemUpdateTime: 0,
            totalProcessingTime: 0
        };
        this.signalMetrics = {
            totalSignals: 0,
            validSignals: 0,
            invalidSignals: 0,
            signalTypes: new Map(),
            averageIntensity: 0,
            averageFrequency: 0
        };
        this.patternMetrics = {
            patternsDetected: 0,
            patternTypes: new Map(),
            patternConfidence: 0,
            seasonalPatterns: 0,
            trendPatterns: 0
        };
    }
    setupAlertConditions() {
        this.alertConditions = [
            {
                metric: 'signalProcessingTime',
                threshold: 1000,
                operator: '>',
                severity: 'warning'
            },
            {
                metric: 'invalidSignals',
                threshold: 10,
                operator: '>',
                severity: 'error'
            },
            {
                metric: 'patternConfidence',
                threshold: 0.5,
                operator: '<',
                severity: 'warning'
            }
        ];
    }
    async trackSignalProcessing(signal) {
        const startTime = Date.now();
        try {
            this.whaleSteward.handleIncomingWhaleSignal(signal);
            this.updateSignalMetrics(signal);
        }
        catch (error) {
            this.signalMetrics.invalidSignals++;
            throw error;
        }
        this.performanceMetrics.signalProcessingTime = Date.now() - startTime;
    }
    async trackAnalysis(analysis) {
        const startTime = Date.now();
        try {
            await this.poseidonSystem.processWhaleAnalysis(analysis);
            this.updatePatternMetrics(analysis);
        }
        catch (error) {
            throw error;
        }
        this.performanceMetrics.analysisTime = Date.now() - startTime;
    }
    updateSignalMetrics(signal) {
        this.signalMetrics.totalSignals++;
        this.signalMetrics.validSignals++;
        const signalType = signal.signalType || 'unknown';
        this.signalMetrics.signalTypes.set(signalType, (this.signalMetrics.signalTypes.get(signalType) || 0) + 1);
        if (signal.intensity) {
            this.signalMetrics.averageIntensity = (this.signalMetrics.averageIntensity * (this.signalMetrics.validSignals - 1) +
                signal.intensity) / this.signalMetrics.validSignals;
        }
        if (signal.frequency) {
            this.signalMetrics.averageFrequency = (this.signalMetrics.averageFrequency * (this.signalMetrics.validSignals - 1) +
                signal.frequency) / this.signalMetrics.validSignals;
        }
    }
    updatePatternMetrics(analysis) {
        const patterns = analysis.patterns;
        if (patterns) {
            this.patternMetrics.patternsDetected += patterns.length;
            patterns.forEach((pattern) => {
                const patternType = pattern.type;
                this.patternMetrics.patternTypes.set(patternType, (this.patternMetrics.patternTypes.get(patternType) || 0) + 1);
                if (patternType === 'seasonal') {
                    this.patternMetrics.seasonalPatterns++;
                }
                else if (patternType === 'trend') {
                    this.patternMetrics.trendPatterns++;
                }
            });
        }
        if (analysis.confidence) {
            this.patternMetrics.patternConfidence = (this.patternMetrics.patternConfidence * (this.patternMetrics.patternsDetected - 1) +
                analysis.confidence) / this.patternMetrics.patternsDetected;
        }
    }
    checkAlerts() {
        const alerts = [];
        this.alertConditions.forEach(condition => {
            const value = this.getMetricValue(condition.metric);
            if (this.evaluateCondition(value, condition)) {
                alerts.push({
                    metric: condition.metric,
                    severity: condition.severity,
                    value
                });
            }
        });
        return alerts;
    }
    getMetricValue(metric) {
        switch (metric) {
            case 'signalProcessingTime':
                return this.performanceMetrics.signalProcessingTime;
            case 'invalidSignals':
                return this.signalMetrics.invalidSignals;
            case 'patternConfidence':
                return this.patternMetrics.patternConfidence;
            default:
                return 0;
        }
    }
    evaluateCondition(value, condition) {
        switch (condition.operator) {
            case '>':
                return value > condition.threshold;
            case '<':
                return value < condition.threshold;
            case '==':
                return value === condition.threshold;
            case '>=':
                return value >= condition.threshold;
            case '<=':
                return value <= condition.threshold;
            default:
                return false;
        }
    }
    getPerformanceReport() {
        return { ...this.performanceMetrics };
    }
    getSignalReport() {
        return { ...this.signalMetrics };
    }
    getPatternReport() {
        return { ...this.patternMetrics };
    }
    getUptime() {
        return Date.now() - this.startTime;
    }
    resetMetrics() {
        this.initializeMetrics();
        this.startTime = Date.now();
    }
    addMetrics(metrics) {
        this.metrics.push(metrics);
        if (this.metrics.length > this.MAX_METRICS_HISTORY) {
            this.metrics = this.metrics.slice(-this.MAX_METRICS_HISTORY);
        }
    }
    calculateAverage(numbers) {
        if (numbers.length === 0)
            return 0;
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }
    // Alert methods
    shouldAlertHighProcessingTime(metrics) {
        return metrics.signalProcessingTime > 1000; // Alert if processing takes more than 1 second
    }
    shouldAlertHighUpdateTime(metrics) {
        return metrics.ecosystemUpdateTime > 2000; // Alert if update takes more than 2 seconds
    }
    shouldAlertLowConfidence(metrics) {
        return metrics.confidence < 0.3; // Alert if confidence is below 30%
    }
    shouldAlertHighImpact(metrics) {
        return metrics.impact > 0.8; // Alert if impact is above 80%
    }
    shouldAlertEcosystemStatus(metrics) {
        return metrics.ecosystemStatus === 'unstable';
    }
    // Generate monitoring report
    generateReport() {
        const performance = this.getPerformanceReport();
        const recentMetrics = this.getRecentMetrics(5);
        const errorMetrics = this.getErrorMetrics();
        return `
Integration Monitoring Report
============================
Generated: ${new Date().toISOString()}

Performance Metrics:
------------------
Signal Processing Time: ${performance.signalProcessingTime.toFixed(2)}ms
Analysis Time: ${performance.analysisTime.toFixed(2)}ms
Ecosystem Update Time: ${performance.ecosystemUpdateTime.toFixed(2)}ms
Total Processing Time: ${performance.totalProcessingTime.toFixed(2)}ms

Recent Activity:
--------------
${recentMetrics.map(m => `
Signal Type: ${m.signalType}
Processing Time: ${m.signalProcessingTime}ms
Ecosystem Update Time: ${m.ecosystemUpdateTime}ms
Confidence: ${(m.confidence * 100).toFixed(2)}%
Impact: ${(m.impact * 100).toFixed(2)}%
Ecosystem Status: ${m.ecosystemStatus}
${m.error ? `Error: ${m.error}` : ''}
`).join('\n')}

Error Summary:
------------
Total Errors: ${errorMetrics.length}
${errorMetrics.length > 0 ? `
Recent Errors:
${errorMetrics.slice(-3).map(m => `
Time: ${m.timestamp.toISOString()}
Type: ${m.signalType}
Error: ${m.error}
`).join('\n')}` : 'No recent errors'}

System Health:
------------
Adaptation Level Trend: ${this.getAdaptationLevelTrend().slice(-5).map(v => v.toFixed(2)).join(' -> ')}
Confidence Trend: ${this.getConfidenceTrend().slice(-5).map(v => v.toFixed(2)).join(' -> ')}
Impact Trend: ${this.getImpactTrend().slice(-5).map(v => v.toFixed(2)).join(' -> ')}
`;
    }
    getAdaptationLevelTrend() {
        const recentMetrics = this.metrics.slice(-100); // Last 100 metrics
        return recentMetrics.map(m => m.adaptationLevel);
    }
    getConfidenceTrend() {
        const recentMetrics = this.metrics.slice(-100); // Last 100 metrics
        return recentMetrics.map(m => m.confidence);
    }
    getImpactTrend() {
        const recentMetrics = this.metrics.slice(-100); // Last 100 metrics
        return recentMetrics.map(m => m.impact);
    }
    getRecentMetrics(count = 10) {
        return this.metrics.slice(-count);
    }
    getMetricsByType(signalType) {
        return this.metrics.filter(m => m.signalType === signalType);
    }
    getErrorMetrics() {
        return this.metrics.filter(m => m.error);
    }
}
exports.IntegrationMonitor = IntegrationMonitor;
//# sourceMappingURL=IntegrationMonitor.js.map