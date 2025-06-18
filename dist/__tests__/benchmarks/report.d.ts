import { BenchmarkResult } from '../../types';
export declare class BenchmarkReporter {
    private results;
    private readonly reportDir;
    constructor();
    addResult(result: BenchmarkResult): void;
    generateReport(): Promise<void>;
    private calculateSummary;
    private formatMemory;
    private generateTextReport;
}
