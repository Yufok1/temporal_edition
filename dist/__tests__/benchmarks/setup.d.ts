import { createTestServices } from '../integration/setup';
import { NotificationPriority } from '../../notification_types';
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
    throughput: number;
    averageLatency: number;
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
export declare function runBenchmark(operation: string, options: BenchmarkOptions, testFn: (services: Awaited<ReturnType<typeof createTestServices>>, options: BenchmarkOptions) => Promise<void>): Promise<BenchmarkResult>;
export declare function generateTestJobs(count: number, priority?: NotificationPriority): {
    recipient: string;
    subject: string;
    text: string;
    html: string;
    priority: NotificationPriority;
    metadata: {
        test: boolean;
        index: number;
    };
    type: string;
}[];
export declare function formatBenchmarkResult(result: BenchmarkResult): string;
export declare function calculatePercentile(latencies: number[], percentile: number): number;
export declare function measureLatency(startTime: number): number;
