// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

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