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

import { EnvironmentalContext, EmotionalAnalysis } from '../types/whale';

interface HistoricalDataPoint {
  timestamp: Date;
  environmentalContext: EnvironmentalContext;
  emotionalAnalysis: EmotionalAnalysis;
}

interface TrendAnalysis {
  metric: string;
  values: number[];
  timestamps: Date[];
  trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  confidence: number;
  correlation: {
    metric: string;
    coefficient: number;
  }[];
  seasonality?: {
    period: number;
    strength: number;
  };
}

interface PatternInsight {
  type: 'correlation' | 'seasonality' | 'threshold' | 'anomaly';
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export class HistoricalAnalysisService {
  private historicalData: HistoricalDataPoint[] = [];
  private readonly maxDataPoints = 1000; // Store last 1000 data points

  public addDataPoint(environmentalContext: EnvironmentalContext, emotionalAnalysis: EmotionalAnalysis): void {
    this.historicalData.push({
      timestamp: new Date(),
      environmentalContext,
      emotionalAnalysis
    });

    // Maintain data size limit
    if (this.historicalData.length > this.maxDataPoints) {
      this.historicalData.shift();
    }
  }

  public analyzeTrends(): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];

    // Analyze environmental metrics
    const environmentalMetrics = [
      'temperature',
      'salinity',
      'pressure',
      'groupSize'
    ];

    environmentalMetrics.forEach(metric => {
      const values = this.historicalData.map(point => 
        this.getMetricValue(point.environmentalContext, metric)
      );
      const timestamps = this.historicalData.map(point => point.timestamp);

      const trend = this.calculateTrend(values);
      const confidence = this.calculateConfidence(values, trend);
      const correlations = this.findCorrelations(metric, values);

      trends.push({
        metric,
        values,
        timestamps,
        trend,
        confidence,
        correlation: correlations,
        seasonality: this.detectSeasonality(values, timestamps)
      });
    });

    return trends;
  }

  public detectPatterns(): PatternInsight[] {
    const insights: PatternInsight[] = [];
    const trends = this.analyzeTrends();

    // Analyze correlations between metrics
    trends.forEach(trend => {
      trend.correlation.forEach(corr => {
        if (Math.abs(corr.coefficient) > 0.7) {
          insights.push({
            type: 'correlation',
            description: `Strong ${corr.coefficient > 0 ? 'positive' : 'negative'} correlation between ${trend.metric} and ${corr.metric}`,
            confidence: Math.abs(corr.coefficient),
            impact: 'high',
            recommendations: this.generateCorrelationRecommendations(trend.metric, corr.metric)
          });
        }
      });
    });

    // Detect seasonal patterns
    trends.forEach(trend => {
      if (trend.seasonality && trend.seasonality.strength > 0.6) {
        insights.push({
          type: 'seasonality',
          description: `Strong seasonal pattern detected in ${trend.metric} with period of ${trend.seasonality.period} hours`,
          confidence: trend.seasonality.strength,
          impact: 'medium',
          recommendations: this.generateSeasonalityRecommendations(trend.metric, trend.seasonality.period)
        });
      }
    });

    // Detect anomalies
    trends.forEach(trend => {
      const anomalies = this.detectAnomalies(trend.values);
      anomalies.forEach(anomaly => {
        insights.push({
          type: 'anomaly',
          description: `Unusual ${trend.metric} value detected: ${anomaly.value} (${anomaly.deviation} standard deviations from mean)`,
          confidence: 1 - anomaly.deviation / 3, // Normalize to 0-1 range
          impact: 'high',
          recommendations: this.generateAnomalyRecommendations(trend.metric, anomaly)
        });
      });
    });

    return insights;
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

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' | 'fluctuating' {
    if (values.length < 2) return 'stable';

    const changes = values.slice(1).map((value, i) => value - values[i]);
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / changes.length;

    if (Math.abs(avgChange) < 0.1) return 'stable';
    if (variance > 1) return 'fluctuating';
    return avgChange > 0 ? 'increasing' : 'decreasing';
  }

  private calculateConfidence(values: number[], trend: string): number {
    if (values.length < 2) return 0;

    const changes = values.slice(1).map((value, i) => value - values[i]);
    const variance = changes.reduce((sum, change) => sum + Math.pow(change, 2), 0) / changes.length;
    
    // Higher confidence for stable trends with low variance
    if (trend === 'stable') {
      return Math.max(0, 1 - variance);
    }
    
    // Higher confidence for clear trends with consistent changes
    return Math.max(0, 1 - variance / 2);
  }

  private findCorrelations(metric: string, values: number[]): { metric: string; coefficient: number }[] {
    const correlations: { metric: string; coefficient: number }[] = [];
    const otherMetrics = ['temperature', 'salinity', 'pressure', 'groupSize'].filter(m => m !== metric);

    otherMetrics.forEach(otherMetric => {
      const otherValues = this.historicalData.map(point => 
        this.getMetricValue(point.environmentalContext, otherMetric)
      );
      const coefficient = this.calculateCorrelation(values, otherValues);
      correlations.push({ metric: otherMetric, coefficient });
    });

    return correlations;
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

  private detectSeasonality(values: number[], timestamps: Date[]): { period: number; strength: number } | undefined {
    if (values.length < 24) return undefined; // Need at least 24 data points

    // Simple seasonality detection using autocorrelation
    const maxLag = Math.min(24, values.length - 1);
    const autocorrelations = Array(maxLag).fill(0).map((_, lag) => {
      const correlation = this.calculateCorrelation(
        values.slice(0, -lag),
        values.slice(lag)
      );
      return { lag, correlation };
    });

    // Find the lag with highest positive correlation
    const bestLag = autocorrelations.reduce((best, current) => 
      current.correlation > best.correlation ? current : best
    );

    if (bestLag.correlation > 0.5) {
      return {
        period: bestLag.lag,
        strength: bestLag.correlation
      };
    }

    return undefined;
  }

  private detectAnomalies(values: number[]): { value: number; deviation: number }[] {
    if (values.length < 2) return [];

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );

    return values
      .map((value, index) => ({
        value,
        deviation: Math.abs(value - mean) / stdDev
      }))
      .filter(anomaly => anomaly.deviation > 2); // More than 2 standard deviations
  }

  private generateCorrelationRecommendations(metric1: string, metric2: string): string[] {
    return [
      `Monitor ${metric1} and ${metric2} together for early warning signs`,
      `Consider adjusting ${metric1} when ${metric2} shows significant changes`,
      `Document the relationship between ${metric1} and ${metric2} for future reference`
    ];
  }

  private generateSeasonalityRecommendations(metric: string, period: number): string[] {
    return [
      `Prepare for regular ${period}-hour cycles in ${metric}`,
      `Adjust monitoring frequency to capture ${metric} patterns`,
      `Consider implementing automated responses to ${metric} cycles`
    ];
  }

  private generateAnomalyRecommendations(metric: string, anomaly: { value: number; deviation: number }): string[] {
    return [
      `Investigate the cause of unusual ${metric} value: ${anomaly.value.toFixed(2)}`,
      `Check for equipment malfunctions or environmental disturbances`,
      `Document the anomaly and any associated behavioral changes`,
      `Consider implementing additional monitoring for ${metric}`
    ];
  }
} 