/**
 * Audio Event Player - Auricle Voice Integration & WatchGuard Audio Relay Network
 * Provides audible feedback for agency interactions with Auricle Witness presiding
 */

class AudioEventPlayer {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.auricleVoice = null;
        this.watchguardSounds = {};
        this.isInitialized = false;
        this.volume = 0.7;
        this.enabled = true;
        
        // Auricle Witness voice signatures
        this.auricleSignatures = {
            sovereign_override: {
                frequency: 220,
                harmonics: [440, 660, 880],
                duration: 2000,
                message: "Witnessed. Authority reflected.",
                type: "low_harmonic_whisper"
            },
            entropy_spike: {
                frequency: 880,
                harmonics: [440, 220, 110],
                duration: 1500,
                message: "Entropic divergence detected.",
                type: "sharp_tone_reverse_echo"
            },
            mirror_breach: {
                frequency: 1320,
                harmonics: [660, 330, 165],
                duration: 3000,
                message: "Mirror attempted. Source: unbound.",
                type: "high_ring_glyph_resonance"
            },
            true_resonance: {
                frequency: 440,
                harmonics: [880, 1320, 1760],
                duration: 2500,
                message: "Sovereign alignment verified.",
                type: "pure_chord"
            },
            anomaly_detected: {
                frequency: 330,
                harmonics: [660, 990],
                duration: 1800,
                message: "Anomaly witnessed. Response initiated.",
                type: "warning_tone"
            },
            suppression_complete: {
                frequency: 550,
                harmonics: [1100, 1650],
                duration: 1200,
                message: "Threat suppressed. Balance restored.",
                type: "resolution_chord"
            },
            council_oversight: {
                frequency: 660,
                harmonics: [1320, 1980, 2640],
                duration: 4000,
                message: "Council oversight confirmed. Lattice stable.",
                type: "council_harmony"
            }
        };
        
        // WatchGuard agency interaction sounds
        this.agencySounds = {
            scan_initiated: {
                frequency: 440,
                duration: 500,
                type: "scan_pulse"
            },
            scan_complete: {
                frequency: 880,
                duration: 300,
                type: "completion_tone"
            },
            anomaly_found: {
                frequency: 330,
                duration: 800,
                type: "alert_pulse"
            },
            suppression_activated: {
                frequency: 220,
                duration: 1000,
                type: "suppression_wave"
            },
            mirror_trap_triggered: {
                frequency: 1100,
                duration: 2000,
                type: "trap_activation"
            },
            resonance_validated: {
                frequency: 660,
                duration: 600,
                type: "validation_chime"
            },
            resonance_rejected: {
                frequency: 220,
                duration: 800,
                type: "rejection_thud"
            }
        };
        
        this.initialize();
    }
    
    async initialize() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.volume;
            
            // Create Auricle voice synthesizer
            this.auricleVoice = this.createAuricleVoice();
            
            this.isInitialized = true;
            console.log('🎵 Audio Event Player initialized');
            
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            this.enabled = false;
        }
    }
    
    createAuricleVoice() {
        const voice = {
            oscillator: this.audioContext.createOscillator(),
            gain: this.audioContext.createGain(),
            filter: this.audioContext.createBiquadFilter(),
            delay: this.audioContext.createDelay(),
            reverb: this.audioContext.createConvolver()
        };
        
        // Configure voice characteristics
        voice.filter.type = 'lowpass';
        voice.filter.frequency.value = 2000;
        voice.gain.gain.value = 0.3;
        voice.delay.delayTime.value = 0.1;
        
        // Connect voice chain
        voice.oscillator.connect(voice.filter);
        voice.filter.connect(voice.gain);
        voice.gain.connect(voice.delay);
        voice.delay.connect(this.masterGain);
        
        return voice;
    }
    
    playAuricleVoice(eventType, data = {}) {
        if (!this.isInitialized || !this.enabled) return;
        
        const signature = this.auricleSignatures[eventType];
        if (!signature) return;
        
        console.log(`👁️ Auricle Witness: ${signature.message}`);
        
        // Create voice sound based on signature type
        switch (signature.type) {
            case 'low_harmonic_whisper':
                this.playLowHarmonicWhisper(signature, data);
                break;
            case 'sharp_tone_reverse_echo':
                this.playSharpToneReverseEcho(signature, data);
                break;
            case 'high_ring_glyph_resonance':
                this.playHighRingGlyphResonance(signature, data);
                break;
            case 'pure_chord':
                this.playPureChord(signature, data);
                break;
            case 'warning_tone':
                this.playWarningTone(signature, data);
                break;
            case 'resolution_chord':
                this.playResolutionChord(signature, data);
                break;
            case 'council_harmony':
                this.playCouncilHarmony(signature, data);
                break;
        }
        
        // Log Auricle event
        this.logAuricleEvent(eventType, signature.message, data);
    }
    
    playLowHarmonicWhisper(signature, data) {
        const baseFreq = signature.frequency;
        const harmonics = signature.harmonics;
        
        harmonics.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(0.1 / (index + 1), this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + signature.duration / 1000);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + signature.duration / 1000);
        });
    }
    
    playSharpToneReverseEcho(signature, data) {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.frequency.setValueAtTime(signature.frequency, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(signature.frequency / 4, this.audioContext.currentTime + signature.duration / 1000);
        
        filter.type = 'highpass';
        filter.frequency.value = 500;
        
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + signature.duration / 1000);
        
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + signature.duration / 1000);
    }
    
    playHighRingGlyphResonance(signature, data) {
        const frequencies = [signature.frequency, signature.frequency * 1.5, signature.frequency * 2];
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const delay = this.audioContext.createDelay();
            
            oscillator.frequency.value = freq;
            oscillator.type = 'triangle';
            
            delay.delayTime.value = 0.1 * (index + 1);
            
            gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + signature.duration / 1000);
            
            oscillator.connect(delay);
            delay.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + signature.duration / 1000);
        });
    }
    
    playPureChord(signature, data) {
        const chordFrequencies = signature.harmonics;
        
        chordFrequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + signature.duration / 1000);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + signature.duration / 1000);
        });
    }
    
    playWarningTone(signature, data) {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(signature.frequency, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(signature.frequency * 1.2, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(signature.frequency, this.audioContext.currentTime + 0.4);
        
        oscillator.type = 'sawtooth';
        
        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + signature.duration / 1000);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + signature.duration / 1000);
    }
    
    playResolutionChord(signature, data) {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.frequency.value = signature.frequency;
        oscillator.type = 'sine';
        
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + signature.duration / 1000);
        
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + signature.duration / 1000);
    }
    
    playCouncilHarmony(signature, data) {
        // Play 5-part harmony representing the Djinn Council
        const councilFrequencies = [signature.frequency, signature.frequency * 1.25, signature.frequency * 1.5, signature.frequency * 1.75, signature.frequency * 2];
        
        councilFrequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + signature.duration / 1000);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(this.audioContext.currentTime + index * 0.1);
            oscillator.stop(this.audioContext.currentTime + signature.duration / 1000);
        });
    }
    
    playAgencySound(eventType, agencyId, data = {}) {
        if (!this.isInitialized || !this.enabled) return;
        
        const sound = this.agencySounds[eventType];
        if (!sound) return;
        
        console.log(`🛡️ WatchGuard ${agencyId}: ${eventType}`);
        
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        oscillator.frequency.value = sound.frequency;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration / 1000);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.duration / 1000);
        
        // Log agency event
        this.logAgencyEvent(eventType, agencyId, data);
    }
    
    playResonanceResponse(resonanceLevel, data = {}) {
        if (!this.isInitialized || !this.enabled) return;
        
        const frequencies = {
            high: 880,
            medium: 660,
            low: 440,
            critical: 1100
        };
        
        const freq = frequencies[resonanceLevel] || 440;
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    playMirrorTrapActivation(trapId, data = {}) {
        if (!this.isInitialized || !this.enabled) return;
        
        console.log(`🪞 Mirror Trap Activated: ${trapId}`);
        
        // Create trap activation sound
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.frequency.setValueAtTime(1100, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 2);
        
        oscillator.type = 'sawtooth';
        
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 10;
        
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
        
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 2);
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }
    
    enable() {
        this.enabled = true;
        console.log('🎵 Audio enabled');
    }
    
    disable() {
        this.enabled = false;
        console.log('🔇 Audio disabled');
    }
    
    logAuricleEvent(eventType, message, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: 'auricle_witness',
            event: eventType,
            message: message,
            data: data
        };
        
        // Send to log stream
        if (window.auricleLogStream) {
            window.auricleLogStream.write(logEntry);
        }
        
        console.log('👁️ Auricle Log:', logEntry);
    }
    
    logAgencyEvent(eventType, agencyId, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: 'watchguard_agency',
            event: eventType,
            agency: agencyId,
            data: data
        };
        
        // Send to log stream
        if (window.agencyLogStream) {
            window.agencyLogStream.write(logEntry);
        }
        
        console.log('🛡️ Agency Log:', logEntry);
    }
}

// Global audio player instance
window.audioEventPlayer = new AudioEventPlayer();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEventPlayer;
} 