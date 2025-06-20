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

import { PoseidonVoiceService } from '../PoseidonVoiceService';
import { createLogger } from '../utils/logger';

const logger = createLogger('PoseidonVoiceActivation');

export async function activatePoseidonVoice(): Promise<void> {
    try {
        logger.info('Starting Poseidon\'s Voice activation sequence...');
        
        // Initialize the voice service
        const poseidonVoice = new PoseidonVoiceService();
        
        // Activate Poseidon's Voice framework
        poseidonVoice.activateVoice();
        
        // Get initial status
        const status = poseidonVoice.getStatus();
        logger.info('Initial voice status:', status);
        
        // Process a test signal
        const testMessage = 'Whale song of the deep';
        const divineMessage = poseidonVoice.speak(testMessage);
        logger.info('Test message translation:', divineMessage);
        
        logger.info('Poseidon\'s Voice framework activated successfully');
        
        return;
    } catch (error) {
        logger.error('Failed to activate Poseidon\'s Voice:', error);
        throw error;
    }
}

// Run the activation script
activatePoseidonVoice(); 