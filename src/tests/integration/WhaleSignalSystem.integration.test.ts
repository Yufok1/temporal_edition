import { WhaleStewardSystem } from '../../services/WhaleStewardSystem';
import { WhaleVocalSignal, WhaleMovementPattern, WhaleEnvironmentalData } from '../../types/whale';

describe('Whale Signal System Integration', () => {
    let system: WhaleStewardSystem;

    beforeEach(() => {
        system = new WhaleStewardSystem();
    });

    describe('End-to-End Signal Processing', () => {
        it('should process a complete signal flow', () => {
            // Create a vocal signal
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            // Process the signal
            system.handleIncomingWhaleSignal(vocalSignal);

            // Verify signal history
            const history = system.getSignalHistory();
            expect(history.length).toBe(1);
            expect(history[0].type).toBe('vocal');
            expect(history[0].content).toEqual(vocalSignal);

            // Verify analysis
            const analysis = system.analyzeWhaleData();
            expect(analysis).toBeDefined();
            expect(analysis.signalType).toBe('aggregate');
            expect(analysis.confidence).toBeGreaterThanOrEqual(0);
            expect(analysis.confidence).toBeLessThanOrEqual(1);
            expect(analysis.impact).toBeGreaterThanOrEqual(0);
            expect(analysis.impact).toBeLessThanOrEqual(1);
        });

        it('should handle multiple signal types in sequence', () => {
            // Create signals of different types
            const vocalSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            const movementSignal: WhaleMovementPattern = {
                behaviorType: 'migration',
                speed: 8,
                direction: 45,
                depth: 50,
                timestamp: new Date()
            };

            const environmentalSignal: WhaleEnvironmentalData = {
                waterTemperature: 15,
                waterDepth: 200,
                salinity: 35,
                timestamp: new Date()
            };

            // Process signals in sequence
            system.handleIncomingWhaleSignal(vocalSignal);
            system.handleIncomingWhaleSignal(movementSignal);
            system.handleIncomingWhaleSignal(environmentalSignal);

            // Verify signal history
            const history = system.getSignalHistory();
            expect(history.length).toBe(3);
            expect(history[0].type).toBe('vocal');
            expect(history[1].type).toBe('movement');
            expect(history[2].type).toBe('environmental');

            // Verify analysis
            const analysis = system.analyzeWhaleData();
            expect(analysis).toBeDefined();
            expect(analysis.metadata.pattern).toBeDefined();
        });
    });

    describe('Pattern Detection and Analysis', () => {
        it('should detect patterns across different signal types', () => {
            // Create a sequence of related signals
            const baseTime = new Date();
            
            // Add vocal signals with increasing frequency
            for (let i = 0; i < 5; i++) {
                const vocalSignal: WhaleVocalSignal = {
                    signalType: 'song',
                    frequency: 1500 + (i * 100),
                    duration: 10,
                    intensity: 0.8,
                    timestamp: new Date(baseTime.getTime() + i * 1000)
                };
                system.handleIncomingWhaleSignal(vocalSignal);
            }

            // Add movement signals with increasing depth
            for (let i = 0; i < 5; i++) {
                const movementSignal: WhaleMovementPattern = {
                    behaviorType: 'diving',
                    speed: 5,
                    direction: 90,
                    depth: 50 + (i * 20),
                    timestamp: new Date(baseTime.getTime() + (i + 5) * 1000)
                };
                system.handleIncomingWhaleSignal(movementSignal);
            }

            // Verify pattern detection
            const analysis = system.analyzeWhaleData();
            expect(analysis.metadata.pattern).toBeDefined();
            expect(analysis.metadata.prediction).toBeDefined();
        });

        it('should handle environmental changes affecting signal patterns', () => {
            // Create environmental changes
            const environmentalSignals: WhaleEnvironmentalData[] = [
                {
                    waterTemperature: 15,
                    waterDepth: 200,
                    salinity: 35,
                    timestamp: new Date()
                },
                {
                    waterTemperature: 18,
                    waterDepth: 180,
                    salinity: 34,
                    timestamp: new Date(Date.now() + 1000)
                },
                {
                    waterTemperature: 20,
                    waterDepth: 150,
                    salinity: 33,
                    timestamp: new Date(Date.now() + 2000)
                }
            ];

            // Process environmental signals
            environmentalSignals.forEach(signal => {
                system.handleIncomingWhaleSignal(signal);
            });

            // Verify environmental pattern detection
            const analysis = system.analyzeWhaleData();
            expect(analysis.metadata.pattern).toBeDefined();
            expect(analysis.impact).toBeGreaterThan(0);
        });
    });

    describe('Error Handling and Recovery', () => {
        it('should handle invalid signals gracefully', () => {
            const invalidSignal = {
                type: 'invalid',
                value: 100
            };

            expect(() => {
                system.handleIncomingWhaleSignal(invalidSignal as any);
            }).toThrow();

            // Verify system remains stable
            const history = system.getSignalHistory();
            expect(history.length).toBe(0);
        });

        it('should recover from error and continue processing valid signals', () => {
            // Try to process an invalid signal
            const invalidSignal = {
                type: 'invalid',
                value: 100
            };

            expect(() => {
                system.handleIncomingWhaleSignal(invalidSignal as any);
            }).toThrow();

            // Process a valid signal after error
            const validSignal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 1500,
                duration: 10,
                intensity: 0.8,
                timestamp: new Date()
            };

            system.handleIncomingWhaleSignal(validSignal);

            // Verify valid signal was processed
            const history = system.getSignalHistory();
            expect(history.length).toBe(1);
            expect(history[0].type).toBe('vocal');
        });
    });

    describe('Performance and Load Testing', () => {
        it('should handle rapid signal processing', () => {
            const startTime = Date.now();
            const signalCount = 1000;

            // Generate and process signals rapidly
            for (let i = 0; i < signalCount; i++) {
                const signal: WhaleVocalSignal = {
                    signalType: 'song',
                    frequency: 1500 + (i % 100),
                    duration: 10,
                    intensity: 0.8,
                    timestamp: new Date()
                };
                system.handleIncomingWhaleSignal(signal);
            }

            const endTime = Date.now();
            const processingTime = endTime - startTime;

            // Verify processing time is reasonable (less than 5 seconds for 1000 signals)
            expect(processingTime).toBeLessThan(5000);

            // Verify signal history is maintained correctly
            const history = system.getSignalHistory();
            expect(history.length).toBeLessThanOrEqual(1000);
        });

        it('should maintain accuracy under load', () => {
            // Generate a sequence of signals with a known pattern
            const baseFrequency = 1500;
            const frequencyStep = 100;
            const signalCount = 100;

            for (let i = 0; i < signalCount; i++) {
                const signal: WhaleVocalSignal = {
                    signalType: 'song',
                    frequency: baseFrequency + (i * frequencyStep),
                    duration: 10,
                    intensity: 0.8,
                    timestamp: new Date()
                };
                system.handleIncomingWhaleSignal(signal);
            }

            // Verify pattern detection accuracy
            const analysis = system.analyzeWhaleData();
            expect(analysis.metadata.pattern).toBeDefined();
            expect(analysis.confidence).toBeGreaterThan(0.5);
        });
    });
}); 