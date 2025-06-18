"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureLatency = exports.calculatePercentile = exports.formatBenchmarkResult = exports.generateTestJobs = exports.runBenchmark = void 0;
const setup_1 = require("../integration/setup");
const notification_types_1 = require("../../notification_types");
const perf_hooks_1 = require("perf_hooks");
function getMemoryMetrics() {
    const memoryUsage = process.memoryUsage();
    return {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers,
        rss: memoryUsage.rss,
        timestamp: perf_hooks_1.performance.now()
    };
}
async function runBenchmark(operation, options, testFn) {
    const services = await (0, setup_1.createTestServices)();
    const errors = [];
    const startTime = perf_hooks_1.performance.now();
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
    }
    catch (error) {
        errors.push(error);
    }
    clearInterval(memoryCheckInterval);
    const endTime = perf_hooks_1.performance.now();
    const endMemory = getMemoryMetrics();
    const duration = endTime - startTime;
    const throughput = (options.numJobs / duration) * 1000; // jobs per second
    const averageLatency = duration / options.numJobs;
    await services.emailQueue.close();
    await (0, setup_1.cleanupRedis)();
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
exports.runBenchmark = runBenchmark;
function generateTestJobs(count, priority = notification_types_1.NotificationPriority.MEDIUM) {
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
exports.generateTestJobs = generateTestJobs;
function formatBenchmarkResult(result) {
    const formatMemory = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
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
exports.formatBenchmarkResult = formatBenchmarkResult;
function calculatePercentile(latencies, percentile) {
    const sorted = [...latencies].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
}
exports.calculatePercentile = calculatePercentile;
function measureLatency(startTime) {
    return perf_hooks_1.performance.now() - startTime;
}
exports.measureLatency = measureLatency;
//# sourceMappingURL=setup.js.map