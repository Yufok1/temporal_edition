"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentalDataIntegrator = void 0;
class EnvironmentalDataIntegrator {
    constructor() {
        this.history = [];
        this.current = null;
    }
    // Add a new environmental signal
    addEnvironmentalSignal(signal) {
        this.history.push(signal);
        this.current = signal;
    }
    // Get the latest environmental context
    getCurrentContext() {
        return this.current;
    }
    // Get environmental context for a given timestamp (nearest or interpolated)
    getContextForTimestamp(timestamp) {
        if (this.history.length === 0)
            return null;
        // Find the closest signal in time
        let closest = this.history[0];
        let minDiff = Math.abs(timestamp.getTime() - closest.timestamp.getTime());
        for (const sig of this.history) {
            const diff = Math.abs(timestamp.getTime() - sig.timestamp.getTime());
            if (diff < minDiff) {
                closest = sig;
                minDiff = diff;
            }
        }
        return closest;
    }
    // Normalize environmental data for analysis (e.g., z-score normalization)
    normalizeHistory() {
        if (this.history.length === 0)
            return [];
        const keys = ['temperature', 'salinity', 'currentSpeed', 'depth'];
        const means = {};
        const stds = {};
        for (const key of keys) {
            const values = this.history.map(s => s[key] ?? 0);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
            means[key] = mean;
            stds[key] = std || 1;
        }
        return this.history.map(s => {
            const norm = { ...s };
            for (const key of keys) {
                norm[key] = ((s[key] ?? 0) - means[key]) / stds[key];
            }
            return norm;
        });
    }
    // Integrate environmental context into a whale signal
    integrateWithWhaleSignal(signal) {
        const context = this.getContextForTimestamp(signal.timestamp);
        return {
            ...signal,
            temperature: context?.temperature ?? signal.temperature,
            salinity: context?.salinity ?? signal.salinity,
            currentSpeed: context?.currentSpeed ?? signal.currentSpeed,
            currentDirection: context?.currentDirection ?? signal.currentDirection,
            environmentalContext: context ?? signal.environmentalContext
        };
    }
}
exports.EnvironmentalDataIntegrator = EnvironmentalDataIntegrator;
//# sourceMappingURL=EnvironmentalDataIntegrator.js.map