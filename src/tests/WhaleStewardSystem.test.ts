import { WhaleStewardSystem } from '../services/WhaleStewardSystem';
import { WhaleVocalSignal, WhaleMovementPattern, WhaleEnvironmentalData } from '../types/whale';
import { RiddlerExplorerService, Steward } from '../services/RiddlerExplorerService';
import {
    createWhaleVocalSignal,
    createWhaleMovementPattern,
    createWhaleEnvironmentalData
} from './factories/whaleSignalFactory';

describe('WhaleStewardSystem', () => {
    let system: WhaleStewardSystem;
    let mockRiddler: RiddlerExplorerService;
    let mockSteward: Steward;

    beforeEach(() => {
        mockRiddler = new RiddlerExplorerService();
        mockSteward = {
            id: 'test-steward',
            type: 'whale',
            name: 'Test Steward',
            status: 'approved',
            lastRecognized: Date.now(),
            peckingTier: 1
        };
        system = new WhaleStewardSystem(mockRiddler, mockSteward);
    });

    describe('Signal Processing', () => {
        it('should process vocal signals correctly', () => {
            const vocalSignal = createWhaleVocalSignal();

            system.handleIncomingWhaleSignal(vocalSignal);
            const history = system.getSignalHistory();
            expect(history.length).toBe(1);
            expect(history[0].translatedText).toBeDefined();
            expect(history[0].confidence).toBeGreaterThanOrEqual(0);
            expect(history[0].confidence).toBeLessThanOrEqual(1);
        });

        it('should process movement patterns correctly', () => {
            const movementSignal = createWhaleMovementPattern();

            system.handleIncomingWhaleSignal(movementSignal);
            const history = system.getSignalHistory();
            expect(history.length).toBe(1);
            expect(history[0].translatedText).toBeDefined();
            expect(history[0].confidence).toBeGreaterThanOrEqual(0);
            expect(history[0].confidence).toBeLessThanOrEqual(1);
        });

        it('should process environmental data correctly', () => {
            const environmentalSignal = createWhaleEnvironmentalData();

            system.handleIncomingWhaleSignal(environmentalSignal);
            const history = system.getSignalHistory();
            expect(history.length).toBe(1);
            expect(history[0].translatedText).toBeDefined();
            expect(history[0].confidence).toBeGreaterThanOrEqual(0);
            expect(history[0].confidence).toBeLessThanOrEqual(1);
        });
    });

    describe('Signal History Management', () => {
        it('should maintain signal history within limits', () => {
            const vocalSignal = createWhaleVocalSignal();

            // Add more signals than MAX_HISTORY_LENGTH
            for (let i = 0; i < 1100; i++) {
                system.handleIncomingWhaleSignal(vocalSignal);
            }

            const history = system.getSignalHistory();
            expect(history.length).toBeLessThanOrEqual(1000);
        });
    });

    describe('Command Execution', () => {
        it('should execute commands when authorized', () => {
            const result = system.executeCommand('test-command', { param: 'value' });
            expect(result).toBe(true);
        });

        it('should handle data requests', () => {
            const data = system.requestData('test-data', { param: 'value' });
            expect(data).toBeDefined();
        });
    });
}); 