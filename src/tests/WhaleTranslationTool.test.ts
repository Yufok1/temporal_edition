import { WhaleTranslationTool } from '../services/WhaleTranslationTool';
import { WhaleVocalSignal, WhaleMovementPattern, WhaleEnvironmentalData } from '../types/whale';

describe('WhaleTranslationTool', () => {
    let translator: WhaleTranslationTool;

    beforeEach(() => {
        translator = new WhaleTranslationTool();
    });

    describe('Signal Translation', () => {
        it('should translate vocal signals correctly', () => {
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const translated = translator.translateWhaleSignal(vocalSignal);
            expect(translated.type).toBe('vocal');
            expect(translated.content).toEqual(vocalSignal);
            expect(translated.systemInterpretation).toContain('Vocal signal detected');
        });

        it('should translate movement patterns correctly', () => {
            const movementSignal: WhaleMovementPattern = {
                behaviorType: 'migration',
                speed: 8,
                direction: 45,
                depth: 50,
                timestamp: new Date()
            };

            const translated = translator.translateWhaleSignal(movementSignal);
            expect(translated.type).toBe('movement');
            expect(translated.content).toEqual(movementSignal);
            expect(translated.systemInterpretation).toContain('Movement pattern');
        });

        it('should translate environmental data correctly', () => {
            const environmentalSignal: WhaleEnvironmentalData = {
                waterTemperature: 15,
                waterDepth: 200,
                salinity: 35,
                timestamp: new Date()
            };

            const translated = translator.translateWhaleSignal(environmentalSignal);
            expect(translated.type).toBe('environmental');
            expect(translated.content).toEqual(environmentalSignal);
            expect(translated.systemInterpretation).toContain('Environmental conditions');
        });
    });

    describe('Signal Analysis', () => {
        it('should analyze vocal signals correctly', () => {
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const translated = translator.translateWhaleSignal(vocalSignal);
            const analysis = translator.analyzeSignal(translated);

            expect(analysis.signalType).toBe('vocal');
            expect(analysis.confidence).toBeGreaterThanOrEqual(0);
            expect(analysis.confidence).toBeLessThanOrEqual(1);
            expect(analysis.impact).toBeGreaterThanOrEqual(0);
            expect(analysis.impact).toBeLessThanOrEqual(1);
            expect(analysis.metadata).toBeDefined();
        });

        it('should analyze high-frequency vocal signals', () => {
            const highFreqSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 2000,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const translated = translator.translateWhaleSignal(highFreqSignal);
            const analysis = translator.analyzeSignal(translated);

            expect(analysis.signalType).toBe('vocal');
            expect(analysis.impact).toBeGreaterThan(0.5); // High frequency should have higher impact
        });

        it('should analyze low-intensity signals', () => {
            const lowIntensitySignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.2,
                timestamp: new Date()
            };

            const translated = translator.translateWhaleSignal(lowIntensitySignal);
            const analysis = translator.analyzeSignal(translated);

            expect(analysis.signalType).toBe('vocal');
            expect(analysis.confidence).toBeLessThan(0.5); // Low intensity should have lower confidence
        });
    });

    describe('Pattern Detection', () => {
        it('should detect patterns in vocal signals', () => {
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const translated = translator.translateWhaleSignal(vocalSignal);
            const analysis = translator.analyzeSignal(translated);

            expect(analysis.metadata.pattern).toBeDefined();
        });

        it('should detect patterns in movement signals', () => {
            const movementSignal: WhaleMovementPattern = {
                behaviorType: 'migration',
                speed: 8,
                direction: 45,
                depth: 50,
                timestamp: new Date()
            };

            const translated = translator.translateWhaleSignal(movementSignal);
            const analysis = translator.analyzeSignal(translated);

            expect(analysis.metadata.pattern).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid signal types', () => {
            const invalidSignal = {
                type: 'invalid',
                value: 100
            };

            expect(() => {
                translator.translateWhaleSignal(invalidSignal as any);
            }).toThrow();
        });

        it('should handle missing required fields', () => {
            const incompleteSignal = {
                signalType: 'song',
                frequency: 1500
                // Missing required fields
            };

            expect(() => {
                translator.translateWhaleSignal(incompleteSignal as any);
            }).toThrow();
        });
    });
}); 