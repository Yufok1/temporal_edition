import { WhaleAnalysisResult, EnvironmentalSignal } from '../types/whale';
import { WhaleSignalProcessing } from './WhaleSignalProcessing';

interface EcosystemUpdate {
    status: 'success' | 'error';
    impact: number;
    ecosystemChanges: {
        environmentalAdjustments?: {
            temperature?: number;
            depth?: number;
            salinity?: number;
        };
        behavioralChanges?: {
            migrationPatterns?: string[];
            feedingPatterns?: string[];
            socialPatterns?: string[];
        };
        populationChanges?: {
            species?: string[];
            count?: number;
            distribution?: string[];
        };
    };
    timestamp: Date;
}

interface EcosystemStatus {
    status: string;
    adaptationLevel: number;
    environmentalMetrics: {
        temperature: number;
        salinity: number;
        depth: number;
        currentSpeed: number;
        currentDirection: number;
        oxygenLevel: number;
    };
    populationMetrics: {
        totalSpecies: number;
        totalIndividuals: number;
        distribution: Map<string, number>;
    };
}

interface EcosystemAdjustments {
    temperature?: number;
    salinity?: number;
    depth?: number;
    currentSpeed?: number;
    currentDirection?: number;
    oxygenLevel?: number;
}

interface EnvironmentalChanges {
    species?: string[];
    count?: number;
    distribution?: Map<string, number>;
}

export class PoseidonSystem {
    private processor: WhaleSignalProcessing;
    private ecosystemStatus: EcosystemStatus;
    private readonly ADAPTATION_THRESHOLD = 0.7;
    private readonly STABILITY_THRESHOLD = 0.3;
    private environmentalData: Array<{
        temperature: number;
        salinity: number;
        depth: number;
        currentSpeed: number;
        currentDirection: number;
        oxygenLevel: number;
    }>;

    constructor(processor: WhaleSignalProcessing) {
        this.processor = processor;
        this.ecosystemStatus = this.initializeEcosystemStatus();
        this.environmentalData = [];
    }

    async processWhaleAnalysis(analysis: WhaleAnalysisResult): Promise<EcosystemUpdate> {
        try {
            // Calculate impact on ecosystem
            const impact = this.calculateEcosystemImpact(analysis);

            // Determine necessary ecosystem changes
            const ecosystemChanges = this.determineEcosystemChanges(analysis, impact);

            // Update ecosystem status
            await this.updateEcosystemStatus(ecosystemChanges);

            return {
                status: 'success',
                impact,
                ecosystemChanges,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Error processing whale analysis:', error);
            return {
                status: 'error',
                impact: 0,
                ecosystemChanges: {},
                timestamp: new Date()
            };
        }
    }

    async getEcosystemStatus(): Promise<EcosystemStatus> {
        return this.ecosystemStatus;
    }

    private initializeEcosystemStatus(): EcosystemStatus {
        return {
            status: 'stable',
            adaptationLevel: 0,
            environmentalMetrics: {
                temperature: 20,
                salinity: 35,
                depth: 100,
                currentSpeed: 0,
                currentDirection: 0,
                oxygenLevel: 8
            },
            populationMetrics: {
                totalSpecies: 0,
                totalIndividuals: 0,
                distribution: new Map<string, number>()
            }
        };
    }

    private calculateEcosystemImpact(analysis: WhaleAnalysisResult): number {
        // Calculate impact based on signal type, confidence, and metadata
        let impact = analysis.impact;

        // Adjust impact based on signal type
        switch (analysis.signalType) {
            case 'vocal':
                impact *= 1.2; // Vocal signals have higher impact
                break;
            case 'movement':
                impact *= 1.1; // Movement signals have moderate impact
                break;
            case 'environmental':
                impact *= 1.3; // Environmental signals have highest impact
                break;
        }

        // Adjust impact based on confidence
        impact *= analysis.confidence;

        // Adjust impact based on pattern detection
        if (analysis.metadata.pattern) {
            impact *= 1.2; // Pattern detection increases impact
        }

        return Math.min(Math.max(impact, 0), 1);
    }

    private determineEcosystemChanges(
        analysis: WhaleAnalysisResult,
        impact: number
    ): EcosystemUpdate['ecosystemChanges'] {
        const changes: EcosystemUpdate['ecosystemChanges'] = {};

        // Determine environmental adjustments
        if (analysis.signalType === 'environmental') {
            changes.environmentalAdjustments = this.calculateEnvironmentalAdjustments(analysis);
        }

        // Determine behavioral changes
        if (analysis.signalType === 'movement' || analysis.signalType === 'vocal') {
            changes.behavioralChanges = this.calculateBehavioralChanges(analysis);
        }

        // Determine population changes
        if (impact > this.ADAPTATION_THRESHOLD) {
            changes.populationChanges = this.calculatePopulationChanges(analysis);
        }

        return changes;
    }

    private calculateEnvironmentalAdjustments(
        analysis: WhaleAnalysisResult
    ): EcosystemUpdate['ecosystemChanges']['environmentalAdjustments'] {
        const adjustments: EcosystemUpdate['ecosystemChanges']['environmentalAdjustments'] = {};

        // Calculate temperature adjustments
        if (analysis.metadata.pattern === 'trend') {
            adjustments.temperature = this.calculateTemperatureAdjustment(analysis);
        }

        // Calculate depth adjustments
        if (analysis.metadata.pattern === 'seasonal') {
            adjustments.depth = this.calculateDepthAdjustment(analysis);
        }

        // Calculate salinity adjustments
        if (analysis.metadata.pattern === 'anomaly') {
            adjustments.salinity = this.calculateSalinityAdjustment(analysis);
        }

        return adjustments;
    }

    private calculateBehavioralChanges(
        analysis: WhaleAnalysisResult
    ): EcosystemUpdate['ecosystemChanges']['behavioralChanges'] {
        const changes: EcosystemUpdate['ecosystemChanges']['behavioralChanges'] = {};

        // Calculate migration pattern changes
        if (analysis.metadata.pattern === 'trend') {
            changes.migrationPatterns = this.calculateMigrationPatterns(analysis);
        }

        // Calculate feeding pattern changes
        if (analysis.metadata.pattern === 'seasonal') {
            changes.feedingPatterns = this.calculateFeedingPatterns(analysis);
        }

        // Calculate social pattern changes
        if (analysis.metadata.pattern === 'cluster') {
            changes.socialPatterns = this.calculateSocialPatterns(analysis);
        }

        return changes;
    }

    private calculatePopulationChanges(
        analysis: WhaleAnalysisResult
    ): EcosystemUpdate['ecosystemChanges']['populationChanges'] {
        return {
            species: this.determineAffectedSpecies(analysis),
            count: this.calculatePopulationCount(analysis),
            distribution: this.calculatePopulationDistribution(analysis)
        };
    }

    private async updateEcosystemStatus(
        changes: EcosystemUpdate['ecosystemChanges']
    ): Promise<void> {
        // Update environmental metrics
        if (changes.environmentalAdjustments) {
            this.updateEnvironmentalMetrics(changes.environmentalAdjustments);
        }

        // Update population metrics
        if (changes.populationChanges) {
            this.updatePopulationMetrics(changes.populationChanges);
        }

        // Update adaptation level
        this.updateAdaptationLevel(changes);

        // Update ecosystem status
        this.updateEcosystemStability();
    }

    private updateEnvironmentalMetrics(
        adjustments: EcosystemUpdate['ecosystemChanges']['environmentalAdjustments']
    ): void {
        if (adjustments.temperature) {
            this.ecosystemStatus.environmentalMetrics.temperature += adjustments.temperature;
        }
        if (adjustments.depth) {
            this.ecosystemStatus.environmentalMetrics.depth += adjustments.depth;
        }
        if (adjustments.salinity) {
            this.ecosystemStatus.environmentalMetrics.salinity += adjustments.salinity;
        }
    }

    private updatePopulationMetrics(
        changes: EcosystemUpdate['ecosystemChanges']['populationChanges']
    ): void {
        if (changes.species) {
            this.ecosystemStatus.populationMetrics.totalSpecies = changes.species.length;
        }
        if (changes.count) {
            this.ecosystemStatus.populationMetrics.totalIndividuals = changes.count;
        }
        if (changes.distribution) {
            changes.distribution.forEach((value, key) => {
                this.ecosystemStatus.populationMetrics.distribution.set(key, value);
            });
        }
    }

    private updateAdaptationLevel(changes: EcosystemUpdate['ecosystemChanges']): void {
        let adaptationDelta = 0;

        // Calculate adaptation based on environmental changes
        if (changes.environmentalAdjustments) {
            adaptationDelta += 0.1;
        }

        // Calculate adaptation based on behavioral changes
        if (changes.behavioralChanges) {
            adaptationDelta += 0.2;
        }

        // Calculate adaptation based on population changes
        if (changes.populationChanges) {
            adaptationDelta += 0.3;
        }

        // Update adaptation level
        this.ecosystemStatus.adaptationLevel = Math.min(
            Math.max(this.ecosystemStatus.adaptationLevel + adaptationDelta, 0),
            1
        );
    }

    private updateEcosystemStability(): void {
        if (this.ecosystemStatus.adaptationLevel > this.ADAPTATION_THRESHOLD) {
            this.ecosystemStatus.status = 'adapting';
        } else if (this.ecosystemStatus.adaptationLevel < this.STABILITY_THRESHOLD) {
            this.ecosystemStatus.status = 'unstable';
        } else {
            this.ecosystemStatus.status = 'stable';
        }
    }

    // Helper methods for calculating specific adjustments
    private calculateTemperatureAdjustment(analysis: WhaleAnalysisResult): number {
        return (analysis.impact - 0.5) * 2;
    }

    private calculateDepthAdjustment(analysis: WhaleAnalysisResult): number {
        return (analysis.impact - 0.5) * 10;
    }

    private calculateSalinityAdjustment(analysis: WhaleAnalysisResult): number {
        return (analysis.impact - 0.5) * 0.5;
    }

    private calculateMigrationPatterns(analysis: WhaleAnalysisResult): string[] {
        return ['north', 'south', 'east', 'west'].filter(
            direction => Math.random() > 0.5
        );
    }

    private calculateFeedingPatterns(analysis: WhaleAnalysisResult): string[] {
        return ['surface', 'deep', 'coastal'].filter(
            pattern => Math.random() > 0.5
        );
    }

    private calculateSocialPatterns(analysis: WhaleAnalysisResult): string[] {
        return ['group', 'pair', 'solitary'].filter(
            pattern => Math.random() > 0.5
        );
    }

    private determineAffectedSpecies(analysis: WhaleAnalysisResult): string[] {
        return ['humpback', 'blue', 'orca'].filter(
            species => Math.random() > 0.5
        );
    }

    private calculatePopulationCount(analysis: WhaleAnalysisResult): number {
        return Math.round(analysis.impact * 100);
    }

    private calculatePopulationDistribution(analysis: WhaleAnalysisResult): string[] {
        return ['north', 'south', 'east', 'west'].filter(
            region => Math.random() > 0.5
        );
    }

    // Simulate providing environmental data to the processor
    provideEnvironmentalData(signal: EnvironmentalSignal): void {
        this.processor.addEnvironmentalSignal(signal);
    }

    // Simulate a sudden environmental change (e.g., temperature drop)
    simulateEnvironmentalChange(change: Partial<EnvironmentalSignal>): void {
        const currentContext = this.processor.getSignalHistory().slice(-1)[0]?.environmentalContext;
        if (currentContext) {
            const updatedSignal: EnvironmentalSignal = {
                ...currentContext,
                ...change,
                timestamp: new Date()
            };
            this.provideEnvironmentalData(updatedSignal);
        }
    }

    public applyEcosystemAdjustments(adjustments: EcosystemAdjustments): void {
        if (!adjustments) return;

        if (adjustments.temperature !== undefined) {
            this.ecosystemStatus.environmentalMetrics.temperature += adjustments.temperature;
        }
        if (adjustments.depth !== undefined) {
            this.ecosystemStatus.environmentalMetrics.depth += adjustments.depth;
        }
        if (adjustments.salinity !== undefined) {
            this.ecosystemStatus.environmentalMetrics.salinity += adjustments.salinity;
        }
        if (adjustments.oxygenLevel !== undefined) {
            this.ecosystemStatus.environmentalMetrics.oxygenLevel += adjustments.oxygenLevel;
        }
    }

    public applyEnvironmentalChanges(changes: EnvironmentalChanges): void {
        if (!changes) return;

        if (changes.species !== undefined) {
            this.ecosystemStatus.populationMetrics.totalSpecies = changes.species.length;
        }
        if (changes.count !== undefined) {
            this.ecosystemStatus.populationMetrics.totalIndividuals = changes.count;
        }
        if (changes.distribution !== undefined) {
            changes.distribution.forEach((value, key) => {
                this.ecosystemStatus.populationMetrics.distribution.set(key.toString(), value);
            });
        }
    }

    public getCurrentEnvironmentalData(): EnvironmentalSignal {
        return {
            timestamp: new Date(),
            temperature: this.ecosystemStatus.environmentalMetrics.temperature,
            salinity: this.ecosystemStatus.environmentalMetrics.salinity,
            currentSpeed: this.ecosystemStatus.environmentalMetrics.currentSpeed,
            currentDirection: this.ecosystemStatus.environmentalMetrics.currentDirection,
            depth: this.ecosystemStatus.environmentalMetrics.depth,
            oxygenLevel: this.ecosystemStatus.environmentalMetrics.oxygenLevel
        };
    }

    public calculateEnvironmentalStability(envData: EnvironmentalSignal): number {
        // Calculate stability based on environmental factors
        const tempStability = 1 - Math.abs(envData.temperature - 15) / 10; // Optimal temp around 15°C
        const salinityStability = 1 - Math.abs(envData.salinity - 32.5) / 5; // Optimal salinity around 32.5
        const currentStability = 1 - Math.min(envData.currentSpeed / 5, 1); // Lower current is more stable

        return (tempStability + salinityStability + currentStability) / 3;
    }
} 