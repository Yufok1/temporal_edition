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

import { WhaleStewardSystem } from '../../services/WhaleStewardSystem';
import { PoseidonSystem } from '../../services/PoseidonSystem';
import { 
    WhaleVocalSignal, 
    WhaleMovementPattern, 
    WhaleEnvironmentalData,
    WhaleAnalysisResult 
} from '../../types/whale';
import { 
    createTestSystems, 
    waitForEcosystemStability,
    generateTestSignals,
    generateEnvironmentalChanges,
    generateMovementPatterns,
    generateComplexPattern,
    generateCorrelatedSignals,
    generateExtremeScenario,
    generateInvalidSignals,
    generateOverloadScenario
} from './setup';

describe('Poseidon-Mermaid Integration', () => {
    let whaleSteward: WhaleStewardSystem;
    let poseidonSystem: PoseidonSystem;

    beforeEach(() => {
        const systems = createTestSystems();
        whaleSteward = systems.whaleSteward;
        poseidonSystem = systems.poseidonSystem;
    });

    it('should process whale signals and update ecosystem', async () => {
        // Create a test signal
        const signal: WhaleVocalSignal = {
            signalType: 'song',
            frequency: 20,
            duration: 5,
            intensity: 0.8,
            timestamp: new Date()
        };

        // Process the signal
        whaleSteward.handleIncomingWhaleSignal(signal);
        const analysis = whaleSteward.analyzeWhaleData();
        expect(analysis).toBeDefined();
        expect(analysis.signalType).toBeDefined();

        // Update ecosystem
        const update = await poseidonSystem.processWhaleAnalysis(analysis);
        expect(update.status).toBe('success');
        expect(update.impact).toBeGreaterThan(0);
        expect(update.ecosystemChanges).toBeDefined();

        // Check ecosystem status
        const status = await poseidonSystem.getEcosystemStatus();
        expect(status.status).toBeDefined();
        expect(status.adaptationLevel).toBeGreaterThanOrEqual(0);
        expect(status.adaptationLevel).toBeLessThanOrEqual(1);
    });

    it('should handle multiple signal types and update ecosystem accordingly', async () => {
        const signals = [
            {
                signalType: 'song',
                frequency: 20,
                duration: 5,
                intensity: 0.8,
                timestamp: new Date()
            } as WhaleVocalSignal,
            {
                behaviorType: 'migration',
                speed: 5,
                direction: 45,
                depth: 100,
                timestamp: new Date()
            } as WhaleMovementPattern
        ];

        for (const signal of signals) {
            whaleSteward.handleIncomingWhaleSignal(signal);
            const analysis = whaleSteward.analyzeWhaleData();
            const update = await poseidonSystem.processWhaleAnalysis(analysis);
            expect(update.status).toBe('success');
        }

        const status = await poseidonSystem.getEcosystemStatus();
        expect(status.status).toBeDefined();
        expect(status.adaptationLevel).toBeGreaterThan(0);
    });

    it('should detect patterns and trigger ecosystem responses', async () => {
        // Create a sequence of signals showing a trend
        const signals: WhaleVocalSignal[] = Array.from({ length: 5 }, (_, i) => ({
            signalType: 'song',
            frequency: 20 + i,
            duration: 5,
            intensity: 0.8,
            timestamp: new Date(Date.now() + i * 1000)
        }));

        for (const signal of signals) {
            whaleSteward.handleIncomingWhaleSignal(signal);
            const analysis = whaleSteward.analyzeWhaleData();
            const update = await poseidonSystem.processWhaleAnalysis(analysis);
            expect(update.status).toBe('success');
        }

        const status = await poseidonSystem.getEcosystemStatus();
        expect(status.status).toBeDefined();
        expect(status.adaptationLevel).toBeGreaterThan(0.5);
    });

    it('should handle environmental changes and adapt ecosystem', async () => {
        const signal: WhaleEnvironmentalData = {
            waterTemperature: 15,
            waterDepth: 200,
            salinity: 35,
            timestamp: new Date()
        };

        whaleSteward.handleIncomingWhaleSignal(signal);
        const analysis = whaleSteward.analyzeWhaleData();
        const update = await poseidonSystem.processWhaleAnalysis(analysis);
        expect(update.status).toBe('success');
        expect(update.ecosystemChanges.environmentalAdjustments).toBeDefined();

        const status = await poseidonSystem.getEcosystemStatus();
        expect(status.environmentalMetrics).toBeDefined();
        expect(status.environmentalMetrics.temperature).toBeDefined();
        expect(status.environmentalMetrics.salinity).toBeDefined();
    });

    it('should handle invalid signals gracefully', async () => {
        const invalidSignal = {
            type: 'invalid',
            timestamp: new Date()
        } as any;

        expect(() => {
            whaleSteward.handleIncomingWhaleSignal(invalidSignal);
        }).toThrow();

        const status = await poseidonSystem.getEcosystemStatus();
        expect(status.status).toBe('stable');
    });

    it('should maintain ecosystem stability under high-volume signal processing', async () => {
        const signals: WhaleVocalSignal[] = Array.from({ length: 100 }, (_, i) => ({
            signalType: 'song',
            frequency: 20 + Math.random() * 10,
            duration: 5,
            intensity: 0.8,
            timestamp: new Date(Date.now() + i * 100)
        }));

        const startTime = Date.now();
        for (const signal of signals) {
            whaleSteward.handleIncomingWhaleSignal(signal);
            const analysis = whaleSteward.analyzeWhaleData();
            const update = await poseidonSystem.processWhaleAnalysis(analysis);
            expect(update.status).toBe('success');
        }
        const endTime = Date.now();

        // Verify processing time is reasonable
        expect(endTime - startTime).toBeLessThan(5000);

        const status = await poseidonSystem.getEcosystemStatus();
        expect(status.status).toBeDefined();
        expect(status.adaptationLevel).toBeGreaterThan(0);
    });

    describe('Edge Cases and Complex Scenarios', () => {
        it('should handle high-frequency signal bursts', async () => {
            // Create a burst of rapid signals
            const signals: WhaleVocalSignal[] = Array.from({ length: 50 }, (_, i) => ({
                signalType: 'song',
                frequency: 20 + Math.random() * 10,
                duration: 0.1, // Very short duration
                intensity: 0.8,
                timestamp: new Date(Date.now() + i * 10) // 10ms intervals
            }));

            const startTime = Date.now();
            for (const signal of signals) {
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                const update = await poseidonSystem.processWhaleAnalysis(analysis);
                expect(update.status).toBe('success');
            }
            const endTime = Date.now();

            // Verify processing time is reasonable for high-frequency signals
            expect(endTime - startTime).toBeLessThan(2000); // 2 seconds for 50 signals

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0);
        });

        it('should handle complex signal interactions', async () => {
            // Create a sequence of mixed signal types with varying intensities
            const signals = [
                // Vocal signal
                {
                    signalType: 'song',
                    frequency: 20,
                    duration: 5,
                    intensity: 0.9,
                    timestamp: new Date()
                } as WhaleVocalSignal,
                // Movement signal
                {
                    behaviorType: 'migration',
                    speed: 8,
                    direction: 45,
                    depth: 100,
                    timestamp: new Date(Date.now() + 1000)
                } as WhaleMovementPattern,
                // Environmental signal
                {
                    waterTemperature: 15,
                    waterDepth: 200,
                    salinity: 35,
                    timestamp: new Date(Date.now() + 2000)
                } as WhaleEnvironmentalData,
                // Another vocal signal with different characteristics
                {
                    signalType: 'song',
                    frequency: 25,
                    duration: 3,
                    intensity: 0.7,
                    timestamp: new Date(Date.now() + 3000)
                } as WhaleVocalSignal
            ];

            for (const signal of signals) {
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                const update = await poseidonSystem.processWhaleAnalysis(analysis);
                expect(update.status).toBe('success');
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0);
        });

        it('should handle extreme environmental scenarios', async () => {
            const extremeScenarios: WhaleEnvironmentalData[] = [
                // Very cold water
                {
                    waterTemperature: -2,
                    waterDepth: 1000,
                    salinity: 35,
                    timestamp: new Date()
                },
                // Very warm water
                {
                    waterTemperature: 35,
                    waterDepth: 50,
                    salinity: 40,
                    timestamp: new Date(Date.now() + 1000)
                },
                // Very deep water
                {
                    waterTemperature: 4,
                    waterDepth: 3000,
                    salinity: 35,
                    timestamp: new Date(Date.now() + 2000)
                },
                // Very shallow water
                {
                    waterTemperature: 25,
                    waterDepth: 5,
                    salinity: 30,
                    timestamp: new Date(Date.now() + 3000)
                }
            ];

            for (const scenario of extremeScenarios) {
                whaleSteward.handleIncomingWhaleSignal(scenario);
                const analysis = whaleSteward.analyzeWhaleData();
                const update = await poseidonSystem.processWhaleAnalysis(analysis);
                expect(update.status).toBe('success');
                expect(update.ecosystemChanges.environmentalAdjustments).toBeDefined();
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.environmentalMetrics).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0);
        });

        it('should handle rapid environmental changes', async () => {
            // Simulate rapid temperature changes
            const temperatureChanges: WhaleEnvironmentalData[] = Array.from({ length: 10 }, (_, i) => ({
                waterTemperature: 15 + (i % 2 === 0 ? 10 : -10), // Alternating hot and cold
                waterDepth: 200,
                salinity: 35,
                timestamp: new Date(Date.now() + i * 100)
            }));

            for (const change of temperatureChanges) {
                whaleSteward.handleIncomingWhaleSignal(change);
                const analysis = whaleSteward.analyzeWhaleData();
                const update = await poseidonSystem.processWhaleAnalysis(analysis);
                expect(update.status).toBe('success');
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0.5); // Should show high adaptation
        });

        it('should handle concurrent signal processing', async () => {
            // Create multiple signals of different types
            const signals = [
                // Vocal signals
                ...Array.from({ length: 5 }, (_, i) => ({
                    signalType: 'song',
                    frequency: 20 + i,
                    duration: 5,
                    intensity: 0.8,
                    timestamp: new Date(Date.now() + i * 100)
                } as WhaleVocalSignal)),
                // Movement signals
                ...Array.from({ length: 5 }, (_, i) => ({
                    behaviorType: 'migration',
                    speed: 5 + i,
                    direction: 45,
                    depth: 100,
                    timestamp: new Date(Date.now() + i * 100)
                } as WhaleMovementPattern)),
                // Environmental signals
                ...Array.from({ length: 5 }, (_, i) => ({
                    waterTemperature: 15 + i,
                    waterDepth: 200,
                    salinity: 35,
                    timestamp: new Date(Date.now() + i * 100)
                } as WhaleEnvironmentalData))
            ];

            // Process signals concurrently
            const startTime = Date.now();
            await Promise.all(signals.map(async (signal) => {
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                const update = await poseidonSystem.processWhaleAnalysis(analysis);
                expect(update.status).toBe('success');
            }));
            const endTime = Date.now();

            // Verify processing time is reasonable
            expect(endTime - startTime).toBeLessThan(3000); // 3 seconds for 15 signals

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0);
        });
    });

    describe('Long-term Pattern Analysis', () => {
        it('should detect seasonal patterns over extended periods', async () => {
            // Generate signals over a simulated year (365 days)
            const signals: WhaleVocalSignal[] = Array.from({ length: 365 }, (_, i) => ({
                signalType: 'song',
                frequency: 20 + Math.sin(i / 30) * 5, // Seasonal variation
                duration: 5,
                intensity: 0.8,
                timestamp: new Date(Date.now() + i * 24 * 60 * 60 * 1000) // Daily intervals
            }));

            for (const signal of signals) {
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0.7); // High adaptation to seasonal patterns
        });

        it('should track migration patterns over time', async () => {
            // Generate movement patterns over 6 months
            const patterns: WhaleMovementPattern[] = Array.from({ length: 180 }, (_, i) => ({
                behaviorType: 'migration',
                speed: 5 + Math.sin(i / 30) * 2, // Varying speed
                direction: 45 + (i % 4) * 90, // Changing direction quarterly
                depth: 100 + Math.cos(i / 15) * 50, // Depth variation
                timestamp: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
            }));

            for (const pattern of patterns) {
                whaleSteward.handleIncomingWhaleSignal(pattern);
                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0.6);
        });
    });

    describe('Extreme Load Scenarios', () => {
        it('should handle burst of high-frequency signals', async () => {
            const signals: WhaleVocalSignal[] = Array.from({ length: 1000 }, (_, i) => ({
                signalType: 'song',
                frequency: 20 + Math.random() * 10,
                duration: 0.1, // Very short duration
                intensity: 0.9, // High intensity
                timestamp: new Date(Date.now() + i * 10) // 10ms intervals
            }));

            const startTime = Date.now();
            for (const signal of signals) {
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }
            const endTime = Date.now();

            // Verify processing time is reasonable
            expect(endTime - startTime).toBeLessThan(10000); // 10 seconds for 1000 signals

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0);
        });

        it('should maintain stability under rapid environmental changes', async () => {
            const changes: WhaleEnvironmentalData[] = Array.from({ length: 100 }, (_, i) => ({
                waterTemperature: 15 + Math.sin(i / 5) * 20, // Rapid temperature swings
                waterDepth: 200 + Math.cos(i / 3) * 100, // Rapid depth changes
                salinity: 35 + Math.sin(i / 4) * 5, // Rapid salinity changes
                timestamp: new Date(Date.now() + i * 100) // 100ms intervals
            }));

            for (const change of changes) {
                whaleSteward.handleIncomingWhaleSignal(change);
                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0.5);
        });
    });

    describe('Error Recovery and Graceful Degradation', () => {
        it('should recover from invalid signal bursts', async () => {
            // First, process some valid signals
            const validSignals = generateTestSignals(10);
            for (const signal of validSignals) {
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }

            // Then, process a burst of invalid signals
            const invalidSignals = generateInvalidSignals(50);

            for (const signal of invalidSignals) {
                expect(() => {
                    whaleSteward.handleIncomingWhaleSignal(signal as any);
                }).toThrow();
            }

            // Finally, process more valid signals
            const recoverySignals = generateTestSignals(10);
            for (const signal of recoverySignals) {
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                const update = await poseidonSystem.processWhaleAnalysis(analysis);
                expect(update.status).toBe('success');
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBe('stable');
        });

        it('should handle system overload gracefully', async () => {
            const { signals, expectedDuration } = generateOverloadScenario(100);

            // Process signals with increasing frequency
            const startTime = Date.now();
            for (let i = 0; i < signals.length; i++) {
                const signal = signals[i];
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                const update = await poseidonSystem.processWhaleAnalysis(analysis);
                expect(update.status).toBe('success');

                // Increase processing frequency
                if (i % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
            const endTime = Date.now();

            // Verify system remains stable
            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(endTime - startTime).toBeLessThan(expectedDuration * 2); // Allow for some overhead
        });
    });

    describe('Pattern Recognition Accuracy', () => {
        it('should accurately detect complex signal patterns', async () => {
            // Generate signals with a known pattern
            const signals: WhaleVocalSignal[] = Array.from({ length: 100 }, (_, i) => ({
                signalType: 'song',
                frequency: generateComplexPattern(20, 5, i / 10, i / 20),
                duration: 5,
                intensity: 0.8,
                timestamp: new Date(Date.now() + i * 1000)
            }));

            for (const signal of signals) {
                whaleSteward.handleIncomingWhaleSignal(signal);
                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0.7);
        });

        it('should identify correlation between different signal types', async () => {
            // Generate correlated signals
            const { vocal, environmental } = generateCorrelatedSignals(50);

            // Process signals in interleaved order
            for (let i = 0; i < 50; i++) {
                whaleSteward.handleIncomingWhaleSignal(vocal[i]);
                whaleSteward.handleIncomingWhaleSignal(environmental[i]);

                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0.6);
        });
    });

    describe('Extreme Scenarios', () => {
        it('should handle extreme environmental conditions', async () => {
            const { environmental } = generateExtremeScenario(100, 2.0);

            for (const change of environmental) {
                whaleSteward.handleIncomingWhaleSignal(change);
                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0.4);
        });

        it('should process rapid movement changes', async () => {
            const { movement } = generateExtremeScenario(100, 1.5);

            const startTime = Date.now();
            for (const pattern of movement) {
                whaleSteward.handleIncomingWhaleSignal(pattern);
                const analysis = whaleSteward.analyzeWhaleData();
                await poseidonSystem.processWhaleAnalysis(analysis);
            }
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(5000); // 5 seconds for 100 signals

            const status = await poseidonSystem.getEcosystemStatus();
            expect(status.status).toBeDefined();
            expect(status.adaptationLevel).toBeGreaterThan(0.5);
        });
    });
}); 