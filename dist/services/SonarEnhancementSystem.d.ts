import { WhaleCommandSystem } from './WhaleCommandSystem';
import { PoseidonSystem } from './PoseidonSystem';
import { EnvironmentalSignal } from '../types/whale';
export declare class SonarEnhancementSystem {
    private commandSystem;
    private poseidon;
    private isActive;
    private sonarFrequency;
    private sonarIntensity;
    private readonly MAX_SAFE_INTENSITY;
    private usageData;
    constructor(commandSystem: WhaleCommandSystem, poseidon: PoseidonSystem);
    toggleActivation(): void;
    adjustFrequency(frequency: number): void;
    adjustIntensity(intensity: number): void;
    provideEnvironmentalData(signal: EnvironmentalSignal): void;
    simulateEnvironmentalChange(change: Partial<EnvironmentalSignal>): void;
    getStatus(): {
        isActive: boolean;
        frequency: number;
        intensity: number;
    };
    private recordUsage;
    getUsageData(): {
        timestamp: Date;
        frequency: number;
        intensity: number;
    }[];
}
