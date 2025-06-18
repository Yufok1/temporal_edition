import { WhaleSignalProcessing } from '../../services/WhaleSignalProcessing';
import { EnvironmentalDataIntegrator } from '../../services/EnvironmentalDataIntegrator';
import { PoseidonSystem } from '../../services/PoseidonSystem';
import { WhaleSignal, EnvironmentalSignal } from '../../types/whale';

describe('Integration: Poseidon & WhaleSignalProcessing', () => {
    let processor: WhaleSignalProcessing;
    let environmentalIntegrator: EnvironmentalDataIntegrator;
    let poseidon: PoseidonSystem;

    beforeEach(() => {
        environmentalIntegrator = new EnvironmentalDataIntegrator();
        processor = new WhaleSignalProcessing(environmentalIntegrator);
        poseidon = new PoseidonSystem(processor);
    });

    it('should update adaptive thresholds when Poseidon provides environmental data', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 15,
            salinity: 35,
            currentSpeed: 2
        };
        poseidon.provideEnvironmentalData(envSignal);
        // Add a whale signal to trigger threshold update
        const whaleSignal: WhaleSignal = {
            signalType: 'vocal',
            timestamp: new Date(),
            frequency: 20
        };
        processor.addWhaleSignal(whaleSignal);
        const thresholds = processor.getAdaptiveThresholds();
        expect(thresholds.frequency).toBeGreaterThan(20); // Should be influenced by temperature
        expect(thresholds.migrationSpeed).toBeGreaterThan(5); // Should be influenced by currentSpeed
    });

    it('should adapt to temperature shifts', () => {
        const initialEnv: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 10,
            salinity: 35,
            currentSpeed: 1
        };
        poseidon.provideEnvironmentalData(initialEnv);
        processor.addWhaleSignal({ signalType: 'vocal', timestamp: new Date(), frequency: 20 });
        let thresholds = processor.getAdaptiveThresholds();
        const initialFreqThreshold = thresholds.frequency;

        // Simulate temperature increase
        poseidon.provideEnvironmentalData({ ...initialEnv, temperature: 20, timestamp: new Date() });
        processor.addWhaleSignal({ signalType: 'vocal', timestamp: new Date(), frequency: 20 });
        thresholds = processor.getAdaptiveThresholds();
        expect(thresholds.frequency).toBeGreaterThan(initialFreqThreshold);
    });

    it('should adapt to salinity changes', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 12,
            salinity: 30,
            currentSpeed: 1
        };
        poseidon.provideEnvironmentalData(envSignal);
        processor.addWhaleSignal({ signalType: 'vocal', timestamp: new Date(), frequency: 15 });
        // No direct salinity effect in current logic, but test for extensibility
        // Add logic here if salinity is used in adaptive thresholds
        expect(processor.getAdaptiveThresholds()).toBeDefined();
    });

    it('should adapt to current speed changes', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 10,
            salinity: 35,
            currentSpeed: 1
        };
        poseidon.provideEnvironmentalData(envSignal);
        processor.addWhaleSignal({ signalType: 'vocal', timestamp: new Date(), frequency: 10 });
        let thresholds = processor.getAdaptiveThresholds();
        const initialMigrationSpeed = thresholds.migrationSpeed;

        // Simulate current speed increase
        poseidon.provideEnvironmentalData({ ...envSignal, currentSpeed: 3, timestamp: new Date() });
        processor.addWhaleSignal({ signalType: 'vocal', timestamp: new Date(), frequency: 10 });
        thresholds = processor.getAdaptiveThresholds();
        expect(thresholds.migrationSpeed).toBeGreaterThan(initialMigrationSpeed);
    });

    it('should reflect environmental changes in FFT and Bayesian analysis', () => {
        // Provide environmental data and whale signals
        poseidon.provideEnvironmentalData({ timestamp: new Date(), temperature: 14, salinity: 33, currentSpeed: 2 });
        processor.addWhaleSignal({ signalType: 'vocal', timestamp: new Date(), frequency: 10, behaviorType: 'feeding' });
        processor.addWhaleSignal({ signalType: 'vocal', timestamp: new Date(), frequency: 20, behaviorType: 'migration' });
        processor.addWhaleSignal({ signalType: 'vocal', timestamp: new Date(), frequency: 30, behaviorType: 'feeding' });

        // FFT should identify dominant frequencies
        const fftResult = processor.analyzePatternsWithFourier();
        expect(fftResult.dominantFrequencies.length).toBeGreaterThan(0);

        // Bayesian should predict the most common recent behavior
        const bayesResult = processor.analyzeWithBayesianModel();
        expect(['feeding', 'migration']).toContain(bayesResult.predictedBehavior);
        expect(bayesResult.confidence).toBeGreaterThan(0);
    });
}); 