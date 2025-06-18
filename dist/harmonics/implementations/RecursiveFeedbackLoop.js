"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecursiveFeedbackLoop = void 0;
class RecursiveFeedbackLoop {
    constructor() {
        this.signatureProvider = null;
        this.currentState = null;
        this.initialized = false;
        this.maxHistorySize = 100;
    }
    async initialize(initialState) {
        this.currentState = {
            ...initialState,
            history: []
        };
        this.initialized = true;
    }
    setSignatureProvider(provider) {
        this.signatureProvider = provider;
    }
    async submitFeedback(feedback) {
        if (!this.initialized || !this.currentState || !this.signatureProvider) {
            throw new Error('Feedback loop not initialized');
        }
        // Verify the feedback signature
        const isValid = await this.signatureProvider.verifySignature(feedback.signature, {
            id: feedback.id,
            data: feedback.data,
            metadata: feedback.metadata
        });
        if (!isValid) {
            throw new Error('Invalid feedback signature');
        }
        // Check for harmonic resonance
        const hasResonance = await this.detectHarmonicResonance(feedback);
        // Update system state based on feedback
        const newState = {
            version: this.currentState.version + 1,
            data: feedback.data,
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
    getState() {
        if (!this.initialized || !this.currentState) {
            throw new Error('Feedback loop not initialized');
        }
        return this.currentState;
    }
    async detectHarmonicResonance(feedback) {
        if (!this.initialized || !this.currentState) {
            throw new Error('Feedback loop not initialized');
        }
        // Simple resonance detection: check if feedback data matches current state
        // In a real implementation, this would be more sophisticated
        return this.arraysEqual(feedback.data, this.currentState.data);
    }
    async rollback(version) {
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
    getFeedbackLoopType() {
        return 'recursive-feedback-v1';
    }
    arraysEqual(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
}
exports.RecursiveFeedbackLoop = RecursiveFeedbackLoop;
//# sourceMappingURL=RecursiveFeedbackLoop.js.map