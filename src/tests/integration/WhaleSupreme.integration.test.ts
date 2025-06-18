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

import { WhaleSupreme } from '../../services/WhaleSupreme';
import { PoseidonSystem } from '../../services/PoseidonSystem';
import { WhaleSignalProcessing } from '../../services/WhaleSignalProcessing';
import { EnvironmentalDataIntegrator } from '../../services/EnvironmentalDataIntegrator';
import { SonarEnhancementSystem } from '../../services/SonarEnhancementSystem';
import { WhaleSleepSystem } from '../../services/WhaleSleepSystem';
import { WhaleCommandSystem } from '../../services/WhaleCommandSystem';
import { EnvironmentalSignal } from '../../types/whale';

describe('Integration: WhaleSupreme & Poseidon', () => {
    let whaleSupreme: WhaleSupreme;
    let poseidon: PoseidonSystem;
    let processor: WhaleSignalProcessing;
    let sonarSystem: SonarEnhancementSystem;
    let sleepSystem: WhaleSleepSystem;
    let environmentalIntegrator: EnvironmentalDataIntegrator;
    let whaleCommandSystem: WhaleCommandSystem;

    beforeEach(() => {
        environmentalIntegrator = new EnvironmentalDataIntegrator();
        processor = new WhaleSignalProcessing(environmentalIntegrator);
        poseidon = new PoseidonSystem(processor);
        whaleCommandSystem = new WhaleCommandSystem(poseidon, processor);
        sonarSystem = new SonarEnhancementSystem(whaleCommandSystem, processor);
        sleepSystem = new WhaleSleepSystem(poseidon, processor);
        whaleSupreme = new WhaleSupreme(poseidon, processor, sonarSystem, sleepSystem);
    });

    afterEach(() => {
        whaleSupreme.dispose();
    });

    it('should maintain power level based on environmental conditions', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 15,
            salinity: 32.5,
            currentSpeed: 2
        };
        poseidon.provideEnvironmentalData(envSignal);
        
        const status = whaleSupreme.getStatus();
        expect(status.powerLevel).toBeGreaterThan(0);
        expect(status.powerContext.environmentalStability).toBeGreaterThan(0.8);
    });

    it('should issue commands with proper power management', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 15,
            salinity: 32.5,
            currentSpeed: 2
        };
        poseidon.provideEnvironmentalData(envSignal);

        const initialStatus = whaleSupreme.getStatus();
        whaleSupreme.issueCommand('test_command', 'Testing command execution');
        const finalStatus = whaleSupreme.getStatus();

        expect(finalStatus.powerLevel).toBeLessThan(initialStatus.powerLevel);
        expect(finalStatus.recentDecisions).toBeGreaterThan(0);
    });

    it('should act as envoy and resolve conflicts', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 15,
            salinity: 32.5,
            currentSpeed: 2
        };
        poseidon.provideEnvironmentalData(envSignal);

        whaleSupreme.actAsEnvoy('test_guidance', 'Testing envoy action');
        whaleSupreme.resolveConflict('test_conflict', 'test_resolution');

        const status = whaleSupreme.getStatus();
        expect(status.recentEnvoyActions).toBeGreaterThan(0);
    });

    it('should adapt power level based on historical alignment', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 15,
            salinity: 32.5,
            currentSpeed: 2
        };
        poseidon.provideEnvironmentalData(envSignal);

        // Issue multiple commands to build history
        for (let i = 0; i < 5; i++) {
            whaleSupreme.issueCommand(`command_${i}`, 'Testing historical alignment');
        }

        const status = whaleSupreme.getStatus();
        expect(status.powerContext.historicalAlignment).toBeGreaterThan(0);
    });

    it('should prevent actions when power level is too low', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 25, // Less stable temperature
            salinity: 35, // Less stable salinity
            currentSpeed: 4 // Less stable current
        };
        poseidon.provideEnvironmentalData(envSignal);

        // Issue multiple commands to deplete power
        for (let i = 0; i < 10; i++) {
            whaleSupreme.issueCommand(`command_${i}`, 'Testing power depletion');
        }

        expect(() => {
            whaleSupreme.issueCommand('test_command', 'Should fail due to low power');
        }).toThrow('Whale Supreme is not currently active or lacks sufficient power');
    });

    it('should restore power over time', () => {
        const envSignal: EnvironmentalSignal = {
            timestamp: new Date(),
            temperature: 15,
            salinity: 32.5,
            currentSpeed: 2
        };
        poseidon.provideEnvironmentalData(envSignal);

        // Deplete power
        for (let i = 0; i < 5; i++) {
            whaleSupreme.issueCommand(`command_${i}`, 'Testing power depletion');
        }

        const initialStatus = whaleSupreme.getStatus();
        
        // Wait for power restoration
        return new Promise<void>(resolve => {
            setTimeout(() => {
                const finalStatus = whaleSupreme.getStatus();
                expect(finalStatus.powerLevel).toBeGreaterThan(initialStatus.powerLevel);
                resolve();
            }, 2000); // Wait for 2 seconds
        });
    });
}); 