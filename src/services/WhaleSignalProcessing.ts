import { WhaleSignal, EnvironmentalSignal, FarewellSignal } from '../types/whale';
import { EnvironmentalDataIntegrator } from './EnvironmentalDataIntegrator';
import { EmotionalTone } from '../types/translation';
// Use require for fft-js since @types/fft-js is not available
const fft = require('fft-js');

interface FarewellPattern {
    vocalPattern: string;
    confidence: number;
    emotionalIndicators: EmotionalTone[];
    behavioralCues: string[];
}

export class WhaleSignalProcessing {
    private environmentalIntegrator: EnvironmentalDataIntegrator;
    private signalHistory: WhaleSignal[] = [];
    private adaptiveThresholds: { [key: string]: number } = {};
    private farewellPatterns: FarewellPattern[] = [
        {
            vocalPattern: 'descending_whistle',
            confidence: 0.85,
            emotionalIndicators: ['peaceful', 'contemplative'],
            behavioralCues: ['slowing_movement', 'increasing_distance']
        },
        {
            vocalPattern: 'ascending_whistle',
            confidence: 0.75,
            emotionalIndicators: ['joyful', 'playful'],
            behavioralCues: ['circular_movement', 'tail_slap']
        },
        {
            vocalPattern: 'low_frequency_pulse',
            confidence: 0.90,
            emotionalIndicators: ['contemplative', 'social'],
            behavioralCues: ['group_separation', 'depth_change']
        }
    ];
    private behavioralCues: Map<string, number>;
    private disengagementThreshold: number;
    private bufferPeriod: number; // in milliseconds
    private readonly emotionalContextWeights = {
        environmental: 0.3,
        social: 0.4,
        behavioral: 0.3
    };
    private readonly bufferPeriodFactors = {
        emotionalIntensity: 1.2,
        socialComplexity: 1.1,
        environmentalStress: 1.3
    };

    constructor(environmentalIntegrator: EnvironmentalDataIntegrator) {
        this.environmentalIntegrator = environmentalIntegrator;
        this.behavioralCues = new Map([
            ['increasing_distance', 0.8],
            ['reduced_engagement', 0.7],
            ['body_orientation', 0.6],
            ['reduced_vocalization', 0.75]
        ]);
        this.disengagementThreshold = 0.7;
        this.bufferPeriod = 5 * 60 * 1000; // 5 minutes
    }

    // Add a whale signal, integrating environmental context
    addWhaleSignal(signal: WhaleSignal): void {
        const enrichedSignal = this.environmentalIntegrator.integrateWithWhaleSignal(signal);
        this.signalHistory.push(enrichedSignal);
        this.updateAdaptiveThresholds(enrichedSignal);
    }

    // Add an environmental signal
    addEnvironmentalSignal(signal: EnvironmentalSignal): void {
        this.environmentalIntegrator.addEnvironmentalSignal(signal);
    }

    // Update adaptive thresholds based on environmental context
    private updateAdaptiveThresholds(signal: WhaleSignal): void {
        // Example: adapt vocalization frequency threshold based on temperature
        if (signal.temperature !== undefined) {
            this.adaptiveThresholds['frequency'] = 20 + (signal.temperature - 10) * 0.5;
        }
        // Example: adapt migration speed threshold based on currentSpeed
        if (signal.currentSpeed !== undefined) {
            this.adaptiveThresholds['migrationSpeed'] = 5 + signal.currentSpeed * 0.8;
        }
        // Add more adaptive logic as needed
    }

    // Analyze signals using Fourier Transform
    analyzePatternsWithFourier(): any {
        if (this.signalHistory.length === 0) {
            return { dominantFrequencies: [], seasonalPatterns: [], trendPatterns: [] };
        }
        // Extract frequency data from signal history (e.g., using frequency property)
        const frequencies = this.signalHistory.map(s => s.frequency ?? 0);
        // Perform FFT
        const fftResult = fft.fft(frequencies);
        // Extract dominant frequencies (e.g., top 3)
        const dominantFrequencies = fftResult.slice(0, 3);
        return {
            dominantFrequencies,
            seasonalPatterns: [], // Placeholder for seasonal analysis
            trendPatterns: []     // Placeholder for trend analysis
        };
    }

    // Bayesian analysis for behavior prediction
    analyzeWithBayesianModel(): any {
        if (this.signalHistory.length === 0) {
            return { predictedBehavior: null, confidence: 0.0 };
        }
        // Simple Bayesian prediction: average of recent behavior types
        const recentBehaviors = this.signalHistory.slice(-5).map(s => s.behaviorType ?? 'unknown');
        const behaviorCounts: { [key: string]: number } = {};
        recentBehaviors.forEach(b => {
            behaviorCounts[b] = (behaviorCounts[b] || 0) + 1;
        });
        let maxCount = 0;
        let predictedBehavior = null;
        for (const [behavior, count] of Object.entries(behaviorCounts)) {
            if (count > maxCount) {
                maxCount = count;
                predictedBehavior = behavior;
            }
        }
        const confidence = maxCount / recentBehaviors.length;
        return { predictedBehavior, confidence };
    }

    // Get current adaptive thresholds
    getAdaptiveThresholds(): { [key: string]: number } {
        return { ...this.adaptiveThresholds };
    }

    // Get signal history
    getSignalHistory(): WhaleSignal[] {
        return [...this.signalHistory];
    }

    /**
     * Process incoming whale signals and detect farewell patterns
     */
    public processSignal(signal: WhaleSignal): FarewellSignal | null {
        const farewellPattern = this.detectFarewellPattern(signal);
        if (!farewellPattern) return null;

        const emotionalState = this.analyzeEmotionalState(signal, farewellPattern);
        const confidence = this.calculateConfidence(signal, farewellPattern);
        const context = this.analyzeContext(signal);

        return {
            type: this.determineFarewellType(farewellPattern, emotionalState),
            confidence,
            timestamp: Date.now(),
            details: {
                emotionalState,
                vocalPattern: farewellPattern.vocalPattern,
                behavioralCues: farewellPattern.behavioralCues,
                context
            }
        };
    }

    private detectFarewellPattern(signal: WhaleSignal): FarewellPattern | null {
        return this.farewellPatterns.find(pattern => 
            this.matchesVocalPattern(signal, pattern) &&
            this.matchesBehavioralCues(signal, pattern)
        ) || null;
    }

    private matchesVocalPattern(signal: WhaleSignal, pattern: FarewellPattern): boolean {
        // Implement vocal pattern matching logic
        return signal.frequency >= 20 && signal.frequency <= 20000;
    }

    private matchesBehavioralCues(signal: WhaleSignal, pattern: FarewellPattern): boolean {
        // Implement behavioral cue matching logic
        return true; // Placeholder
    }

    private analyzeEmotionalState(signal: WhaleSignal, pattern: FarewellPattern): EmotionalTone {
        const emotionalScores = pattern.emotionalIndicators.map(tone => ({
            tone,
            score: this.calculateEmotionalScore(signal, tone)
        }));

        return emotionalScores.reduce((prev, current) => 
            current.score > prev.score ? current : prev
        ).tone;
    }

    private calculateEmotionalScore(signal: WhaleSignal, tone: EmotionalTone): number {
        const environmentalScore = this.calculateEnvironmentalScore(signal);
        const socialScore = this.calculateSocialScore(signal);
        const behavioralScore = this.calculateBehavioralScore(signal);

        return (
            environmentalScore * this.emotionalContextWeights.environmental +
            socialScore * this.emotionalContextWeights.social +
            behavioralScore * this.emotionalContextWeights.behavioral
        );
    }

    private calculateEnvironmentalScore(signal: WhaleSignal): number {
        const environmentalData = this.environmentalIntegrator.getCurrentData();
        // Implement environmental score calculation
        return 0.8; // Placeholder
    }

    private calculateSocialScore(signal: WhaleSignal): number {
        // Implement social score calculation
        return 0.7; // Placeholder
    }

    private calculateBehavioralScore(signal: WhaleSignal): number {
        // Implement behavioral score calculation
        return 0.9; // Placeholder
    }

    private calculateConfidence(signal: WhaleSignal, pattern: FarewellPattern): number {
        const baseConfidence = pattern.confidence;
        const emotionalConfidence = this.calculateEmotionalConfidence(signal);
        const contextualConfidence = this.calculateContextualConfidence(signal);

        return (baseConfidence + emotionalConfidence + contextualConfidence) / 3;
    }

    private calculateEmotionalConfidence(signal: WhaleSignal): number {
        // Implement emotional confidence calculation
        return 0.85; // Placeholder
    }

    private calculateContextualConfidence(signal: WhaleSignal): number {
        // Implement contextual confidence calculation
        return 0.75; // Placeholder
    }

    private determineFarewellType(pattern: FarewellPattern, emotionalState: EmotionalTone): 'farewell' | 'temporary_leave' | 'migration_start' {
        if (emotionalState === 'migratory') return 'migration_start';
        if (pattern.confidence < 0.8) return 'temporary_leave';
        return 'farewell';
    }

    private analyzeContext(signal: WhaleSignal) {
        return {
            environmental: this.environmentalIntegrator.getCurrentData(),
            social: {
                groupSize: 3, // Placeholder
                proximityToGroup: 50, // Placeholder
                interactionIntensity: 0.3 // Placeholder
            }
        };
    }

    /**
     * Get the recommended buffer period for reengagement
     */
    public getBufferPeriod(): number {
        return this.bufferPeriod;
    }

    /**
     * Update the buffer period based on environmental and social context
     */
    public updateBufferPeriod(signal: WhaleSignal): void {
        const environmentalFactor = this.analyzeEnvironmentalContext(signal);
        const socialFactor = this.analyzeSocialContext(signal);
        
        // Adjust buffer period based on context
        this.bufferPeriod = Math.round(
            this.bufferPeriod * (1 + (1 - environmentalFactor) * 0.5) * (1 + (1 - socialFactor) * 0.5)
        );
    }

    private analyzeEnvironmentalContext(signal: WhaleSignal): number {
        const { waterTemperature, currentSpeed, visibility } = signal.context.environmental;
        
        // Environmental factors that might influence farewell behavior
        const temperatureFactor = waterTemperature > 20 ? 0.8 : 0.4;
        const currentFactor = currentSpeed > 2 ? 0.7 : 0.5;
        const visibilityFactor = visibility > 10 ? 0.6 : 0.3;

        return (temperatureFactor + currentFactor + visibilityFactor) / 3;
    }

    private analyzeSocialContext(signal: WhaleSignal): number {
        const { groupSize, proximity } = signal.context.social;
        
        // Social factors that might influence farewell behavior
        const groupFactor = groupSize > 3 ? 0.7 : 0.4;
        const proximityFactor = proximity > 50 ? 0.8 : 0.3;

        return (groupFactor + proximityFactor) / 2;
    }

    public calculateBufferPeriod(signal: FarewellSignal): number {
        const basePeriod = 300000; // 5 minutes in milliseconds
        const emotionalIntensity = this.calculateEmotionalIntensity(signal);
        const socialComplexity = this.calculateSocialComplexity(signal);
        const environmentalStress = this.calculateEnvironmentalStress(signal);

        return basePeriod * 
            (emotionalIntensity * this.bufferPeriodFactors.emotionalIntensity) *
            (socialComplexity * this.bufferPeriodFactors.socialComplexity) *
            (environmentalStress * this.bufferPeriodFactors.environmentalStress);
    }

    private calculateEmotionalIntensity(signal: FarewellSignal): number {
        // Implement emotional intensity calculation
        return 1.0; // Placeholder
    }

    private calculateSocialComplexity(signal: FarewellSignal): number {
        // Implement social complexity calculation
        return 1.0; // Placeholder
    }

    private calculateEnvironmentalStress(signal: FarewellSignal): number {
        // Implement environmental stress calculation
        return 1.0; // Placeholder
    }
} 