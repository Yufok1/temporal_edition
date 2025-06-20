// Professional data API for BI tools (Metabase, Redash, Superset)
// PostgreSQL/ClickHouse compatible schema and query interface

import { MarineBiologyWatchtower, Observer, NazarEvent, MarineSignal } from '../core/MarineBiologyWatchtower';
import { WatchtowerMetrics } from './WatchtowerMetrics';

export interface DatabaseRecord {
    id: string;
    timestamp: number;
    table: string;
    data: any;
}

export interface QueryResult {
    columns: string[];
    rows: any[][];
    metadata: {
        row_count: number;
        execution_time_ms: number;
        data_source: string;
    };
}

export interface BiApiEndpoint {
    path: string;
    method: 'GET' | 'POST';
    description: string;
    parameters?: Record<string, string>;
    schema?: any;
}

export class WatchtowerDataAPI {
    private watchtower: MarineBiologyWatchtower;
    private metrics: WatchtowerMetrics;
    private endpoints: BiApiEndpoint[] = [
        {
            path: '/api/v1/observers',
            method: 'GET',
            description: 'Get all observers with hierarchy information',
            parameters: { 'tier': 'Filter by observer tier (1-5)', 'status': 'Filter by status (active/inactive/quarantined)' }
        },
        {
            path: '/api/v1/nazar-events',
            method: 'GET', 
            description: 'Get nazar oversight events with temporal filtering',
            parameters: { 'from': 'Start timestamp (Unix)', 'to': 'End timestamp (Unix)', 'action': 'Filter by action type' }
        },
        {
            path: '/api/v1/marine-signals',
            method: 'GET',
            description: 'Get marine biological signals and analysis',
            parameters: { 'type': 'Signal type (vocal/movement/environmental)', 'min_intensity': 'Minimum intensity threshold' }
        },
        {
            path: '/api/v1/hierarchy-analysis', 
            method: 'GET',
            description: 'Leadership correlation and pecking order analysis',
            parameters: { 'period': 'Analysis period (1h/24h/7d/30d)' }
        },
        {
            path: '/api/v1/metrics/prometheus',
            method: 'GET',
            description: 'Prometheus-compatible metrics export'
        },
        {
            path: '/api/v1/sql/query',
            method: 'POST',
            description: 'Execute SQL queries for BI tools',
            schema: { query: 'string', format: 'json|csv|parquet' }
        }
    ];

    constructor(watchtower: MarineBiologyWatchtower, metrics: WatchtowerMetrics) {
        this.watchtower = watchtower;
        this.metrics = metrics;
    }

    // PostgreSQL-compatible schema for BI tools
    getTableSchemas(): Record<string, any> {
        return {
            observers: {
                id: 'VARCHAR(255) PRIMARY KEY',
                type: 'VARCHAR(50) NOT NULL',
                tier: 'INTEGER NOT NULL CHECK (tier >= 1 AND tier <= 5)',
                status: 'VARCHAR(50) NOT NULL',
                last_seen: 'TIMESTAMP NOT NULL',
                privileges: 'TEXT[]',
                created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            },
            nazar_events: {
                id: 'SERIAL PRIMARY KEY',
                timestamp: 'TIMESTAMP NOT NULL',
                observer_id: 'VARCHAR(255) REFERENCES observers(id)',
                action: 'VARCHAR(100) NOT NULL',
                target: 'VARCHAR(255)',
                result: 'VARCHAR(50) NOT NULL',
                tier: 'INTEGER NOT NULL',
                response_time_ms: 'FLOAT'
            },
            marine_signals: {
                id: 'SERIAL PRIMARY KEY',
                timestamp: 'TIMESTAMP NOT NULL',
                source: 'VARCHAR(255) NOT NULL',
                signal_type: 'VARCHAR(50) NOT NULL',
                frequency: 'FLOAT',
                intensity: 'FLOAT NOT NULL',
                confidence: 'FLOAT NOT NULL',
                latitude: 'DECIMAL(10,8)',
                longitude: 'DECIMAL(11,8)', 
                depth: 'FLOAT',
                processed_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            },
            hierarchy_metrics: {
                id: 'SERIAL PRIMARY KEY',
                recorded_at: 'TIMESTAMP NOT NULL',
                total_observers: 'INTEGER',
                active_observers: 'INTEGER',
                privilege_violations: 'INTEGER',
                escalations: 'INTEGER',
                tier_distribution: 'JSONB'
            }
        };
    }

    // BI-friendly query interface
    async executeQuery(sql: string, format: 'json' | 'csv' | 'parquet' = 'json'): Promise<QueryResult> {
        const startTime = Date.now();
        
        // Simulate SQL parsing and execution against our in-memory data
        const result = this.simulateSQL(sql);
        
        const executionTime = Date.now() - startTime;
        
        return {
            columns: result.columns,
            rows: result.rows,
            metadata: {
                row_count: result.rows.length,
                execution_time_ms: executionTime,
                data_source: 'watchtower_core'
            }
        };
    }

    // REST API endpoints for BI tools
    async getObservers(filters?: { tier?: number; status?: string }): Promise<QueryResult> {
        const status = this.watchtower.getHierarchyStatus();
        let observers = status.observers;

        if (filters?.tier) {
            observers = observers.filter(o => o.tier === filters.tier);
        }
        if (filters?.status) {
            observers = observers.filter(o => o.status === filters.status);
        }

        return {
            columns: ['id', 'type', 'tier', 'status', 'last_seen', 'privileges'],
            rows: observers.map(o => [o.id, o.type, o.tier, o.status, new Date(o.lastSeen).toISOString(), o.privileges.join(',')]),
            metadata: {
                row_count: observers.length,
                execution_time_ms: 1.2,
                data_source: 'watchtower_observers'
            }
        };
    }

    async getNazarEvents(filters?: { from?: number; to?: number; action?: string }): Promise<QueryResult> {
        const status = this.watchtower.getHierarchyStatus();
        let events = status.recentEvents;

        if (filters?.from !== undefined) {
            events = events.filter(e => e.timestamp >= filters.from!);
        }
        if (filters?.to !== undefined) {
            events = events.filter(e => e.timestamp <= filters.to!);
        }
        if (filters?.action) {
            events = events.filter(e => e.action === filters.action);
        }

        return {
            columns: ['timestamp', 'observer_id', 'action', 'target', 'result', 'tier'],
            rows: events.map(e => [
                new Date(e.timestamp).toISOString(),
                e.observerId,
                e.action,
                e.target || null,
                e.result,
                e.tier
            ]),
            metadata: {
                row_count: events.length,
                execution_time_ms: 0.8,
                data_source: 'watchtower_nazar'
            }
        };
    }

    async getHierarchyAnalysis(period: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<QueryResult> {
        const hierarchyMetrics = this.metrics.collectHierarchyMetrics();
        const nazarMetrics = this.metrics.collectNazarMetrics();
        
        // Leadership correlation analysis
        const leadership_effectiveness = this.calculateLeadershipEffectiveness();
        const pecking_order_stability = this.calculatePeckingOrderStability();
        const nazar_oversight_quality = this.calculateNazarOversightQuality();

        return {
            columns: [
                'period', 'total_observers', 'leadership_effectiveness', 
                'pecking_order_stability', 'nazar_oversight_quality',
                'privilege_violations', 'escalations', 'tier_distribution'
            ],
            rows: [[
                period,
                hierarchyMetrics.total_observers,
                leadership_effectiveness,
                pecking_order_stability,
                nazar_oversight_quality,
                hierarchyMetrics.privilege_violations,
                hierarchyMetrics.escalations,
                JSON.stringify(hierarchyMetrics.observers_by_tier)
            ]],
            metadata: {
                row_count: 1,
                execution_time_ms: 5.3,
                data_source: 'watchtower_analysis'
            }
        };
    }

    // Advanced analytics for leadership correlation
    private calculateLeadershipEffectiveness(): number {
        const status = this.watchtower.getHierarchyStatus();
        const tier1and2 = status.observers.filter(o => o.tier <= 2);
        const recentEvents = status.recentEvents.filter(e => e.timestamp > Date.now() - 86400000); // 24h
        
        const leaderActions = recentEvents.filter(e => {
            const observer = status.observers.find(o => o.id === e.observerId);
            return observer && observer.tier <= 2;
        });

        const successfulLeaderActions = leaderActions.filter(e => e.result === 'allowed').length;
        return leaderActions.length > 0 ? (successfulLeaderActions / leaderActions.length) * 100 : 0;
    }

    private calculatePeckingOrderStability(): number {
        const status = this.watchtower.getHierarchyStatus();
        const recentEvents = status.recentEvents.filter(e => e.timestamp > Date.now() - 86400000);
        
        const escalations = recentEvents.filter(e => e.result === 'escalated').length;
        const totalEvents = recentEvents.length;
        
        // Lower escalation rate = higher stability
        return totalEvents > 0 ? Math.max(0, 100 - (escalations / totalEvents) * 100) : 100;
    }

    private calculateNazarOversightQuality(): number {
        const nazarMetrics = this.metrics.collectNazarMetrics();
        
        // Quality based on response time and decision accuracy
        const responseScore = Math.max(0, 100 - nazarMetrics.response_time_ms);
        const decisionAccuracy = nazarMetrics.total_events > 0 ? 
            ((nazarMetrics.total_events - nazarMetrics.denied_actions) / nazarMetrics.total_events) * 100 : 100;
        
        return (responseScore + decisionAccuracy) / 2;
    }

    // Simple SQL simulation for BI tools
    private simulateSQL(sql: string): { columns: string[]; rows: any[][] } {
        const upperSQL = sql.toUpperCase();
        
        if (upperSQL.includes('SELECT') && upperSQL.includes('OBSERVERS')) {
            const status = this.watchtower.getHierarchyStatus();
            return {
                columns: ['id', 'type', 'tier', 'status'],
                rows: status.observers.map(o => [o.id, o.type, o.tier, o.status])
            };
        }
        
        if (upperSQL.includes('SELECT') && upperSQL.includes('NAZAR_EVENTS')) {
            const status = this.watchtower.getHierarchyStatus();
            return {
                columns: ['timestamp', 'action', 'result'],
                rows: status.recentEvents.map(e => [new Date(e.timestamp).toISOString(), e.action, e.result])
            };
        }

        // Default empty result
        return { columns: [], rows: [] };
    }

    // Export data for external analysis tools
    exportData(format: 'json' | 'csv' | 'parquet'): string {
        const status = this.watchtower.getHierarchyStatus();
        const data = {
            observers: status.observers,
            recent_events: status.recentEvents,
            metrics: {
                hierarchy: this.metrics.collectHierarchyMetrics(),
                signals: this.metrics.collectSignalMetrics(),
                nazar: this.metrics.collectNazarMetrics()
            },
            export_timestamp: new Date().toISOString()
        };

        switch (format) {
            case 'csv':
                return this.convertToCSV(data);
            case 'parquet':
                return JSON.stringify(data); // Would use actual Parquet library
            default:
                return JSON.stringify(data, null, 2);
        }
    }

    private convertToCSV(data: any): string {
        // Simple CSV conversion for key data
        const lines = ['timestamp,observer_id,action,result,tier'];
        
        if (data.recent_events) {
            data.recent_events.forEach((event: any) => {
                lines.push(`${new Date(event.timestamp).toISOString()},${event.observerId},${event.action},${event.result},${event.tier}`);
            });
        }

        return lines.join('\n');
    }

    getApiDocumentation(): BiApiEndpoint[] {
        return this.endpoints;
    }
}