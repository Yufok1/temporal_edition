import { EnvironmentalContext, EmotionalAnalysis } from '../types/whale';

interface TimeSeriesData {
  timestamp: Date;
  value: number;
  confidence: number;
}

interface PredictionModel {
  type: 'regression' | 'timeSeries';
  metrics: {
    accuracy: number;
    confidence: number;
    error: number;
  };
  lastUpdated: Date;
}

interface MLPrediction {
  value: number;
  confidence: number;
  factors: {
    name: string;
    influence: number;
    confidence: number;
  }[];
  model: PredictionModel;
}

export class MachineLearningService {
  private readonly maxDataPoints = 1000;
  private readonly minDataPoints = 24;
  private historicalData: {
    timestamp: Date;
    environmentalContext: EnvironmentalContext;
    emotionalAnalysis: EmotionalAnalysis;
  }[] = [];

  private models: Map<string, PredictionModel> = new Map();

  constructor() {
    // Initialize models for different metrics
    ['temperature', 'salinity', 'pressure', 'groupSize'].forEach(metric => {
      this.models.set(metric, {
        type: 'timeSeries',
        metrics: {
          accuracy: 0.85,
          confidence: 0.8,
          error: 0.15
        },
        lastUpdated: new Date()
      });
    });
  }

  public addDataPoint(
    environmentalContext: EnvironmentalContext,
    emotionalAnalysis: EmotionalAnalysis
  ): void {
    this.historicalData.push({
      timestamp: new Date(),
      environmentalContext,
      emotionalAnalysis
    });

    if (this.historicalData.length > this.maxDataPoints) {
      this.historicalData.shift();
    }

    // Update models if we have enough data
    if (this.historicalData.length >= this.minDataPoints) {
      this.updateModels();
    }
  }

  public generatePrediction(metric: string, horizon: number = 24): MLPrediction {
    if (this.historicalData.length < this.minDataPoints) {
      throw new Error('Insufficient data for prediction');
    }

    const model = this.models.get(metric);
    if (!model) {
      throw new Error(`No model available for metric: ${metric}`);
    }

    const timeSeriesData = this.prepareTimeSeriesData(metric);
    const prediction = this.predictValue(timeSeriesData, model, horizon);
    const factors = this.analyzeInfluencingFactors(metric);

    return {
      value: prediction.value,
      confidence: prediction.confidence,
      factors,
      model
    };
  }

  private prepareTimeSeriesData(metric: string): TimeSeriesData[] {
    return this.historicalData.map(point => ({
      timestamp: point.timestamp,
      value: this.getMetricValue(point.environmentalContext, metric),
      confidence: 0.9 // Base confidence, could be adjusted based on data quality
    }));
  }

  private predictValue(
    timeSeriesData: TimeSeriesData[],
    model: PredictionModel,
    horizon: number
  ): { value: number; confidence: number } {
    // Implement time series prediction using exponential smoothing
    const alpha = 0.3; // Smoothing factor
    const values = timeSeriesData.map(d => d.value);
    const lastValue = values[values.length - 1];
    const trend = this.calculateTrend(values);

    // Simple exponential smoothing with trend
    const predictedValue = lastValue + (trend * horizon);
    const confidence = this.calculateConfidence(timeSeriesData, model);

    return {
      value: predictedValue,
      confidence
    };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const xMean = (values.length - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / values.length;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < values.length; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += Math.pow(i - xMean, 2);
    }

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateConfidence(
    timeSeriesData: TimeSeriesData[],
    model: PredictionModel
  ): number {
    // Calculate confidence based on data quality and model performance
    const dataQuality = this.assessDataQuality(timeSeriesData);
    const modelPerformance = model.metrics.confidence;
    
    return Math.min(dataQuality, modelPerformance);
  }

  private assessDataQuality(timeSeriesData: TimeSeriesData[]): number {
    // Assess data quality based on completeness and consistency
    const completeness = timeSeriesData.length / this.maxDataPoints;
    const consistency = this.calculateDataConsistency(timeSeriesData);
    
    return (completeness + consistency) / 2;
  }

  private calculateDataConsistency(timeSeriesData: TimeSeriesData[]): number {
    // Calculate data consistency based on variance and gaps
    const values = timeSeriesData.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    
    // Normalize variance to a 0-1 scale (lower is better)
    const normalizedVariance = Math.min(variance / mean, 1);
    return 1 - normalizedVariance;
  }

  private analyzeInfluencingFactors(metric: string): {
    name: string;
    influence: number;
    confidence: number;
  }[] {
    const factors: { [key: string]: number[] } = {};
    const metricValues: number[] = [];

    // Collect data for correlation analysis
    this.historicalData.forEach(point => {
      metricValues.push(this.getMetricValue(point.environmentalContext, metric));
      
      // Analyze other metrics as potential factors
      ['temperature', 'salinity', 'pressure', 'groupSize'].forEach(otherMetric => {
        if (otherMetric !== metric) {
          if (!factors[otherMetric]) {
            factors[otherMetric] = [];
          }
          factors[otherMetric].push(
            this.getMetricValue(point.environmentalContext, otherMetric)
          );
        }
      });
    });

    // Calculate correlations and influences
    return Object.entries(factors).map(([name, values]) => {
      const correlation = this.calculateCorrelation(metricValues, values);
      return {
        name,
        influence: correlation,
        confidence: Math.abs(correlation) // Use absolute correlation as confidence
      };
    }).sort((a, b) => Math.abs(b.influence) - Math.abs(a.influence));
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;

    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }

    if (xDenominator === 0 || yDenominator === 0) return 0;
    return numerator / Math.sqrt(xDenominator * yDenominator);
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

  private updateModels(): void {
    // Update model metrics based on recent predictions
    this.models.forEach((model, metric) => {
      const recentData = this.historicalData.slice(-this.minDataPoints);
      const predictions = recentData.map((_, i) => {
        if (i === 0) return null;
        const historicalData = recentData.slice(0, i);
        return this.predictValue(
          this.prepareTimeSeriesData(metric),
          model,
          1
        );
      }).filter(Boolean);

      // Calculate new model metrics
      const actualValues = recentData.map(point =>
        this.getMetricValue(point.environmentalContext, metric)
      );
      const errors = predictions.map((p, i) =>
        Math.abs(p!.value - actualValues[i + 1])
      );
      const meanError = errors.reduce((a, b) => a + b, 0) / errors.length;

      model.metrics = {
        accuracy: 1 - meanError,
        confidence: 1 - (meanError / Math.max(...actualValues)),
        error: meanError
      };
      model.lastUpdated = new Date();
    });
  }
} 