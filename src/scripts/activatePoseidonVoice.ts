import { PoseidonVoiceService } from '../PoseidonVoiceService';
import logger from '../logger';

async function activatePoseidonVoice() {
    try {
        const poseidonVoice = new PoseidonVoiceService();
        
        // Activate Poseidon's Voice framework
        await poseidonVoice.activatePoseidonsVoice();
        
        // Get initial metrics
        const metrics = await poseidonVoice.getSignalMetrics();
        logger.info('Initial signal metrics:', metrics);
        
        // Process a test signal
        const testSignal = 'Whale song of the deep';
        const translation = await poseidonVoice.processSignal(testSignal, 'whale');
        logger.info('Test signal translation:', translation);
        
        logger.info('Poseidon\'s Voice framework activated successfully');
    } catch (error) {
        logger.error('Error activating Poseidon\'s Voice framework:', error);
        process.exit(1);
    }
}

// Run the activation script
activatePoseidonVoice(); 