import { WhaleCommandSystem } from './WhaleCommandSystem';
import { PoseidonSystem } from './PoseidonSystem';
import { EnvironmentalSignal } from '../types/whale';

export class SonarEnhancementSystem {
    private commandSystem: WhaleCommandSystem;
    private poseidon: PoseidonSystem;
    private isActive: boolean = false;
    private sonarFrequency: number = 0;
    private sonarIntensity: number = 0;
    private readonly MAX_SAFE_INTENSITY: number = 100;
    private usageData: { timestamp: Date; frequency: number; intensity: number }[] = [];

    constructor(commandSystem: WhaleCommandSystem, poseidon: PoseidonSystem) {
        this.commandSystem = commandSystem;
        this.poseidon = poseidon;
    }

    // Activate or deactivate the sonar enhancement system
    toggleActivation(): void {
        this.isActive = !this.isActive;
        console.log(`Sonar Enhancement System ${this.isActive ? 'activated' : 'deactivated'}`);
    }

    // Adjust sonar frequency based on whale command
    adjustFrequency(frequency: number): void {
        this.sonarFrequency = frequency;
        this.recordUsage();
        console.log(`Sonar frequency adjusted to ${frequency}`);
    }

    // Adjust sonar intensity based on whale command
    adjustIntensity(intensity: number): void {
        if (intensity > this.MAX_SAFE_INTENSITY) {
            console.warn('Intensity exceeds safe threshold. Reducing to safe level.');
            this.sonarIntensity = this.MAX_SAFE_INTENSITY;
        } else {
            this.sonarIntensity = intensity;
        }
        this.recordUsage();
        console.log(`Sonar intensity adjusted to ${this.sonarIntensity}`);
    }

    // Provide environmental data to Poseidon
    provideEnvironmentalData(signal: EnvironmentalSignal): void {
        this.commandSystem.provideEnvironmentalData(signal);
    }

    // Simulate a sudden environmental change
    simulateEnvironmentalChange(change: Partial<EnvironmentalSignal>): void {
        this.commandSystem.simulateEnvironmentalChange(change);
    }

    // Get current sonar status
    getStatus(): { isActive: boolean; frequency: number; intensity: number } {
        return {
            isActive: this.isActive,
            frequency: this.sonarFrequency,
            intensity: this.sonarIntensity
        };
    }

    // Record usage data for feedback and adaptation
    private recordUsage(): void {
        this.usageData.push({
            timestamp: new Date(),
            frequency: this.sonarFrequency,
            intensity: this.sonarIntensity
        });
    }

    // Get usage data for analysis
    getUsageData(): { timestamp: Date; frequency: number; intensity: number }[] {
        return [...this.usageData];
    }
} 