import { AnomalyDetectionResult, AnomalyAnalysisResult, SystemMetrics } from '../types';
export declare class AnomalyDetector {
    detectAnomalies(data: number[]): AnomalyDetectionResult;
    analyzeAnomalies(metrics: SystemMetrics[]): AnomalyAnalysisResult;
    private determineAnomalySeverity;
    private calculateMean;
    private calculateStandardDeviation;
}
