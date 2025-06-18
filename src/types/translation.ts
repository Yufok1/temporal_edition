import { StewardAssessment, StewardFeedback } from './steward';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'pt' | 'ru';

export type EmotionalTone = 
    | 'peaceful'
    | 'joyful'
    | 'contemplative'
    | 'curious'
    | 'playful'
    | 'distressed'
    | 'mating'
    | 'migratory'
    | 'teaching'
    | 'learning'
    | 'social'
    | 'alerting'
    | 'spiritual'
    | 'encouraging';

export type SentimentScore = {
    baseScore: number;
    modifiers: {
        environmental: number;
        social: number;
        emotional: number;
    };
    confidence: number;
};

export interface VocabularyEntry {
    message: string;
    emotionalTone: EmotionalTone;
    context: {
        environmental: string[];
        social: string[];
        emotional: string[];
    };
    confidence: number;
}

export type WhaleCallType = 
    | 'whale_call_greeting'
    | 'whale_call_warning'
    | 'whale_call_spiritual'
    | 'whale_call_encouragement'
    | 'whale_call_farewell'
    | 'whale_call_teaching'
    | 'whale_call_learning'
    | 'whale_call_social';

export type VocabularyMapping = Record<WhaleCallType, Record<SupportedLanguage, VocabularyEntry>>;

export interface TranslationContext {
    emotionalState: EmotionalTone;
    environmentalContext: string[];
    socialContext: string[];
    behavioralContext: string[];
    seasonalContext: string[];
    stewardContext?: {
        stewardID: string;
        interactionHistory: StewardFeedback[];
        currentAssessment: StewardAssessment;
    };
}

export interface TranslationResult {
    translatedText: string;
    confidence: number;
    emotionalTone: EmotionalTone;
    context: {
        environmental: string[];
        social: string[];
        emotional: string[];
    };
    sentiment: SentimentScore;
    timestamp: Date;
}

export interface TranslationOptions {
    targetLanguage: SupportedLanguage;
    includeContext?: boolean;
    includeSentiment?: boolean;
    stewardID?: string;
    includeFeedback?: boolean;
    includeAssessment?: boolean;
} 