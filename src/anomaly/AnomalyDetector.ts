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

import {
    AnomalyPoint,
    AnomalyDetectionResult,
    AnomalyAnalysisResult,
    SystemMetrics,
    AlertSeverity
} from '../types';

export class AnomalyDetector {
    public detectAnomalies(data: number[]): AnomalyDetectionResult {
        const mean = this.calculateMean(data);
        const stdDev = this.calculateStandardDeviation(data, mean);
        const threshold = 2.5; // Standard deviation threshold for anomaly detection
        
        const anomalies: AnomalyPoint[] = [];
        
        for (let i = 0; i < data.length; i++) {
            const deviation = Math.abs(data[i] - mean) / stdDev;
            const isAnomaly = deviation > threshold;
            
            if (isAnomaly) {
                anomalies.push({
                    timestamp: Date.now() - (data.length - i) * 1000, // Approximate timestamp
                    value: data[i],
                    deviation,
                    threshold,
                    isAnomaly
                });
            }
        }
        
        return {
            anomalies,
            mean,
            stdDev,
            threshold
        };
    }

    public analyzeAnomalies(metrics: SystemMetrics[]): AnomalyAnalysisResult {
        const values = metrics.map(m => m.value);
        const detectionResult = this.detectAnomalies(values);
        
        const severity = this.determineAnomalySeverity(detectionResult.anomalies);
        
        return {
            isAnomaly: detectionResult.anomalies.length > 0,
            score: detectionResult.anomalies.reduce((sum, a) => sum + a.deviation, 0) / detectionResult.anomalies.length,
            threshold: detectionResult.threshold,
            severity,
            anomalies: detectionResult.anomalies,
            mean: detectionResult.mean,
            stdDev: detectionResult.stdDev
        };
    }

    private determineAnomalySeverity(anomalies: AnomalyPoint[]): AlertSeverity {
        if (anomalies.length === 0) return 'NONE';
        
        const maxDeviation = Math.max(...anomalies.map(a => a.deviation));
        
        if (maxDeviation >= 3.5) return 'CRITICAL';
        if (maxDeviation >= 3.0) return 'HIGH';
        if (maxDeviation >= 2.5) return 'MEDIUM';
        return 'LOW';
    }

    private calculateMean(data: number[]): number {
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }

    private calculateStandardDeviation(data: number[], mean: number): number {
        const squareDiffs = data.map(value => {
            const diff = value - mean;
            return diff * diff;
        });
        const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    }
} 