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

import { runBenchmark, BenchmarkOptions, generateTestJobs } from './setup';
import { NotificationPriority } from '../../notification_types';
import { performance } from 'perf_hooks';
import { register } from '../../metrics/system-metrics';
import { queueMetrics } from '../../metrics/queue-metrics';
import { serviceHealthMetrics } from '../../metrics/queue-metrics';
import { rugMetrics } from '../../metrics/system-metrics';

describe('Monitoring System Validation', () => {
    // Helper function to wait for metric to reach threshold
    async function waitForMetricThreshold(
        metricName: string,
        threshold: number,
        timeout: number = 5000
    ): Promise<boolean> {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const metrics = await register.getMetricsAsJSON();
            const metric = metrics.find(m => m.name === metricName);
            if (metric && metric.value >= threshold) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return false;
    }

    describe('System Health Monitoring', () => {
        it('should track CPU usage under load', async () => {
            const result = await runBenchmark(
                'CPU Load Test',
                { numJobs: 10000, concurrent: true },
                async (services, options) => {
                    // Simulate CPU-intensive operations
                    const jobs = generateTestJobs(options.numJobs);
                    await Promise.all(jobs.map(async (job) => {
                        // Simulate CPU work
                        const start = performance.now();
                        while (performance.now() - start < 10) {
                            Math.random() * Math.random();
                        }
                        await services.emailQueue.add(job);
                    }));
                }
            );

            // Verify CPU metrics were recorded
            const cpuThresholdReached = await waitForMetricThreshold('system_cpu_usage', 50);
            expect(cpuThresholdReached).toBe(true);
            expect(result.errors).toBe(0);
        });

        it('should track memory usage under load', async () => {
            const result = await runBenchmark(
                'Memory Load Test',
                { numJobs: 5000, concurrent: true },
                async (services, options) => {
                    // Simulate memory-intensive operations
                    const jobs = generateTestJobs(options.numJobs);
                    const largeData = new Array(1000).fill('x').join('');
                    await Promise.all(jobs.map(async (job) => {
                        const jobWithLargeData = {
                            ...job,
                            text: largeData,
                            html: `<p>${largeData}</p>`
                        };
                        await services.emailQueue.add(jobWithLargeData);
                    }));
                }
            );

            // Verify memory metrics were recorded
            const memoryThresholdReached = await waitForMetricThreshold('system_memory_usage_bytes', 100 * 1024 * 1024); // 100MB
            expect(memoryThresholdReached).toBe(true);
            expect(result.errors).toBe(0);
        });
    });

    describe('Queue Health Monitoring', () => {
        it('should track queue size and processing time', async () => {
            const result = await runBenchmark(
                'Queue Load Test',
                { numJobs: 2000, concurrent: true },
                async (services, options) => {
                    const jobs = generateTestJobs(options.numJobs);
                    await Promise.all(jobs.map(job => services.emailQueue.add(job)));
                    
                    // Wait for queue to process
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            );

            // Verify queue metrics were recorded
            const queueSizeRecorded = await waitForMetricThreshold('queue_size', 0);
            expect(queueSizeRecorded).toBe(true);
            expect(result.errors).toBe(0);
        });

        it('should track job processing delays', async () => {
            const result = await runBenchmark(
                'Queue Delay Test',
                { numJobs: 1000, concurrent: true },
                async (services, options) => {
                    const jobs = generateTestJobs(options.numJobs, NotificationPriority.HIGH);
                    await Promise.all(jobs.map(async (job) => {
                        // Simulate processing delay
                        await new Promise(resolve => setTimeout(resolve, 100));
                        await services.emailQueue.add(job);
                    }));
                }
            );

            // Verify processing time metrics were recorded
            const processingTimeRecorded = await waitForMetricThreshold('queue_processing_time_seconds_count', 0);
            expect(processingTimeRecorded).toBe(true);
            expect(result.errors).toBe(0);
        });
    });

    describe('Pattern Detection Monitoring', () => {
        it('should track pattern density under varying loads', async () => {
            const result = await runBenchmark(
                'Pattern Density Test',
                { numJobs: 3000, concurrent: true },
                async (services, options) => {
                    const jobs = generateTestJobs(options.numJobs);
                    // Simulate varying load patterns
                    for (let i = 0; i < jobs.length; i += 100) {
                        const batch = jobs.slice(i, i + 100);
                        await Promise.all(batch.map(job => services.emailQueue.add(job)));
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }
            );

            // Verify pattern metrics were recorded
            const patternDensityRecorded = await waitForMetricThreshold('rug_stability_score', 0);
            expect(patternDensityRecorded).toBe(true);
            expect(result.errors).toBe(0);
        });

        it('should track system stability under stress', async () => {
            const result = await runBenchmark(
                'System Stability Test',
                { numJobs: 5000, concurrent: true },
                async (services, options) => {
                    const jobs = generateTestJobs(options.numJobs);
                    // Simulate bursty load
                    for (let i = 0; i < jobs.length; i += 500) {
                        const batch = jobs.slice(i, i + 500);
                        await Promise.all(batch.map(job => services.emailQueue.add(job)));
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            );

            // Verify stability metrics were recorded
            const stabilityRecorded = await waitForMetricThreshold('rug_stability_score', 0);
            expect(stabilityRecorded).toBe(true);
            expect(result.errors).toBe(0);
        });
    });

    describe('Service Health Monitoring', () => {
        it('should track service health under load', async () => {
            const result = await runBenchmark(
                'Service Health Test',
                { numJobs: 1000, concurrent: true },
                async (services, options) => {
                    const jobs = generateTestJobs(options.numJobs);
                    await Promise.all(jobs.map(job => services.emailQueue.add(job)));
                    
                    // Simulate service operations
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            );

            // Verify service health metrics were recorded
            const healthScoreRecorded = await waitForMetricThreshold('service_health_score', 0);
            expect(healthScoreRecorded).toBe(true);
            expect(result.errors).toBe(0);
        });

        it('should track dependency health', async () => {
            const result = await runBenchmark(
                'Dependency Health Test',
                { numJobs: 500, concurrent: true },
                async (services, options) => {
                    const jobs = generateTestJobs(options.numJobs);
                    // Simulate dependency operations
                    await Promise.all(jobs.map(async (job) => {
                        await services.emailQueue.add(job);
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }));
                }
            );

            // Verify dependency health metrics were recorded
            const dependencyHealthRecorded = await waitForMetricThreshold('service_dependency_health', 0);
            expect(dependencyHealthRecorded).toBe(true);
            expect(result.errors).toBe(0);
        });
    });
}); 