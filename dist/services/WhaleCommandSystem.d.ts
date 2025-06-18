import { PoseidonSystem } from './PoseidonSystem';
import { WhaleSignalProcessing } from './WhaleSignalProcessing';
import { EnvironmentalSignal } from '../types/whale';
export declare class WhaleCommandSystem {
    private poseidon;
    private processor;
    constructor(poseidon: PoseidonSystem, processor: WhaleSignalProcessing);
    adjustThresholds(thresholds: {
        [key: string]: number;
    }): void;
    delegateSubsystemControl(subsystem: string, authority: string): void;
    overrideSignalProcessing(rules: any): void;
    provideEnvironmentalData(signal: EnvironmentalSignal): void;
    simulateEnvironmentalChange(change: Partial<EnvironmentalSignal>): void;
}
