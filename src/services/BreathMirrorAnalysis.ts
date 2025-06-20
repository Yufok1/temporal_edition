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

import { EventEmitter } from 'events';
import { createLogger } from '../utils/logger';
import { SystemMetrics, AlignmentStage } from './TemporalSequencer';

// Browser-safe logger interface
interface Logger {
    error: (message: string, metadata?: any) => void;
    warn: (message: string, metadata?: any) => void;
    info: (message: string, metadata?: any) => void;
    debug: (message: string, metadata?: any) => void;
}

export interface AnalysisResult {
    timestamp: Date;
    systemId: string;
    metrics: SystemMetrics;
    recommendations: string[];
    warnings: string[];
    alignmentProgress: number;
}

export interface AnalysisConfig {
    stabilityThreshold: number;
    performanceThreshold: number;
    alignmentThreshold: number;
    checkInterval: number;
}

export class BreathMirrorAnalysis extends EventEmitter {
    private logger: Logger;
    private config: AnalysisConfig;
    private analysisResults: Map<string, AnalysisResult[]>;
    private analysisIntervals: Map<string, NodeJS.Timeout>;

    constructor(config: Partial<AnalysisConfig> = {}) {
        super();
        this.logger = createLogger('BreathMirrorAnalysis');
        this.config = {
            stabilityThreshold: config.stabilityThreshold ?? 0.8,
            performanceThreshold: config.performanceThreshold ?? 0.7,
            alignmentThreshold: config.alignmentThreshold ?? 0.9,
            checkInterval: config.checkInterval ?? 5000
        };
        this.analysisResults = new Map();
        this.analysisIntervals = new Map();
    }

    public startAnalysis(systemId: string, initialMetrics: SystemMetrics): void {
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

    public stopAnalysis(systemId: string): void {
        const interval = this.analysisIntervals.get(systemId);
        if (interval) {
            clearInterval(interval);
            this.analysisIntervals.delete(systemId);
            this.logger.info(`Stopped analysis for system ${systemId}`);
        }
    }

    public updateMetrics(systemId: string, metrics: SystemMetrics): void {
        this.performAnalysis(systemId, metrics);
    }

    private performAnalysis(systemId: string, metrics: SystemMetrics): void {
        const recommendations: string[] = [];
        const warnings: string[] = [];

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

        const result: AnalysisResult = {
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

    private calculateAlignmentProgress(metrics: SystemMetrics): number {
        const weights = {
            alignmentScore: 0.4,
            stabilityIndex: 0.3,
            performance: 0.3
        };

        const performanceScore = 1 - metrics.performanceMetrics.errorRate;
        
        return (
            metrics.alignmentScore * weights.alignmentScore +
            metrics.stabilityIndex * weights.stabilityIndex +
            performanceScore * weights.performance
        );
    }

    public getAnalysisHistory(systemId: string): AnalysisResult[] {
        return this.analysisResults.get(systemId) || [];
    }

    public getLatestAnalysis(systemId: string): AnalysisResult | undefined {
        const results = this.analysisResults.get(systemId);
        return results ? results[results.length - 1] : undefined;
    }

    public updateConfig(newConfig: Partial<AnalysisConfig>): void {
        this.config = {
            ...this.config,
            ...newConfig
        };
        this.logger.info('Analysis configuration updated', { newConfig });
    }
} 