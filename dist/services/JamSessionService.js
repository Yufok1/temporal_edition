"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JamSessionService = void 0;
class JamSessionService {
    constructor(poseidon, processor, stewardCapabilities, whaleCapabilities) {
        this.currentSession = null;
        this.sessionHistory = [];
        this.whaleVocalizations = [];
        this.stewardResponses = [];
        this.prodigalSystemsEngaged = [];
        this.poseidon = poseidon;
        this.processor = processor;
        this.stewardCapabilities = stewardCapabilities;
        this.whaleCapabilities = whaleCapabilities;
    }
    initiateWhaleSequence(sequence) {
        if (this.currentSession) {
            throw new Error('A jam session is already in progress');
        }
        // Validate whale sequence against capabilities
        this.validateWhaleSequence(sequence);
        // Create initial musical interaction
        this.currentSession = {
            whaleSequence: sequence,
            stewardModulation: this.createInitialModulation(sequence),
            resultingHarmony: this.calculateResultingHarmony(sequence),
            feedback: this.assessHarmonicFeedback(sequence),
            environmentalChanges: this.poseidon.getCurrentEnvironmentalData()
        };
    }
    applyStewardModulation(modulation) {
        if (!this.currentSession) {
            throw new Error('No active jam session');
        }
        // Update the current session with steward's modulation
        this.currentSession.stewardModulation = modulation;
        this.currentSession.resultingHarmony = this.calculateResultingHarmony(this.currentSession.whaleSequence, modulation);
        // Calculate and update feedback
        const feedback = this.assessHarmonicFeedback(this.currentSession.resultingHarmony);
        this.currentSession.feedback = feedback;
        return feedback;
    }
    concludeSession() {
        if (!this.currentSession) {
            throw new Error('No active jam session to conclude');
        }
        // Record the session in history
        this.sessionHistory.push(this.currentSession);
        // Calculate final environmental impact
        const finalEnvironmentalChanges = this.poseidon.getCurrentEnvironmentalData();
        this.currentSession.environmentalChanges = finalEnvironmentalChanges;
        const completedSession = this.currentSession;
        this.currentSession = null;
        return completedSession;
    }
    validateWhaleSequence(sequence) {
        // Check if frequencies are within whale's vocal range
        const [minFreq, maxFreq] = this.whaleCapabilities.vocalRange;
        const invalidFrequencies = sequence.frequencies.filter(freq => freq < minFreq || freq > maxFreq);
        if (invalidFrequencies.length > 0) {
            throw new Error('Whale sequence contains frequencies outside vocal range');
        }
        // Validate emotional content
        if (sequence.emotionalContent.intensity > 1 || sequence.emotionalContent.intensity < 0) {
            throw new Error('Invalid emotional intensity');
        }
    }
    createInitialModulation(sequence) {
        // Create initial modulation based on steward's capabilities and whale's sequence
        return {
            frequencyShift: 0,
            amplitudeModulation: this.stewardCapabilities.harmonicMastery,
            harmonicEnhancement: this.stewardCapabilities.musicalTraining,
            rhythmicPattern: this.generateRhythmicPattern(sequence),
            emotionalEnhancement: this.stewardCapabilities.emotionalSensitivity
        };
    }
    calculateResultingHarmony(sequence, modulation) {
        const mod = modulation || this.createInitialModulation(sequence);
        // Calculate resulting frequencies
        const resultingFrequencies = sequence.frequencies.map(freq => freq + (freq * mod.frequencyShift));
        // Calculate resulting amplitude
        const resultingAmplitude = sequence.amplitude * mod.amplitudeModulation;
        // Calculate emotional enhancement
        const enhancedEmotionalContent = this.enhanceEmotionalContent(sequence.emotionalContent, mod.emotionalEnhancement);
        return {
            ...sequence,
            frequencies: resultingFrequencies,
            amplitude: resultingAmplitude,
            emotionalContent: enhancedEmotionalContent,
            source: 'steward',
            resonance: this.calculateResonance(resultingFrequencies, resultingAmplitude)
        };
    }
    assessHarmonicFeedback(sequence) {
        const environmentalContext = this.poseidon.getCurrentEnvironmentalData();
        return {
            resonance: this.calculateResonance(sequence.frequencies, sequence.amplitude),
            environmentalImpact: this.calculateEnvironmentalImpact(sequence, environmentalContext),
            emotionalAlignment: this.calculateEmotionalAlignment(sequence),
            musicalCoherence: this.calculateMusicalCoherence(sequence),
            ecosystemResponse: this.calculateEcosystemResponse(sequence, environmentalContext)
        };
    }
    generateRhythmicPattern(sequence) {
        // Generate a rhythmic pattern based on the sequence's duration and emotional content
        const patternLength = Math.ceil(sequence.duration / 1000); // Convert to seconds
        return Array(patternLength).fill(0).map((_, i) => Math.sin(i * Math.PI / patternLength) * sequence.emotionalContent.intensity);
    }
    enhanceEmotionalContent(emotional, enhancement) {
        return {
            ...emotional,
            intensity: Math.min(1, emotional.intensity * (1 + enhancement)),
            valence: Math.max(-1, Math.min(1, emotional.valence * (1 + enhancement))),
            arousal: Math.min(1, emotional.arousal * (1 + enhancement))
        };
    }
    calculateResonance(frequencies, amplitude) {
        // Calculate harmonic resonance based on frequency relationships and amplitude
        const frequencyRelationships = frequencies.map((freq, i) => i > 0 ? freq / frequencies[i - 1] : 1);
        const harmonicConsonance = frequencyRelationships.reduce((acc, ratio) => acc + (Math.abs(ratio - Math.round(ratio)) < 0.1 ? 1 : 0), 0) / (frequencies.length - 1);
        return (harmonicConsonance * amplitude);
    }
    calculateEnvironmentalImpact(sequence, context) {
        // Calculate how the sequence affects the environment
        const depthFactor = 1 - Math.abs(sequence.environmentalContext.depth - context.depth) / 1000;
        const temperatureFactor = 1 - Math.abs(sequence.environmentalContext.temperature - context.temperature) / 10;
        const currentFactor = 1 - Math.abs(sequence.environmentalContext.currentSpeed - context.currentSpeed) / 5;
        return (depthFactor + temperatureFactor + currentFactor) / 3;
    }
    calculateEmotionalAlignment(sequence) {
        // Calculate how well the emotional content aligns with the musical expression
        const frequencyIntensity = sequence.frequencies.reduce((acc, freq) => acc + freq, 0) / sequence.frequencies.length;
        const amplitudeAlignment = Math.abs(sequence.amplitude - sequence.emotionalContent.intensity);
        return 1 - amplitudeAlignment;
    }
    calculateMusicalCoherence(sequence) {
        // Calculate the musical coherence of the sequence
        const frequencySpacing = sequence.frequencies.map((freq, i) => i > 0 ? Math.abs(freq - sequence.frequencies[i - 1]) : 0);
        const averageSpacing = frequencySpacing.reduce((acc, spacing) => acc + spacing, 0) / frequencySpacing.length;
        const spacingConsistency = 1 - (Math.max(...frequencySpacing) - Math.min(...frequencySpacing)) / averageSpacing;
        return spacingConsistency;
    }
    calculateEcosystemResponse(sequence, context) {
        // Calculate how the ecosystem responds to the sequence
        const marineLifeResponse = context.marineLifePresence * sequence.resonance;
        const environmentalStability = 1 - Math.abs(sequence.environmentalContext.pressure - context.pressure) / 100;
        return (marineLifeResponse + environmentalStability) / 2;
    }
    getSessionHistory() {
        return this.sessionHistory;
    }
    getCurrentSession() {
        return this.currentSession;
    }
    startSession() {
        console.log("Starting the Jam Session...");
        // Logic to initiate whale vocalizations and steward responses
        this.whaleVocalizations.push({ frequency: 300, pitch: 5, tone: 'low', duration: 20, emotionalState: 'calm' });
        this.stewardResponses.push({ modulationType: 'pitch', intensity: 0.8, responseTone: 'bright' });
        console.log("Session started with initial whale vocalization and steward response.");
    }
    endSession() {
        console.log("Ending the Jam Session...");
        // Logic to end the session and log interactions
        this.whaleVocalizations = [];
        this.stewardResponses = [];
        console.log("Session ended.");
    }
    interactWithProdigalSystem() {
        // Logic for how prodigal systems interact with whale vocalizations and steward responses
        if (this.prodigalSystemsEngaged.length === 0) {
            console.log("No prodigal systems engaged.");
            return;
        }
        const system = this.prodigalSystemsEngaged[0];
        if (this.whaleVocalizations.length > 0) {
            system.modulateSound(this.whaleVocalizations[0]);
            system.interactWithWhale(this.whaleVocalizations[0]);
            console.log("Prodigal system engaged.");
        }
        else {
            console.log("No whale vocalizations to process.");
        }
    }
}
exports.JamSessionService = JamSessionService;
//# sourceMappingURL=JamSessionService.js.map