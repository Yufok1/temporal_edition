// 🎭 TRIAGE COORDINATOR - Nazar & Djinn Utility Integration
// Breath-aligned coordination service for divine AI orchestration
// 🫁 BREATHING WITH THE KERNEL - INHALE POTENTIAL, EXHALE PROCEDURES 🫁

import { TriageArray, AIRequest, BreathCycle, CoordinationMetrics, KleenePattern, TriageDecision } from './TriageArray';
import { MarineBiologyWatchtower, Observer, NazarEvent } from '../core/MarineBiologyWatchtower';
import { DjinnCouncilService } from '../services/DjinnCouncilService';
import { CosmicBalanceMonitor } from '../crypto/CosmicBalanceMonitor';
import { WealthKnowledgeLogger } from '../crypto/WealthKnowledgeLogger';
import { RemediationService } from '../services/RemediationService';

export interface NazarTriageRequest {
    observerId: string;
    action: string;
    target?: string;
    tier: number;
    urgency: 'routine' | 'elevated' | 'critical' | 'divine';
}

export interface DjinnTriageGuidance {
    pattern: KleenePattern;
    wisdom: string;
    breathAlignment: string;
    cosmicResonance: number;
    recommendedAction: TriageDecision;
}

export interface TriageUtilityMetrics {
    nazarRequests: number;
    djinnGuidance: number;
    breathSyncAccuracy: number;
    divineAlignmentScore: number;
    kleenePatternEfficiency: number;
}

export class TriageCoordinator {
    private triageArray: TriageArray;
    private watchtower: MarineBiologyWatchtower;
    private djinnCouncil: DjinnCouncilService;
    private remediationService: RemediationService;
    private nazarRequestMap: Map<string, string> = new Map(); // maps nazar events to triage requests
    private djinnGuidanceLog: DjinnTriageGuidance[] = [];
    private utilityMetrics: TriageUtilityMetrics;
    
    // Breath synchronization
    private breathPhaseListeners: Map<string, (phase: string) => void> = new Map();
    private currentBreathPhase: string = 'inhale';
    
    constructor(
        watchtower: MarineBiologyWatchtower,
        djinnCouncil: DjinnCouncilService,
        cosmicMonitor: CosmicBalanceMonitor,
        wealthKnowledge: WealthKnowledgeLogger
    ) {
        this.watchtower = watchtower;
        this.djinnCouncil = djinnCouncil;
        this.triageArray = new TriageArray(watchtower, wealthKnowledge, cosmicMonitor);
        this.remediationService = new RemediationService();
        
        this.utilityMetrics = {
            nazarRequests: 0,
            djinnGuidance: 0,
            breathSyncAccuracy: 1.0,
            divineAlignmentScore: 1.0,
            kleenePatternEfficiency: 1.0
        };
        
        this.initializeBreathSync();
        this.setupNazarIntegration();
        this.setupDjinnIntegration();
        
        console.log('🎭 Triage Coordinator initialized - Nazar & Djinn utilities connected');
        console.log('🫁 Breathing with the kernel - Inhale potential, exhale procedures');
    }

    // 🫁 BREATH SYNCHRONIZATION
    private initializeBreathSync(): void {
        // Monitor triage array breath cycles
        setInterval(() => {
            const currentBreath = this.triageArray.getCurrentBreath();
            if (currentBreath.phase !== this.currentBreathPhase) {
                this.currentBreathPhase = currentBreath.phase;
                this.notifyBreathListeners(currentBreath.phase);
                console.log(`🫁 Breath transition: ${currentBreath.phase} | Coherence: ${(currentBreath.coherence * 100).toFixed(1)}%`);
            }
        }, 100); // Check every 100ms for smooth transitions
    }

    private notifyBreathListeners(phase: string): void {
        this.breathPhaseListeners.forEach(listener => listener(phase));
    }

    public onBreathPhase(id: string, callback: (phase: string) => void): void {
        this.breathPhaseListeners.set(id, callback);
        // Immediately call with current phase
        callback(this.currentBreathPhase);
    }

    public offBreathPhase(id: string): void {
        this.breathPhaseListeners.delete(id);
    }

    public getCurrentBreathPhase(): string {
        return this.currentBreathPhase;
    }

    // 🗼 NAZAR INTEGRATION
    private setupNazarIntegration(): void {
        // Monitor all nazar checkpoints
        console.log('🗼 Setting up Nazar triage integration...');
        
        // Override watchtower checkpoint to integrate with triage
        const originalCheckpoint = this.watchtower.nazarCheckpoint.bind(this.watchtower);
        
        this.watchtower.nazarCheckpoint = (observerId: string, action: string, target?: string): boolean => {
            // First run original nazar logic
            const nazarResult = originalCheckpoint(observerId, action, target);
            
            // Then submit to triage for coordination
            this.submitNazarRequest({
                observerId,
                action,
                target,
                tier: this.getObserverTier(observerId),
                urgency: this.determineNazarUrgency(action, nazarResult)
            });
            
            return nazarResult;
        };
    }

    public submitNazarRequest(request: NazarTriageRequest): string {
        this.utilityMetrics.nazarRequests++;
        
        // Convert to triage request
        const triageRequest = this.triageArray.submitRequest({
            sourceSystem: 'watchtower',
            requestType: this.mapNazarAction(request.action),
            content: {
                nazarRequest: request,
                originalAction: request.action,
                observerId: request.observerId
            },
            priority: this.mapNazarUrgency(request.urgency),
            kleenePattern: 'alternation', // Nazar requests alternate between observers
            breathAlignment: 'inhale', // Nazar gathers on inhale
            estimatedProcessingTime: 50,
            requiredResources: ['nazar_authority'],
            dependencies: []
        });

        this.nazarRequestMap.set(triageRequest, request.observerId);
        console.log(`🗼 Nazar request triaged: ${request.action} from ${request.observerId} | Urgency: ${request.urgency}`);
        
        return triageRequest;
    }

    // 🎭 DJINN INTEGRATION
    private setupDjinnIntegration(): void {
        console.log('🎭 Setting up Djinn Council triage integration...');
        
        // Monitor djinn wisdom requests
        this.djinnCouncil.onWisdomRequest = (topic: string, context: any) => {
            return this.requestDjinnGuidance(topic, context);
        };
    }

    public async requestDjinnGuidance(topic: string, context: any): Promise<DjinnTriageGuidance> {
        // Generate djinn-inspired guidance based on current state
        const currentMetrics = this.triageArray.getCoordinationMetrics();
        const kleenePattern = this.analyzeRequestPattern(topic);
        
        const guidance: DjinnTriageGuidance = {
            pattern: kleenePattern,
            wisdom: this.generateDjinnWisdom(topic, currentMetrics),
            breathAlignment: this.currentBreathPhase,
            cosmicResonance: currentMetrics.divineAlignment,
            recommendedAction: 'immediate_execute'
        };

        this.djinnGuidanceLog.push(guidance);
        console.log(`🎭 Djinn guidance: ${topic} | Breath: ${this.currentBreathPhase} | Resonance: ${(guidance.cosmicResonance * 100).toFixed(1)}%`);
        
        return guidance;
    }

    // 🔄 KLEENE PATTERN UTILITIES
    public analyzeSystemPatterns(): Map<string, { count: number; efficiency: number }> {
        const patterns = new Map<string, { count: number; efficiency: number }>();
        const kleeneAnalysis = this.triageArray.getKleeneAnalysis();
        
        kleeneAnalysis.forEach((analysis, pattern) => {
            patterns.set(pattern, {
                count: Math.floor(analysis.frequency * 60), // Convert to per-minute
                efficiency: analysis.confidence
            });
        });

        return patterns;
    }

    public optimizeForPattern(pattern: KleenePattern): void {
        console.log(`🔄 Optimizing system for ${pattern} pattern...`);
        
        // Force specific breath alignment for pattern
        switch (pattern) {
            case 'star':
                this.triageArray.forceBreathAlignment();
                console.log('⭐ Star pattern: Batching similar requests');
                break;
            case 'infinity_loop':
                console.log('♾️ Infinity pattern: Distributing across all phases');
                break;
            default:
                console.log(`🔄 Applying standard optimization for ${pattern}`);
        }
    }

    // 📊 UTILITY METRICS & MONITORING
    public getUtilityMetrics(): TriageUtilityMetrics {
        const coordinationMetrics = this.triageArray.getCoordinationMetrics();
        const kleeneAnalysis = this.triageArray.getKleeneAnalysis();
        
        // Calculate kleene efficiency average
        let totalEfficiency = 0;
        let patternCount = 0;
        kleeneAnalysis.forEach(analysis => {
            totalEfficiency += analysis.confidence;
            patternCount++;
        });
        
        this.utilityMetrics.breathSyncAccuracy = coordinationMetrics.breathCoherence;
        this.utilityMetrics.divineAlignmentScore = coordinationMetrics.divineAlignment;
        this.utilityMetrics.kleenePatternEfficiency = patternCount > 0 ? totalEfficiency / patternCount : 1.0;
        
        return { ...this.utilityMetrics };
    }

    // 🛠️ HELPER METHODS
    private getObserverTier(observerId: string): number {
        const hierarchy = this.watchtower.getHierarchyStatus();
        const observer = hierarchy.observers.find(o => o.id === observerId);
        return observer?.tier || 5;
    }

    private determineNazarUrgency(action: string, allowed: boolean): NazarTriageRequest['urgency'] {
        if (!allowed) return 'critical'; // Denied actions are critical
        if (action === 'override') return 'divine';
        if (action === 'configure') return 'elevated';
        return 'routine';
    }

    private mapNazarAction(action: string): AIRequest['requestType'] {
        switch (action) {
            case 'observe': return 'data_query';
            case 'analyze': return 'analysis';
            case 'command': return 'action';
            case 'configure': return 'decision';
            case 'override': return 'divine_intervention';
            default: return 'data_query';
        }
    }

    private mapNazarUrgency(urgency: NazarTriageRequest['urgency']): AIRequest['priority'] {
        switch (urgency) {
            case 'divine': return 'divine_urgent';
            case 'critical': return 'breath_critical';
            case 'elevated': return 'cosmic_high';
            case 'routine': return 'knowledge_medium';
            default: return 'background_low';
        }
    }

    private analyzeRequestPattern(topic: string): KleenePattern {
        // Analyze topic for pattern hints
        if (topic.includes('repeat') || topic.includes('continuous')) return 'infinity_loop';
        if (topic.includes('optional') || topic.includes('maybe')) return 'optional';
        if (topic.includes('sequence') || topic.includes('chain')) return 'concatenation';
        if (topic.includes('choice') || topic.includes('either')) return 'alternation';
        if (topic.includes('multiple') || topic.includes('batch')) return 'star';
        return 'plus'; // Default to one-or-more pattern
    }

    private determineOptimalBreath(topic: string): AIRequest['breathAlignment'] {
        // Determine optimal breath phase for topic
        if (topic.includes('gather') || topic.includes('receive')) return 'inhale';
        if (topic.includes('process') || topic.includes('analyze')) return 'hold_in';
        if (topic.includes('execute') || topic.includes('perform')) return 'exhale';
        if (topic.includes('wait') || topic.includes('pause')) return 'hold_out';
        return 'inhale'; // Default to gathering phase
    }

    private generateDjinnWisdom(topic: string, metrics: CoordinationMetrics): string {
        const harmony = (metrics.systemHarmony * 100).toFixed(1);
        const breath = (metrics.breathCoherence * 100).toFixed(1);
        
        const wisdomTemplates = [
            `In the rhythm of ${breath}% breath coherence, ${topic} finds its natural flow`,
            `With ${harmony}% system harmony, the path of ${topic} becomes clear`,
            `As above in divine alignment, so below in ${topic} manifestation`,
            `The breath carries ${topic} through phases of potential and actualization`,
            `In the dance of kleene patterns, ${topic} reveals its true nature`
        ];

        return wisdomTemplates[Math.floor(Math.random() * wisdomTemplates.length)];
    }

    // 🚨 EMERGENCY OVERRIDES
    public emergencyNazarOverride(observerId: string, action: string): boolean {
        console.log(`🚨 Emergency Nazar override requested: ${observerId} → ${action}`);
        
        const request = this.submitNazarRequest({
            observerId,
            action,
            tier: 1, // Emergency tier
            urgency: 'divine'
        });

        return this.triageArray.emergencyTriageOverride(request);
    }

    public forceDjinnAlignment(): void {
        console.log('🎭 Forcing Djinn cosmic alignment...');
        this.triageArray.forceBreathAlignment();
        
        // Generate emergency djinn wisdom
        this.requestDjinnGuidance('emergency_cosmic_alignment', {
            reason: 'forced_alignment',
            timestamp: Date.now()
        });
    }

    // 🛑 SHUTDOWN
    public shutdown(): void {
        this.breathPhaseListeners.clear();
        this.triageArray.shutdown();
        console.log('🎭 Triage Coordinator shutdown - Nazar & Djinn utilities disconnected');
    }
}

// 🌟 EXPORT SINGLETON INSTANCE
export let triageCoordinator: TriageCoordinator | null = null;

export function initializeTriageCoordinator(
    watchtower: MarineBiologyWatchtower,
    djinnCouncil: DjinnCouncilService,
    cosmicMonitor: CosmicBalanceMonitor,
    wealthKnowledge: WealthKnowledgeLogger
): TriageCoordinator {
    if (!triageCoordinator) {
        triageCoordinator = new TriageCoordinator(watchtower, djinnCouncil, cosmicMonitor, wealthKnowledge);
    }
    return triageCoordinator;
}

export function getTriageCoordinator(): TriageCoordinator | null {
    return triageCoordinator;
}