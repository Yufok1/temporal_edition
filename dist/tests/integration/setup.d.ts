import { WhaleStewardSystem } from '../../services/WhaleStewardSystem';
import { PoseidonSystem } from '../../services/PoseidonSystem';
import { WhaleVocalSignal, WhaleMovementPattern, WhaleEnvironmentalData } from '../../types/whale';
interface TestSystems {
    whaleSteward: WhaleStewardSystem;
    poseidonSystem: PoseidonSystem;
}
export declare function createTestSystems(): TestSystems;
export declare function waitForEcosystemStability(poseidonSystem: PoseidonSystem, timeout?: number): Promise<void>;
export declare function generateTestSignals(count: number): WhaleVocalSignal[];
export declare function generateEnvironmentalChanges(count: number): WhaleEnvironmentalData[];
export declare function generateMovementPatterns(count: number): WhaleMovementPattern[];
export declare function generateComplexPattern(baseValue: number, amplitude: number, frequency: number, phase?: number): number;
export declare function generateCorrelatedSignals(count: number, correlationFactor?: number): {
    vocal: WhaleVocalSignal[];
    environmental: WhaleEnvironmentalData[];
};
export declare function generateExtremeScenario(count: number, intensity?: number): {
    vocal: WhaleVocalSignal[];
    environmental: WhaleEnvironmentalData[];
    movement: WhaleMovementPattern[];
};
export declare function generateInvalidSignals(count: number): any[];
export declare function generateOverloadScenario(signalCount: number, interval?: number): {
    signals: any[];
    expectedDuration: number;
};
export {};
