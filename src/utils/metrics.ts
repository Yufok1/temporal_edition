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

// Browser-safe metrics service that replaces prom-client
export class MetricsService {
    private counters: Map<string, number> = new Map();
    private gauges: Map<string, number> = new Map();
    private histograms: Map<string, number[]> = new Map();
    private customMetrics: Record<string, { count: number; total: number; lastValue: number; lastUpdated: number }> = {};

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

    recordWhaleSignal(type: 'received' | 'transmitted', success: boolean, metadata?: any): void {
        const key = `whale_signal_${type}_${success ? 'success' : 'failure'}`;
        const current = this.counters.get(key) || 0;
        this.counters.set(key, current + 1);
        
        console.log(`🐋 Whale signal ${type}: ${success ? '✓' : '✗'}`);
    }

    recordSessionDuration(duration: number): void {
        const key = 'session_duration_ms';
        if (!this.histograms.has(key)) {
            this.histograms.set(key, []);
        }
        const values = this.histograms.get(key)!;
        values.push(duration);
        
        // Keep only last 50 sessions
        if (values.length > 50) {
            values.shift();
        }
        
        console.log(`📊 Session duration: ${(duration / 1000).toFixed(1)}s`);
    }

    updateConnectionStatus(connected: boolean): void {
        this.gauges.set('connection_status', connected ? 1 : 0);
        console.log(`🔌 Connection status: ${connected ? 'Connected' : 'Disconnected'}`);
    }

    recordDjinnActivity(djinnName: string, activityType: string): void {
        const key = `djinn_${djinnName}_${activityType}`;
        const current = this.counters.get(key) || 0;
        this.counters.set(key, current + 1);
        
        console.log(`🧞 Djinn activity: ${djinnName} - ${activityType}`);
    }

    recordLearningPattern(pattern: string, alignment: number): void {
        const key = `learning_pattern_${pattern}`;
        this.gauges.set(key, alignment);
        
        console.log(`🎓 Learning pattern: ${pattern} (${(alignment * 100).toFixed(1)}% aligned)`);
    }

    recordCryptoFlow(currency: 'PSDN' | 'OBOL', amount: number, flowType: 'in' | 'out'): void {
        const key = `crypto_flow_${currency}_${flowType}`;
        const current = this.counters.get(key) || 0;
        this.counters.set(key, current + amount);
        
        const gaugeKey = `crypto_balance_${currency}`;
        const currentBalance = this.gauges.get(gaugeKey) || 0;
        const newBalance = flowType === 'in' ? currentBalance + amount : currentBalance - amount;
        this.gauges.set(gaugeKey, newBalance);
        
        console.log(`💰 ${currency} ${flowType}: ${amount} (balance: ${newBalance})`);
    }

    recordCosmicEvent(eventType: string, severity: number): void {
        const key = `cosmic_event_${eventType}`;
        const current = this.counters.get(key) || 0;
        this.counters.set(key, current + 1);
        
        this.gauges.set(`cosmic_severity_${eventType}`, severity);
        
        console.log(`✨ Cosmic event: ${eventType} (severity: ${severity})`);
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
    public recordTemporalShift(type: string, magnitude: number): void {
        const key = `temporal_shift_${type}`;
        if (!this.histograms.has(key)) {
            this.histograms.set(key, []);
        }
        const values = this.histograms.get(key)!;
        values.push(magnitude);
        
        // Keep only last 100 values
        if (values.length > 100) {
            values.shift();
        }
        
        console.log(`⏱️ Temporal shift recorded: ${type} = ${magnitude}ms`);
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
        
        // Keep only last 1000 values
        if (values.length > 1000) {
            values.shift();
        }
    }

    private getMetricKey(name: string, labels?: Record<string, string>): string {
        if (!labels || Object.keys(labels).length === 0) {
            return name;
        }
        const labelStr = Object.entries(labels)
            .map(([k, v]) => `${k}="${v}"`)
            .join(',');
        return `${name}{${labelStr}}`;
    }

    recordCustomMetric(name: string, value: number): void {
        // Record custom metric in browser-safe way
        const key = `custom_${name}`;
        if (!this.customMetrics[key]) {
            this.customMetrics[key] = {
                count: 0,
                total: 0,
                lastValue: 0,
                lastUpdated: Date.now()
            };
        }
        
        this.customMetrics[key].count++;
        this.customMetrics[key].total += value;
        this.customMetrics[key].lastValue = value;
        this.customMetrics[key].lastUpdated = Date.now();
        
        console.log(`📊 Custom metric recorded: ${name} = ${value}`);
    }

    recordCounter(name: string, labels?: Record<string, string>): void {
        const key = this.getMetricKey(name, labels);
        const current = this.counters.get(key) || 0;
        this.counters.set(key, current + 1);
    }

    recordGauge(name: string, value: number, labels?: Record<string, string>): void {
        const key = this.getMetricKey(name, labels);
        this.gauges.set(key, value);
    }

    recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
        const key = this.getMetricKey(name, labels);
        if (!this.histograms.has(key)) {
            this.histograms.set(key, []);
        }
        const values = this.histograms.get(key)!;
        values.push(value);
        
        // Keep only last 1000 values
        if (values.length > 1000) {
            values.shift();
        }
    }
}

export const metricsService = new MetricsService(); 