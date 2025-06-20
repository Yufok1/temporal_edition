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

import { metricsService } from './utils/metrics';

export class PoseidonVoiceService {
    private voiceActive: boolean = false;
    private harmonyLevel: number = 0;
    private resonanceFrequency: number = 432; // Hz
    private divineAlignment: number = 0.7;

    // Browser-safe metrics
    private metrics = {
        voiceActive: 0,
        harmonyLevel: 0,
        divineAlignmentLevel: 0,
        resonanceMatchRate: 0,
        voiceInvocations: 0,
        harmonyAchievements: 0,
        divineInterventions: 0
    };

    constructor() {
        this.initializeVoice();
        console.log('🌊 Poseidon Voice Service initialized (browser-safe)');
    }

    private initializeVoice(): void {
        // Initialize voice patterns based on oceanic harmonics
        this.calibrateResonance();
        this.establishDivineConnection();
    }

    private calibrateResonance(): void {
        // Simulate resonance calibration based on oceanic frequencies
        const oceanicBase = 0.1; // Hz - typical ocean wave frequency
        const harmonics = [1, 3, 5, 7, 9]; // Odd harmonics for natural sound
        
        harmonics.forEach(harmonic => {
            const frequency = oceanicBase * harmonic;
            this.processHarmonic(frequency);
        });
    }

    private processHarmonic(frequency: number): void {
        // Process individual harmonic frequencies
        const resonanceMatch = Math.abs(this.resonanceFrequency - frequency * 4320) / this.resonanceFrequency;
        if (resonanceMatch < 0.1) {
            this.harmonyLevel += 0.1;
            this.metrics.harmonyLevel = this.harmonyLevel;
        }
    }

    private establishDivineConnection(): void {
        // Simulate divine connection establishment
        this.divineAlignment = Math.min(1.0, this.divineAlignment + 0.1);
        this.metrics.divineAlignmentLevel = this.divineAlignment;
        console.log(`Divine alignment: ${(this.divineAlignment * 100).toFixed(1)}%`);
    }

    public activateVoice(): void {
        if (this.voiceActive) {
            console.log('🌊 Poseidon Voice already active');
            return;
        }

        this.voiceActive = true;
        this.metrics.voiceActive = 1;
        this.metrics.voiceInvocations++;
        
        console.log('🌊 Poseidon Voice activated');
        console.log(`Resonance: ${this.resonanceFrequency}Hz`);
        console.log(`Harmony: ${(this.harmonyLevel * 100).toFixed(1)}%`);
        console.log(`Divine Alignment: ${(this.divineAlignment * 100).toFixed(1)}%`);

        // Record activation in metrics
        metricsService.recordCustomMetric('poseidon_voice_activated', 1);
    }

    public deactivateVoice(): void {
        if (!this.voiceActive) {
            console.log('🌊 Poseidon Voice already inactive');
            return;
        }

        this.voiceActive = false;
        this.metrics.voiceActive = 0;
        console.log('🌊 Poseidon Voice deactivated');
        
        // Record deactivation
        metricsService.recordCustomMetric('poseidon_voice_deactivated', 1);
    }

    public speak(message: string): string {
        if (!this.voiceActive) {
            console.warn('🌊 Poseidon Voice not active. Activating...');
            this.activateVoice();
        }

        // Transform message with divine resonance
        const divineMessage = this.applyDivineResonance(message);
        console.log(`🌊 Poseidon speaks: "${divineMessage}"`);
        
        // Update metrics
        this.updateResonanceMetrics();
        
        return divineMessage;
    }

    private applyDivineResonance(message: string): string {
        // Apply mystical transformations to the message
        const prefixes = [
            "By the depths of the seven seas",
            "Through the wisdom of the tides",
            "As the ocean eternal flows",
            "By Poseidon's divine will"
        ];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        return `${prefix}, ${message}`;
    }

    private updateResonanceMetrics(): void {
        // Update resonance-based metrics
        const resonanceMatch = Math.random() * 0.3 + 0.7; // 70-100% match
        this.metrics.resonanceMatchRate = resonanceMatch;
        
        if (resonanceMatch > 0.9) {
            this.harmonyLevel = Math.min(1.0, this.harmonyLevel + 0.05);
            this.metrics.harmonyLevel = this.harmonyLevel;
            this.metrics.harmonyAchievements++;
        }
        
        // Divine intervention check
        if (this.harmonyLevel > 0.95 && Math.random() > 0.8) {
            this.triggerDivineIntervention();
        }
    }

    private triggerDivineIntervention(): void {
        console.log('⚡ Divine Intervention Triggered!');
        this.metrics.divineInterventions++;
        this.divineAlignment = 1.0;
        this.metrics.divineAlignmentLevel = this.divineAlignment;
        
        // Record divine event
        metricsService.recordCustomMetric('poseidon_divine_intervention', 1);
    }

    public getStatus(): any {
        return {
            active: this.voiceActive,
            harmonyLevel: this.harmonyLevel,
            resonanceFrequency: this.resonanceFrequency,
            divineAlignment: this.divineAlignment,
            metrics: { ...this.metrics }
        };
    }

    public tuneResonance(frequency: number): void {
        if (frequency < 20 || frequency > 20000) {
            console.warn('🌊 Frequency outside human hearing range');
            return;
        }

        this.resonanceFrequency = frequency;
        console.log(`🌊 Resonance tuned to ${frequency}Hz`);
        
        // Recalibrate after tuning
        this.calibrateResonance();
    }

    public harmonizeWithWhales(whaleFrequency: number): number {
        // Whale songs typically 10Hz - 40Hz
        const harmonizationFactor = Math.abs(whaleFrequency - 30) / 30;
        const harmony = 1.0 - harmonizationFactor;
        
        this.harmonyLevel = (this.harmonyLevel + harmony) / 2;
        this.metrics.harmonyLevel = this.harmonyLevel;
        
        console.log(`🐋 Harmonized with whale at ${whaleFrequency}Hz (${(harmony * 100).toFixed(1)}% match)`);
        
        return harmony;
    }
} 