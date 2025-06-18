import { EnvironmentalContext, EmotionalAnalysis } from '../types/whale';

interface Prediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  timeHorizon: number; // hours
  factors: {
    name: string;
    influence: number;
  }[];
}

interface ForecastPoint {
  timestamp: Date;
  value: number;
  confidence: number;
}

interface MetricForecast {
  metric: string;
  points: ForecastPoint[];
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

export class PredictiveAnalysisService {
  private readonly maxDataPoints = 1000;
  private readonly predictionHorizon = 24; // hours
  private readonly minDataPoints = 24; // minimum data points needed for prediction

  public generatePredictions(
    historicalData: { timestamp: Date; environmentalContext: EnvironmentalContext; emotionalAnalysis: EmotionalAnalysis }[]
  ): Prediction[] {
    if (historicalData.length < this.minDataPoints) {
      return [];
    }

    const predictions: Prediction[] = [];
    const metrics = ['temperature', 'salinity', 'pressure', 'groupSize'];

    metrics.forEach(metric => {
      const values = historicalData.map(point => this.getMetricValue(point.environmentalContext, metric));
      const timestamps = historicalData.map(point => point.timestamp);

      const { slope, intercept, confidence } = this.performLinearRegression(timestamps, values);
      const currentValue = values[values.length - 1];
      const predictedValue = this.predictValue(slope, intercept, timestamps[timestamps.length - 1], this.predictionHorizon);

      predictions.push({
        metric,
        currentValue,
        predictedValue,
        confidence,
        trend: this.determineTrend(slope),
        timeHorizon: this.predictionHorizon,
        factors: this.analyzeInfluencingFactors(metric, historicalData)
      });
    });

    return predictions;
  }

  public generateForecast(
    historicalData: { timestamp: Date; environmentalContext: EnvironmentalContext; emotionalAnalysis: EmotionalAnalysis }[],
    metric: string,
    hours: number = 24
  ): ForecastPoint[] {
    if (historicalData.length < this.minDataPoints) {
      return [];
    }

    const values = historicalData.map(point => this.getMetricValue(point.environmentalContext, metric));
    const timestamps = historicalData.map(point => point.timestamp);
    const { slope, intercept, confidence } = this.performLinearRegression(timestamps, values);

    const forecast: ForecastPoint[] = [];
    const lastTimestamp = timestamps[timestamps.length - 1];
    const lastValue = values[values.length - 1];

    // Generate forecast points
    for (let i = 1; i <= hours; i++) {
      const forecastTimestamp = new Date(lastTimestamp.getTime() + i * 60 * 60 * 1000);
      const predictedValue = this.predictValue(slope, intercept, lastTimestamp, i);
      
      // Adjust confidence based on time horizon
      const timeConfidence = Math.max(0, 1 - (i / hours));
      const pointConfidence = confidence * timeConfidence;

      forecast.push({
        timestamp: forecastTimestamp,
        value: predictedValue,
        confidence: pointConfidence
      });
    }

    return forecast;
  }

  private getMetricValue(context: EnvironmentalContext, metric: string): number {
    switch (metric) {
      case 'temperature':
        return context.waterConditions.temperature;
      case 'salinity':
        return context.waterConditions.salinity;
      case 'pressure':
        return context.waterConditions.pressure;
      case 'groupSize':
        return context.socialContext.groupSize;
      default:
        return 0;
    }
  }

  private performLinearRegression(
    timestamps: Date[],
    values: number[]
  ): { slope: number; intercept: number; confidence: number } {
    const n = timestamps.length;
    const x = timestamps.map(t => t.getTime());
    const y = values;

    // Calculate means
    const xMean = x.reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;

    // Calculate slope and intercept
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Calculate R-squared for confidence
    let ssTotal = 0;
    let ssResidual = 0;

    for (let i = 0; i < n; i++) {
      const predicted = slope * x[i] + intercept;
      ssTotal += Math.pow(y[i] - yMean, 2);
      ssResidual += Math.pow(y[i] - predicted, 2);
    }

    const rSquared = 1 - (ssResidual / ssTotal);
    const confidence = Math.max(0, Math.min(1, rSquared));

    return { slope, intercept, confidence };
  }

  private predictValue(
    slope: number,
    intercept: number,
    lastTimestamp: Date,
    hoursAhead: number
  ): number {
    const futureTimestamp = new Date(lastTimestamp.getTime() + hoursAhead * 60 * 60 * 1000);
    return slope * futureTimestamp.getTime() + intercept;
  }

  private determineTrend(slope: number): 'increasing' | 'decreasing' | 'stable' {
    if (Math.abs(slope) < 0.0001) return 'stable';
    return slope > 0 ? 'increasing' : 'decreasing';
  }

  private analyzeInfluencingFactors(
    metric: string,
    historicalData: { timestamp: Date; environmentalContext: EnvironmentalContext; emotionalAnalysis: EmotionalAnalysis }[]
  ): { name: string; influence: number }[] {
    const factors: { name: string; influence: number }[] = [];
    const otherMetrics = ['temperature', 'salinity', 'pressure', 'groupSize'].filter(m => m !== metric);

    const metricValues = historicalData.map(point => this.getMetricValue(point.environmentalContext, metric));

    otherMetrics.forEach(otherMetric => {
      const otherValues = historicalData.map(point => 
        this.getMetricValue(point.environmentalContext, otherMetric)
      );
      const correlation = this.calculateCorrelation(metricValues, otherValues);
      
      if (Math.abs(correlation) > 0.3) {
        factors.push({
          name: otherMetric,
          influence: correlation
        });
      }
    });

    // Sort by absolute influence
    return factors.sort((a, b) => Math.abs(b.influence) - Math.abs(a.influence));
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }
} 