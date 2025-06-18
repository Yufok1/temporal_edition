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

import { IHarmonicSignatureProvider } from '../interfaces/IHarmonicSignatureProvider';
import { Feedback, IRecursiveFeedbackLoop, SystemState } from '../interfaces/IRecursiveFeedbackLoop';

export class RecursiveFeedbackLoop implements IRecursiveFeedbackLoop {
    private signatureProvider: IHarmonicSignatureProvider | null = null;
    private currentState: SystemState | null = null;
    private initialized: boolean = false;
    private readonly maxHistorySize: number = 100;

    async initialize(initialState: SystemState): Promise<void> {
        this.currentState = {
            ...initialState,
            history: []
        };
        this.initialized = true;
    }

    setSignatureProvider(provider: IHarmonicSignatureProvider): void {
        this.signatureProvider = provider;
    }

    async submitFeedback(feedback: Feedback): Promise<void> {
        if (!this.initialized || !this.currentState || !this.signatureProvider) {
            throw new Error('Feedback loop not initialized');
        }

        // Verify the feedback signature
        const isValid = await this.signatureProvider.verifySignature(
            feedback.signature,
            {
                id: feedback.id,
                data: feedback.data,
                metadata: feedback.metadata
            }
        );

        if (!isValid) {
            throw new Error('Invalid feedback signature');
        }

        // Check for harmonic resonance
        const hasResonance = await this.detectHarmonicResonance(feedback);
        
        // Update system state based on feedback
        const newState: SystemState = {
            version: this.currentState.version + 1,
            data: feedback.data, // In a real implementation, this would be a more complex state update
            lastUpdate: Date.now(),
            history: [...this.currentState.history, { ...this.currentState }],
            metadata: {
                feedbackId: feedback.id,
                hasResonance,
                ...feedback.metadata
            }
        };

        // Maintain history size limit
        if (newState.history.length > this.maxHistorySize) {
            newState.history = newState.history.slice(-this.maxHistorySize);
        }

        this.currentState = newState;
    }

    getState(): SystemState {
        if (!this.initialized || !this.currentState) {
            throw new Error('Feedback loop not initialized');
        }
        return this.currentState;
    }

    async detectHarmonicResonance(feedback: Feedback): Promise<boolean> {
        if (!this.initialized || !this.currentState) {
            throw new Error('Feedback loop not initialized');
        }

        // Simple resonance detection: check if feedback data matches current state
        // In a real implementation, this would be more sophisticated
        return this.arraysEqual(feedback.data, this.currentState.data);
    }

    async rollback(version: number): Promise<void> {
        if (!this.initialized || !this.currentState) {
            throw new Error('Feedback loop not initialized');
        }

        const targetState = this.currentState.history.find(state => state.version === version);
        if (!targetState) {
            throw new Error(`No state found for version ${version}`);
        }

        this.currentState = {
            ...targetState,
            history: this.currentState.history
        };
    }

    getFeedbackLoopType(): string {
        return 'recursive-feedback-v1';
    }

    private arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
} 