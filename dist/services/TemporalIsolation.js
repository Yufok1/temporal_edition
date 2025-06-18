"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalIsolation = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
class TemporalIsolation extends events_1.EventEmitter {
    constructor() {
        super();
        this.lockTimeout = null;
        this.state = {
            isIsolated: false,
            timestamp: new Date().toISOString()
        };
    }
    isolateExplorer(reason) {
        this.state = {
            isIsolated: true,
            timestamp: new Date().toISOString(),
            reason
        };
        this.emit('explorerIsolated', this.state);
        logger_1.logger.info('Explorer isolated', { reason, timestamp: this.state.timestamp });
    }
    reactivateExplorer() {
        this.state = {
            isIsolated: false,
            timestamp: new Date().toISOString()
        };
        this.emit('explorerReactivated', this.state);
        logger_1.logger.info('Explorer reactivated', { timestamp: this.state.timestamp });
    }
    applyTemporalLock(duration) {
        // Clear any existing lock
        if (this.lockTimeout) {
            clearTimeout(this.lockTimeout);
        }
        // Apply new lock
        this.isolateExplorer('Temporal lock applied');
        this.emit('temporalLockApplied', { duration, timestamp: new Date().toISOString() });
        logger_1.logger.info('Applying temporal lock', { duration, timestamp: new Date().toISOString() });
        // Set timeout to remove lock
        this.lockTimeout = setTimeout(() => {
            this.removeTemporalLock();
        }, duration);
    }
    removeTemporalLock() {
        if (this.lockTimeout) {
            clearTimeout(this.lockTimeout);
            this.lockTimeout = null;
        }
        this.reactivateExplorer();
        this.emit('temporalLockRemoved', { timestamp: new Date().toISOString() });
        logger_1.logger.info('Removing temporal lock', { timestamp: new Date().toISOString() });
    }
    getExplorerStatus() {
        return { ...this.state };
    }
}
exports.TemporalIsolation = TemporalIsolation;
//# sourceMappingURL=TemporalIsolation.js.map