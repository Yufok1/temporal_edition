import { 
    WhaleVocalSignal, 
    WhaleMovementPattern, 
    WhaleEnvironmentalData,
    WhaleSignal,
    WhaleEmotionalContext,
    WhaleBehavioralContext,
    WhaleEnvironmentalContext
} from '../../types/whale';

export const createWhaleVocalSignal = (overrides: Partial<WhaleVocalSignal> = {}): WhaleVocalSignal => ({
    signalType: 'song',
    frequency: 1500,
    duration: 10,
    intensity: 0.8,
    timestamp: new Date(),
    ...overrides
});

export const createWhaleMovementPattern = (overrides: Partial<WhaleMovementPattern> = {}): WhaleMovementPattern => ({
    behaviorType: 'migration',
    speed: 8,
    direction: 45,
    depth: 50,
    timestamp: new Date(),
    ...overrides
});

export const createWhaleEnvironmentalData = (overrides: Partial<WhaleEnvironmentalData> = {}): WhaleEnvironmentalData => ({
    waterTemperature: 15,
    waterDepth: 200,
    salinity: 35,
    timestamp: new Date(),
    ...overrides
});

export const createWhaleEmotionalContext = (overrides: Partial<WhaleEmotionalContext> = {}): WhaleEmotionalContext => ({
    primaryEmotion: 'peaceful',
    secondaryEmotions: ['calm'],
    intensity: 0.7,
    stability: 0.8,
    confidence: 0.9,
    vocalizationPattern: 'descending_whistle',
    behavioralIndicators: ['synchronized_swimming'],
    environmentalTriggers: [],
    ...overrides
});

export const createWhaleBehavioralContext = (overrides: Partial<WhaleBehavioralContext> = {}): WhaleBehavioralContext => ({
    movementPattern: {
        type: 'migration',
        speed: 8,
        direction: 45,
        depth: 50,
        duration: 3600,
        confidence: 0.9
    },
    socialInteraction: {
        type: 'group',
        participants: 3,
        intensity: 0.7,
        duration: 1800,
        confidence: 0.8
    },
    environmentalResponse: {
        type: 'adaptation',
        intensity: 0.6,
        duration: 1200,
        confidence: 0.9
    },
    temporalContext: {
        timeOfDay: 'morning',
        season: 'summer',
        duration: 3600,
        frequency: 1
    },
    ...overrides
});

export const createWhaleEnvironmentalContext = (overrides: Partial<WhaleEnvironmentalContext> = {}): WhaleEnvironmentalContext => ({
    waterConditions: {
        temperature: 15,
        currentSpeed: 2,
        visibility: 20,
        depth: 50,
        salinity: 35,
        lightLevel: 0.8,
        turbulence: 0.2,
        oxygenLevel: 6
    },
    spatialContext: {
        depth: 50,
        location: 'open_ocean',
        proximityToGroup: 100,
        proximityToSteward: 200
    },
    temporalContext: {
        timeOfDay: 'morning',
        season: 'summer',
        duration: 3600,
        frequency: 1
    },
    socialContext: {
        groupSize: 3,
        groupCohesion: 0.8,
        interactionIntensity: 0.7,
        socialHierarchy: 0.6,
        proximityToGroup: 100,
        socialBonds: [{
            strength: 0.8,
            type: 'family'
        }]
    },
    ...overrides
});

export const createWhaleSignal = (overrides: Partial<WhaleSignal> = {}): WhaleSignal => ({
    type: 'vocalization',
    timestamp: new Date(),
    frequency: 1500,
    duration: 10,
    intensity: 0.8,
    confidence: 0.9,
    emotionalContext: createWhaleEmotionalContext(),
    behavioralContext: createWhaleBehavioralContext(),
    environmentalContext: createWhaleEnvironmentalContext(),
    ...overrides
}); 