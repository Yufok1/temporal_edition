import { IntegrationMonitor } from '../../monitoring/IntegrationMonitor';
import { WhaleStewardSystem } from '../../services/WhaleStewardSystem';
import { PoseidonSystem } from '../../services/PoseidonSystem';
import { WhaleVocalSignal, WhaleMovementPattern, WhaleEnvironmentalData, WhaleAnalysisResult } from '../../types/whale';

describe('IntegrationMonitor', () => {
    let monitor: IntegrationMonitor;
    let whaleSteward: WhaleStewardSystem;
    let poseidonSystem: PoseidonSystem;

    beforeEach(() => {
        whaleSteward = new WhaleStewardSystem();
        poseidonSystem = new PoseidonSystem();
        monitor = new IntegrationMonitor(whaleSteward, poseidonSystem);
    });

    describe('Signal Processing', () => {
        it('should track valid signal processing', async () => {
            const signal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 20,
                duration: 5,
                intensity: 0.8,
                timestamp: new Date()
            };

            await monitor.trackSignalProcessing(signal);
            const signalReport = monitor.getSignalReport();

            expect(signalReport.totalSignals).toBe(1);
            expect(signalReport.validSignals).toBe(1);
            expect(signalReport.invalidSignals).toBe(0);
            expect(signalReport.signalTypes.get('song')).toBe(1);
            expect(signalReport.averageIntensity).toBe(0.8);
            expect(signalReport.averageFrequency).toBe(20);
        });

        it('should track invalid signal processing', async () => {
            const invalidSignal = {
                type: 'invalid',
                timestamp: new Date()
            };

            await expect(monitor.trackSignalProcessing(invalidSignal)).rejects.toThrow();
            const signalReport = monitor.getSignalReport();

            expect(signalReport.totalSignals).toBe(1);
            expect(signalReport.validSignals).toBe(0);
            expect(signalReport.invalidSignals).toBe(1);
        });
    });

    describe('Pattern Analysis', () => {
        it('should track pattern analysis', async () => {
            const analysis: WhaleAnalysisResult = {
                signalType: 'song',
                confidence: 0.8,
                impact: 0.6,
                patterns: [
                    { type: 'seasonal', confidence: 0.9 },
                    { type: 'trend', confidence: 0.7 }
                ]
            } as WhaleAnalysisResult;

            await monitor.trackAnalysis(analysis);
            const patternReport = monitor.getPatternReport();

            expect(patternReport.patternsDetected).toBe(2);
            expect(patternReport.patternTypes.get('seasonal')).toBe(1);
            expect(patternReport.patternTypes.get('trend')).toBe(1);
            expect(patternReport.seasonalPatterns).toBe(1);
            expect(patternReport.trendPatterns).toBe(1);
            expect(patternReport.patternConfidence).toBe(0.8);
        });

        it('should handle analysis without patterns', async () => {
            const analysis: WhaleAnalysisResult = {
                signalType: 'song',
                confidence: 0.8,
                impact: 0.6
            } as WhaleAnalysisResult;

            await monitor.trackAnalysis(analysis);
            const patternReport = monitor.getPatternReport();

            expect(patternReport.patternsDetected).toBe(0);
            expect(patternReport.patternConfidence).toBe(0.8);
        });
    });

    describe('Alert Conditions', () => {
        it('should detect high processing time', async () => {
            const signal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 20,
                duration: 5,
                intensity: 0.8,
                timestamp: new Date()
            };

            // Simulate slow processing
            jest.spyOn(whaleSteward, 'handleIncomingWhaleSignal').mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 1500));
            });

            await monitor.trackSignalProcessing(signal);
            const alerts = monitor.checkAlerts();

            expect(alerts).toContainEqual({
                metric: 'signalProcessingTime',
                severity: 'warning',
                value: expect.any(Number)
            });
        });

        it('should detect high invalid signal count', async () => {
            const invalidSignal = {
                type: 'invalid',
                timestamp: new Date()
            };

            for (let i = 0; i < 11; i++) {
                await expect(monitor.trackSignalProcessing(invalidSignal)).rejects.toThrow();
            }

            const alerts = monitor.checkAlerts();

            expect(alerts).toContainEqual({
                metric: 'invalidSignals',
                severity: 'error',
                value: 11
            });
        });

        it('should detect low pattern confidence', async () => {
            const analysis: WhaleAnalysisResult = {
                signalType: 'song',
                confidence: 0.3,
                impact: 0.6
            } as WhaleAnalysisResult;

            await monitor.trackAnalysis(analysis);
            const alerts = monitor.checkAlerts();

            expect(alerts).toContainEqual({
                metric: 'patternConfidence',
                severity: 'warning',
                value: 0.3
            });
        });
    });

    describe('Performance Metrics', () => {
        it('should track processing times', async () => {
            const signal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 20,
                duration: 5,
                intensity: 0.8,
                timestamp: new Date()
            };

            const analysis: WhaleAnalysisResult = {
                signalType: 'song',
                confidence: 0.8,
                impact: 0.6
            } as WhaleAnalysisResult;

            await monitor.trackSignalProcessing(signal);
            await monitor.trackAnalysis(analysis);

            const performanceReport = monitor.getPerformanceReport();

            expect(performanceReport.signalProcessingTime).toBeGreaterThan(0);
            expect(performanceReport.analysisTime).toBeGreaterThan(0);
            expect(performanceReport.totalProcessingTime).toBeGreaterThan(0);
        });

        it('should track uptime', () => {
            const uptime = monitor.getUptime();
            expect(uptime).toBeGreaterThan(0);
        });
    });

    describe('Reset Functionality', () => {
        it('should reset all metrics', async () => {
            const signal: WhaleVocalSignal = {
                signalType: 'song',
                frequency: 20,
                duration: 5,
                intensity: 0.8,
                timestamp: new Date()
            };

            await monitor.trackSignalProcessing(signal);
            monitor.resetMetrics();

            const signalReport = monitor.getSignalReport();
            const patternReport = monitor.getPatternReport();
            const performanceReport = monitor.getPerformanceReport();

            expect(signalReport.totalSignals).toBe(0);
            expect(signalReport.validSignals).toBe(0);
            expect(signalReport.invalidSignals).toBe(0);
            expect(patternReport.patternsDetected).toBe(0);
            expect(performanceReport.signalProcessingTime).toBe(0);
        });
    });

    it('should monitor signal processing successfully', async () => {
        const signal: WhaleVocalSignal = {
            signalType: 'song',
            frequency: 20,
            duration: 5,
            intensity: 0.8,
            timestamp: new Date()
        };

        const metrics = await monitor.monitorSignalProcessing(signal);
        expect(metrics).toBeDefined();
        expect(metrics.signalType).toBeDefined();
        expect(metrics.signalProcessingTime).toBeGreaterThan(0);
        expect(metrics.ecosystemUpdateTime).toBeGreaterThan(0);
        expect(metrics.error).toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
        const invalidSignal = {
            type: 'invalid',
            timestamp: new Date()
        };

        const metrics = await monitor.monitorSignalProcessing(invalidSignal);
        expect(metrics.error).toBeDefined();
        expect(metrics.signalType).toBe('error');
        expect(metrics.confidence).toBe(0);
        expect(metrics.impact).toBe(0);
    });

    it('should track performance metrics', async () => {
        // Process multiple signals
        const signals: WhaleVocalSignal[] = Array.from({ length: 5 }, (_, i) => ({
            signalType: 'song',
            frequency: 20 + i,
            duration: 5,
            intensity: 0.8,
            timestamp: new Date()
        }));

        for (const signal of signals) {
            await monitor.monitorSignalProcessing(signal);
        }

        const performance = monitor.getPerformanceMetrics();
        expect(performance.averageProcessingTime).toBeGreaterThan(0);
        expect(performance.averageUpdateTime).toBeGreaterThan(0);
        expect(performance.successRate).toBeGreaterThanOrEqual(0);
        expect(performance.successRate).toBeLessThanOrEqual(1);
        expect(performance.errorRate).toBeGreaterThanOrEqual(0);
        expect(performance.errorRate).toBeLessThanOrEqual(1);
    });

    it('should generate comprehensive reports', async () => {
        // Process some signals
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
            } as WhaleMovementPattern,
            {
                waterTemperature: 15,
                waterDepth: 200,
                salinity: 35,
                timestamp: new Date()
            } as WhaleEnvironmentalData
        ];

        for (const signal of signals) {
            await monitor.monitorSignalProcessing(signal);
        }

        const report = monitor.generateReport();
        expect(report).toContain('Integration Monitoring Report');
        expect(report).toContain('Performance Metrics');
        expect(report).toContain('Recent Activity');
        expect(report).toContain('Error Summary');
        expect(report).toContain('System Health');
    });

    it('should filter metrics by signal type', async () => {
        // Process different types of signals
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
            } as WhaleMovementPattern,
            {
                waterTemperature: 15,
                waterDepth: 200,
                salinity: 35,
                timestamp: new Date()
            } as WhaleEnvironmentalData
        ];

        for (const signal of signals) {
            await monitor.monitorSignalProcessing(signal);
        }

        const vocalMetrics = monitor.getMetricsByType('vocal');
        expect(vocalMetrics.length).toBeGreaterThan(0);
        expect(vocalMetrics.every(m => m.signalType === 'vocal')).toBe(true);

        const movementMetrics = monitor.getMetricsByType('movement');
        expect(movementMetrics.length).toBeGreaterThan(0);
        expect(movementMetrics.every(m => m.signalType === 'movement')).toBe(true);
    });

    it('should detect and alert on performance issues', async () => {
        const signal: WhaleVocalSignal = {
            signalType: 'song',
            frequency: 20,
            duration: 5,
            intensity: 0.8,
            timestamp: new Date()
        };

        const metrics = await monitor.monitorSignalProcessing(signal);

        // Test alert conditions
        expect(monitor.shouldAlertHighProcessingTime(metrics)).toBe(false);
        expect(monitor.shouldAlertHighUpdateTime(metrics)).toBe(false);
        expect(monitor.shouldAlertLowConfidence(metrics)).toBe(false);
        expect(monitor.shouldAlertHighImpact(metrics)).toBe(false);
        expect(monitor.shouldAlertEcosystemStatus(metrics)).toBe(false);
    });

    it('should maintain metrics history within limits', async () => {
        // Process more signals than the history limit
        const signals: WhaleVocalSignal[] = Array.from({ length: 1100 }, (_, i) => ({
            signalType: 'song',
            frequency: 20 + i,
            duration: 5,
            intensity: 0.8,
            timestamp: new Date()
        }));

        for (const signal of signals) {
            await monitor.monitorSignalProcessing(signal);
        }

        const performance = monitor.getPerformanceMetrics();
        expect(performance.adaptationTrend.length).toBeLessThanOrEqual(100);
        expect(performance.confidenceTrend.length).toBeLessThanOrEqual(100);
        expect(performance.impactTrend.length).toBeLessThanOrEqual(100);
    });
}); 