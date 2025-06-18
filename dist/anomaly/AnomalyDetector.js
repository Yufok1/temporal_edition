"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnomalyDetector = void 0;
class AnomalyDetector {
    detectAnomalies(data) {
        const mean = this.calculateMean(data);
        const stdDev = this.calculateStandardDeviation(data, mean);
        const threshold = 2.5; // Standard deviation threshold for anomaly detection
        const anomalies = [];
        for (let i = 0; i < data.length; i++) {
            const deviation = Math.abs(data[i] - mean) / stdDev;
            const isAnomaly = deviation > threshold;
            if (isAnomaly) {
                anomalies.push({
                    timestamp: Date.now() - (data.length - i) * 1000,
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
    analyzeAnomalies(metrics) {
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
    determineAnomalySeverity(anomalies) {
        if (anomalies.length === 0)
            return 'NONE';
        const maxDeviation = Math.max(...anomalies.map(a => a.deviation));
        if (maxDeviation >= 3.5)
            return 'CRITICAL';
        if (maxDeviation >= 3.0)
            return 'HIGH';
        if (maxDeviation >= 2.5)
            return 'MEDIUM';
        return 'LOW';
    }
    calculateMean(data) {
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }
    calculateStandardDeviation(data, mean) {
        const squareDiffs = data.map(value => {
            const diff = value - mean;
            return diff * diff;
        });
        const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    }
}
exports.AnomalyDetector = AnomalyDetector;
//# sourceMappingURL=AnomalyDetector.js.map