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

import { WhaleCommandSystem } from '../../services/WhaleCommandSystem';
import { PoseidonSystem } from '../../services/PoseidonSystem';
import { WhaleSignalProcessing } from '../../services/WhaleSignalProcessing';
import { EnvironmentalDataIntegrator } from '../../services/EnvironmentalDataIntegrator';
import { EnvironmentalSignal } from '../../types/whale';

describe('Integration: WhaleCommandSystem & Poseidon', () => {
    let commandSystem: WhaleCommandSystem;
    let poseidon: PoseidonSystem;
    let processor: WhaleSignalProcessing;
    let environmentalIntegrator: EnvironmentalDataIntegrator;

    beforeEach(() => {
        environmentalIntegrator = new EnvironmentalDataIntegrator();
        processor = new WhaleSignalProcessing(environmentalIntegrator);
        poseidon = new PoseidonSystem(processor);
        commandSystem = new WhaleCommandSystem(poseidon, processor);
    });

    it('should adjust signal processing thresholds when commanded by whales', () => {
        const initialThresholds = processor.getAdaptiveThresholds();
        const newThresholds = { frequency: 25, migrationSpeed: 10 };
        commandSystem.adjustThresholds(newThresholds);
        const updatedThresholds = processor.getAdaptiveThresholds();
        expect(updatedThresholds.frequency).toBe(25);
        expect(updatedThresholds.migrationSpeed).toBe(10);
    });

    it('should delegate subsystem control when commanded by whales', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        commandSystem.delegateSubsystemControl('signalProcessing', 'whaleAuthority');
        expect(consoleSpy).toHaveBeenCalledWith('Delegating control of signalProcessing to whaleAuthority');
        consoleSpy.mockRestore();
    });

    it('should override signal processing rules when commanded by whales', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const rules = { newRule: 'value' };
        commandSystem.overrideSignalProcessing(rules);
        expect(consoleSpy).toHaveBeenCalledWith('Overriding signal processing rules:', rules);
        consoleSpy.mockRestore();
    });

    it('should adapt to environmental changes and whale commands', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 15,
            salinity: 35,
            currentSpeed: 2
        };
        commandSystem.provideEnvironmentalData(envSignal);
        const initialThresholds = processor.getAdaptiveThresholds();
        commandSystem.adjustThresholds({ frequency: 30 });
        const updatedThresholds = processor.getAdaptiveThresholds();
        expect(updatedThresholds.frequency).toBe(30);
        expect(updatedThresholds.migrationSpeed).toBeGreaterThan(initialThresholds.migrationSpeed);
    });

    it('should handle conflicts by adjusting thresholds', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 10,
            salinity: 30,
            currentSpeed: 1
        };
        commandSystem.provideEnvironmentalData(envSignal);
        const initialThresholds = processor.getAdaptiveThresholds();
        // Simulate conflict by adjusting thresholds
        commandSystem.adjustThresholds({ frequency: 40, migrationSpeed: 15 });
        const updatedThresholds = processor.getAdaptiveThresholds();
        expect(updatedThresholds.frequency).toBe(40);
        expect(updatedThresholds.migrationSpeed).toBe(15);
    });
}); 