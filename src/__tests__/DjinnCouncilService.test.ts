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

import { DjinnCouncilService } from '../DjinnCouncilService';
import { register } from 'prom-client';
import { logger } from '../utils/logger';

jest.mock('../utils/logger');

describe('DjinnCouncilService', () => {
    let djinnCouncil: DjinnCouncilService;

    beforeEach(() => {
        // Clear Prometheus registry before each test
        register.clear();
        djinnCouncil = new DjinnCouncilService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Alignment Metrics', () => {
        it('should record system alignment metrics', async () => {
            const metrics = await djinnCouncil.getMetrics();
            expect(metrics).toContain('djinn_alignment_gauge');
            expect(metrics).toContain('djinn_evolution_counter');
            expect(metrics).toContain('djinn_stability_gauge');
            expect(metrics).toContain('djinn_purpose_gauge');
        });

        it('should calculate lawful metrics based on queue performance', async () => {
            // Simulate queue performance data
            const queueMetrics = {
                successRate: 0.95,
                errorRate: 0.05,
                processingTime: 100,
                queueSize: 50
            };

            const alignment = await djinnCouncil.calculateLawfulMetrics(queueMetrics);
            expect(alignment).toHaveProperty('alignment');
            expect(alignment).toHaveProperty('stability');
            expect(alignment).toHaveProperty('purpose');
            expect(alignment.alignment).toBeGreaterThanOrEqual(0);
            expect(alignment.alignment).toBeLessThanOrEqual(1);
        });

        it('should maintain alignment during system stress', async () => {
            // Simulate system stress
            const stressMetrics = {
                successRate: 0.7,
                errorRate: 0.3,
                processingTime: 500,
                queueSize: 1000
            };

            const alignment = await djinnCouncil.calculateLawfulMetrics(stressMetrics);
            expect(alignment.alignment).toBeLessThan(0.8); // Lower alignment during stress
            expect(alignment.stability).toBeLessThan(0.8); // Lower stability during stress
        });
    });

    describe('Component Health Monitoring', () => {
        it('should track component health status', async () => {
            const componentHealth = await djinnCouncil.getComponentHealth();
            expect(componentHealth).toHaveProperty('components');
            expect(Array.isArray(componentHealth.components)).toBe(true);
            
            componentHealth.components.forEach(component => {
                expect(component).toHaveProperty('name');
                expect(component).toHaveProperty('status');
                expect(component).toHaveProperty('lastChecked');
            });
        });

        it('should detect component degradation', async () => {
            // Simulate component degradation
            const degradedComponent = {
                name: 'test-component',
                status: 'degraded',
                metrics: {
                    errorRate: 0.2,
                    latency: 500
                }
            };

            const health = await djinnCouncil.recordComponentHealth(degradedComponent);
            expect(health.status).toBe('degraded');
            expect(health.metrics.errorRate).toBe(0.2);
        });
    });

    describe('Network and Dependency Health', () => {
        it('should monitor network latency', async () => {
            const latency = await djinnCouncil.getNetworkLatency();
            expect(latency).toHaveProperty('latency');
            expect(typeof latency.latency).toBe('object');
        });

        it('should track dependency health', async () => {
            const dependencies = await djinnCouncil.getDependencyHealth();
            expect(dependencies).toHaveProperty('dependencies');
            expect(Array.isArray(dependencies.dependencies)).toBe(true);
        });

        it('should detect dependency failures', async () => {
            // Simulate dependency failure
            const failedDependency = {
                name: 'test-dependency',
                status: 'failed',
                error: 'Connection timeout'
            };

            const health = await djinnCouncil.recordDependencyHealth(failedDependency);
            expect(health.status).toBe('failed');
            expect(health.error).toBe('Connection timeout');
        });
    });

    describe('Data Integrity', () => {
        it('should monitor data integrity metrics', async () => {
            const integrity = await djinnCouncil.getDataIntegrity();
            expect(integrity).toHaveProperty('integrity');
            expect(typeof integrity.integrity).toBe('object');
        });

        it('should detect data corruption', async () => {
            // Simulate data corruption
            const corruptedData = {
                type: 'test-data',
                integrity: 0.5,
                errors: ['checksum mismatch']
            };

            const result = await djinnCouncil.recordDataIntegrity(corruptedData);
            expect(result.integrity).toBe(0.5);
            expect(result.errors).toContain('checksum mismatch');
        });
    });

    describe('Error Handling and Recovery', () => {
        it('should track error distribution', async () => {
            const errors = await djinnCouncil.getErrorDistribution();
            expect(errors).toHaveProperty('errors');
            expect(Array.isArray(errors.errors)).toBe(true);
        });

        it('should handle cascading failures', async () => {
            // Simulate cascading failure
            const failure = {
                primary: 'component-a',
                affected: ['component-b', 'component-c'],
                error: 'Cascading failure detected'
            };

            const result = await djinnCouncil.handleCascadingFailure(failure);
            expect(result).toHaveProperty('recovery');
            expect(result).toHaveProperty('affectedComponents');
            expect(result.affectedComponents).toHaveLength(3);
        });

        it('should implement graceful degradation', async () => {
            // Simulate system degradation
            const degradation = {
                component: 'test-component',
                severity: 'high',
                metrics: {
                    performance: 0.3,
                    reliability: 0.4
                }
            };

            const result = await djinnCouncil.implementGracefulDegradation(degradation);
            expect(result).toHaveProperty('degradedServices');
            expect(result).toHaveProperty('maintainedServices');
            expect(result.degradedServices).toContain('test-component');
        });
    });

    describe('Evolution and Adaptation', () => {
        it('should track system evolution', async () => {
            const evolution = await djinnCouncil.getEvolutionMetrics();
            expect(evolution).toHaveProperty('adaptations');
            expect(evolution).toHaveProperty('improvements');
            expect(evolution).toHaveProperty('learnings');
        });

        it('should record system adaptations', async () => {
            const adaptation = {
                type: 'performance',
                change: 'increased queue capacity',
                impact: 'positive',
                metrics: {
                    before: 0.7,
                    after: 0.9
                }
            };

            const result = await djinnCouncil.recordAdaptation(adaptation);
            expect(result).toHaveProperty('success');
            expect(result).toHaveProperty('metrics');
            expect(result.metrics.improvement).toBeGreaterThan(0);
        });
    });

    describe('Integration with Logging', () => {
        it('should log component health changes', () => {
            djinnCouncil.recordComponentHealth('email-queue', 'healthy', 0.95);
            expect(logger.info).toHaveBeenCalledWith(
                'Component health recorded: email-queue - healthy',
                expect.any(Object)
            );
        });

        it('should log error occurrences', () => {
            djinnCouncil.recordError('timeout', 'high', 'email-queue');
            expect(logger.warn).toHaveBeenCalledWith(
                'Error recorded: timeout',
                expect.any(Object)
            );
        });
    });
});