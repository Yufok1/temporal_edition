import { v4 as uuidv4 } from 'uuid';
import { SodiumCryptoProvider } from '../../crypto/implementations/SodiumCryptoProvider';
import { DataHashHarmonicSignatureProvider } from '../implementations/DataHashHarmonicSignatureProvider';
import { RecursiveFeedbackLoop } from '../implementations/RecursiveFeedbackLoop';

describe('RecursiveFeedbackLoop', () => {
    let feedbackLoop: RecursiveFeedbackLoop;
    let signatureProvider: DataHashHarmonicSignatureProvider;
    let cryptoProvider: SodiumCryptoProvider;

    beforeEach(async () => {
        feedbackLoop = new RecursiveFeedbackLoop();
        signatureProvider = new DataHashHarmonicSignatureProvider();
        cryptoProvider = new SodiumCryptoProvider();
        
        await signatureProvider.initialize(cryptoProvider);
        feedbackLoop.setSignatureProvider(signatureProvider);

        const initialState = {
            version: 1,
            data: new TextEncoder().encode('initial state'),
            lastUpdate: Date.now(),
            history: [],
            metadata: { type: 'initial' }
        };

        await feedbackLoop.initialize(initialState);
    });

    describe('Initialization', () => {
        it('should initialize with initial state', async () => {
            const initialState = {
                version: 1,
                data: new Uint8Array(),
                lastUpdate: Date.now(),
                history: [],
                metadata: { type: 'initial' }
            };

            await feedbackLoop.initialize(initialState);
            const state = feedbackLoop.getState();
            expect(state.version).toBe(1);
            expect(state.history.length).toBe(0);
            expect(state.metadata?.type).toBe('initial');
        });

        it('should throw if not initialized', async () => {
            const newLoop = new RecursiveFeedbackLoop();
            expect(() => newLoop.getState()).toThrow('Feedback loop not initialized');
        });
    });

    describe('Feedback Processing', () => {
        it('should process valid feedback', async () => {
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('test feedback')
            };

            const signature = await signatureProvider.generateSignature(entity);
            const feedback = {
                id: uuidv4(),
                data: entity.data,
                timestamp: Date.now(),
                signature,
                metadata: { type: 'test' }
            };

            await feedbackLoop.submitFeedback(feedback);
            const state = feedbackLoop.getState();
            expect(state.version).toBe(2);
            expect(state.metadata?.feedbackId).toBe(feedback.id);
        });

        it('should reject invalid feedback', async () => {
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('test feedback')
            };
            const wrongEntity = {
                id: 'test',
                data: new TextEncoder().encode('wrong feedback')
            };

            const signature = await signatureProvider.generateSignature(entity);
            const feedback = {
                id: uuidv4(),
                data: wrongEntity.data,
                timestamp: Date.now(),
                signature,
                metadata: { type: 'test' }
            };

            await expect(feedbackLoop.submitFeedback(feedback)).rejects.toThrow('Invalid feedback signature');
        });

        it('should detect harmonic resonance', async () => {
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('resonant feedback')
            };

            const signature = await signatureProvider.generateSignature(entity);
            const feedback = {
                id: uuidv4(),
                data: entity.data,
                timestamp: Date.now(),
                signature,
                metadata: { type: 'test' }
            };

            await feedbackLoop.submitFeedback(feedback);
            const hasResonance = await feedbackLoop.detectHarmonicResonance(feedback);
            expect(hasResonance).toBe(true);
        });
    });

    describe('State Management', () => {
        it('should maintain state history', async () => {
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('test feedback')
            };

            const signature = await signatureProvider.generateSignature(entity);
            const feedback = {
                id: uuidv4(),
                data: entity.data,
                timestamp: Date.now(),
                signature,
                metadata: { type: 'test' }
            };

            await feedbackLoop.submitFeedback(feedback);
            const state = feedbackLoop.getState();
            expect(state.history.length).toBe(1);
            expect(state.history[0].version).toBe(1);
            expect(state.version).toBe(2);
        });

        it('should rollback to previous state', async () => {
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('test feedback')
            };

            const signature = await signatureProvider.generateSignature(entity);
            const feedback = {
                id: uuidv4(),
                data: entity.data,
                timestamp: Date.now(),
                signature,
                metadata: { type: 'test' }
            };

            await feedbackLoop.submitFeedback(feedback);
            await feedbackLoop.rollback(1);
            const state = feedbackLoop.getState();
            expect(state.version).toBe(1);
        });

        it('should throw on invalid rollback version', async () => {
            await expect(feedbackLoop.rollback(999)).rejects.toThrow('No state found for version 999');
        });
    });

    describe('Performance', () => {
        it('should handle multiple feedback submissions', async () => {
            const start = performance.now();
            
            // Submit 10 feedback items
            for (let i = 0; i < 10; i++) {
                const entity = {
                    id: `test-${i}`,
                    data: new TextEncoder().encode(`feedback ${i}`)
                };
                const signature = await signatureProvider.generateSignature(entity);
                const feedback = {
                    id: uuidv4(),
                    data: entity.data,
                    timestamp: Date.now(),
                    signature,
                    metadata: { type: 'test' }
                };
                await feedbackLoop.submitFeedback(feedback);
            }

            const end = performance.now();
            const duration = end - start;
            
            // Ensure operations complete within reasonable time (e.g., 5 seconds)
            expect(duration).toBeLessThan(5000);
            
            const state = feedbackLoop.getState();
            expect(state.version).toBe(11);
            expect(state.history.length).toBeLessThanOrEqual(100); // Max history size
        });
    });
}); 