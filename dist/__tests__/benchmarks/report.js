"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenchmarkReporter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class BenchmarkReporter {
    constructor() {
        this.results = [];
        this.reportDir = path_1.default.join(process.cwd(), 'benchmark-reports');
        if (!fs_1.default.existsSync(this.reportDir)) {
            fs_1.default.mkdirSync(this.reportDir, { recursive: true });
        }
    }
    addResult(result) {
        this.results.push(result);
    }
    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            results: this.results,
            summary: this.calculateSummary()
        };
        // Generate text report
        const textReport = this.generateTextReport(report);
        const reportPath = path_1.default.join(this.reportDir, `benchmark-report-${Date.now()}.txt`);
        fs_1.default.writeFileSync(reportPath, textReport);
        console.log(`Benchmark report generated: ${reportPath}`);
    }
    calculateSummary() {
        const totalJobs = this.results.reduce((sum, result) => sum + result.jobsProcessed, 0);
        const averageThroughput = this.results.reduce((sum, result) => sum + result.throughput, 0) / this.results.length;
        const averageLatency = this.results.reduce((sum, result) => sum + result.averageLatency, 0) / this.results.length;
        const totalErrors = this.results.reduce((sum, result) => sum + result.errors, 0);
        const memoryUsage = {
            averageStart: this.results.reduce((sum, result) => sum + result.memoryMetrics.start.heapUsed, 0) / this.results.length,
            averageEnd: this.results.reduce((sum, result) => sum + result.memoryMetrics.end.heapUsed, 0) / this.results.length,
            averagePeak: this.results.reduce((sum, result) => sum + result.memoryMetrics.peak.heapUsed, 0) / this.results.length,
            maxPeak: Math.max(...this.results.map(result => result.memoryMetrics.peak.heapUsed))
        };
        return {
            totalJobs,
            averageThroughput,
            averageLatency,
            totalErrors,
            memoryUsage
        };
    }
    formatMemory(bytes) {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    }
    generateTextReport(report) {
        const memoryDiff = (result) => {
            const diff = result.memoryMetrics.end.heapUsed - result.memoryMetrics.start.heapUsed;
            return diff >= 0 ? `+${this.formatMemory(diff)}` : this.formatMemory(diff);
        };
        return `
Benchmark Report
===============
Generated at: ${new Date(report.timestamp).toLocaleString()}

Summary
-------
Total Jobs: ${report.summary.totalJobs}
Average Throughput: ${report.summary.averageThroughput.toFixed(2)} jobs/second
Average Latency: ${report.summary.averageLatency.toFixed(2)}ms
Total Errors: ${report.summary.totalErrors}

Memory Usage:
- Average Start: ${this.formatMemory(report.summary.memoryUsage.averageStart)}
- Average End: ${this.formatMemory(report.summary.memoryUsage.averageEnd)}
- Average Peak: ${this.formatMemory(report.summary.memoryUsage.averagePeak)}
- Maximum Peak: ${this.formatMemory(report.summary.memoryUsage.maxPeak)}

Detailed Results
---------------
${report.results.map(result => `
Operation: ${result.operation}
Jobs Processed: ${result.jobsProcessed}
Duration: ${result.duration.toFixed(2)}ms
Throughput: ${result.throughput.toFixed(2)} jobs/second
Average Latency: ${result.averageLatency.toFixed(2)}ms
Memory Start: ${this.formatMemory(result.memoryMetrics.start.heapUsed)}
Memory End: ${this.formatMemory(result.memoryMetrics.end.heapUsed)}
Memory Peak: ${this.formatMemory(result.memoryMetrics.peak.heapUsed)}
Memory Change: ${memoryDiff(result)}
Errors: ${result.errors}
----------------------------------------
`).join('\n')}
`;
    }
}
exports.BenchmarkReporter = BenchmarkReporter;
//# sourceMappingURL=report.js.map