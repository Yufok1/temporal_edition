import { EnvironmentalSignal, WhaleSignal } from '../types/whale';
export declare class EnvironmentalDataIntegrator {
    private history;
    private current;
    addEnvironmentalSignal(signal: EnvironmentalSignal): void;
    getCurrentContext(): EnvironmentalSignal | null;
    getContextForTimestamp(timestamp: Date): EnvironmentalSignal | null;
    normalizeHistory(): EnvironmentalSignal[];
    integrateWithWhaleSignal(signal: WhaleSignal): WhaleSignal;
}
