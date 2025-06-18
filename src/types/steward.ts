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

import { EmotionalTone } from './translation';

export type InteractionType = 
    | 'translation'
    | 'musical'
    | 'environmental'
    | 'social'
    | 'spiritual';

export type ResponseType = 
    | 'positive'
    | 'engaged'
    | 'neutral'
    | 'confused'
    | 'negative'
    | 'disengaged';

export interface StewardAssessment {
    stewardID: string;
    emotionalIntelligence: number;
    culturalSensitivity: number;
    communicationEffectiveness: number;
    adaptability: number;
    empathy: number;
    patience: number;
    clarity: number;
    feedbackHistory: StewardFeedback[];
    lastUpdated: Date;
    environmentalContext: EnvironmentalContext;
    socialContext: SocialContext;
    emotionalContext: EmotionalContext;
}

export interface EnvironmentalContext {
    waterTemperature: number;
    currentSpeed: number;
    visibility: number;
    noiseLevel: number;
    weatherConditions: string;
}

export interface SocialContext {
    groupSize: number;
    socialHierarchy: string;
    interactionPattern: string;
    groupDynamics: string;
}

export interface EmotionalContext {
    dominantEmotion: EmotionalTone;
    emotionalStability: number;
    stressLevel: number;
    engagementLevel: number;
}

export interface StewardFeedback {
    timestamp: Date;
    interactionType: InteractionType;
    emotionalTone: EmotionalTone;
    feedbackScore: number;
    feedbackNotes: string;
    whaleResponse: WhaleResponse;
    environmentalContext: EnvironmentalContext;
    socialContext: SocialContext;
    emotionalContext: EmotionalContext;
    improvementAreas: ImprovementArea[];
}

export interface ImprovementArea {
    category: string;
    description: string;
    suggestedActions: string[];
    priority: 'high' | 'medium' | 'low';
}

export interface WhaleResponse {
    timestamp: Date;
    responseType: ResponseType;
    engagementLevel: number;
    contextMatch: number;
    duration: number;
    emotionalIntensity: number;
    socialImpact: number;
}

export interface StewardCapabilities {
    emotionalIntelligence: number;
    culturalSensitivity: number;
    communicationEffectiveness: number;
    adaptability: number;
    empathy: number;
    patience: number;
    clarity: number;
    languageProficiency: Record<string, number>;
    specializations: string[];
}

export interface StewardPerformanceMetrics {
    averageEmotionalIntelligence: number;
    averageCulturalSensitivity: number;
    averageCommunicationEffectiveness: number;
    averageAdaptability: number;
    averageEmpathy: number;
    averagePatience: number;
    averageClarity: number;
    successRate: number;
    improvementRate: number;
    whaleEngagementScore: number;
    environmentalAdaptationScore: number;
    socialIntegrationScore: number;
    emotionalConnectionScore: number;
    performanceTrends: PerformanceTrend[];
}

export interface PerformanceTrend {
    metric: string;
    values: number[];
    timestamps: Date[];
    trend: 'improving' | 'stable' | 'declining';
    confidence: number;
} 