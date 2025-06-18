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

import { WhaleStewardSystem } from '../../services/WhaleStewardSystem';
import { PoseidonSystem } from '../../services/PoseidonSystem';
import { IntegrationMonitor } from '../../monitoring/IntegrationMonitor';
import { 
    WhaleVocalSignal, 
    WhaleMovementPattern, 
    WhaleEnvironmentalData 
} from '../../types/whale';

// Global test setup
beforeAll(async () => {
    // Initialize test environment
    console.log('Setting up integration test environment...');
});

// Global test teardown
afterAll(async () => {
    // Clean up test environment
    console.log('Cleaning up integration test environment...');
});

interface TestSystems {
    whaleSteward: WhaleStewardSystem;
    poseidonSystem: PoseidonSystem;
}

export function createTestSystems(): TestSystems {
    const whaleSteward = new WhaleStewardSystem();
    const poseidonSystem = new PoseidonSystem();
    return { whaleSteward, poseidonSystem };
}

export async function waitForEcosystemStability(
    poseidonSystem: PoseidonSystem,
    timeout: number = 5000
): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const status = await poseidonSystem.getEcosystemStatus();
        if (status.status === 'stable') {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Ecosystem did not stabilize within timeout');
}

export function generateTestSignals(count: number): WhaleVocalSignal[] {
    return Array.from({ length: count }, (_, i) => ({
        signalType: 'song',
        frequency: 20 + Math.random() * 10,
        duration: 5,
        intensity: 0.8,
        timestamp: new Date(Date.now() + i * 1000)
    }));
}

export function generateEnvironmentalChanges(count: number): WhaleEnvironmentalData[] {
    return Array.from({ length: count }, (_, i) => ({
        waterTemperature: 15 + Math.random() * 10,
        waterDepth: 200 + Math.random() * 100,
        salinity: 35 + Math.random() * 2,
        timestamp: new Date(Date.now() + i * 1000)
    }));
}

export function generateMovementPatterns(count: number): WhaleMovementPattern[] {
    return Array.from({ length: count }, (_, i) => ({
        behaviorType: 'migration',
        speed: 5 + Math.random() * 5,
        direction: Math.random() * 360,
        depth: 100 + Math.random() * 50,
        timestamp: new Date(Date.now() + i * 1000)
    }));
}

export function generateComplexPattern(
    baseValue: number,
    amplitude: number,
    frequency: number,
    phase: number = 0
): number {
    return baseValue + amplitude * Math.sin(frequency + phase);
}

export function generateCorrelatedSignals(
    count: number,
    correlationFactor: number = 0.8
): { vocal: WhaleVocalSignal[], environmental: WhaleEnvironmentalData[] } {
    const vocalSignals: WhaleVocalSignal[] = [];
    const environmentalSignals: WhaleEnvironmentalData[] = [];

    for (let i = 0; i < count; i++) {
        const baseValue = 20 + Math.random() * 10;
        const correlatedValue = baseValue * correlationFactor + Math.random() * (1 - correlationFactor);

        vocalSignals.push({
            signalType: 'song',
            frequency: baseValue,
            duration: 5,
            intensity: 0.8,
            timestamp: new Date(Date.now() + i * 1000)
        });

        environmentalSignals.push({
            waterTemperature: correlatedValue,
            waterDepth: 200 + Math.random() * 100,
            salinity: 35 + Math.random() * 2,
            timestamp: new Date(Date.now() + i * 1000)
        });
    }

    return { vocal: vocalSignals, environmental: environmentalSignals };
}

export function generateExtremeScenario(
    count: number,
    intensity: number = 1.0
): { vocal: WhaleVocalSignal[], environmental: WhaleEnvironmentalData[], movement: WhaleMovementPattern[] } {
    const vocalSignals: WhaleVocalSignal[] = [];
    const environmentalSignals: WhaleEnvironmentalData[] = [];
    const movementSignals: WhaleMovementPattern[] = [];

    for (let i = 0; i < count; i++) {
        // Generate extreme vocal signals
        vocalSignals.push({
            signalType: 'song',
            frequency: 20 + Math.random() * 20 * intensity,
            duration: 0.1 + Math.random() * 10 * intensity,
            intensity: 0.9 * intensity,
            timestamp: new Date(Date.now() + i * 10) // 10ms intervals
        });

        // Generate extreme environmental changes
        environmentalSignals.push({
            waterTemperature: 15 + Math.sin(i / 5) * 20 * intensity,
            waterDepth: 200 + Math.cos(i / 3) * 100 * intensity,
            salinity: 35 + Math.sin(i / 4) * 5 * intensity,
            timestamp: new Date(Date.now() + i * 10)
        });

        // Generate extreme movement patterns
        movementSignals.push({
            behaviorType: 'migration',
            speed: 5 + Math.random() * 10 * intensity,
            direction: Math.random() * 360,
            depth: 100 + Math.random() * 100 * intensity,
            timestamp: new Date(Date.now() + i * 10)
        });
    }

    return {
        vocal: vocalSignals,
        environmental: environmentalSignals,
        movement: movementSignals
    };
}

export function generateInvalidSignals(count: number): any[] {
    return Array.from({ length: count }, () => ({
        type: 'invalid',
        timestamp: new Date(),
        invalidField: Math.random()
    }));
}

export function generateOverloadScenario(
    signalCount: number,
    interval: number = 10
): { signals: any[], expectedDuration: number } {
    const signals = [
        ...generateTestSignals(signalCount),
        ...generateEnvironmentalChanges(signalCount),
        ...generateMovementPatterns(signalCount)
    ];

    const expectedDuration = signalCount * interval;
    return { signals, expectedDuration };
} 