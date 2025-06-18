import { EventEmitter } from 'events';
import logger from '../logger';
import { metricsService } from '../utils/metrics';
import { SystemMetrics } from '../services/TemporalSequencer';
import { AnalysisResult } from '../types';
import { rugMetrics, rebMetrics, healthMetrics } from '../metrics/system-metrics';

export interface TemporalDataPoint {
    timestamp: Date;
    frequencyLevel: number;
    environmentalConditions: {
        ionization: number;
        gasLevel: number;
    };
    systemMetrics: SystemMetrics;
}

export interface TemporalAnalysis {
    timestamp: Date;
    dataPoints: TemporalDataPoint[];
    predictions: {
        frequencyTrend: number;
        environmentalTrend: number;
        ventingNeeded: boolean;
        estimatedVentingTime: Date;
    };
    recommendations: string[];
}

export class TemporalMonitoringService extends EventEmitter {
    private logger = logger;
    private dataPoints: Map<string, TemporalDataPoint[]> = new Map();
    private readonly MAX_DATA_POINTS = 1000;
    private readonly ANALYSIS_INTERVAL = 60000; // 1 minute
    private analysisInterval: NodeJS.Timeout | null = null;

    constructor() {
        super();
        this.initializeMetrics();
    }

    private initializeMetrics(): void {
        // Initialize RUG metrics
        rugMetrics.currentDepth.set(0);
        rugMetrics.stabilityScore.set(1.0);
        rugMetrics.acclimationProgress.set(0);

        // Initialize REB metrics
        rebMetrics.boundaryViolations.reset();
        rebMetrics.cooldownActive.set(0);
        rebMetrics.stabilityViolations.reset();

        // Initialize health metrics
        healthMetrics.cpuUsage.set(0);
        healthMetrics.memoryUsage.set(0);
        healthMetrics.uptime.set(0);
    }

    public startMonitoring(systemId: string): void {
        this.logger.info(`Starting temporal monitoring for system ${systemId}`);
        this.dataPoints.set(systemId, []);
        
        if (!this.analysisInterval) {
            this.analysisInterval = setInterval(() => {
                this.performTemporalAnalysis();
            }, this.ANALYSIS_INTERVAL);
        }
    }

    public stopMonitoring(systemId: string): void {
        this.logger.info(`Stopping temporal monitoring for system ${systemId}`);
        this.dataPoints.delete(systemId);
        
        if (this.dataPoints.size === 0 && this.analysisInterval) {
            clearInterval(this.analysisInterval);
            this.analysisInterval = null;
        }
    }

    public recordDataPoint(systemId: string, dataPoint: Omit<TemporalDataPoint, 'timestamp'>): void {
        const points = this.dataPoints.get(systemId) || [];
        const newDataPoint: TemporalDataPoint = {
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

    private updateMetrics(systemId: string, dataPoint: TemporalDataPoint): void {
        // Update RUG metrics
        rugMetrics.stabilityScore.set(this.calculateStabilityScore(dataPoint));
        rugMetrics.acclimationProgress.set(this.calculateAcclimationProgress(dataPoint));

        // Update health metrics
        const memoryUsage = process.memoryUsage();
        healthMetrics.cpuUsage.set(process.cpuUsage().user / 1000000); // Convert to percentage
        healthMetrics.memoryUsage.set(memoryUsage.heapUsed);
    }

    private calculateStabilityScore(dataPoint: TemporalDataPoint): number {
        const { frequencyLevel, environmentalConditions, systemMetrics } = dataPoint;
        
        // Calculate stability based on multiple factors
        const frequencyStability = 1 - Math.min(frequencyLevel / 100, 1);
        const environmentalStability = 1 - (
            (environmentalConditions.ionization + environmentalConditions.gasLevel) / 200
        );
        const systemStability = systemMetrics.stabilityIndex;

        return (frequencyStability + environmentalStability + systemStability) / 3;
    }

    private calculateAcclimationProgress(dataPoint: TemporalDataPoint): number {
        const { systemMetrics } = dataPoint;
        return systemMetrics.alignmentScore;
    }

    private async performTemporalAnalysis(): Promise<void> {
        for (const [systemId, points] of this.dataPoints.entries()) {
            if (points.length < 2) continue;

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

    private analyzeTemporalData(systemId: string, points: TemporalDataPoint[]): TemporalAnalysis {
        const latestPoint = points[points.length - 1];
        const frequencyTrend = this.calculateTrend(points.map(p => p.frequencyLevel));
        const environmentalTrend = this.calculateTrend(
            points.map(p => (p.environmentalConditions.ionization + p.environmentalConditions.gasLevel) / 2)
        );

        const ventingNeeded = this.determineVentingNeeded(frequencyTrend, environmentalTrend);
        const estimatedVentingTime = this.estimateVentingTime(points, frequencyTrend);

        const recommendations = this.generateRecommendations(
            frequencyTrend,
            environmentalTrend,
            ventingNeeded
        );

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

    private calculateTrend(values: number[]): number {
        if (values.length < 2) return 0;
        
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

    private determineVentingNeeded(frequencyTrend: number, environmentalTrend: number): boolean {
        return frequencyTrend > 0.1 || environmentalTrend > 0.1;
    }

    private estimateVentingTime(points: TemporalDataPoint[], frequencyTrend: number): Date {
        const latestPoint = points[points.length - 1];
        const currentLevel = latestPoint.frequencyLevel;
        const threshold = 80; // Example threshold
        
        if (frequencyTrend <= 0) return new Date(Date.now() + 3600000); // No venting needed soon
        
        const timeToThreshold = (threshold - currentLevel) / frequencyTrend;
        return new Date(Date.now() + timeToThreshold * 60000); // Convert to milliseconds
    }

    private generateRecommendations(
        frequencyTrend: number,
        environmentalTrend: number,
        ventingNeeded: boolean
    ): string[] {
        const recommendations: string[] = [];

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