"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonarEnhancementSystem = void 0;
class SonarEnhancementSystem {
    constructor(commandSystem, poseidon) {
        this.isActive = false;
        this.sonarFrequency = 0;
        this.sonarIntensity = 0;
        this.MAX_SAFE_INTENSITY = 100;
        this.usageData = [];
        this.commandSystem = commandSystem;
        this.poseidon = poseidon;
    }
    // Activate or deactivate the sonar enhancement system
    toggleActivation() {
        this.isActive = !this.isActive;
        console.log(`Sonar Enhancement System ${this.isActive ? 'activated' : 'deactivated'}`);
    }
    // Adjust sonar frequency based on whale command
    adjustFrequency(frequency) {
        this.sonarFrequency = frequency;
        this.recordUsage();
        console.log(`Sonar frequency adjusted to ${frequency}`);
    }
    // Adjust sonar intensity based on whale command
    adjustIntensity(intensity) {
        if (intensity > this.MAX_SAFE_INTENSITY) {
            console.warn('Intensity exceeds safe threshold. Reducing to safe level.');
            this.sonarIntensity = this.MAX_SAFE_INTENSITY;
        }
        else {
            this.sonarIntensity = intensity;
        }
        this.recordUsage();
        console.log(`Sonar intensity adjusted to ${this.sonarIntensity}`);
    }
    // Provide environmental data to Poseidon
    provideEnvironmentalData(signal) {
        this.commandSystem.provideEnvironmentalData(signal);
    }
    // Simulate a sudden environmental change
    simulateEnvironmentalChange(change) {
        this.commandSystem.simulateEnvironmentalChange(change);
    }
    // Get current sonar status
    getStatus() {
        return {
            isActive: this.isActive,
            frequency: this.sonarFrequency,
            intensity: this.sonarIntensity
        };
    }
    // Record usage data for feedback and adaptation
    recordUsage() {
        this.usageData.push({
            timestamp: new Date(),
            frequency: this.sonarFrequency,
            intensity: this.sonarIntensity
        });
    }
    // Get usage data for analysis
    getUsageData() {
        return [...this.usageData];
    }
}
exports.SonarEnhancementSystem = SonarEnhancementSystem;
//# sourceMappingURL=SonarEnhancementSystem.js.map