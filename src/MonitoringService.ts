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

import { Gauge, Counter, register } from 'prom-client';
import logger from './logger';
import { config } from './config';
import { NotificationPriority } from './notification_types';
import { TemporalData } from './services/TemporalEditionService';

export interface SessionEvent {
    type: 'session_start' | 'session_end';
    timestamp: number;
    metadata: {
        identity: string;
        mode: string;
    };
}

export class MonitoringService {
    private readonly systemHealthGauge: Gauge;
    private readonly alertCounter: Counter;
    private readonly queueHealthGauge: Gauge;
    private readonly processingTimeGauge: Gauge;
    private readonly errorRateGauge: Gauge;
    private readonly recursiveScanGauge: Gauge;
    private readonly selfAwarenessGauge: Gauge;
    private readonly coherenceGauge: Gauge;
    private readonly interactionFlowGauge: Gauge;
    private readonly stabilityGauge: Gauge;
    private temporalData: TemporalData[] = [];
    private sessionEvents: SessionEvent[] = [];

    private readonly ALERT_THRESHOLDS = {
        queueSize: 1000,
        errorRate: 0.1, // 10% error rate
        processingTime: 30000, // 30 seconds
        retryRate: 0.2, // 20% retry rate
        recursiveDepth: 10,
        coherenceThreshold: 0.8,
        stabilityThreshold: 0.9
    };

    constructor() {
        // Initialize Prometheus metrics
        this.systemHealthGauge = new Gauge({
            name: 'system_health',
            help: 'Overall system health status (1 = healthy, 0 = unhealthy)',
            labelNames: ['component']
        });

        this.alertCounter = new Counter({
            name: 'system_alerts_total',
            help: 'Total number of system alerts',
            labelNames: ['severity', 'component', 'type']
        });

        this.queueHealthGauge = new Gauge({
            name: 'queue_health',
            help: 'Queue health metrics',
            labelNames: ['metric']
        });

        this.processingTimeGauge = new Gauge({
            name: 'job_processing_time',
            help: 'Average job processing time in milliseconds',
            labelNames: ['priority']
        });

        this.errorRateGauge = new Gauge({
            name: 'error_rate',
            help: 'Error rate per priority level',
            labelNames: ['priority']
        });

        // Initialize new metrics for recursive monitoring
        this.recursiveScanGauge = new Gauge({
            name: 'recursive_scan_depth',
            help: 'Current depth of recursive scanning',
            labelNames: ['component']
        });

        this.selfAwarenessGauge = new Gauge({
            name: 'self_awareness_level',
            help: 'System self-awareness metrics',
            labelNames: ['metric']
        });

        this.coherenceGauge = new Gauge({
            name: 'recursive_coherence',
            help: 'Recursive coherence metrics',
            labelNames: ['component']
        });

        this.interactionFlowGauge = new Gauge({
            name: 'interaction_flow',
            help: 'Interaction flow metrics',
            labelNames: ['type']
        });

        this.stabilityGauge = new Gauge({
            name: 'system_stability',
            help: 'System stability metrics',
            labelNames: ['component']
        });

        logger.info('Enhanced MonitoringService initialized with recursive capabilities');
    }

    updateSystemHealth(component: string, isHealthy: boolean): void {
        this.systemHealthGauge.set({ component }, isHealthy ? 1 : 0);
        
        if (!isHealthy) {
            this.recordAlert('critical', component, 'health_check_failed');
            logger.error(`System health check failed for component: ${component}`);
        }
    }

    updateQueueMetrics(metrics: {
        size: number;
        processingTime: number;
        errorRate: number;
        retryRate: number;
    }): void {
        // Update queue size
        this.queueHealthGauge.set({ metric: 'size' }, metrics.size);
        if (metrics.size > this.ALERT_THRESHOLDS.queueSize) {
            this.recordAlert('warning', 'queue', 'size_threshold_exceeded');
            logger.warn(`Queue size threshold exceeded: ${metrics.size}`);
        }

        // Update processing time
        this.queueHealthGauge.set({ metric: 'processing_time' }, metrics.processingTime);
        if (metrics.processingTime > this.ALERT_THRESHOLDS.processingTime) {
            this.recordAlert('warning', 'queue', 'processing_time_threshold_exceeded');
            logger.warn(`Processing time threshold exceeded: ${metrics.processingTime}ms`);
        }

        // Update error rate
        this.queueHealthGauge.set({ metric: 'error_rate' }, metrics.errorRate);
        if (metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            this.recordAlert('error', 'queue', 'error_rate_threshold_exceeded');
            logger.error(`Error rate threshold exceeded: ${metrics.errorRate}`);
        }

        // Update retry rate
        this.queueHealthGauge.set({ metric: 'retry_rate' }, metrics.retryRate);
        if (metrics.retryRate > this.ALERT_THRESHOLDS.retryRate) {
            this.recordAlert('warning', 'queue', 'retry_rate_threshold_exceeded');
            logger.warn(`Retry rate threshold exceeded: ${metrics.retryRate}`);
        }
    }

    updatePriorityMetrics(priority: NotificationPriority, metrics: {
        processingTime: number;
        errorRate: number;
    }): void {
        this.processingTimeGauge.set({ priority }, metrics.processingTime);
        this.errorRateGauge.set({ priority }, metrics.errorRate);

        if (metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            this.recordAlert('error', 'priority', `error_rate_${priority.toLowerCase()}`);
            logger.error(`Error rate threshold exceeded for priority ${priority}: ${metrics.errorRate}`);
        }
    }

    updateRecursiveScanMetrics(component: string, depth: number, coherence: number): void {
        this.recursiveScanGauge.set({ component }, depth);
        this.coherenceGauge.set({ component }, coherence);

        if (depth > this.ALERT_THRESHOLDS.recursiveDepth) {
            this.recordAlert('warning', component, 'recursive_depth_exceeded');
            logger.warn(`Recursive depth threshold exceeded for ${component}: ${depth}`);
        }

        if (coherence < this.ALERT_THRESHOLDS.coherenceThreshold) {
            this.recordAlert('warning', component, 'coherence_threshold_below');
            logger.warn(`Coherence threshold below acceptable level for ${component}: ${coherence}`);
        }
    }

    updateSelfAwarenessMetrics(metrics: {
        recognitionLevel: number;
        stateAwareness: number;
        adaptationRate: number;
    }): void {
        this.selfAwarenessGauge.set({ metric: 'recognition' }, metrics.recognitionLevel);
        this.selfAwarenessGauge.set({ metric: 'state' }, metrics.stateAwareness);
        this.selfAwarenessGauge.set({ metric: 'adaptation' }, metrics.adaptationRate);
    }

    updateInteractionFlowMetrics(metrics: {
        requestRate: number;
        responseTime: number;
        errorRate: number;
        throughput: number;
    }): void {
        this.interactionFlowGauge.set({ type: 'requests' }, metrics.requestRate);
        this.interactionFlowGauge.set({ type: 'response_time' }, metrics.responseTime);
        this.interactionFlowGauge.set({ type: 'errors' }, metrics.errorRate);
        this.interactionFlowGauge.set({ type: 'throughput' }, metrics.throughput);
    }

    updateSystemStability(component: string, stability: number): void {
        this.stabilityGauge.set({ component }, stability);

        if (stability < this.ALERT_THRESHOLDS.stabilityThreshold) {
            this.recordAlert('warning', component, 'stability_threshold_below');
            logger.warn(`System stability below threshold for ${component}: ${stability}`);
        }
    }

    private recordAlert(severity: 'info' | 'warning' | 'error' | 'critical', component: string, type: string): void {
        this.alertCounter.inc({ severity, component, type });
    }

    async getMetrics(): Promise<string> {
        return register.metrics();
    }

    logTemporalData(data: TemporalData) {
        this.temporalData.push(data);
        console.log('Temporal data logged:', data);
    }

    logSessionEvent(event: SessionEvent) {
        this.sessionEvents.push(event);
        console.log('Session event logged:', event);
    }

    getTemporalData(): TemporalData[] {
        return this.temporalData;
    }

    getSessionEvents(): SessionEvent[] {
        return this.sessionEvents;
    }

    clearData() {
        this.temporalData = [];
        this.sessionEvents = [];
    }
} 