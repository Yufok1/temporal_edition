import { WhaleSupreme } from '../services/WhaleSupreme';
import { EnvironmentalDataIntegrator } from '../services/EnvironmentalDataIntegrator';
import { WhaleSignalProcessing } from '../services/WhaleSignalProcessing';
import { PoseidonSystem } from '../services/PoseidonSystem';
import { WhaleCommandSystem } from '../services/WhaleCommandSystem';
import { SonarEnhancementSystem } from '../services/SonarEnhancementSystem';
import { WhaleSleepSystem } from '../services/WhaleSleepSystem';
import { EnvironmentalSignal } from '../types/whale';

describe('WhaleSupreme', () => {
    let environmentalIntegrator: EnvironmentalDataIntegrator;
    let processor: WhaleSignalProcessing;
    let poseidon: PoseidonSystem;
    let commandSystem: WhaleCommandSystem;
    let sonarSystem: SonarEnhancementSystem;
    let sleepSystem: WhaleSleepSystem;
    let whaleSupreme: WhaleSupreme;

    beforeEach(() => {
        environmentalIntegrator = new EnvironmentalDataIntegrator();
        processor = new WhaleSignalProcessing(environmentalIntegrator);
        poseidon = new PoseidonSystem(processor);
        commandSystem = new WhaleCommandSystem(poseidon, processor);
        sonarSystem = new SonarEnhancementSystem(commandSystem, poseidon);
        sleepSystem = new WhaleSleepSystem(poseidon, processor);
        whaleSupreme = new WhaleSupreme(
            environmentalIntegrator,
            processor,
            poseidon,
            commandSystem,
            sonarSystem,
            sleepSystem
        );
    });

    afterEach(() => {
        whaleSupreme.dispose();
    });

    describe('Decision Logging', () => {
        it('should log decisions with ethical and ecological data', () => {
            const decisionType = 'test_decision';
            const context = 'Testing decision logging';
            
            whaleSupreme.issueCommand(decisionType, context);
            
            const status = whaleSupreme.getStatus();
            expect(status.recentDecisions).toBeGreaterThan(0);
            expect(status.ethicalAlignment).toBeDefined();
            expect(status.ecologicalBalance).toBeDefined();
        });

        it('should include environmental context in decision logs', () => {
            const envSignal: EnvironmentalSignal = {
                timestamp: new Date(),
                temperature: 15,
                salinity: 32.5,
                currentSpeed: 2
            };
            poseidon.provideEnvironmentalData(envSignal);

            whaleSupreme.issueCommand('test_command', 'Testing environmental context');
            
            const decisions = whaleSupreme.getRecentDecisions(1);
            expect(decisions[0].environmentalContext).toBeDefined();
            expect(decisions[0].environmentalContext.temperature).toBe(15);
            expect(decisions[0].environmentalContext.salinity).toBe(32.5);
        });
    });

    describe('Environmental Integration', () => {
        it('should respond to environmental changes', () => {
            const envSignal: EnvironmentalSignal = {
                timestamp: new Date(),
                temperature: 20,
                salinity: 33,
                currentSpeed: 3
            };

            whaleSupreme.respondToEnvironmentalChange(envSignal);
            
            const status = whaleSupreme.getStatus();
            expect(status.powerContext.environmentalStability).toBeDefined();
        });

        it('should adapt power levels based on environmental stability', () => {
            const stableEnv: EnvironmentalSignal = {
                timestamp: new Date(),
                temperature: 15,
                salinity: 32.5,
                currentSpeed: 2
            };

            const unstableEnv: EnvironmentalSignal = {
                timestamp: new Date(),
                temperature: 25,
                salinity: 35,
                currentSpeed: 4
            };

            // Test with stable environment
            poseidon.provideEnvironmentalData(stableEnv);
            const stableStatus = whaleSupreme.getStatus();
            expect(stableStatus.powerContext.environmentalStability).toBeGreaterThan(0.8);

            // Test with unstable environment
            poseidon.provideEnvironmentalData(unstableEnv);
            const unstableStatus = whaleSupreme.getStatus();
            expect(unstableStatus.powerContext.environmentalStability).toBeLessThan(0.8);
        });
    });

    describe('Alert System', () => {
        it('should generate alerts for low power levels', () => {
            // Deplete power
            for (let i = 0; i < 10; i++) {
                whaleSupreme.issueCommand(`command_${i}`, 'Testing power depletion');
            }

            const alerts = whaleSupreme.getRecentAlerts();
            const powerAlerts = alerts.filter(alert => alert.alertType === 'power');
            expect(powerAlerts.length).toBeGreaterThan(0);
            expect(powerAlerts[0].severity).toBe('high');
        });

        it('should generate alerts for ethical misalignment', () => {
            const envSignal: EnvironmentalSignal = {
                timestamp: new Date(),
                temperature: 25,
                salinity: 35,
                currentSpeed: 4
            };
            poseidon.provideEnvironmentalData(envSignal);

            whaleSupreme.issueCommand('test_command', 'Testing ethical alignment');
            
            const alerts = whaleSupreme.getRecentAlerts();
            const ethicalAlerts = alerts.filter(alert => alert.alertType === 'ethical');
            expect(ethicalAlerts.length).toBeGreaterThan(0);
        });

        it('should generate alerts for ecological imbalance', () => {
            const envSignal: EnvironmentalSignal = {
                timestamp: new Date(),
                temperature: 25,
                salinity: 35,
                currentSpeed: 4
            };
            poseidon.provideEnvironmentalData(envSignal);

            whaleSupreme.issueCommand('test_command', 'Testing ecological balance');
            
            const alerts = whaleSupreme.getRecentAlerts();
            const ecologicalAlerts = alerts.filter(alert => alert.alertType === 'ecological');
            expect(ecologicalAlerts.length).toBeGreaterThan(0);
        });
    });

    describe('Power Management', () => {
        it('should restore power over time in stable conditions', () => {
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

        it('should prevent actions when power is too low', () => {
            // Deplete power
            for (let i = 0; i < 10; i++) {
                whaleSupreme.issueCommand(`command_${i}`, 'Testing power depletion');
            }

            expect(() => {
                whaleSupreme.issueCommand('test_command', 'Should fail due to low power');
            }).toThrow('Whale Supreme is not currently active or lacks sufficient power');
        });
    });
}); 