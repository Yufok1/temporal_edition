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

import { runBenchmark, formatBenchmarkResult } from './setup';
import { redisClient } from '../integration/setup';
import { Counter, Registry } from 'prom-client';
import { BenchmarkReporter } from './report';

describe('Infrastructure Performance Benchmarks', () => {
    const registry = new Registry();
    const testCounter = new Counter({
        name: 'test_counter',
        help: 'Test counter for benchmarks',
        registers: [registry]
    });
    const reporter = new BenchmarkReporter();

    afterAll(async () => {
        await reporter.generateReport();
    });

    describe('Redis Performance', () => {
        const keyCounts = [1000, 10000, 100000];

        keyCounts.forEach(count => {
            it(`should handle ${count} Redis operations`, async () => {
                const result = await runBenchmark(
                    `Redis Operations (${count} keys)`,
                    { numJobs: count },
                    async (services, options) => {
                        // Write operations
                        for (let i = 0; i < options.numJobs; i++) {
                            await redisClient.set(`test:key:${i}`, `value:${i}`);
                        }

                        // Read operations
                        for (let i = 0; i < options.numJobs; i++) {
                            await redisClient.get(`test:key:${i}`);
                        }

                        // Cleanup
                        for (let i = 0; i < options.numJobs; i++) {
                            await redisClient.del(`test:key:${i}`);
                        }
                    }
                );

                console.log(formatBenchmarkResult(result));
                reporter.addResult(result);
                expect(result.errors).toBe(0);
            });
        });

        it('should handle Redis pipeline operations', async () => {
            const result = await runBenchmark(
                'Redis Pipeline Operations',
                { numJobs: 10000 },
                async (services, options) => {
                    const pipeline = redisClient.multi();
                    
                    // Batch write
                    for (let i = 0; i < options.numJobs; i++) {
                        pipeline.set(`test:key:${i}`, `value:${i}`);
                    }
                    await pipeline.exec();

                    // Batch read
                    const readPipeline = redisClient.multi();
                    for (let i = 0; i < options.numJobs; i++) {
                        readPipeline.get(`test:key:${i}`);
                    }
                    await readPipeline.exec();

                    // Batch delete
                    const deletePipeline = redisClient.multi();
                    for (let i = 0; i < options.numJobs; i++) {
                        deletePipeline.del(`test:key:${i}`);
                    }
                    await deletePipeline.exec();
                }
            );

            console.log(formatBenchmarkResult(result));
            reporter.addResult(result);
            expect(result.errors).toBe(0);
        });
    });

    describe('Prometheus Performance', () => {
        const metricCounts = [1000, 10000, 100000];

        metricCounts.forEach(count => {
            it(`should handle ${count} metric operations`, async () => {
                const result = await runBenchmark(
                    `Prometheus Operations (${count} metrics)`,
                    { numJobs: count },
                    async (services, options) => {
                        // Increment counter
                        for (let i = 0; i < options.numJobs; i++) {
                            testCounter.inc();
                        }

                        // Get metrics
                        const metrics = await registry.getMetricsAsJSON();
                        expect(metrics.length).toBeGreaterThan(0);
                    }
                );

                console.log(formatBenchmarkResult(result));
                reporter.addResult(result);
                expect(result.errors).toBe(0);
            });
        });

        it('should handle concurrent metric operations', async () => {
            const result = await runBenchmark(
                'Concurrent Prometheus Operations',
                { numJobs: 10000 },
                async (services, options) => {
                    const operations = Array(options.numJobs).fill(null).map(async (_, index) => {
                        testCounter.inc();
                        if (index % 1000 === 0) {
                            await registry.getMetricsAsJSON();
                        }
                    });

                    await Promise.all(operations);
                }
            );

            console.log(formatBenchmarkResult(result));
            reporter.addResult(result);
            expect(result.errors).toBe(0);
        });
    });

    describe('Combined Infrastructure Load', () => {
        it('should handle combined Redis and Prometheus operations', async () => {
            const result = await runBenchmark(
                'Combined Infrastructure Operations',
                { numJobs: 10000 },
                async (services, options) => {
                    const operations = Array(options.numJobs).fill(null).map(async (_, index) => {
                        // Redis operation
                        await redisClient.set(`test:key:${index}`, `value:${index}`);
                        
                        // Prometheus operation
                        testCounter.inc();

                        if (index % 1000 === 0) {
                            // Get metrics
                            await registry.getMetricsAsJSON();
                            
                            // Get Redis value
                            await redisClient.get(`test:key:${index}`);
                        }
                    });

                    await Promise.all(operations);

                    // Cleanup
                    const pipeline = redisClient.multi();
                    for (let i = 0; i < options.numJobs; i++) {
                        pipeline.del(`test:key:${i}`);
                    }
                    await pipeline.exec();
                }
            );

            console.log(formatBenchmarkResult(result));
            reporter.addResult(result);
            expect(result.errors).toBe(0);
        });
    });
}); 