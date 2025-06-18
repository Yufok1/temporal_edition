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