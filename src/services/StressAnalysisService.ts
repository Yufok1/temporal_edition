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

import { EmotionalAnalysis, EnvironmentalContext } from '../types/whale';

interface StressFactors {
  environmental: number;
  social: number;
  emotional: number;
  physical: number;
}

interface SocialBondingMetrics {
  groupCohesion: number;
  individualConnections: number;
  interactionQuality: number;
  trustLevel: number;
}

interface StressPrediction {
  currentStressLevel: number;
  predictedStressLevel: number;
  stressFactors: StressFactors;
  mitigationStrategies: string[];
  confidence: number;
}

interface SocialBondingAnalysis {
  metrics: SocialBondingMetrics;
  bondingTrend: 'strengthening' | 'stable' | 'weakening';
  recommendedActions: string[];
  confidence: number;
}

export class StressAnalysisService {
  private static readonly STRESS_THRESHOLD = 0.7;
  private static readonly BONDING_THRESHOLD = 0.6;

  static analyzeStress(
    emotionalAnalysis: EmotionalAnalysis,
    environmentalContext: EnvironmentalContext
  ): StressPrediction {
    const stressFactors = this.calculateStressFactors(emotionalAnalysis, environmentalContext);
    const currentStressLevel = this.calculateOverallStressLevel(stressFactors);
    const predictedStressLevel = this.predictFutureStressLevel(currentStressLevel, stressFactors);

    return {
      currentStressLevel,
      predictedStressLevel,
      stressFactors,
      mitigationStrategies: this.generateMitigationStrategies(stressFactors),
      confidence: this.calculateConfidence(stressFactors)
    };
  }

  static analyzeSocialBonding(
    emotionalAnalysis: EmotionalAnalysis,
    environmentalContext: EnvironmentalContext
  ): SocialBondingAnalysis {
    const metrics = this.calculateSocialBondingMetrics(emotionalAnalysis, environmentalContext);
    const bondingTrend = this.determineBondingTrend(metrics);

    return {
      metrics,
      bondingTrend,
      recommendedActions: this.generateBondingRecommendations(metrics, bondingTrend),
      confidence: this.calculateBondingConfidence(metrics)
    };
  }

  private static calculateStressFactors(
    emotionalAnalysis: EmotionalAnalysis,
    environmentalContext: EnvironmentalContext
  ): StressFactors {
    const { waterConditions, socialContext } = environmentalContext;
    
    // Calculate environmental stress based on water conditions
    const environmentalStress = this.calculateEnvironmentalStress(waterConditions);
    
    // Calculate social stress based on group dynamics
    const socialStress = this.calculateSocialStress(socialContext);
    
    // Calculate emotional stress based on emotional analysis
    const emotionalStress = this.calculateEmotionalStress(emotionalAnalysis);
    
    // Calculate physical stress (placeholder for now)
    const physicalStress = 0.3;

    return {
      environmental: environmentalStress,
      social: socialStress,
      emotional: emotionalStress,
      physical: physicalStress
    };
  }

  private static calculateEnvironmentalStress(waterConditions: EnvironmentalContext['waterConditions']): number {
    const { temperature, salinity, pressure } = waterConditions;
    
    // Normalize and weight environmental factors
    const tempStress = Math.abs(temperature - 20) / 20; // Assuming 20°C is optimal
    const salinityStress = Math.abs(salinity - 35) / 35; // Assuming 35 ppt is optimal
    const pressureStress = Math.abs(pressure - 1) / 1; // Assuming 1 atm is optimal
    
    return (tempStress + salinityStress + pressureStress) / 3;
  }

  private static calculateSocialStress(socialContext: EnvironmentalContext['socialContext']): number {
    const { groupSize, proximity } = socialContext;
    
    // Calculate social stress based on group size and proximity
    const groupSizeStress = Math.abs(groupSize - 3) / 3; // Assuming 3 is optimal group size
    const proximityStress = Math.abs(proximity - 0.5) / 0.5; // Assuming 0.5 is optimal proximity
    
    return (groupSizeStress + proximityStress) / 2;
  }

  private static calculateEmotionalStress(emotionalAnalysis: EmotionalAnalysis): number {
    // Calculate emotional stress based on emotional intensity and recovery rate
    const intensityStress = emotionalAnalysis.intensity;
    const recoveryStress = 1 - emotionalAnalysis.recoveryRate;
    
    return (intensityStress + recoveryStress) / 2;
  }

  private static calculateOverallStressLevel(factors: StressFactors): number {
    // Weight different stress factors
    const weights = {
      environmental: 0.3,
      social: 0.3,
      emotional: 0.3,
      physical: 0.1
    };

    return (
      factors.environmental * weights.environmental +
      factors.social * weights.social +
      factors.emotional * weights.emotional +
      factors.physical * weights.physical
    );
  }

  private static predictFutureStressLevel(
    currentLevel: number,
    factors: StressFactors
  ): number {
    // Simple prediction based on current level and trend
    const trend = this.calculateStressTrend(factors);
    return Math.min(1, Math.max(0, currentLevel + trend));
  }

  private static calculateStressTrend(factors: StressFactors): number {
    // Calculate trend based on rate of change in stress factors
    const environmentalTrend = factors.environmental > 0.7 ? 0.1 : -0.05;
    const socialTrend = factors.social > 0.7 ? 0.1 : -0.05;
    const emotionalTrend = factors.emotional > 0.7 ? 0.1 : -0.05;
    
    return (environmentalTrend + socialTrend + emotionalTrend) / 3;
  }

  private static generateMitigationStrategies(factors: StressFactors): string[] {
    const strategies: string[] = [];

    if (factors.environmental > this.STRESS_THRESHOLD) {
      strategies.push('Adjust water conditions to optimal range');
    }
    if (factors.social > this.STRESS_THRESHOLD) {
      strategies.push('Modify group dynamics or increase distance');
    }
    if (factors.emotional > this.STRESS_THRESHOLD) {
      strategies.push('Implement calming techniques');
    }
    if (factors.physical > this.STRESS_THRESHOLD) {
      strategies.push('Reduce physical activity');
    }

    return strategies;
  }

  private static calculateConfidence(factors: StressFactors): number {
    // Calculate confidence based on the consistency of stress factors
    const variance = this.calculateVariance(Object.values(factors));
    return Math.max(0, 1 - variance);
  }

  private static calculateSocialBondingMetrics(
    emotionalAnalysis: EmotionalAnalysis,
    environmentalContext: EnvironmentalContext
  ): SocialBondingMetrics {
    return {
      groupCohesion: this.calculateGroupCohesion(environmentalContext),
      individualConnections: this.calculateIndividualConnections(emotionalAnalysis),
      interactionQuality: this.calculateInteractionQuality(emotionalAnalysis, environmentalContext),
      trustLevel: this.calculateTrustLevel(emotionalAnalysis)
    };
  }

  private static calculateGroupCohesion(context: EnvironmentalContext): number {
    const { groupSize, proximity } = context.socialContext;
    return (groupSize * 0.3 + proximity * 0.7);
  }

  private static calculateIndividualConnections(analysis: EmotionalAnalysis): number {
    return analysis.confidence * 0.8 + analysis.recoveryRate * 0.2;
  }

  private static calculateInteractionQuality(
    analysis: EmotionalAnalysis,
    context: EnvironmentalContext
  ): number {
    const emotionalQuality = analysis.intensity * 0.6;
    const socialQuality = context.socialContext.proximity * 0.4;
    return emotionalQuality + socialQuality;
  }

  private static calculateTrustLevel(analysis: EmotionalAnalysis): number {
    return analysis.confidence * 0.7 + (1 - analysis.intensity) * 0.3;
  }

  private static determineBondingTrend(metrics: SocialBondingMetrics): 'strengthening' | 'stable' | 'weakening' {
    const overallScore = (
      metrics.groupCohesion +
      metrics.individualConnections +
      metrics.interactionQuality +
      metrics.trustLevel
    ) / 4;

    if (overallScore > this.BONDING_THRESHOLD + 0.1) return 'strengthening';
    if (overallScore < this.BONDING_THRESHOLD - 0.1) return 'weakening';
    return 'stable';
  }

  private static generateBondingRecommendations(
    metrics: SocialBondingMetrics,
    trend: 'strengthening' | 'stable' | 'weakening'
  ): string[] {
    const recommendations: string[] = [];

    if (metrics.groupCohesion < this.BONDING_THRESHOLD) {
      recommendations.push('Encourage group activities');
    }
    if (metrics.individualConnections < this.BONDING_THRESHOLD) {
      recommendations.push('Facilitate one-on-one interactions');
    }
    if (metrics.interactionQuality < this.BONDING_THRESHOLD) {
      recommendations.push('Improve interaction quality through structured activities');
    }
    if (metrics.trustLevel < this.BONDING_THRESHOLD) {
      recommendations.push('Build trust through consistent positive interactions');
    }

    return recommendations;
  }

  private static calculateBondingConfidence(metrics: SocialBondingMetrics): number {
    const variance = this.calculateVariance(Object.values(metrics));
    return Math.max(0, 1 - variance);
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
} 