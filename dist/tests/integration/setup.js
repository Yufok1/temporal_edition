"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOverloadScenario = exports.generateInvalidSignals = exports.generateExtremeScenario = exports.generateCorrelatedSignals = exports.generateComplexPattern = exports.generateMovementPatterns = exports.generateEnvironmentalChanges = exports.generateTestSignals = exports.waitForEcosystemStability = exports.createTestSystems = void 0;
const WhaleStewardSystem_1 = require("../../services/WhaleStewardSystem");
const PoseidonSystem_1 = require("../../services/PoseidonSystem");
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
function createTestSystems() {
    const whaleSteward = new WhaleStewardSystem_1.WhaleStewardSystem();
    const poseidonSystem = new PoseidonSystem_1.PoseidonSystem();
    return { whaleSteward, poseidonSystem };
}
exports.createTestSystems = createTestSystems;
async function waitForEcosystemStability(poseidonSystem, timeout = 5000) {
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
exports.waitForEcosystemStability = waitForEcosystemStability;
function generateTestSignals(count) {
    return Array.from({ length: count }, (_, i) => ({
        signalType: 'song',
        frequency: 20 + Math.random() * 10,
        duration: 5,
        intensity: 0.8,
        timestamp: new Date(Date.now() + i * 1000)
    }));
}
exports.generateTestSignals = generateTestSignals;
function generateEnvironmentalChanges(count) {
    return Array.from({ length: count }, (_, i) => ({
        waterTemperature: 15 + Math.random() * 10,
        waterDepth: 200 + Math.random() * 100,
        salinity: 35 + Math.random() * 2,
        timestamp: new Date(Date.now() + i * 1000)
    }));
}
exports.generateEnvironmentalChanges = generateEnvironmentalChanges;
function generateMovementPatterns(count) {
    return Array.from({ length: count }, (_, i) => ({
        behaviorType: 'migration',
        speed: 5 + Math.random() * 5,
        direction: Math.random() * 360,
        depth: 100 + Math.random() * 50,
        timestamp: new Date(Date.now() + i * 1000)
    }));
}
exports.generateMovementPatterns = generateMovementPatterns;
function generateComplexPattern(baseValue, amplitude, frequency, phase = 0) {
    return baseValue + amplitude * Math.sin(frequency + phase);
}
exports.generateComplexPattern = generateComplexPattern;
function generateCorrelatedSignals(count, correlationFactor = 0.8) {
    const vocalSignals = [];
    const environmentalSignals = [];
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
exports.generateCorrelatedSignals = generateCorrelatedSignals;
function generateExtremeScenario(count, intensity = 1.0) {
    const vocalSignals = [];
    const environmentalSignals = [];
    const movementSignals = [];
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
exports.generateExtremeScenario = generateExtremeScenario;
function generateInvalidSignals(count) {
    return Array.from({ length: count }, () => ({
        type: 'invalid',
        timestamp: new Date(),
        invalidField: Math.random()
    }));
}
exports.generateInvalidSignals = generateInvalidSignals;
function generateOverloadScenario(signalCount, interval = 10) {
    const signals = [
        ...generateTestSignals(signalCount),
        ...generateEnvironmentalChanges(signalCount),
        ...generateMovementPatterns(signalCount)
    ];
    const expectedDuration = signalCount * interval;
    return { signals, expectedDuration };
}
exports.generateOverloadScenario = generateOverloadScenario;
//# sourceMappingURL=setup.js.map