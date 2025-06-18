import { PoseidonSystem } from './PoseidonSystem';
import { WhaleSignalProcessing } from './WhaleSignalProcessing';
export declare class WhaleSleepSystem {
    private poseidon;
    private processor;
    private isSleepModeActive;
    private sleepDuration;
    private sleepStartTime;
    constructor(poseidon: PoseidonSystem, processor: WhaleSignalProcessing);
    activateSleepMode(): void;
    deactivateSleepMode(): void;
    setSleepDuration(duration: number): void;
    suggestRest(): void;
    emergencyOverride(): void;
    getStatus(): {
        isSleepModeActive: boolean;
        sleepDuration: number;
        sleepStartTime: Date | null;
    };
}
