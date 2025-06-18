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

import { runBenchmark, generateTestJobs, formatBenchmarkResult, BenchmarkOptions } from './setup';
import { NotificationPriority } from '../../types';
import { BenchmarkReporter } from './report';

describe('Queue Performance Benchmarks', () => {
    const benchmarkSizes = [100, 1000, 10000];
    const priorities = [
        NotificationPriority.URGENT,
        NotificationPriority.HIGH,
        NotificationPriority.MEDIUM,
        NotificationPriority.LOW
    ];
    const reporter = new BenchmarkReporter();

    afterAll(async () => {
        await reporter.generateReport();
    });

    describe('Sequential Job Processing', () => {
        benchmarkSizes.forEach(size => {
            it(`should process ${size} jobs sequentially`, async () => {
                const result = await runBenchmark(
                    `Sequential Processing (${size} jobs)`,
                    { numJobs: size },
                    async (services, options) => {
                        const jobs = generateTestJobs(options.numJobs);
                        for (const job of jobs) {
                            await services.emailQueue.addToQueue(job);
                        }
                    }
                );

                console.log(formatBenchmarkResult(result));
                reporter.addResult(result);
                expect(result.errors).toBe(0);
                expect(result.jobsProcessed).toBe(size);
            });
        });
    });

    describe('Concurrent Job Processing', () => {
        benchmarkSizes.forEach(size => {
            it(`should process ${size} jobs concurrently`, async () => {
                const result = await runBenchmark(
                    `Concurrent Processing (${size} jobs)`,
                    { numJobs: size, concurrent: true },
                    async (services, options) => {
                        const jobs = generateTestJobs(options.numJobs);
                        await Promise.all(
                            jobs.map(job => services.emailQueue.addToQueue(job))
                        );
                    }
                );

                console.log(formatBenchmarkResult(result));
                reporter.addResult(result);
                expect(result.errors).toBe(0);
                expect(result.jobsProcessed).toBe(size);
            });
        });
    });

    describe('Priority-based Processing', () => {
        priorities.forEach(priority => {
            it(`should process 1000 jobs with ${priority} priority`, async () => {
                const result = await runBenchmark(
                    `Priority Processing (${priority})`,
                    { numJobs: 1000, priority },
                    async (services, options) => {
                        const jobs = generateTestJobs(options.numJobs, options.priority);
                        await Promise.all(
                            jobs.map(job => services.emailQueue.addToQueue(job))
                        );
                    }
                );

                console.log(formatBenchmarkResult(result));
                reporter.addResult(result);
                expect(result.errors).toBe(0);
                expect(result.jobsProcessed).toBe(1000);
            });
        });
    });

    describe('Batch Processing', () => {
        const batchSizes = [10, 50, 100];
        batchSizes.forEach(batchSize => {
            it(`should process 1000 jobs in batches of ${batchSize}`, async () => {
                const result = await runBenchmark(
                    `Batch Processing (${batchSize} per batch)`,
                    { numJobs: 1000, batchSize },
                    async (services, options) => {
                        const jobs = generateTestJobs(options.numJobs);
                        for (let i = 0; i < jobs.length; i += options.batchSize!) {
                            const batch = jobs.slice(i, i + options.batchSize);
                            await Promise.all(
                                batch.map(job => services.emailQueue.addToQueue(job))
                            );
                        }
                    }
                );

                console.log(formatBenchmarkResult(result));
                reporter.addResult(result);
                expect(result.errors).toBe(0);
                expect(result.jobsProcessed).toBe(1000);
            });
        });
    });

    describe('Mixed Priority Processing', () => {
        it('should process 1000 jobs with mixed priorities', async () => {
            const result = await runBenchmark(
                'Mixed Priority Processing',
                { numJobs: 1000 },
                async (services, options) => {
                    const jobs = Array(options.numJobs).fill(null).map((_, index) => ({
                        to: `test${index}@example.com`,
                        subject: `Test Email ${index}`,
                        text: `Test content ${index}`,
                        html: `<p>Test content ${index}</p>`,
                        priority: priorities[index % priorities.length],
                        metadata: { test: true, index }
                    }));

                    await Promise.all(
                        jobs.map(job => services.emailQueue.addToQueue(job))
                    );
                }
            );

            console.log(formatBenchmarkResult(result));
            reporter.addResult(result);
            expect(result.errors).toBe(0);
            expect(result.jobsProcessed).toBe(1000);
        });
    });

    describe('Error Handling Under Load', () => {
        it('should handle 1000 jobs with simulated failures', async () => {
            const result = await runBenchmark(
                'Error Handling Under Load',
                { numJobs: 1000 },
                async (services, options) => {
                    // Mock email service to fail every 5th job
                    jest.spyOn(services.emailService, 'sendEmail')
                        .mockImplementation(async (job) => {
                            if (job.metadata?.index % 5 === 0) {
                                throw new Error('Simulated failure');
                            }
                            return Promise.resolve();
                        });

                    const jobs = generateTestJobs(options.numJobs);
                    await Promise.all(
                        jobs.map(job => services.emailQueue.addToQueue(job))
                    );
                }
            );

            console.log(formatBenchmarkResult(result));
            reporter.addResult(result);
            // We expect some errors due to simulated failures
            expect(result.errors).toBeGreaterThan(0);
            expect(result.jobsProcessed).toBe(1000);
        });
    });
}); 