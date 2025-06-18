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

export interface HarmonicSequence {
    timestamp: Date;
    frequencies: number[];
    amplitude: number;
    duration: number;
    emotionalContent: EmotionalState;
    environmentalContext: EnvironmentalContext;
    source: 'whale' | 'steward';
    resonance: number;
}

export interface EmotionalState {
    intensity: number;  // 0-1 scale
    valence: number;    // -1 to 1 scale (negative to positive)
    arousal: number;    // 0-1 scale
    type: EmotionType;
}

export type EmotionType = 
    | 'calm'
    | 'agitated'
    | 'joyful'
    | 'contemplative'
    | 'gathering'
    | 'distress'
    | 'playful';

export interface EnvironmentalContext {
    depth: number;
    temperature: number;
    currentSpeed: number;
    salinity: number;
    pressure: number;
    marineLifePresence: number;  // 0-1 scale
}

export interface SonicModulation {
    frequencyShift: number;
    amplitudeModulation: number;
    harmonicEnhancement: number;
    rhythmicPattern: number[];
    emotionalEnhancement: number;
}

export interface HarmonicFeedback {
    resonance: number;
    environmentalImpact: number;
    emotionalAlignment: number;
    musicalCoherence: number;
    ecosystemResponse: number;
}

export interface MusicalInteraction {
    whaleSequence: HarmonicSequence;
    stewardModulation: SonicModulation;
    resultingHarmony: HarmonicSequence;
    feedback: HarmonicFeedback;
    environmentalChanges: EnvironmentalContext;
}

export interface StewardCapabilities {
    musicalTraining: number;      // 0-1 scale
    emotionalSensitivity: number; // 0-1 scale
    environmentalUnderstanding: number; // 0-1 scale
    harmonicMastery: number;      // 0-1 scale
}

export interface WhaleCapabilities {
    vocalRange: [number, number]; // min and max frequencies
    harmonicComplexity: number;   // 0-1 scale
    environmentalSensitivity: number; // 0-1 scale
    emotionalExpression: number;  // 0-1 scale
}

export interface WhaleVocalization {
  frequency: number;
  pitch: number;
  tone: 'low' | 'medium' | 'high';
  duration: number;
  emotionalState: 'calm' | 'alert' | 'distressed' | 'joyful';
}

export interface StewardResponse {
  modulationType: 'pitch' | 'rhythm' | 'harmony';
  intensity: number;
  responseTone: 'bright' | 'soft' | 'aggressive';
}

export interface ProdigalSystem {
  systemType: 'synthesizer' | 'resonanceModulator' | 'soundAmplifier';
  frequencyRange: [number, number];
  interactWithWhale(vocalization: WhaleVocalization): string;
  modulateSound(input: WhaleVocalization | StewardResponse): string;
}

export interface JamSession {
  whaleVocalizations: WhaleVocalization[];
  stewardResponses: StewardResponse[];
  prodigalSystemsEngaged: ProdigalSystem[];
  startSession(): void;
  endSession(): void;
} 