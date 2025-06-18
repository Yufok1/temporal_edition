import { EnvironmentalContext } from '../types/whale';

interface EnvironmentalAlert {
  type: 'temperature' | 'salinity' | 'pressure' | 'group';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  value: number;
  threshold: number;
}

interface EnvironmentalTrend {
  metric: string;
  values: number[];
  timestamps: Date[];
  trend: 'increasing' | 'decreasing' | 'stable';
  rateOfChange: number;
}

export class EnvironmentalMonitoringService {
  private readonly historySize: number = 1000; // Store last 1000 readings
  private environmentalHistory: EnvironmentalContext[] = [];
  private alerts: EnvironmentalAlert[] = [];
  private readonly alertThresholds = {
    temperature: { min: 10, max: 20, changeRate: 2 },
    salinity: { min: 30, max: 35, changeRate: 1 },
    pressure: { min: 0.5, max: 0.8, changeRate: 0.1 },
    groupSize: { min: 3, max: 8, changeRate: 2 }
  };

  public processEnvironmentalData(context: EnvironmentalContext): void {
    // Add to history
    this.environmentalHistory.push(context);
    if (this.environmentalHistory.length > this.historySize) {
      this.environmentalHistory.shift();
    }

    // Check for significant changes
    this.checkEnvironmentalChanges(context);
  }

  public getEnvironmentalTrends(): EnvironmentalTrend[] {
    const trends: EnvironmentalTrend[] = [];
    const metrics = ['temperature', 'salinity', 'pressure', 'groupSize'];

    metrics.forEach(metric => {
      const values = this.environmentalHistory.map(ctx => {
        switch (metric) {
          case 'temperature':
            return ctx.waterConditions.temperature;
          case 'salinity':
            return ctx.waterConditions.salinity;
          case 'pressure':
            return ctx.waterConditions.pressure;
          case 'groupSize':
            return ctx.socialContext.groupSize;
          default:
            return 0;
        }
      });

      const timestamps = this.environmentalHistory.map(ctx => new Date());
      const trend = this.calculateTrend(values);
      const rateOfChange = this.calculateRateOfChange(values);

      trends.push({
        metric,
        values,
        timestamps,
        trend,
        rateOfChange
      });
    });

    return trends;
  }

  public getActiveAlerts(): EnvironmentalAlert[] {
    // Remove alerts older than 1 hour
    const oneHourAgo = new Date(Date.now() - 3600000);
    this.alerts = this.alerts.filter(alert => alert.timestamp > oneHourAgo);
    return this.alerts;
  }

  public getEnvironmentalImpact(context: EnvironmentalContext): {
    socialStability: number;
    emotionalInfluence: number;
    recommendedActions: string[];
  } {
    const socialStability = this.calculateSocialStability(context);
    const emotionalInfluence = this.calculateEmotionalInfluence(context);
    const recommendedActions = this.generateRecommendations(context);

    return {
      socialStability,
      emotionalInfluence,
      recommendedActions
    };
  }

  private checkEnvironmentalChanges(context: EnvironmentalContext): void {
    // Check temperature
    if (context.waterConditions.temperature < this.alertThresholds.temperature.min) {
      this.addAlert('temperature', 'low', 'Temperature below optimal range');
    } else if (context.waterConditions.temperature > this.alertThresholds.temperature.max) {
      this.addAlert('temperature', 'high', 'Temperature above optimal range');
    }

    // Check salinity
    if (context.waterConditions.salinity < this.alertThresholds.salinity.min) {
      this.addAlert('salinity', 'low', 'Salinity below optimal range');
    } else if (context.waterConditions.salinity > this.alertThresholds.salinity.max) {
      this.addAlert('salinity', 'high', 'Salinity above optimal range');
    }

    // Check pressure
    if (context.waterConditions.pressure < this.alertThresholds.pressure.min) {
      this.addAlert('pressure', 'low', 'Pressure below optimal range');
    } else if (context.waterConditions.pressure > this.alertThresholds.pressure.max) {
      this.addAlert('pressure', 'high', 'Pressure above optimal range');
    }

    // Check group size
    if (context.socialContext.groupSize < this.alertThresholds.groupSize.min) {
      this.addAlert('group', 'low', 'Group size below optimal range');
    } else if (context.socialContext.groupSize > this.alertThresholds.groupSize.max) {
      this.addAlert('group', 'high', 'Group size above optimal range');
    }
  }

  private addAlert(
    type: EnvironmentalAlert['type'],
    severity: EnvironmentalAlert['severity'],
    message: string
  ): void {
    const context = this.environmentalHistory[this.environmentalHistory.length - 1];
    let value = 0;
    let threshold = 0;

    switch (type) {
      case 'temperature':
        value = context.waterConditions.temperature;
        threshold = severity === 'low' ? this.alertThresholds.temperature.min : this.alertThresholds.temperature.max;
        break;
      case 'salinity':
        value = context.waterConditions.salinity;
        threshold = severity === 'low' ? this.alertThresholds.salinity.min : this.alertThresholds.salinity.max;
        break;
      case 'pressure':
        value = context.waterConditions.pressure;
        threshold = severity === 'low' ? this.alertThresholds.pressure.min : this.alertThresholds.pressure.max;
        break;
      case 'group':
        value = context.socialContext.groupSize;
        threshold = severity === 'low' ? this.alertThresholds.groupSize.min : this.alertThresholds.groupSize.max;
        break;
    }

    this.alerts.push({
      type,
      severity,
      message,
      timestamp: new Date(),
      value,
      threshold
    });
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    const threshold = 0.1; // 10% change threshold

    if (Math.abs(difference) < threshold) return 'stable';
    return difference > 0 ? 'increasing' : 'decreasing';
  }

  private calculateRateOfChange(values: number[]): number {
    if (values.length < 2) return 0;

    const changes = [];
    for (let i = 1; i < values.length; i++) {
      changes.push(values[i] - values[i - 1]);
    }

    return changes.reduce((a, b) => a + b, 0) / changes.length;
  }

  private calculateSocialStability(context: EnvironmentalContext): number {
    // Calculate social stability based on environmental factors
    let stability = 1.0;

    // Temperature impact
    const tempDiff = Math.abs(context.waterConditions.temperature - 15); // Optimal temperature
    stability -= tempDiff * 0.05;

    // Salinity impact
    const salinityDiff = Math.abs(context.waterConditions.salinity - 32.5); // Optimal salinity
    stability -= salinityDiff * 0.03;

    // Pressure impact
    const pressureDiff = Math.abs(context.waterConditions.pressure - 0.65); // Optimal pressure
    stability -= pressureDiff * 0.1;

    // Group size impact
    const groupSizeDiff = Math.abs(context.socialContext.groupSize - 5); // Optimal group size
    stability -= groupSizeDiff * 0.05;

    return Math.max(0, Math.min(1, stability));
  }

  private calculateEmotionalInfluence(context: EnvironmentalContext): number {
    // Calculate how much the environment might influence emotions
    let influence = 0.5;

    // Temperature influence
    const tempDiff = Math.abs(context.waterConditions.temperature - 15);
    influence += tempDiff * 0.02;

    // Salinity influence
    const salinityDiff = Math.abs(context.waterConditions.salinity - 32.5);
    influence += salinityDiff * 0.01;

    // Pressure influence
    const pressureDiff = Math.abs(context.waterConditions.pressure - 0.65);
    influence += pressureDiff * 0.05;

    // Group size influence
    const groupSizeDiff = Math.abs(context.socialContext.groupSize - 5);
    influence += groupSizeDiff * 0.03;

    return Math.max(0, Math.min(1, influence));
  }

  private generateRecommendations(context: EnvironmentalContext): string[] {
    const recommendations: string[] = [];

    // Temperature recommendations
    if (context.waterConditions.temperature < this.alertThresholds.temperature.min) {
      recommendations.push('Consider moving to warmer waters');
    } else if (context.waterConditions.temperature > this.alertThresholds.temperature.max) {
      recommendations.push('Consider moving to cooler waters');
    }

    // Salinity recommendations
    if (context.waterConditions.salinity < this.alertThresholds.salinity.min) {
      recommendations.push('Monitor for signs of stress due to low salinity');
    } else if (context.waterConditions.salinity > this.alertThresholds.salinity.max) {
      recommendations.push('Monitor for signs of stress due to high salinity');
    }

    // Pressure recommendations
    if (context.waterConditions.pressure < this.alertThresholds.pressure.min) {
      recommendations.push('Consider moving to deeper waters');
    } else if (context.waterConditions.pressure > this.alertThresholds.pressure.max) {
      recommendations.push('Consider moving to shallower waters');
    }

    // Group size recommendations
    if (context.socialContext.groupSize < this.alertThresholds.groupSize.min) {
      recommendations.push('Consider facilitating social interactions with other groups');
    } else if (context.socialContext.groupSize > this.alertThresholds.groupSize.max) {
      recommendations.push('Consider splitting the group to reduce social stress');
    }

    return recommendations;
  }
} 