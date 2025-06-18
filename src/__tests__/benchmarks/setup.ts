import { createTestServices, cleanupRedis } from '../integration/setup';
import { NotificationPriority } from '../../notification_types';
import { performance } from 'perf_hooks';

export interface MemoryMetrics {
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
    rss: number;
    timestamp: number;
}

export interface BenchmarkResult {
    operation: string;
    duration: number;
    jobsProcessed: number;
    throughput: number; // jobs per second
    averageLatency: number; // milliseconds per job
    errors: number;
    memoryMetrics: {
        start: MemoryMetrics;
        end: MemoryMetrics;
        peak: MemoryMetrics;
    };
}

export interface BenchmarkOptions {
    numJobs: number;
    priority?: NotificationPriority;
    concurrent?: boolean;
    batchSize?: number;
}

function getMemoryMetrics(): MemoryMetrics {
    const memoryUsage = process.memoryUsage();
    return {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers,
        rss: memoryUsage.rss,
        timestamp: performance.now()
    };
}

export async function runBenchmark(
    operation: string,
    options: BenchmarkOptions,
    testFn: (services: Awaited<ReturnType<typeof createTestServices>>, options: BenchmarkOptions) => Promise<void>
): Promise<BenchmarkResult> {
    const services = await createTestServices();
    const errors: Error[] = [];
    const startTime = performance.now();
    const startMemory = getMemoryMetrics();
    let peakMemory = startMemory;

    // Set up memory monitoring
    const memoryCheckInterval = setInterval(() => {
        const currentMemory = getMemoryMetrics();
        if (currentMemory.heapUsed > peakMemory.heapUsed) {
            peakMemory = currentMemory;
        }
    }, 100); // Check every 100ms

    try {
        await testFn(services, options);
    } catch (error) {
        errors.push(error as Error);
    }

    clearInterval(memoryCheckInterval);
    const endTime = performance.now();
    const endMemory = getMemoryMetrics();
    const duration = endTime - startTime;
    const throughput = (options.numJobs / duration) * 1000; // jobs per second
    const averageLatency = duration / options.numJobs;

    await services.emailQueue.close();
    await cleanupRedis();

    return {
        operation,
        duration,
        jobsProcessed: options.numJobs,
        throughput,
        averageLatency,
        errors: errors.length,
        memoryMetrics: {
            start: startMemory,
            end: endMemory,
            peak: peakMemory
        }
    };
}

export function generateTestJobs(count: number, priority: NotificationPriority = NotificationPriority.MEDIUM) {
    return Array(count).fill(null).map((_, index) => ({
        recipient: `test${index}@example.com`,
        subject: `Test Email ${index}`,
        text: `Test content ${index}`,
        html: `<p>Test content ${index}</p>`,
        priority,
        metadata: { test: true, index },
        type: 'test',
    }));
}

export function formatBenchmarkResult(result: BenchmarkResult): string {
    const formatMemory = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    const memoryDiff = result.memoryMetrics.end.heapUsed - result.memoryMetrics.start.heapUsed;
    const memoryDiffFormatted = memoryDiff >= 0 ? `+${formatMemory(memoryDiff)}` : formatMemory(memoryDiff);

    return `
Benchmark Results for ${result.operation}:
----------------------------------------
Total Duration: ${result.duration.toFixed(2)}ms
Jobs Processed: ${result.jobsProcessed}
Throughput: ${result.throughput.toFixed(2)} jobs/second
Average Latency: ${result.averageLatency.toFixed(2)}ms/job
Errors: ${result.errors}

Memory Usage:
Start: ${formatMemory(result.memoryMetrics.start.heapUsed)}
End: ${formatMemory(result.memoryMetrics.end.heapUsed)}
Peak: ${formatMemory(result.memoryMetrics.peak.heapUsed)}
Change: ${memoryDiffFormatted}
`;
}

export function calculatePercentile(latencies: number[], percentile: number): number {
    const sorted = [...latencies].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
}

export function measureLatency(startTime: number): number {
    return performance.now() - startTime;
} 