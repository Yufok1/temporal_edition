import { WhaleSignalFeedbackLoop } from '../services/WhaleSignalFeedbackLoop';
import { TranslatedWhaleSignal, WhaleVocalSignal } from '../types/whale';

describe('WhaleSignalFeedbackLoop', () => {
    let feedbackLoop: WhaleSignalFeedbackLoop;

    beforeEach(() => {
        feedbackLoop = new WhaleSignalFeedbackLoop();
    });

    describe('Feedback Processing', () => {
        it('should process feedback for vocal signals', () => {
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const translatedSignal: TranslatedWhaleSignal = {
                type: 'vocal',
                content: vocalSignal,
                systemInterpretation: 'Vocal signal detected: song (High frequency)',
                timestamp: new Date()
            };

            feedbackLoop.processFeedback(translatedSignal);
            const analysis = feedbackLoop.analyzeSignalImpact();
            
            expect(analysis).toBeDefined();
            expect(analysis.signalType).toBe('aggregate');
            expect(analysis.confidence).toBeGreaterThanOrEqual(0);
            expect(analysis.confidence).toBeLessThanOrEqual(1);
            expect(analysis.impact).toBeGreaterThanOrEqual(0);
            expect(analysis.impact).toBeLessThanOrEqual(1);
        });

        it('should maintain history within limits', () => {
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const translatedSignal: TranslatedWhaleSignal = {
                type: 'vocal',
                content: vocalSignal,
                systemInterpretation: 'Vocal signal detected: song',
                timestamp: new Date()
            };

            // Add more signals than MAX_HISTORY_LENGTH
            for (let i = 0; i < 1100; i++) {
                feedbackLoop.processFeedback(translatedSignal);
            }

            const analysis = feedbackLoop.analyzeSignalImpact();
            expect(analysis).toBeDefined();
        });
    });

    describe('Pattern Analysis', () => {
        it('should detect patterns in signal history', () => {
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const translatedSignal: TranslatedWhaleSignal = {
                type: 'vocal',
                content: vocalSignal,
                systemInterpretation: 'Vocal signal detected: song',
                timestamp: new Date()
            };

            // Add multiple signals to create a pattern
            for (let i = 0; i < 10; i++) {
                feedbackLoop.processFeedback(translatedSignal);
            }

            const analysis = feedbackLoop.analyzeSignalImpact();
            expect(analysis.metadata.pattern).toBeDefined();
        });

        it('should calculate prediction error', () => {
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const translatedSignal: TranslatedWhaleSignal = {
                type: 'vocal',
                content: vocalSignal,
                systemInterpretation: 'Vocal signal detected: song',
                timestamp: new Date()
            };

            // Add signals with varying frequencies
            for (let i = 0; i < 5; i++) {
                const signal = {
                    ...translatedSignal,
                    content: {
                        ...vocalSignal,
                        frequency: 1500 + (i * 100)
                    }
                };
                feedbackLoop.processFeedback(signal);
            }

            const analysis = feedbackLoop.analyzeSignalImpact();
            expect(analysis.metadata.error).toBeDefined();
            expect(analysis.metadata.error).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Signal Impact Analysis', () => {
        it('should analyze high-impact signals', () => {
            const highImpactSignal: TranslatedWhaleSignal = {
                type: 'vocal',
                content: {
                    signalType: 'song',
                    frequency: 2000,
                    duration: 20,
                    intensity: 0.9,
                    timestamp: new Date()
                },
                systemInterpretation: 'Vocal signal detected: song (High frequency, Long duration, High intensity)',
                timestamp: new Date()
            };

            feedbackLoop.processFeedback(highImpactSignal);
            const analysis = feedbackLoop.analyzeSignalImpact();
            
            expect(analysis.impact).toBeGreaterThan(0.5);
        });

        it('should analyze low-impact signals', () => {
            const lowImpactSignal: TranslatedWhaleSignal = {
                type: 'vocal',
                content: {
                    signalType: 'song',
                    frequency: 500,
                    duration: 2,
                    intensity: 0.2,
                    timestamp: new Date()
                },
                systemInterpretation: 'Vocal signal detected: song (Low frequency, Short duration, Low intensity)',
                timestamp: new Date()
            };

            feedbackLoop.processFeedback(lowImpactSignal);
            const analysis = feedbackLoop.analyzeSignalImpact();
            
            expect(analysis.impact).toBeLessThan(0.5);
        });
    });

    describe('Error Handling', () => {
        it('should handle empty signal history', () => {
            const analysis = feedbackLoop.analyzeSignalImpact();
            expect(analysis.signalType).toBe('empty');
            expect(analysis.confidence).toBe(0);
            expect(analysis.impact).toBe(0);
        });

        it('should handle invalid signal types', () => {
            const invalidSignal: TranslatedWhaleSignal = {
                type: 'invalid' as any,
                content: {} as any,
                systemInterpretation: 'Invalid signal',
                timestamp: new Date()
            };

            expect(() => {
                feedbackLoop.processFeedback(invalidSignal);
            }).toThrow();
        });
    });
}); 