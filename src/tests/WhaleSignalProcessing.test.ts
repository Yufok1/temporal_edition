import { WhaleSignalProcessing } from '../services/WhaleSignalProcessing';
import { EnvironmentalDataIntegrator } from '../services/EnvironmentalDataIntegrator';
import { WhaleSignal, EnvironmentalSignal } from '../types/whale';

describe('WhaleSignalProcessing', () => {
    let processor: WhaleSignalProcessing;
    let environmentalIntegrator: EnvironmentalDataIntegrator;

    beforeEach(() => {
        environmentalIntegrator = new EnvironmentalDataIntegrator();
        processor = new WhaleSignalProcessing(environmentalIntegrator);
    });

    describe('Fourier Transform Analysis', () => {
        it('should return empty results when no signals are present', () => {
            const result = processor.analyzePatternsWithFourier();
            expect(result.dominantFrequencies).toEqual([]);
            expect(result.seasonalPatterns).toEqual([]);
            expect(result.trendPatterns).toEqual([]);
        });

        it('should identify dominant frequencies from synthetic signal data', () => {
            // Add synthetic whale signals with known frequencies
            const signals: WhaleSignal[] = [
                { signalType: 'vocal', timestamp: new Date(), frequency: 10 },
                { signalType: 'vocal', timestamp: new Date(), frequency: 20 },
                { signalType: 'vocal', timestamp: new Date(), frequency: 30 }
            ];
            signals.forEach(s => processor.addWhaleSignal(s));

            const result = processor.analyzePatternsWithFourier();
            expect(result.dominantFrequencies.length).toBeGreaterThan(0);
            // Note: Exact values depend on FFT implementation; adjust expectations accordingly
        });
    });

    describe('Bayesian Analysis', () => {
        it('should return null prediction and zero confidence when no signals are present', () => {
            const result = processor.analyzeWithBayesianModel();
            expect(result.predictedBehavior).toBeNull();
            expect(result.confidence).toBe(0.0);
        });

        it('should predict behavior based on recent signal history', () => {
            // Add synthetic whale signals with known behavior types
            const signals: WhaleSignal[] = [
                { signalType: 'vocal', timestamp: new Date(), behaviorType: 'feeding' },
                { signalType: 'vocal', timestamp: new Date(), behaviorType: 'feeding' },
                { signalType: 'vocal', timestamp: new Date(), behaviorType: 'migration' }
            ];
            signals.forEach(s => processor.addWhaleSignal(s));

            const result = processor.analyzeWithBayesianModel();
            expect(result.predictedBehavior).toBe('feeding');
            expect(result.confidence).toBeGreaterThan(0.5);
        });
    });
}); 