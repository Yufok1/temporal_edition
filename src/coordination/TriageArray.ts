// ⚡ TRIAGE ARRAY - Breath-Aligned AI System Coordination
// Kleene Analysis Engines for Pattern Recognition & Request Prioritization
// 🫁 BREATH ALIGNED: Synchronized with natural respiration cycles 🫁

import { MarineBiologyWatchtower, Observer, ObserverTier } from '../core/MarineBiologyWatchtower';
import { CosmicBalanceMonitor, DivineAlert } from '../crypto/CosmicBalanceMonitor';
import { WealthKnowledgeLogger, KnowledgeVertex } from '../crypto/WealthKnowledgeLogger';

export type BreathPhase = 'inhale' | 'hold_in' | 'exhale' | 'hold_out';
export type RequestPriority = 'breath_critical' | 'divine_urgent' | 'cosmic_high' | 'knowledge_medium' | 'background_low';
export type KleenePattern = 'star' | 'plus' | 'optional' | 'alternation' | 'concatenation' | 'infinity_loop';
export type TriageDecision = 'immediate_execute' | 'queue_next_breath' | 'defer_to_exhale' | 'escalate_divine' | 'background_process';

export interface BreathCycle {
    id: string;
    phase: BreathPhase;
    timestamp: number;
    duration: number; // milliseconds
    intensity: number; // 0-1 scale
    harmonic: number; // breath harmonic frequency
    coherence: number; // heart-breath coherence 0-1
}

export interface AIRequest {
    id: string;
    timestamp: number;
    sourceSystem: 'psdn_tracker' | 'obol_dash' | 'cosmic_monitor' | 'wealth_knowledge' | 'watchtower' | 'portfolio' | 'user_input';
    requestType: 'data_query' | 'analysis' | 'decision' | 'action' | 'alert' | 'divine_intervention';
    content: any;
    priority: RequestPriority;
    kleenePattern: KleenePattern;
    breathAlignment: BreathPhase;
    estimatedProcessingTime: number; // milliseconds
    requiredResources: string[];
    dependencies: string[];
}

export interface KleeneAnalysisResult {
    pattern: KleenePattern;
    confidence: number; // 0-1
    frequency: number; // requests per breath cycle
    predictedNext: AIRequest[];
    optimizationSuggestion: string;
    breathAlignment: BreathPhase;
}

export interface TriageDecisionMatrix {
    request: AIRequest;
    breathContext: BreathCycle;
    decision: TriageDecision;
    reasoning: string[];
    executionTime: number; // when to execute (timestamp)
    assignedResources: string[];
    kleeneOptimization: KleeneAnalysisResult;
}

export interface CoordinationMetrics {
    breathCoherence: number; // 0-1 alignment with breath
    requestThroughput: number; // requests per minute
    kleeneEfficiency: number; // pattern optimization score
    divineAlignment: number; // cosmic harmony score
    resourceUtilization: number; // 0-1 resource efficiency
    systemHarmony: number; // overall coordination score
}

export class TriageArray {
    private breathCycles: BreathCycle[] = [];
    private requestQueue: AIRequest[] = [];
    private activeRequests: Map<string, TriageDecisionMatrix> = new Map();
    private kleenePatterns: Map<KleenePattern, KleeneAnalysisResult> = new Map();
    private coordinationMetrics: CoordinationMetrics;
    
    // Connected AI Systems
    private watchtower: MarineBiologyWatchtower;
    private cosmicMonitor?: CosmicBalanceMonitor;
    private wealthKnowledge: WealthKnowledgeLogger;
    
    // Breath-aligned timing
    private currentBreath: BreathCycle;
    private breathTimer: any = null;
    private kleeneAnalysisTimer: any = null;
    
    // Coordination constants
    private readonly BREATH_CYCLE_BASE = 4000; // 4 second base breath cycle
    private readonly INHALE_RATIO = 0.4; // 40% of cycle
    private readonly HOLD_IN_RATIO = 0.1; // 10% of cycle  
    private readonly EXHALE_RATIO = 0.4; // 40% of cycle
    private readonly HOLD_OUT_RATIO = 0.1; // 10% of cycle
    private readonly KLEENE_ANALYSIS_INTERVAL = 15000; // 15 seconds
    private readonly MAX_REQUESTS_PER_BREATH = 12; // Efficiency limit
    
    constructor(
        watchtower: MarineBiologyWatchtower,
        wealthKnowledge: WealthKnowledgeLogger,
        cosmicMonitor?: CosmicBalanceMonitor
    ) {
        this.watchtower = watchtower;
        this.wealthKnowledge = wealthKnowledge;
        this.cosmicMonitor = cosmicMonitor;
        
        this.coordinationMetrics = this.initializeMetrics();
        this.currentBreath = this.initializeBreathCycle();
        
        this.startBreathCoordination();
        this.startKleeneAnalysis();
        
        console.log('⚡🫁 Triage Array initialized - Breath-aligned AI coordination active');
        console.log('🔄 Kleene Analysis Engines online - Pattern optimization enabled');
    }

    private initializeMetrics(): CoordinationMetrics {
        return {
            breathCoherence: 1.0,
            requestThroughput: 0,
            kleeneEfficiency: 1.0,
            divineAlignment: 1.0,
            resourceUtilization: 0,
            systemHarmony: 1.0
        };
    }

    private initializeBreathCycle(): BreathCycle {
        return {
            id: `breath_${Date.now()}`,
            phase: 'inhale',
            timestamp: Date.now(),
            duration: this.BREATH_CYCLE_BASE,
            intensity: 1.0,
            harmonic: 0.25, // 4 second cycle = 0.25 Hz
            coherence: 1.0
        };
    }

    // 🫁 BREATH COORDINATION ENGINE
    private startBreathCoordination(): void {
        const startNewBreathCycle = () => {
            this.currentBreath = {
                id: `breath_${Date.now()}`,
                phase: 'inhale',
                timestamp: Date.now(),
                duration: this.calculateBreathDuration(),
                intensity: this.calculateBreathIntensity(),
                harmonic: this.calculateBreathHarmonic(),
                coherence: this.calculateBreathCoherence()
            };
            
            this.breathCycles.push(this.currentBreath);
            this.processBreathPhase();
        };

        startNewBreathCycle();
    }

    private processBreathPhase(): void {
        const { duration } = this.currentBreath;
        
        // Schedule phase transitions
        setTimeout(() => {
            this.currentBreath.phase = 'hold_in';
            this.executeBreathPhaseActions('hold_in');
        }, duration * this.INHALE_RATIO);

        setTimeout(() => {
            this.currentBreath.phase = 'exhale';
            this.executeBreathPhaseActions('exhale');
        }, duration * (this.INHALE_RATIO + this.HOLD_IN_RATIO));

        setTimeout(() => {
            this.currentBreath.phase = 'hold_out';
            this.executeBreathPhaseActions('hold_out');
        }, duration * (this.INHALE_RATIO + this.HOLD_IN_RATIO + this.EXHALE_RATIO));

        setTimeout(() => {
            // Complete cycle and start new one
            this.completeBreathCycle();
            this.processBreathPhase();
        }, duration);

        // Execute inhale phase actions immediately
        this.executeBreathPhaseActions('inhale');
    }

    private executeBreathPhaseActions(phase: BreathPhase): void {
        console.log(`🫁 Breath Phase: ${phase.toUpperCase()} - Processing aligned requests`);
        
        // Process requests aligned with this breath phase
        const phaseRequests = this.requestQueue.filter(req => 
            req.breathAlignment === phase || this.shouldProcessInPhase(req, phase)
        );

        phaseRequests.forEach(request => {
            const decision = this.makeTriageDecision(request, this.currentBreath);
            if (decision.decision === 'immediate_execute') {
                this.executeRequest(decision);
            }
        });

        // Update breath coherence metrics
        this.updateBreathCoherence(phase);
    }

    // 🔄 KLEENE ANALYSIS ENGINE
    private startKleeneAnalysis(): void {
        this.kleeneAnalysisTimer = setInterval(() => {
            this.performKleeneAnalysis();
            this.optimizeRequestPatterns();
            this.updateCoordinationMetrics();
        }, this.KLEENE_ANALYSIS_INTERVAL);
    }

    private performKleeneAnalysis(): void {
        const recentRequests = this.getRecentRequests(60000); // Last minute
        
        // Analyze patterns for each kleene type
        const patterns: KleenePattern[] = ['star', 'plus', 'optional', 'alternation', 'concatenation', 'infinity_loop'];
        
        patterns.forEach(pattern => {
            const analysis = this.analyzeKleenePattern(recentRequests, pattern);
            this.kleenePatterns.set(pattern, analysis);
        });

        console.log(`🔄 Kleene Analysis completed - ${patterns.length} patterns analyzed`);
    }

    private optimizeRequestPatterns(): void {
        // Apply kleene analysis results to optimize future request processing
        for (const [pattern, analysis] of this.kleenePatterns) {
            if (analysis.confidence > 0.7) {
                console.log(`🔄 High confidence pattern detected: ${pattern} (${(analysis.confidence * 100).toFixed(1)}%)`);
                console.log(`   Optimization: ${analysis.optimizationSuggestion}`);
                
                // Apply pattern-specific optimizations
                this.applyPatternOptimization(analysis);
            }
        }
    }

    private applyPatternOptimization(analysis: KleeneAnalysisResult): void {
        // Apply specific optimizations based on kleene analysis
        switch (analysis.pattern) {
            case 'star':
                // Batch similar requests during optimal phase
                this.batchSimilarRequests(analysis.breathAlignment);
                break;
            case 'plus':
                // Prepare for consecutive request processing
                this.prepareConsecutiveProcessing();
                break;
            case 'optional':
                // Defer optional requests to reduce load
                this.deferOptionalRequests();
                break;
            case 'alternation':
                // Balance alternating request types
                this.balanceAlternatingRequests();
                break;
            case 'concatenation':
                // Optimize dependency chains
                this.optimizeDependencyChains();
                break;
            case 'infinity_loop':
                // Distribute infinite patterns across cycles
                this.distributeInfinitePatterns();
                break;
        }
    }

    private batchSimilarRequests(optimalPhase: BreathPhase): void {
        // Group similar requests for batch processing during optimal breath phase
        const similarGroups = new Map<string, AIRequest[]>();
        
        this.requestQueue.forEach(request => {
            const key = `${request.sourceSystem}_${request.requestType}`;
            if (!similarGroups.has(key)) {
                similarGroups.set(key, []);
            }
            similarGroups.get(key)!.push(request);
        });

        // Update breath alignment for batched requests
        for (const group of similarGroups.values()) {
            if (group.length >= 2) {
                group.forEach(request => {
                    request.breathAlignment = optimalPhase;
                });
            }
        }
    }

    private prepareConsecutiveProcessing(): void {
        console.log('🔄 Preparing for consecutive request processing optimization');
    }

    private deferOptionalRequests(): void {
        this.requestQueue.forEach(request => {
            if (request.priority === 'background_low') {
                request.breathAlignment = 'hold_out';
            }
        });
    }

    private balanceAlternatingRequests(): void {
        console.log('🔄 Balancing alternating request pattern processing');
    }

    private optimizeDependencyChains(): void {
        // Sort requests by dependency chains
        const dependentRequests = this.requestQueue.filter(req => req.dependencies.length > 0);
        dependentRequests.forEach(request => {
            request.breathAlignment = 'exhale'; // Sequential execution phase
        });
    }

    private distributeInfinitePatterns(): void {
        // Distribute high-frequency patterns across all breath phases
        const highFreqRequests = this.requestQueue.filter(req => 
            req.kleenePattern === 'infinity_loop'
        );
        
        const phases: BreathPhase[] = ['inhale', 'hold_in', 'exhale', 'hold_out'];
        highFreqRequests.forEach((request, index) => {
            request.breathAlignment = phases[index % phases.length];
        });
    }

    private analyzeKleenePattern(requests: AIRequest[], pattern: KleenePattern): KleeneAnalysisResult {
        let confidence = 0;
        let frequency = 0;
        let predictedNext: AIRequest[] = [];
        let optimizationSuggestion = '';
        let breathAlignment: BreathPhase = 'inhale';

        switch (pattern) {
            case 'star': // Zero or more repetitions (a*)
                const starRepeats = this.findRepeatingSequences(requests);
                confidence = starRepeats.length > 0 ? 0.8 : 0.2;
                frequency = starRepeats.length / 60; // per second
                optimizationSuggestion = 'Batch similar requests during exhale phase';
                breathAlignment = 'exhale';
                break;

            case 'plus': // One or more repetitions (a+)
                const plusRepeats = this.findConsecutiveRepeats(requests);
                confidence = plusRepeats.length > 1 ? 0.9 : 0.3;
                frequency = plusRepeats.length / 60;
                optimizationSuggestion = 'Sequence processing during inhale-hold';
                breathAlignment = 'hold_in';
                break;

            case 'optional': // Zero or one occurrence (a?)
                const optionalPatterns = this.findOptionalPatterns(requests);
                confidence = optionalPatterns.confidence;
                frequency = optionalPatterns.frequency;
                optimizationSuggestion = 'Process optionals during hold phases';
                breathAlignment = 'hold_out';
                break;

            case 'alternation': // Choice between patterns (a|b)
                const alternations = this.findAlternatingPatterns(requests);
                confidence = alternations.strength;
                frequency = alternations.rate;
                optimizationSuggestion = 'Alternate processing between inhale/exhale';
                breathAlignment = 'inhale';
                break;

            case 'concatenation': // Sequential patterns (ab)
                const sequences = this.findSequentialPatterns(requests);
                confidence = sequences.reliability;
                frequency = sequences.rate;
                optimizationSuggestion = 'Chain dependent requests in sequence';
                breathAlignment = 'exhale';
                break;

            case 'infinity_loop': // Infinite repetition (a∞)
                const loops = this.findInfiniteLoops(requests);
                confidence = loops.detected ? 0.95 : 0.1;
                frequency = loops.cycleRate;
                optimizationSuggestion = 'Distribute infinite patterns across all phases';
                breathAlignment = 'inhale';
                break;
        }

        return {
            pattern,
            confidence,
            frequency,
            predictedNext,
            optimizationSuggestion,
            breathAlignment
        };
    }

    // 🎯 TRIAGE DECISION ENGINE
    public submitRequest(request: Omit<AIRequest, 'id' | 'timestamp'>): string {
        const fullRequest: AIRequest = {
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            ...request
        };

        // Apply kleene pattern analysis
        fullRequest.kleenePattern = this.detectKleenePattern(fullRequest);
        fullRequest.breathAlignment = this.optimizeBreathAlignment(fullRequest);

        this.requestQueue.push(fullRequest);
        
        // Immediate triage decision
        const decision = this.makeTriageDecision(fullRequest, this.currentBreath);
        this.activeRequests.set(fullRequest.id, decision);

        console.log(`⚡ Request submitted: ${fullRequest.requestType} | Pattern: ${fullRequest.kleenePattern} | Priority: ${fullRequest.priority}`);
        
        // Execute if immediate
        if (decision.decision === 'immediate_execute') {
            this.executeRequest(decision);
        }

        return fullRequest.id;
    }

    private makeTriageDecision(request: AIRequest, breathContext: BreathCycle): TriageDecisionMatrix {
        const reasoning: string[] = [];
        let decision: TriageDecision = 'queue_next_breath';
        let executionTime = Date.now();

        // Priority-based decision
        switch (request.priority) {
            case 'breath_critical':
                decision = 'immediate_execute';
                reasoning.push('Critical priority overrides breath alignment');
                break;
                
            case 'divine_urgent':
                const divineAlerts = this.cosmicMonitor?.getDivineAlerts() || [];
                if (divineAlerts.length > 0) {
                    decision = 'escalate_divine';
                    reasoning.push('Divine intervention required');
                } else {
                    decision = 'immediate_execute';
                }
                break;
                
            case 'cosmic_high':
                if (breathContext.phase === 'inhale' || breathContext.phase === 'hold_in') {
                    decision = 'immediate_execute';
                    reasoning.push('High priority aligned with inhale phase');
                } else {
                    decision = 'queue_next_breath';
                    reasoning.push('Queued for next inhale phase');
                }
                break;
                
            case 'knowledge_medium':
                if (breathContext.phase === 'exhale') {
                    decision = 'immediate_execute';
                    reasoning.push('Knowledge processing optimal during exhale');
                } else {
                    decision = 'defer_to_exhale';
                }
                break;
                
            case 'background_low':
                decision = 'background_process';
                reasoning.push('Background processing during hold phases');
                break;
        }

        // Breath alignment optimization
        if (request.breathAlignment === breathContext.phase) {
            reasoning.push(`Breath-aligned with ${breathContext.phase} phase`);
        }

        // Resource availability check
        const resourcesAvailable = this.checkResourceAvailability(request.requiredResources);
        if (!resourcesAvailable && decision === 'immediate_execute') {
            decision = 'queue_next_breath';
            reasoning.push('Resources not available, queuing for next cycle');
        }

        // Kleene pattern optimization
        const kleeneResult = this.kleenePatterns.get(request.kleenePattern);
        if (kleeneResult) {
            reasoning.push(`Kleene ${request.kleenePattern}: ${kleeneResult.optimizationSuggestion}`);
            
            if (kleeneResult.breathAlignment !== breathContext.phase && decision !== 'immediate_execute') {
                executionTime = this.calculateOptimalExecutionTime(kleeneResult.breathAlignment);
            }
        }

        return {
            request,
            breathContext,
            decision,
            reasoning,
            executionTime,
            assignedResources: request.requiredResources,
            kleeneOptimization: kleeneResult || this.getDefaultKleeneResult(request.kleenePattern)
        };
    }

    // 🚀 REQUEST EXECUTION ENGINE
    private executeRequest(decision: TriageDecisionMatrix): void {
        const { request } = decision;
        
        console.log(`🚀 Executing request: ${request.id} | ${request.requestType} | Decision: ${decision.decision}`);
        console.log(`   Reasoning: ${decision.reasoning.join(', ')}`);

        // Route to appropriate system
        switch (request.sourceSystem) {
            case 'watchtower':
                this.executeWatchtowerRequest(request);
                break;
            case 'cosmic_monitor':
                this.executeCosmicRequest(request);
                break;
            case 'wealth_knowledge':
                this.executeWealthKnowledgeRequest(request);
                break;
            case 'psdn_tracker':
            case 'obol_dash':
            case 'portfolio':
                this.executeCryptoRequest(request);
                break;
            case 'user_input':
                this.executeUserRequest(request);
                break;
        }

        // Update metrics
        this.updateExecutionMetrics(decision);
        
        // Remove from active requests
        this.activeRequests.delete(request.id);
    }

    // 📊 COORDINATION METRICS & OPTIMIZATION
    private updateCoordinationMetrics(): void {
        const recentRequests = this.getRecentRequests(60000);
        
        // Breath coherence
        this.coordinationMetrics.breathCoherence = this.calculateBreathCoherence();
        
        // Request throughput
        this.coordinationMetrics.requestThroughput = recentRequests.length;
        
        // Kleene efficiency
        const kleeneEfficiencies = Array.from(this.kleenePatterns.values())
            .map(p => p.confidence);
        this.coordinationMetrics.kleeneEfficiency = kleeneEfficiencies.length > 0 ? 
            kleeneEfficiencies.reduce((sum, eff) => sum + eff, 0) / kleeneEfficiencies.length : 1.0;
        
        // Divine alignment
        this.coordinationMetrics.divineAlignment = this.cosmicMonitor ? 
            this.cosmicMonitor.getCosmicBalance().equilibriumScore / 100 : 1.0;
        
        // Resource utilization
        this.coordinationMetrics.resourceUtilization = this.calculateResourceUtilization();
        
        // Overall system harmony
        this.coordinationMetrics.systemHarmony = (
            this.coordinationMetrics.breathCoherence +
            Math.min(1, this.coordinationMetrics.requestThroughput / 60) +
            this.coordinationMetrics.kleeneEfficiency +
            this.coordinationMetrics.divineAlignment +
            this.coordinationMetrics.resourceUtilization
        ) / 5;

        console.log(`📊 Coordination Metrics - Harmony: ${(this.coordinationMetrics.systemHarmony * 100).toFixed(1)}%`);
    }

    // 🔄 PATTERN ANALYSIS UTILITIES
    private findRepeatingSequences(requests: AIRequest[]): AIRequest[][] {
        const sequences: AIRequest[][] = [];
        const typeSequences = requests.map(r => r.requestType);
        
        for (let i = 0; i < typeSequences.length - 1; i++) {
            for (let j = i + 1; j < typeSequences.length; j++) {
                if (typeSequences[i] === typeSequences[j]) {
                    const subsequence = requests.slice(i, j + 1);
                    if (subsequence.length >= 2) {
                        sequences.push(subsequence);
                    }
                }
            }
        }
        
        return sequences;
    }

    private findConsecutiveRepeats(requests: AIRequest[]): AIRequest[] {
        const repeats: AIRequest[] = [];
        
        for (let i = 0; i < requests.length - 1; i++) {
            if (requests[i].requestType === requests[i + 1].requestType) {
                repeats.push(requests[i], requests[i + 1]);
            }
        }
        
        return [...new Set(repeats)]; // Remove duplicates
    }

    private findOptionalPatterns(requests: AIRequest[]): { confidence: number; frequency: number } {
        const patterns = new Map<string, number>();
        const optionalCount = requests.filter(r => r.priority === 'background_low').length;
        
        return {
            confidence: optionalCount > 0 ? Math.min(1, optionalCount / requests.length * 2) : 0,
            frequency: optionalCount / 60
        };
    }

    private findAlternatingPatterns(requests: AIRequest[]): { strength: number; rate: number } {
        let alternations = 0;
        
        for (let i = 0; i < requests.length - 1; i++) {
            if (requests[i].sourceSystem !== requests[i + 1].sourceSystem) {
                alternations++;
            }
        }
        
        return {
            strength: requests.length > 1 ? alternations / (requests.length - 1) : 0,
            rate: alternations / 60
        };
    }

    private findSequentialPatterns(requests: AIRequest[]): { reliability: number; rate: number } {
        let sequences = 0;
        
        // Look for dependency chains
        requests.forEach(request => {
            if (request.dependencies.length > 0) {
                sequences++;
            }
        });
        
        return {
            reliability: requests.length > 0 ? sequences / requests.length : 0,
            rate: sequences / 60
        };
    }

    private findInfiniteLoops(requests: AIRequest[]): { detected: boolean; cycleRate: number } {
        const typeCounters = new Map<string, number>();
        
        requests.forEach(request => {
            const key = `${request.sourceSystem}_${request.requestType}`;
            typeCounters.set(key, (typeCounters.get(key) || 0) + 1);
        });
        
        const maxRepeats = Math.max(...Array.from(typeCounters.values()));
        const detected = maxRepeats >= 5; // 5+ repeats indicates potential loop
        
        return {
            detected,
            cycleRate: detected ? maxRepeats / 60 : 0
        };
    }

    // 🛠️ UTILITY METHODS
    private detectKleenePattern(request: AIRequest): KleenePattern {
        // Simple pattern detection based on request characteristics
        if (request.requestType === 'alert' && request.priority === 'divine_urgent') {
            return 'infinity_loop';
        }
        if (request.dependencies.length > 0) {
            return 'concatenation';
        }
        if (request.priority === 'background_low') {
            return 'optional';
        }
        if (request.sourceSystem === 'user_input') {
            return 'alternation';
        }
        return 'star'; // Default pattern
    }

    private optimizeBreathAlignment(request: AIRequest): BreathPhase {
        switch (request.requestType) {
            case 'data_query':
                return 'inhale'; // Gathering phase
            case 'analysis':
                return 'hold_in'; // Processing phase
            case 'decision':
                return 'exhale'; // Action phase
            case 'action':
                return 'exhale'; // Execution phase
            case 'alert':
                return 'hold_out'; // Alert phase
            case 'divine_intervention':
                return 'inhale'; // Receiving divine guidance
            default:
                return 'inhale';
        }
    }

    private calculateBreathDuration(): number {
        // Adaptive breath duration based on system load
        const currentLoad = this.requestQueue.length;
        const loadFactor = Math.max(0.5, Math.min(2.0, 1 + (currentLoad - 10) * 0.1));
        return this.BREATH_CYCLE_BASE * loadFactor;
    }

    private calculateBreathIntensity(): number {
        // Intensity based on priority of queued requests
        const priorityWeights = {
            'breath_critical': 1.0,
            'divine_urgent': 0.9,
            'cosmic_high': 0.7,
            'knowledge_medium': 0.5,
            'background_low': 0.2
        };
        
        const totalWeight = this.requestQueue.reduce((sum, req) => 
            sum + priorityWeights[req.priority], 0);
        
        return Math.min(1.0, totalWeight / this.requestQueue.length || 0.5);
    }

    private calculateBreathHarmonic(): number {
        const duration = this.currentBreath?.duration || this.BREATH_CYCLE_BASE;
        return 1000 / duration; // Hz
    }

    private calculateBreathCoherence(): number {
        if (this.breathCycles.length < 3) return 1.0;
        
        const recent = this.breathCycles.slice(-3);
        const durations = recent.map(b => b.duration);
        const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        const variance = durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
        
        // Lower variance = higher coherence
        return Math.max(0, 1 - variance / (avgDuration * avgDuration));
    }

    private shouldProcessInPhase(request: AIRequest, phase: BreathPhase): boolean {
        // Emergency overrides
        if (request.priority === 'breath_critical') return true;
        if (request.priority === 'divine_urgent' && this.cosmicMonitor?.getDivineAlerts().length > 0) return true;
        
        // Phase-specific logic
        switch (phase) {
            case 'inhale':
                return ['data_query', 'divine_intervention'].includes(request.requestType);
            case 'hold_in':
                return ['analysis'].includes(request.requestType);
            case 'exhale':
                return ['decision', 'action'].includes(request.requestType);
            case 'hold_out':
                return ['alert'].includes(request.requestType) || request.priority === 'background_low';
        }
        
        return false;
    }

    private checkResourceAvailability(resources: string[]): boolean {
        // Simplified resource check - would integrate with actual resource manager
        return resources.length <= 3; // Arbitrary limit for demo
    }

    private calculateOptimalExecutionTime(optimalPhase: BreathPhase): number {
        const currentTime = Date.now();
        const breathStart = this.currentBreath.timestamp;
        const breathDuration = this.currentBreath.duration;
        
        let phaseOffset = 0;
        switch (optimalPhase) {
            case 'inhale':
                phaseOffset = 0;
                break;
            case 'hold_in':
                phaseOffset = breathDuration * this.INHALE_RATIO;
                break;
            case 'exhale':
                phaseOffset = breathDuration * (this.INHALE_RATIO + this.HOLD_IN_RATIO);
                break;
            case 'hold_out':
                phaseOffset = breathDuration * (this.INHALE_RATIO + this.HOLD_IN_RATIO + this.EXHALE_RATIO);
                break;
        }
        
        const targetTime = breathStart + phaseOffset;
        return targetTime > currentTime ? targetTime : targetTime + breathDuration; // Next cycle if missed
    }

    private getDefaultKleeneResult(pattern: KleenePattern): KleeneAnalysisResult {
        return {
            pattern,
            confidence: 0.5,
            frequency: 0,
            predictedNext: [],
            optimizationSuggestion: 'Insufficient data for optimization',
            breathAlignment: 'inhale'
        };
    }

    // System-specific execution methods
    private executeWatchtowerRequest(request: AIRequest): void {
        console.log(`🗼 Executing watchtower request: ${request.content}`);
        // Integration with watchtower system
    }

    private executeCosmicRequest(request: AIRequest): void {
        console.log(`⚖️ Executing cosmic request: ${request.content}`);
        // Integration with cosmic monitor
    }

    private executeWealthKnowledgeRequest(request: AIRequest): void {
        console.log(`🧠💰 Executing wealth knowledge request: ${request.content}`);
        // Integration with wealth knowledge system
    }

    private executeCryptoRequest(request: AIRequest): void {
        console.log(`💰 Executing crypto request: ${request.content}`);
        // Integration with crypto systems
    }

    private executeUserRequest(request: AIRequest): void {
        console.log(`👤 Executing user request: ${request.content}`);
        // Integration with user interface
    }

    private updateExecutionMetrics(decision: TriageDecisionMatrix): void {
        // Update performance metrics
        const executionTime = Date.now() - decision.request.timestamp;
        console.log(`📊 Request executed in ${executionTime}ms`);
    }

    private calculateResourceUtilization(): number {
        const activeCount = this.activeRequests.size;
        const maxConcurrent = this.MAX_REQUESTS_PER_BREATH;
        return Math.min(1.0, activeCount / maxConcurrent);
    }

    private updateBreathCoherence(phase: BreathPhase): void {
        // Update breath coherence based on successful phase execution
        this.coordinationMetrics.breathCoherence = Math.max(0.1, 
            this.coordinationMetrics.breathCoherence * 0.95 + 0.05);
    }

    private completeBreathCycle(): void {
        console.log(`🫁 Breath cycle completed: ${this.currentBreath.id} | Coherence: ${(this.currentBreath.coherence * 100).toFixed(1)}%`);
        
        // Cleanup old breath cycles
        if (this.breathCycles.length > 100) {
            this.breathCycles = this.breathCycles.slice(-50);
        }
    }

    private getRecentRequests(timeWindow: number): AIRequest[] {
        const cutoff = Date.now() - timeWindow;
        return this.requestQueue.filter(req => req.timestamp >= cutoff);
    }

    // 📊 PUBLIC API METHODS
    public getCoordinationMetrics(): CoordinationMetrics {
        return { ...this.coordinationMetrics };
    }

    public getCurrentBreath(): BreathCycle {
        return { ...this.currentBreath };
    }

    public getKleeneAnalysis(): Map<KleenePattern, KleeneAnalysisResult> {
        return new Map(this.kleenePatterns);
    }

    public getActiveRequests(): TriageDecisionMatrix[] {
        return Array.from(this.activeRequests.values());
    }

    public getRequestQueue(): AIRequest[] {
        return [...this.requestQueue];
    }

    public forceBreathAlignment(): void {
        console.log('🫁 Forcing breath realignment...');
        this.currentBreath.timestamp = Date.now();
        this.currentBreath.coherence = 1.0;
    }

    public emergencyTriageOverride(requestId: string): boolean {
        const decision = this.activeRequests.get(requestId);
        if (decision) {
            decision.decision = 'immediate_execute';
            this.executeRequest(decision);
            return true;
        }
        return false;
    }

    // 🛑 SHUTDOWN
    public shutdown(): void {
        if (this.breathTimer) clearInterval(this.breathTimer);
        if (this.kleeneAnalysisTimer) clearInterval(this.kleeneAnalysisTimer);
        
        console.log('⚡🫁 Triage Array shutdown - Breath coordination ceased');
    }
}