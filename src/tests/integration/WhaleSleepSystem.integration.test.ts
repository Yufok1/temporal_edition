import { WhaleSleepSystem } from '../../services/WhaleSleepSystem';
import { PoseidonSystem } from '../../services/PoseidonSystem';
import { WhaleSignalProcessing } from '../../services/WhaleSignalProcessing';
import { EnvironmentalDataIntegrator } from '../../services/EnvironmentalDataIntegrator';
import { EnvironmentalSignal, WhaleSignal } from '../../types/whale';

describe('Integration: WhaleSleepSystem & Poseidon', () => {
    let sleepSystem: WhaleSleepSystem;
    let poseidon: PoseidonSystem;
    let processor: WhaleSignalProcessing;
    let environmentalIntegrator: EnvironmentalDataIntegrator;

    beforeEach(() => {
        environmentalIntegrator = new EnvironmentalDataIntegrator();
        processor = new WhaleSignalProcessing(environmentalIntegrator);
        poseidon = new PoseidonSystem(processor);
        sleepSystem = new WhaleSleepSystem(poseidon, processor);
    });

    it('should reflect environmental conditions in sleep recommendations', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 15,
            salinity: 35,
            currentSpeed: 2
        };
        poseidon.provideEnvironmentalData(envSignal);
        const consoleSpy = jest.spyOn(console, 'log');
        sleepSystem.suggestRest();
        expect(consoleSpy).toHaveBeenCalledWith('Suggesting optimal rest period based on environmental conditions.');
        consoleSpy.mockRestore();
    });

    it('should not interfere with signal processing during sleep mode', () => {
        sleepSystem.activateSleepMode();
        const whaleSignal: WhaleSignal = { signalType: 'vocal', timestamp: new Date(), frequency: 20 };
        processor.addWhaleSignal(whaleSignal);
        const fftResult = processor.analyzePatternsWithFourier();
        expect(fftResult.dominantFrequencies.length).toBeGreaterThan(0);
    });

    it('should resume signal processing smoothly after deactivating sleep mode', () => {
        sleepSystem.activateSleepMode();
        sleepSystem.deactivateSleepMode();
        const whaleSignal: WhaleSignal = { signalType: 'vocal', timestamp: new Date(), frequency: 20 };
        processor.addWhaleSignal(whaleSignal);
        const fftResult = processor.analyzePatternsWithFourier();
        expect(fftResult.dominantFrequencies.length).toBeGreaterThan(0);
    });
}); 