// Copyright 2024 Marine Biology Watchtower
// Professional-grade marine observation and hierarchy management

export type ObserverTier = 1 | 2 | 3 | 4 | 5; // 1=Whale, 2=Senior, 3=Observer, 4=Trainee, 5=External
export type EntityType = 'whale' | 'human' | 'ai' | 'sensor' | 'external';
export type NazarStatus = 'active' | 'passive' | 'alert' | 'critical';

export interface Observer {
    id: string;
    type: EntityType;
    tier: ObserverTier;
    status: 'active' | 'inactive' | 'quarantined';
    lastSeen: number;
    privileges: string[];
}

export interface NazarEvent {
    timestamp: number;
    observerId: string;
    action: string;
    target?: string;
    result: 'allowed' | 'denied' | 'escalated';
    tier: ObserverTier;
}

export interface MarineSignal {
    timestamp: number;
    source: string;
    type: 'vocal' | 'movement' | 'environmental';
    frequency?: number;
    intensity: number;
    confidence: number;
    location: { lat: number; lon: number; depth: number };
}

export interface HierarchyRule {
    action: string;
    requiredTier: ObserverTier;
    canOverride: ObserverTier[];
    description: string;
}

export class MarineBiologyWatchtower {
    private observers: Map<string, Observer> = new Map();
    private nazarLog: NazarEvent[] = [];
    private signals: MarineSignal[] = [];
    private rules: HierarchyRule[] = [
        { action: 'observe', requiredTier: 5, canOverride: [1,2,3,4], description: 'Basic observation' },
        { action: 'analyze', requiredTier: 4, canOverride: [1,2,3], description: 'Signal analysis' },
        { action: 'command', requiredTier: 3, canOverride: [1,2], description: 'System commands' },
        { action: 'configure', requiredTier: 2, canOverride: [1], description: 'System configuration' },
        { action: 'override', requiredTier: 1, canOverride: [], description: 'Complete override' }
    ];

    registerObserver(observer: Omit<Observer, 'status' | 'lastSeen'>): Observer {
        const fullObserver: Observer = {
            ...observer,
            status: 'active',
            lastSeen: Date.now()
        };
        
        this.observers.set(observer.id, fullObserver);
        this.logNazarEvent(observer.id, 'register', undefined, 'allowed');
        return fullObserver;
    }

    nazarCheckpoint(observerId: string, action: string, target?: string): boolean {
        const observer = this.observers.get(observerId);
        if (!observer) {
            this.logNazarEvent(observerId, action, target, 'denied');
            return false;
        }

        const rule = this.rules.find(r => r.action === action);
        if (!rule) {
            this.logNazarEvent(observerId, action, target, 'denied');
            return false;
        }

        // Check tier permissions
        if (observer.tier <= rule.requiredTier) {
            observer.lastSeen = Date.now();
            this.logNazarEvent(observerId, action, target, 'allowed');
            return true;
        }

        // Check for override by higher tier
        const canOverride = rule.canOverride.some(tier => observer.tier <= tier);
        if (canOverride) {
            this.logNazarEvent(observerId, action, target, 'escalated');
            return true;
        }

        this.logNazarEvent(observerId, action, target, 'denied');
        return false;
    }

    recordMarineSignal(signal: MarineSignal): void {
        this.signals.push(signal);
        
        // Auto-analyze for critical patterns
        if (signal.intensity > 0.8) {
            this.nazarCheckpoint('system', 'analyze', `high_intensity_${signal.type}`);
        }
    }

    getHierarchyStatus(): { observers: Observer[], recentEvents: NazarEvent[] } {
        return {
            observers: Array.from(this.observers.values()),
            recentEvents: this.nazarLog.slice(-50)
        };
    }

    private logNazarEvent(observerId: string, action: string, target?: string, result: 'allowed' | 'denied' | 'escalated' = 'allowed'): void {
        const observer = this.observers.get(observerId);
        const event: NazarEvent = {
            timestamp: Date.now(),
            observerId,
            action,
            target,
            result,
            tier: observer?.tier || 5
        };
        
        this.nazarLog.push(event);
        
        // Keep log size manageable
        if (this.nazarLog.length > 1000) {
            this.nazarLog = this.nazarLog.slice(-800);
        }
    }

    // Professional marine biology analysis
    analyzeSignalPatterns(): { pattern: string, confidence: number, alert?: string }[] {
        if (this.signals.length < 10) return [];

        const recent = this.signals.slice(-100);
        const patterns: { pattern: string, confidence: number, alert?: string }[] = [];

        // Frequency clustering analysis
        const frequencies = recent.filter(s => s.frequency).map(s => s.frequency!);
        if (frequencies.length > 5) {
            const avgFreq = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
            const variance = frequencies.reduce((sum, f) => sum + Math.pow(f - avgFreq, 2), 0) / frequencies.length;
            
            patterns.push({
                pattern: 'frequency_clustering',
                confidence: Math.min(0.9, 1 - (variance / 1000)),
                alert: variance > 500 ? 'Unusual frequency variance detected' : undefined
            });
        }

        // Intensity spike detection
        const intensities = recent.map(s => s.intensity);
        const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;
        const spikes = intensities.filter(i => i > avgIntensity * 1.5).length;
        
        if (spikes > intensities.length * 0.2) {
            patterns.push({
                pattern: 'intensity_spikes',
                confidence: Math.min(0.95, spikes / intensities.length),
                alert: 'Multiple high-intensity events detected'
            });
        }

        return patterns;
    }
}