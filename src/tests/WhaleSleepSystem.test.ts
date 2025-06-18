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

import { WhaleSleepSystem } from '../services/WhaleSleepSystem';
import { PoseidonSystem } from '../services/PoseidonSystem';
import { WhaleSignalProcessing } from '../services/WhaleSignalProcessing';
import { EnvironmentalDataIntegrator } from '../services/EnvironmentalDataIntegrator';

describe('WhaleSleepSystem', () => {
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

    it('should activate sleep mode', () => {
        sleepSystem.activateSleepMode();
        const status = sleepSystem.getStatus();
        expect(status.isSleepModeActive).toBe(true);
        expect(status.sleepStartTime).not.toBeNull();
    });

    it('should deactivate sleep mode', () => {
        sleepSystem.activateSleepMode();
        sleepSystem.deactivateSleepMode();
        const status = sleepSystem.getStatus();
        expect(status.isSleepModeActive).toBe(false);
        expect(status.sleepStartTime).toBeNull();
    });

    it('should set sleep duration', () => {
        const duration = 30;
        sleepSystem.setSleepDuration(duration);
        const status = sleepSystem.getStatus();
        expect(status.sleepDuration).toBe(duration);
    });

    it('should suggest rest based on environmental conditions', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        sleepSystem.suggestRest();
        expect(consoleSpy).toHaveBeenCalledWith('Suggesting optimal rest period based on environmental conditions.');
        consoleSpy.mockRestore();
    });

    it('should handle emergency override', () => {
        sleepSystem.activateSleepMode();
        const consoleSpy = jest.spyOn(console, 'log');
        sleepSystem.emergencyOverride();
        expect(consoleSpy).toHaveBeenCalledWith('Emergency override: Sleep mode deactivated due to urgent event.');
        const status = sleepSystem.getStatus();
        expect(status.isSleepModeActive).toBe(false);
        consoleSpy.mockRestore();
    });
}); 