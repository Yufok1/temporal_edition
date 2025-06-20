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

import { SystemMetrics } from '../services/TemporalSequencer';
import { AnalysisResult } from '../services/BreathMirrorAnalysis';
import { GovernanceStatus } from '../services/GovernanceTracker';

// Browser-safe metrics implementation
export class MetricsService {
    private metrics: Map<string, any> = new Map();
    private counters: Map<string, number> = new Map();
    private gauges: Map<string, number> = new Map();
    private histograms: Map<string, number[]> = new Map();

    constructor() {
        console.log('📊 Metrics service initialized (browser-safe mode)');
    }

    public registerSystem(systemId: string): void {
        console.log(`System registered: ${systemId}`);
        this.setGauge('solar_alignment_score', 1.0, { systemId });
        this.setGauge('solar_system_stability', 1.0, { systemId });
        this.setGauge('system_compliance_score', 1.0, { systemId });
    }

    public updateSystemMetrics(systemId: string, metrics: SystemMetrics): void {
        this.setGauge('solar_alignment_score', metrics.alignmentScore, { systemId });
        this.setGauge('solar_system_stability', metrics.stabilityIndex, { systemId });
        this.recordHistogram('system_performance_response_time', metrics.performanceMetrics.responseTime, { systemId, operation: 'default' });
        this.incrementCounter('system_performance_throughput', metrics.performanceMetrics.throughput, { systemId, operation: 'default' });
        this.setGauge('system_performance_error_rate', metrics.performanceMetrics.errorRate, { systemId, errorType: 'total' });
    }

    public updateAnalysisResult(systemId: string, result: AnalysisResult): void {
        this.setGauge('solar_alignment_score', result.metrics.alignmentScore, { systemId });
        this.setGauge('solar_system_stability', result.metrics.stabilityIndex, { systemId });
    }

    public updateGovernanceStatus(systemId: string, status: GovernanceStatus): void {
        this.setGauge('system_compliance_score', status.complianceScore, { systemId });

        // Count violations by severity
        const violationsBySeverity = status.violations.reduce((acc, violation) => {
            acc[violation.severity] = (acc[violation.severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(violationsBySeverity).forEach(([severity, count]) => {
            this.incrementCounter('system_governance_violations', count, { systemId, severity });
        });
    }

    public incrementRemediationCount(systemId: string, actionType: string): void {
        this.incrementCounter('system_remediation_count', 1, { systemId, actionType });
    }

    public async getMetrics(): Promise<string> {
        const result = {
            counters: Object.fromEntries(this.counters),
            gauges: Object.fromEntries(this.gauges),
            histograms: Object.fromEntries(
                Array.from(this.histograms.entries()).map(([key, values]) => [
                    key,
                    {
                        count: values.length,
                        sum: values.reduce((a, b) => a + b, 0),
                        avg: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
                        min: values.length > 0 ? Math.min(...values) : 0,
                        max: values.length > 0 ? Math.max(...values) : 0
                    }
                ])
            ),
            timestamp: Date.now()
        };
        
        return JSON.stringify(result, null, 2);
    }

    // Whale communication metrics
    public recordWhaleSignal(eventType: 'transmitted' | 'received' | 'processed', success: boolean): void {
        this.incrementCounter('whale_signals_total', 1, { type: eventType, status: success ? 'success' : 'failure' });
    }

    public recordSessionDuration(durationMs: number): void {
        this.recordHistogram('whale_session_duration_ms', durationMs);
    }

    public updateConnectionStatus(connected: boolean): void {
        this.setGauge('whale_connection_active', connected ? 1 : 0);
    }

    // Riddler service metrics
    public recordRiddlerAccess(granted: boolean, stewardId: string): void {
        this.incrementCounter('riddler_access_attempts', 1, { 
            status: granted ? 'granted' : 'denied',
            steward: stewardId 
        });
    }

    public updateActiveQuarantines(count: number): void {
        this.setGauge('riddler_active_quarantines', count);
    }

    // Temporal metrics
    public recordTemporalShift(shiftType: string, latencyMs: number): void {
        this.recordHistogram('temporal_shift_latency_ms', latencyMs, { type: shiftType });
    }

    public updateTimelineIntegrity(score: number): void {
        this.setGauge('timeline_integrity_score', score);
    }

    // Private helper methods
    private incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
        const key = this.getMetricKey(name, labels);
        const current = this.counters.get(key) || 0;
        this.counters.set(key, current + value);
    }

    private setGauge(name: string, value: number, labels?: Record<string, string>): void {
        const key = this.getMetricKey(name, labels);
        this.gauges.set(key, value);
    }

    private recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
        const key = this.getMetricKey(name, labels);
        const values = this.histograms.get(key) || [];
        values.push(value);
        this.histograms.set(key, values);
    }

    private getMetricKey(name: string, labels?: Record<string, string>): string {
        if (!labels) return name;
        const labelStr = Object.entries(labels)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}="${v}"`)
            .join(',');
        return `${name}{${labelStr}}`;
    }
}

export const metricsService = new MetricsService(); 