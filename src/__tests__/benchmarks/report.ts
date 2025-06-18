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

import { BenchmarkResult } from '../../types';
import fs from 'fs';
import path from 'path';

interface BenchmarkReport {
    timestamp: string;
    results: BenchmarkResult[];
    summary: {
        totalJobs: number;
        averageThroughput: number;
        averageLatency: number;
        totalErrors: number;
        memoryUsage: {
            averageStart: number;
            averageEnd: number;
            averagePeak: number;
            maxPeak: number;
        };
    };
}

export class BenchmarkReporter {
    private results: BenchmarkResult[] = [];
    private readonly reportDir: string;

    constructor() {
        this.reportDir = path.join(process.cwd(), 'benchmark-reports');
        if (!fs.existsSync(this.reportDir)) {
            fs.mkdirSync(this.reportDir, { recursive: true });
        }
    }

    public addResult(result: BenchmarkResult): void {
        this.results.push(result);
    }

    public async generateReport(): Promise<void> {
        const report: BenchmarkReport = {
            timestamp: new Date().toISOString(),
            results: this.results,
            summary: this.calculateSummary()
        };

        // Generate text report
        const textReport = this.generateTextReport(report);
        const reportPath = path.join(this.reportDir, `benchmark-report-${Date.now()}.txt`);
        fs.writeFileSync(reportPath, textReport);

        console.log(`Benchmark report generated: ${reportPath}`);
    }

    private calculateSummary(): BenchmarkReport['summary'] {
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

    private formatMemory(bytes: number): string {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    }

    private generateTextReport(report: BenchmarkReport): string {
        const memoryDiff = (result: BenchmarkResult) => {
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