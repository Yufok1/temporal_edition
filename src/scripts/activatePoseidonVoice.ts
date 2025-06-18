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