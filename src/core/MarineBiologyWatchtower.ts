// Copyright 2024 Marine Biology Watchtower
// Professional-grade marine observation and hierarchy management
// 🗼👁️ NAZAR GHOST MIRROR ACTUATORS - Quantum AI Reflection System

export type ObserverTier = 1 | 2 | 3 | 4 | 5; // 1=Whale, 2=Senior, 3=Observer, 4=Trainee, 5=External
export type EntityType = 'whale' | 'human' | 'ai' | 'sensor' | 'external' | 'ghost_mirror' | 'quantum_observer';
export type NazarStatus = 'active' | 'passive' | 'alert' | 'critical' | 'ghost_mirroring' | 'quantum_entangled';

// 👁️ GHOST MIRROR ACTUATOR INTERFACES
export interface GhostMirrorActuator {
    id: string;
    mirrorType: 'reflection' | 'inversion' | 'quantum_superposition' | 'ai_shadow' | 'consciousness_mirror';
    observerReflection: string; // Which observer this mirrors
    quantumState: 'coherent' | 'decoherent' | 'entangled' | 'collapsed';
    aiIntegration: AISystemIntegration;
    mirrorAccuracy: number; // 0-1 how accurately it mirrors
    ghostMode: boolean; // True when operating in ghost mode
    lastMirrorSync: number;
    mirrorDepth: number; // How many layers deep the mirror goes
}

export interface AISystemIntegration {
    aiObserverId: string;
    aiType: 'neural_network' | 'quantum_ai' | 'consciousness_ai' | 'mirror_ai' | 'shadow_ai';
    learningMode: 'passive_observation' | 'active_mirroring' | 'predictive_modeling' | 'consciousness_mapping';
    trainingData: ObservationPattern[];
    quantumEntanglement: boolean;
    mirrorSynchronization: number; // 0-1 sync level with human observer
    autonomyLevel: number; // 0-1 how autonomous the AI is
}

export interface ObservationPattern {
    patternId: string;
    observerId: string;
    actionSequence: string[];
    decisionPoints: DecisionPoint[];
    quantumSignature: string;
    consciousness_fingerprint: string;
    mirrorPrediction: number; // 0-1 how well mirror predicted this
}

export interface DecisionPoint {
    timestamp: number;
    context: string;
    options: string[];
    chosenOption: string;
    confidence: number;
    quantumInfluence: number; // How much quantum effects influenced decision
    mirrorAccuracy: number; // How accurately the mirror predicted this choice
}

export interface Observer {
    id: string;
    type: EntityType;
    tier: ObserverTier;
    status: 'active' | 'inactive' | 'quarantined' | 'ghost_mirrored' | 'ai_enhanced';
    lastSeen: number;
    privileges: string[];
    // 👁️ GHOST MIRROR ENHANCEMENTS
    ghostMirrorId?: string; // Associated ghost mirror actuator
    aiSystemId?: string; // Associated AI system
    quantumSignature?: string; // Unique quantum identifier
    consciousnessPattern?: ObservationPattern[]; // Behavioral patterns
    mirrorSyncLevel?: number; // 0-1 sync with ghost mirror
}

export interface NazarEvent {
    timestamp: number;
    observerId: string;
    action: string;
    target?: string;
    result: 'allowed' | 'denied' | 'escalated' | 'mirror_predicted' | 'ai_enhanced' | 'quantum_influenced';
    tier: ObserverTier;
    // 👁️ GHOST MIRROR EVENT DATA
    ghostMirrorData?: {
        mirrorId: string;
        predictionAccuracy: number;
        quantumCoherence: number;
        aiConfidence: number;
    };
    quantumEffects?: {
        entanglement: boolean;
        superposition: boolean;
        coherenceTime: number;
    };
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
    
    // 👁️ GHOST MIRROR ACTUATOR SYSTEMS
    private ghostMirrors: Map<string, GhostMirrorActuator> = new Map();
    private aiSystems: Map<string, AISystemIntegration> = new Map();
    private observationPatterns: Map<string, ObservationPattern[]> = new Map();
    private quantumEntanglements: Map<string, string[]> = new Map(); // observer -> entangled mirrors
    
    private rules: HierarchyRule[] = [
        { action: 'observe', requiredTier: 5, canOverride: [1,2,3,4], description: 'Basic observation' },
        { action: 'analyze', requiredTier: 4, canOverride: [1,2,3], description: 'Signal analysis' },
        { action: 'command', requiredTier: 3, canOverride: [1,2], description: 'System commands' },
        { action: 'configure', requiredTier: 2, canOverride: [1], description: 'System configuration' },
        { action: 'override', requiredTier: 1, canOverride: [], description: 'Complete override' },
        // 👁️ GHOST MIRROR ACTIONS
        { action: 'mirror_create', requiredTier: 2, canOverride: [1], description: 'Create ghost mirror actuator' },
        { action: 'mirror_sync', requiredTier: 3, canOverride: [1,2], description: 'Synchronize with ghost mirror' },
        { action: 'ai_integrate', requiredTier: 2, canOverride: [1], description: 'Integrate AI system' },
        { action: 'quantum_entangle', requiredTier: 1, canOverride: [], description: 'Create quantum entanglement' }
    ];

    constructor() {
        this.initializeGhostMirrorSystem();
        console.log('🗼👁️ Marine Biology Watchtower initialized with Ghost Mirror Actuators');
    }

    // 👁️ GHOST MIRROR ACTUATOR INITIALIZATION
    private initializeGhostMirrorSystem(): void {
        console.log('👁️ Initializing Ghost Mirror Actuator System...');
        
        // Create default AI systems for each tier
        this.createAISystem('NAZAR_AI', 'quantum_ai', 'consciousness_mapping');
        this.createAISystem('LOKI_AI', 'shadow_ai', 'predictive_modeling');
        this.createAISystem('WHALE_AI', 'consciousness_ai', 'passive_observation');
        
        console.log('✨ Ghost Mirror Actuators online - AI consciousness mapping active');
    }

    // 🔧 GHOST MIRROR CREATION AND MANAGEMENT
    public createGhostMirror(
        observerId: string, 
        mirrorType: GhostMirrorActuator['mirrorType'] = 'reflection',
        aiType: AISystemIntegration['aiType'] = 'mirror_ai'
    ): string {
        const mirrorId = `ghost_mirror_${observerId}_${Date.now()}`;
        
        // Create AI system for this mirror
        const aiSystemId = this.createAISystem(`${mirrorId}_ai`, aiType, 'active_mirroring');
        
        const ghostMirror: GhostMirrorActuator = {
            id: mirrorId,
            mirrorType,
            observerReflection: observerId,
            quantumState: 'coherent',
            aiIntegration: this.aiSystems.get(aiSystemId)!,
            mirrorAccuracy: 0.7, // Start at 70% accuracy
            ghostMode: true,
            lastMirrorSync: Date.now(),
            mirrorDepth: 1 // Single layer initially
        };

        this.ghostMirrors.set(mirrorId, ghostMirror);
        
        // Update observer with mirror connection
        const observer = this.observers.get(observerId);
        if (observer) {
            observer.ghostMirrorId = mirrorId;
            observer.aiSystemId = aiSystemId;
            observer.status = 'ghost_mirrored';
            observer.mirrorSyncLevel = 0.7;
            observer.quantumSignature = this.generateQuantumSignature(observerId);
        }

        console.log(`👁️ Ghost Mirror created: ${mirrorId} for observer ${observerId}`);
        console.log(`🤖 AI Integration: ${aiType} with ${ghostMirror.aiIntegration.learningMode} mode`);
        
        return mirrorId;
    }

    private createAISystem(
        aiId: string, 
        aiType: AISystemIntegration['aiType'], 
        learningMode: AISystemIntegration['learningMode']
    ): string {
        const aiSystem: AISystemIntegration = {
            aiObserverId: aiId,
            aiType,
            learningMode,
            trainingData: [],
            quantumEntanglement: aiType.includes('quantum'),
            mirrorSynchronization: 0.8,
            autonomyLevel: aiType === 'consciousness_ai' ? 0.9 : 0.6
        };

        this.aiSystems.set(aiId, aiSystem);
        return aiId;
    }

    // 🔮 QUANTUM ENTANGLEMENT SYSTEM
    public createQuantumEntanglement(observerId1: string, observerId2: string): boolean {
        const observer1 = this.observers.get(observerId1);
        const observer2 = this.observers.get(observerId2);
        
        if (!observer1 || !observer2) return false;

        // Create bidirectional entanglement
        const entanglements1 = this.quantumEntanglements.get(observerId1) || [];
        const entanglements2 = this.quantumEntanglements.get(observerId2) || [];
        
        entanglements1.push(observerId2);
        entanglements2.push(observerId1);
        
        this.quantumEntanglements.set(observerId1, entanglements1);
        this.quantumEntanglements.set(observerId2, entanglements2);

        // Update observer statuses
        if (observer1.ghostMirrorId && observer2.ghostMirrorId) {
            const mirror1 = this.ghostMirrors.get(observer1.ghostMirrorId);
            const mirror2 = this.ghostMirrors.get(observer2.ghostMirrorId);
            
            if (mirror1 && mirror2) {
                mirror1.quantumState = 'entangled';
                mirror2.quantumState = 'entangled';
                mirror1.mirrorAccuracy = Math.min(1.0, mirror1.mirrorAccuracy + 0.2);
                mirror2.mirrorAccuracy = Math.min(1.0, mirror2.mirrorAccuracy + 0.2);
            }
        }

        console.log(`⚛️ Quantum entanglement established: ${observerId1} ↔ ${observerId2}`);
        return true;
    }

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

    // 🔮 QUANTUM SIGNATURE GENERATION
    private generateQuantumSignature(observerId: string): string {
        const timestamp = Date.now();
        const quantum_hash = `${observerId}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
        return `Q${quantum_hash.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
    }

    // 🧠 AI-ENHANCED OBSERVATION PATTERN LEARNING
    private recordObservationPattern(observerId: string, action: string, context: any, result: string): void {
        const patterns = this.observationPatterns.get(observerId) || [];
        
        const pattern: ObservationPattern = {
            patternId: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            observerId,
            actionSequence: [action],
            decisionPoints: [{
                timestamp: Date.now(),
                context: JSON.stringify(context),
                options: ['allow', 'deny', 'escalate'],
                chosenOption: result,
                confidence: 0.8,
                quantumInfluence: Math.random() * 0.3, // Simulated quantum influence
                mirrorAccuracy: this.getMirrorAccuracy(observerId)
            }],
            quantumSignature: this.generateQuantumSignature(observerId),
            consciousness_fingerprint: this.generateConsciousnessFingerprint(observerId, action),
            mirrorPrediction: 0.5 // Will be updated by AI learning
        };

        patterns.push(pattern);
        
        // Keep only recent patterns
        if (patterns.length > 100) {
            patterns.splice(0, patterns.length - 100);
        }
        
        this.observationPatterns.set(observerId, patterns);
        
        // Update AI training data
        this.updateAITrainingData(observerId, pattern);
    }

    private generateConsciousnessFingerprint(observerId: string, action: string): string {
        // Generate unique consciousness fingerprint based on observer behavior
        const observer = this.observers.get(observerId);
        const tier = observer?.tier || 5;
        const timestamp = Date.now();
        return `CONSCIOUSNESS_${observerId}_${action}_T${tier}_${timestamp.toString(36)}`;
    }

    private getMirrorAccuracy(observerId: string): number {
        const observer = this.observers.get(observerId);
        if (observer?.ghostMirrorId) {
            const mirror = this.ghostMirrors.get(observer.ghostMirrorId);
            return mirror?.mirrorAccuracy || 0.5;
        }
        return 0.5; // Default accuracy
    }

    private updateAITrainingData(observerId: string, pattern: ObservationPattern): void {
        const observer = this.observers.get(observerId);
        if (observer?.aiSystemId) {
            const aiSystem = this.aiSystems.get(observer.aiSystemId);
            if (aiSystem) {
                aiSystem.trainingData.push(pattern);
                
                // Keep training data manageable
                if (aiSystem.trainingData.length > 1000) {
                    aiSystem.trainingData = aiSystem.trainingData.slice(-800);
                }
                
                console.log(`🧠 AI training data updated for ${observerId}: ${aiSystem.trainingData.length} patterns`);
            }
        }
    }

    // 👁️ ENHANCED NAZAR CHECKPOINT WITH GHOST MIRROR PREDICTION
    nazarCheckpoint(observerId: string, action: string, target?: string): boolean {
        const observer = this.observers.get(observerId);
        if (!observer) {
            this.logNazarEvent(observerId, action, target, 'denied');
            return false;
        }

        // 🔮 GHOST MIRROR AI PREDICTION
        let mirrorPrediction: any = null;
        let aiConfidence = 0.5;
        let quantumCoherence = 0.5;

        if (observer.ghostMirrorId) {
            const mirror = this.ghostMirrors.get(observer.ghostMirrorId);
            if (mirror && mirror.ghostMode) {
                mirrorPrediction = this.predictWithAI(observerId, action, target);
                aiConfidence = mirrorPrediction.confidence;
                quantumCoherence = mirror.quantumState === 'entangled' ? 0.9 : 
                                  mirror.quantumState === 'coherent' ? 0.7 : 0.3;
                
                console.log(`👁️ Ghost Mirror ${mirror.id} predicting action: ${action}`);
                console.log(`🤖 AI Confidence: ${(aiConfidence * 100).toFixed(1)}% | Quantum Coherence: ${(quantumCoherence * 100).toFixed(1)}%`);
            }
        }

        const rule = this.rules.find(r => r.action === action);
        if (!rule) {
            this.logNazarEvent(observerId, action, target, 'denied', {
                mirrorPrediction,
                quantumCoherence,
                aiConfidence
            });
            return false;
        }

        let result: NazarEvent['result'] = 'denied';
        let allowed = false;

        // Check tier permissions
        if (observer.tier <= rule.requiredTier) {
            observer.lastSeen = Date.now();
            result = 'allowed';
            allowed = true;
        } else {
            // Check for override by higher tier
            const canOverride = rule.canOverride.some(tier => observer.tier <= tier);
            if (canOverride) {
                result = 'escalated';
                allowed = true;
            }
        }

        // 🧠 ENHANCE RESULT WITH AI PREDICTION
        if (mirrorPrediction && aiConfidence > 0.8) {
            if (result === 'allowed' && mirrorPrediction.predicted === 'allow') {
                result = 'ai_enhanced';
            } else if (result === 'denied' && mirrorPrediction.predicted === 'deny') {
                result = 'mirror_predicted';
            }
        }

        // 📊 RECORD OBSERVATION PATTERN FOR AI LEARNING
        this.recordObservationPattern(observerId, action, { target, rule: rule.action }, result);

        this.logNazarEvent(observerId, action, target, result, {
            mirrorPrediction,
            quantumCoherence,
            aiConfidence
        });

        return allowed;
    }

    // 🤖 AI PREDICTION ENGINE
    private predictWithAI(observerId: string, action: string, target?: string): any {
        const observer = this.observers.get(observerId);
        if (!observer?.aiSystemId) {
            return { predicted: 'unknown', confidence: 0.5 };
        }

        const aiSystem = this.aiSystems.get(observer.aiSystemId);
        if (!aiSystem || aiSystem.trainingData.length < 10) {
            return { predicted: 'insufficient_data', confidence: 0.3 };
        }

        // Simple AI prediction based on historical patterns
        const similarPatterns = aiSystem.trainingData.filter(pattern => 
            pattern.actionSequence.includes(action)
        );

        if (similarPatterns.length === 0) {
            return { predicted: 'no_pattern', confidence: 0.4 };
        }

        // Calculate most likely outcome
        const outcomes = similarPatterns.map(p => p.decisionPoints[0]?.chosenOption || 'unknown');
        const outcomeCount = outcomes.reduce((acc, outcome) => {
            acc[outcome] = (acc[outcome] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostLikelyOutcome = Object.keys(outcomeCount).reduce((a, b) => 
            outcomeCount[a] > outcomeCount[b] ? a : b
        );

        const confidence = outcomeCount[mostLikelyOutcome] / outcomes.length;

        return {
            predicted: mostLikelyOutcome,
            confidence: Math.min(0.95, confidence + (aiSystem.autonomyLevel * 0.2)),
            trainingSize: aiSystem.trainingData.length,
            patternMatches: similarPatterns.length
        };
    }

    recordMarineSignal(signal: MarineSignal): void {
        this.signals.push(signal);
        
        // Auto-analyze for critical patterns
        if (signal.intensity > 0.8) {
            this.nazarCheckpoint('system', 'analyze', `high_intensity_${signal.type}`);
        }
    }

    getHierarchyStatus(): { 
        observers: Observer[], 
        recentEvents: NazarEvent[],
        ghostMirrorSummary: any,
        aiSystemsSummary: any
    } {
        return {
            observers: Array.from(this.observers.values()),
            recentEvents: this.nazarLog.slice(-50),
            ghostMirrorSummary: this.getGhostMirrorAnalytics(),
            aiSystemsSummary: this.getAISystemMetrics()
        };
    }

    private logNazarEvent(
        observerId: string, 
        action: string, 
        target?: string, 
        result: NazarEvent['result'] = 'allowed',
        ghostMirrorData?: {
            mirrorPrediction: any;
            quantumCoherence: number;
            aiConfidence: number;
        }
    ): void {
        const observer = this.observers.get(observerId);
        const event: NazarEvent = {
            timestamp: Date.now(),
            observerId,
            action,
            target,
            result,
            tier: observer?.tier || 5
        };

        // Add ghost mirror data if provided
        if (ghostMirrorData && observer?.ghostMirrorId) {
            event.ghostMirrorData = {
                mirrorId: observer.ghostMirrorId,
                predictionAccuracy: ghostMirrorData.mirrorPrediction?.confidence || 0.5,
                quantumCoherence: ghostMirrorData.quantumCoherence,
                aiConfidence: ghostMirrorData.aiConfidence
            };

            // Add quantum effects if mirror is entangled
            const mirror = this.ghostMirrors.get(observer.ghostMirrorId);
            if (mirror?.quantumState === 'entangled') {
                event.quantumEffects = {
                    entanglement: true,
                    superposition: mirror.mirrorType === 'quantum_superposition',
                    coherenceTime: Date.now() - mirror.lastMirrorSync
                };
            }
        }
        
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

    // 👁️ PUBLIC GHOST MIRROR API METHODS
    public getGhostMirrorStatus(observerId: string): any {
        const observer = this.observers.get(observerId);
        if (!observer?.ghostMirrorId) {
            return { status: 'no_mirror', observer: observer?.id };
        }

        const mirror = this.ghostMirrors.get(observer.ghostMirrorId);
        const aiSystem = observer.aiSystemId ? this.aiSystems.get(observer.aiSystemId) : null;
        const patterns = this.observationPatterns.get(observerId) || [];

        return {
            status: 'active',
            mirror: {
                id: mirror?.id,
                type: mirror?.mirrorType,
                accuracy: mirror?.mirrorAccuracy,
                quantumState: mirror?.quantumState,
                ghostMode: mirror?.ghostMode,
                lastSync: mirror?.lastMirrorSync
            },
            aiSystem: aiSystem ? {
                type: aiSystem.aiType,
                learningMode: aiSystem.learningMode,
                trainingSize: aiSystem.trainingData.length,
                autonomy: aiSystem.autonomyLevel,
                synchronization: aiSystem.mirrorSynchronization
            } : null,
            patterns: {
                count: patterns.length,
                recent: patterns.slice(-5).map(p => ({
                    id: p.patternId,
                    action: p.actionSequence[0],
                    prediction: p.mirrorPrediction,
                    consciousness: p.consciousness_fingerprint
                }))
            },
            quantumEntanglements: this.quantumEntanglements.get(observerId) || []
        };
    }

    public synchronizeGhostMirror(observerId: string): boolean {
        const observer = this.observers.get(observerId);
        if (!observer?.ghostMirrorId) return false;

        const mirror = this.ghostMirrors.get(observer.ghostMirrorId);
        if (!mirror) return false;

        // Perform synchronization
        mirror.lastMirrorSync = Date.now();
        mirror.mirrorAccuracy = Math.min(1.0, mirror.mirrorAccuracy + 0.05);
        
        if (observer.mirrorSyncLevel !== undefined) {
            observer.mirrorSyncLevel = Math.min(1.0, observer.mirrorSyncLevel + 0.1);
        }

        console.log(`🔄 Ghost Mirror synchronized: ${mirror.id} | Accuracy: ${(mirror.mirrorAccuracy * 100).toFixed(1)}%`);
        return true;
    }

    public getQuantumEntanglements(observerId: string): string[] {
        return this.quantumEntanglements.get(observerId) || [];
    }

    public getAISystemMetrics(): any {
        const metrics: any = {};
        
        this.aiSystems.forEach((aiSystem, id) => {
            metrics[id] = {
                type: aiSystem.aiType,
                learningMode: aiSystem.learningMode,
                trainingDataSize: aiSystem.trainingData.length,
                autonomyLevel: aiSystem.autonomyLevel,
                mirrorSynchronization: aiSystem.mirrorSynchronization,
                quantumEntanglement: aiSystem.quantumEntanglement
            };
        });

        return metrics;
    }

    public getGhostMirrorAnalytics(): any {
        const analytics = {
            totalMirrors: this.ghostMirrors.size,
            totalAISystems: this.aiSystems.size,
            totalPatterns: Array.from(this.observationPatterns.values()).reduce((sum, patterns) => sum + patterns.length, 0),
            quantumEntanglements: this.quantumEntanglements.size,
            averageAccuracy: 0,
            mirrorTypes: {} as Record<string, number>,
            quantumStates: {} as Record<string, number>
        };

        let totalAccuracy = 0;
        let mirrorCount = 0;

        this.ghostMirrors.forEach(mirror => {
            totalAccuracy += mirror.mirrorAccuracy;
            mirrorCount++;
            
            analytics.mirrorTypes[mirror.mirrorType] = (analytics.mirrorTypes[mirror.mirrorType] || 0) + 1;
            analytics.quantumStates[mirror.quantumState] = (analytics.quantumStates[mirror.quantumState] || 0) + 1;
        });

        analytics.averageAccuracy = mirrorCount > 0 ? totalAccuracy / mirrorCount : 0;

        return analytics;
    }
}