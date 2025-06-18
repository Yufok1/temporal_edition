// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

import { WhaleAnalysisResult } from '../types/whale';
import { PoseidonSystem } from '../services/PoseidonSystem';
import { WhaleStewardSystem } from '../services/WhaleStewardSystem';

interface MonitoringMetrics {
    timestamp: Date;
    signalProcessingTime: number;
    ecosystemUpdateTime: number;
    signalType: string;
    confidence: number;
    impact: number;
    adaptationLevel: number;
    ecosystemStatus: string;
    error?: string;
}

interface PerformanceMetrics {
    signalProcessingTime: number;
    analysisTime: number;
    ecosystemUpdateTime: number;
    totalProcessingTime: number;
}

interface SignalMetrics {
    totalSignals: number;
    validSignals: number;
    invalidSignals: number;
    signalTypes: Map<string, number>;
    averageIntensity: number;
    averageFrequency: number;
}

interface PatternMetrics {
    patternsDetected: number;
    patternTypes: Map<string, number>;
    patternConfidence: number;
    seasonalPatterns: number;
    trendPatterns: number;
}

interface AlertCondition {
    metric: string;
    threshold: number;
    operator: '>' | '<' | '==' | '>=' | '<=';
    severity: 'warning' | 'error' | 'critical';
}

interface Pattern {
    type: string;
    confidence: number;
}

export class IntegrationMonitor {
    private metrics: MonitoringMetrics[] = [];
    private readonly MAX_METRICS_HISTORY = 1000;
    private readonly whaleSteward: WhaleStewardSystem;
    private readonly poseidonSystem: PoseidonSystem;
    private performanceMetrics!: PerformanceMetrics;
    private signalMetrics!: SignalMetrics;
    private patternMetrics!: PatternMetrics;
    private alertConditions!: AlertCondition[];
    private startTime: number;

    constructor(whaleSteward: WhaleStewardSystem, poseidonSystem: PoseidonSystem) {
        this.whaleSteward = whaleSteward;
        this.poseidonSystem = poseidonSystem;
        this.startTime = Date.now();
        this.initializeMetrics();
        this.setupAlertConditions();
    }

    private initializeMetrics(): void {
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

    private setupAlertConditions(): void {
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

    public async trackSignalProcessing(signal: any): Promise<void> {
        const startTime = Date.now();
        try {
            this.whaleSteward.handleIncomingWhaleSignal(signal);
            this.updateSignalMetrics(signal);
        } catch (error) {
            this.signalMetrics.invalidSignals++;
            throw error;
        }
        this.performanceMetrics.signalProcessingTime = Date.now() - startTime;
    }

    public async trackAnalysis(analysis: WhaleAnalysisResult): Promise<void> {
        const startTime = Date.now();
        try {
            await this.poseidonSystem.processWhaleAnalysis(analysis);
            this.updatePatternMetrics(analysis);
        } catch (error) {
            throw error;
        }
        this.performanceMetrics.analysisTime = Date.now() - startTime;
    }

    private updateSignalMetrics(signal: any): void {
        this.signalMetrics.totalSignals++;
        this.signalMetrics.validSignals++;

        const signalType = signal.signalType || 'unknown';
        this.signalMetrics.signalTypes.set(
            signalType,
            (this.signalMetrics.signalTypes.get(signalType) || 0) + 1
        );

        if (signal.intensity) {
            this.signalMetrics.averageIntensity = (
                this.signalMetrics.averageIntensity * (this.signalMetrics.validSignals - 1) +
                signal.intensity
            ) / this.signalMetrics.validSignals;
        }

        if (signal.frequency) {
            this.signalMetrics.averageFrequency = (
                this.signalMetrics.averageFrequency * (this.signalMetrics.validSignals - 1) +
                signal.frequency
            ) / this.signalMetrics.validSignals;
        }
    }

    private updatePatternMetrics(analysis: WhaleAnalysisResult): void {
        const patterns = (analysis as any).patterns as Pattern[];
        if (patterns) {
            this.patternMetrics.patternsDetected += patterns.length;
            patterns.forEach((pattern: Pattern) => {
                const patternType = pattern.type;
                this.patternMetrics.patternTypes.set(
                    patternType,
                    (this.patternMetrics.patternTypes.get(patternType) || 0) + 1
                );

                if (patternType === 'seasonal') {
                    this.patternMetrics.seasonalPatterns++;
                } else if (patternType === 'trend') {
                    this.patternMetrics.trendPatterns++;
                }
            });
        }

        if (analysis.confidence) {
            this.patternMetrics.patternConfidence = (
                this.patternMetrics.patternConfidence * (this.patternMetrics.patternsDetected - 1) +
                analysis.confidence
            ) / this.patternMetrics.patternsDetected;
        }
    }

    public checkAlerts(): { metric: string; severity: string; value: number }[] {
        const alerts: { metric: string; severity: string; value: number }[] = [];

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

    private getMetricValue(metric: string): number {
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

    private evaluateCondition(value: number, condition: AlertCondition): boolean {
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

    public getPerformanceReport(): PerformanceMetrics {
        return { ...this.performanceMetrics };
    }

    public getSignalReport(): SignalMetrics {
        return { ...this.signalMetrics };
    }

    public getPatternReport(): PatternMetrics {
        return { ...this.patternMetrics };
    }

    public getUptime(): number {
        return Date.now() - this.startTime;
    }

    public resetMetrics(): void {
        this.initializeMetrics();
        this.startTime = Date.now();
    }

    private addMetrics(metrics: MonitoringMetrics): void {
        this.metrics.push(metrics);
        if (this.metrics.length > this.MAX_METRICS_HISTORY) {
            this.metrics = this.metrics.slice(-this.MAX_METRICS_HISTORY);
        }
    }

    private calculateAverage(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    // Alert methods
    shouldAlertHighProcessingTime(metrics: MonitoringMetrics): boolean {
        return metrics.signalProcessingTime > 1000; // Alert if processing takes more than 1 second
    }

    shouldAlertHighUpdateTime(metrics: MonitoringMetrics): boolean {
        return metrics.ecosystemUpdateTime > 2000; // Alert if update takes more than 2 seconds
    }

    shouldAlertLowConfidence(metrics: MonitoringMetrics): boolean {
        return metrics.confidence < 0.3; // Alert if confidence is below 30%
    }

    shouldAlertHighImpact(metrics: MonitoringMetrics): boolean {
        return metrics.impact > 0.8; // Alert if impact is above 80%
    }

    shouldAlertEcosystemStatus(metrics: MonitoringMetrics): boolean {
        return metrics.ecosystemStatus === 'unstable';
    }

    // Generate monitoring report
    generateReport(): string {
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

    private getAdaptationLevelTrend(): number[] {
        const recentMetrics = this.metrics.slice(-100); // Last 100 metrics
        return recentMetrics.map(m => m.adaptationLevel);
    }

    private getConfidenceTrend(): number[] {
        const recentMetrics = this.metrics.slice(-100); // Last 100 metrics
        return recentMetrics.map(m => m.confidence);
    }

    private getImpactTrend(): number[] {
        const recentMetrics = this.metrics.slice(-100); // Last 100 metrics
        return recentMetrics.map(m => m.impact);
    }

    getRecentMetrics(count: number = 10): MonitoringMetrics[] {
        return this.metrics.slice(-count);
    }

    getMetricsByType(signalType: string): MonitoringMetrics[] {
        return this.metrics.filter(m => m.signalType === signalType);
    }

    getErrorMetrics(): MonitoringMetrics[] {
        return this.metrics.filter(m => m.error);
    }
} 