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

import { metricsService } from './utils/metrics';

export interface SessionEvent {
    type: 'session_start' | 'session_end' | 'activity' | 'error';
    timestamp: number;
    metadata?: any;
}

export interface MonitoringData {
    sessionEvents: SessionEvent[];
    whaleSignals: any[];
    temporalData: any[];
    metrics: any;
}

export class MonitoringService {
    private sessionEvents: SessionEvent[] = [];
    private whaleSignals: any[] = [];
    private temporalData: any[] = [];

    // Browser-safe metrics storage
    private metrics = {
        sessionActive: 0,
        totalSessions: 0,
        whaleSignalsTransmitted: 0,
        whaleSignalsReceived: 0,
        temporalEditions: 0,
        systemUptime: Date.now()
    };

    constructor() {
        console.log('📊 Monitoring service initialized (browser-safe)');
        this.initializeMetrics();
    }

    private initializeMetrics(): void {
        // Initialize browser-safe metrics
        this.metrics.systemUptime = Date.now();
    }

    public logSessionEvent(event: SessionEvent): void {
        this.sessionEvents.push(event);
        
        if (event.type === 'session_start') {
            this.metrics.sessionActive = 1;
            this.metrics.totalSessions++;
            metricsService.updateConnectionStatus(true);
        } else if (event.type === 'session_end') {
            this.metrics.sessionActive = 0;
            metricsService.updateConnectionStatus(false);
            
            // Calculate session duration
            const startEvent = this.sessionEvents
                .slice()
                .reverse()
                .find(e => e.type === 'session_start' && e.timestamp < event.timestamp);
            
            if (startEvent) {
                const duration = event.timestamp - startEvent.timestamp;
                metricsService.recordSessionDuration(duration);
            }
        }
    }

    public logWhaleSignal(signal: any): void {
        this.whaleSignals.push({
            ...signal,
            timestamp: Date.now()
        });

        if (signal.type === 'transmitted') {
            this.metrics.whaleSignalsTransmitted++;
            metricsService.recordWhaleSignal('transmitted', true);
        } else if (signal.type === 'received') {
            this.metrics.whaleSignalsReceived++;
            metricsService.recordWhaleSignal('received', true);
        }
    }

    public logTemporalData(data: any): void {
        this.temporalData.push({
            ...data,
            timestamp: Date.now()
        });
        
        this.metrics.temporalEditions++;
        metricsService.recordTemporalShift('edition', Date.now() - data.timestamp);
    }

    public getMonitoringData(): MonitoringData {
        return {
            sessionEvents: this.sessionEvents,
            whaleSignals: this.whaleSignals,
            temporalData: this.temporalData,
            metrics: this.getMetrics()
        };
    }

    public getMetrics(): any {
        const uptime = Date.now() - this.metrics.systemUptime;
        
        return {
            ...this.metrics,
            uptimeSeconds: Math.floor(uptime / 1000),
            eventsTotal: this.sessionEvents.length + this.whaleSignals.length + this.temporalData.length
        };
    }

    public clearHistory(): void {
        this.sessionEvents = [];
        this.whaleSignals = [];
        this.temporalData = [];
    }
} 