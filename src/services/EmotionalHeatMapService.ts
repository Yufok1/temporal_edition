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

interface HeatMapPoint {
  x: number;
  y: number;
  intensity: number;
  timestamp: Date;
  emotion: string;
  context: string;
}

interface HeatMapData {
  points: HeatMapPoint[];
  maxIntensity: number;
  minIntensity: number;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export class EmotionalHeatMapService {
  private readonly historySize: number = 1000; // Store last 1000 points
  private emotionalHistory: HeatMapPoint[] = [];

  public processEmotionalData(
    emotionalAnalysis: EmotionalAnalysis,
    environmentalContext: EnvironmentalContext,
    timestamp: Date = new Date()
  ): HeatMapPoint {
    // Convert emotional data to a point in the heat map
    const point: HeatMapPoint = {
      x: this.calculateEmotionalX(emotionalAnalysis),
      y: this.calculateEmotionalY(emotionalAnalysis),
      intensity: emotionalAnalysis.intensity,
      timestamp,
      emotion: emotionalAnalysis.primaryEmotion,
      context: this.getEnvironmentalContext(environmentalContext)
    };

    // Add to history
    this.emotionalHistory.push(point);
    if (this.emotionalHistory.length > this.historySize) {
      this.emotionalHistory.shift();
    }

    return point;
  }

  public getHeatMapData(timeWindow: number = 3600000): HeatMapData { // Default 1 hour window
    const now = new Date();
    const startTime = new Date(now.getTime() - timeWindow);
    
    const relevantPoints = this.emotionalHistory.filter(
      point => point.timestamp >= startTime
    );

    const intensities = relevantPoints.map(point => point.intensity);
    const maxIntensity = Math.max(...intensities);
    const minIntensity = Math.min(...intensities);

    return {
      points: relevantPoints,
      maxIntensity,
      minIntensity,
      timeRange: {
        start: startTime,
        end: now
      }
    };
  }

  public getEmotionalClusters(): Map<string, HeatMapPoint[]> {
    const clusters = new Map<string, HeatMapPoint[]>();
    
    this.emotionalHistory.forEach(point => {
      const key = `${point.emotion}-${point.context}`;
      if (!clusters.has(key)) {
        clusters.set(key, []);
      }
      clusters.get(key)?.push(point);
    });

    return clusters;
  }

  private calculateEmotionalX(emotionalAnalysis: EmotionalAnalysis): number {
    // Map primary emotion to x-coordinate
    const emotionMap: { [key: string]: number } = {
      'joy': 0.8,
      'contentment': 0.6,
      'curiosity': 0.4,
      'anxiety': 0.2,
      'distress': 0.0
    };
    
    return emotionMap[emotionalAnalysis.primaryEmotion] || 0.5;
  }

  private calculateEmotionalY(emotionalAnalysis: EmotionalAnalysis): number {
    // Map secondary emotions and intensity to y-coordinate
    const secondaryEmotionCount = emotionalAnalysis.secondaryEmotions.length;
    const baseY = 0.5;
    const intensityFactor = emotionalAnalysis.intensity - 0.5;
    
    return baseY + (intensityFactor * 0.5) + (secondaryEmotionCount * 0.1);
  }

  private getEnvironmentalContext(context: EnvironmentalContext): string {
    // Create a context string based on environmental factors
    const factors = [];
    
    if (context.waterConditions.temperature > 20) factors.push('warm');
    if (context.waterConditions.temperature < 10) factors.push('cold');
    if (context.waterConditions.pressure > 0.7) factors.push('deep');
    if (context.socialContext.groupSize > 5) factors.push('crowded');
    
    return factors.join('-') || 'neutral';
  }
} 