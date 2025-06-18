"use strict";
exports.__esModule = true;
exports.AnomalyDetector = void 0;
var AnomalyDetector = /** @class */ (function () {
    function AnomalyDetector() {
    }
    AnomalyDetector.prototype.detectAnomalies = function (data) {
        var mean = this.calculateMean(data);
        var stdDev = this.calculateStandardDeviation(data, mean);
        var threshold = 2.5; // Standard deviation threshold for anomaly detection
        var anomalies = [];
        for (var i = 0; i < data.length; i++) {
            var deviation = Math.abs(data[i] - mean) / stdDev;
            var isAnomaly = deviation > threshold;
            if (isAnomaly) {
                anomalies.push({
                    timestamp: Date.now() - (data.length - i) * 1000,
                    value: data[i],
                    deviation: deviation,
                    threshold: threshold,
                    isAnomaly: isAnomaly
                });
            }
        }
        return {
            anomalies: anomalies,
            mean: mean,
            stdDev: stdDev,
            threshold: threshold
        };
    };
    AnomalyDetector.prototype.analyzeAnomalies = function (metrics) {
        var values = metrics.map(function (m) { return m.value; });
        var detectionResult = this.detectAnomalies(values);
        var severity = this.determineAnomalySeverity(detectionResult.anomalies);
        return {
            isAnomaly: detectionResult.anomalies.length > 0,
            score: detectionResult.anomalies.reduce(function (sum, a) { return sum + a.deviation; }, 0) / detectionResult.anomalies.length,
            threshold: detectionResult.threshold,
            severity: severity,
            anomalies: detectionResult.anomalies,
            mean: detectionResult.mean,
            stdDev: detectionResult.stdDev
        };
    };
    AnomalyDetector.prototype.determineAnomalySeverity = function (anomalies) {
        if (anomalies.length === 0)
            return 'NONE';
        var maxDeviation = Math.max.apply(Math, anomalies.map(function (a) { return a.deviation; }));
        if (maxDeviation >= 3.5)
            return 'CRITICAL';
        if (maxDeviation >= 3.0)
            return 'HIGH';
        if (maxDeviation >= 2.5)
            return 'MEDIUM';
        return 'LOW';
    };
    AnomalyDetector.prototype.calculateMean = function (data) {
        return data.reduce(function (sum, val) { return sum + val; }, 0) / data.length;
    };
    AnomalyDetector.prototype.calculateStandardDeviation = function (data, mean) {
        var squareDiffs = data.map(function (value) {
            var diff = value - mean;
            return diff * diff;
        });
        var avgSquareDiff = squareDiffs.reduce(function (sum, val) { return sum + val; }, 0) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    };
    return AnomalyDetector;
}());
exports.AnomalyDetector = AnomalyDetector;
