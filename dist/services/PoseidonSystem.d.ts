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
export declare class PoseidonSystem {
    private processor;
    private ecosystemStatus;
    private readonly ADAPTATION_THRESHOLD;
    private readonly STABILITY_THRESHOLD;
    private environmentalData;
    constructor(processor: WhaleSignalProcessing);
    processWhaleAnalysis(analysis: WhaleAnalysisResult): Promise<EcosystemUpdate>;
    getEcosystemStatus(): Promise<EcosystemStatus>;
    private initializeEcosystemStatus;
    private calculateEcosystemImpact;
    private determineEcosystemChanges;
    private calculateEnvironmentalAdjustments;
    private calculateBehavioralChanges;
    private calculatePopulationChanges;
    private updateEcosystemStatus;
    private updateEnvironmentalMetrics;
    private updatePopulationMetrics;
    private updateAdaptationLevel;
    private updateEcosystemStability;
    private calculateTemperatureAdjustment;
    private calculateDepthAdjustment;
    private calculateSalinityAdjustment;
    private calculateMigrationPatterns;
    private calculateFeedingPatterns;
    private calculateSocialPatterns;
    private determineAffectedSpecies;
    private calculatePopulationCount;
    private calculatePopulationDistribution;
    provideEnvironmentalData(signal: EnvironmentalSignal): void;
    simulateEnvironmentalChange(change: Partial<EnvironmentalSignal>): void;
    applyEcosystemAdjustments(adjustments: EcosystemAdjustments): void;
    applyEnvironmentalChanges(changes: EnvironmentalChanges): void;
    getCurrentEnvironmentalData(): EnvironmentalSignal;
    calculateEnvironmentalStability(envData: EnvironmentalSignal): number;
}
export {};
