import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { logger } from '../utils/logger';

export interface IsolationState {
    isIsolated: boolean;
    timestamp: string;
    reason?: string;
}

export class TemporalIsolation extends EventEmitter {
    private state: IsolationState;
    private lockTimeout: NodeJS.Timeout | null = null;

    constructor() {
        super();
        this.state = {
            isIsolated: false,
            timestamp: new Date().toISOString()
        };
    }

    public isolateExplorer(reason?: string): void {
        this.state = {
            isIsolated: true,
            timestamp: new Date().toISOString(),
            reason
        };
        this.emit('explorerIsolated', this.state);
        logger.info('Explorer isolated', { reason, timestamp: this.state.timestamp });
    }

    public reactivateExplorer(): void {
        this.state = {
            isIsolated: false,
            timestamp: new Date().toISOString()
        };
        this.emit('explorerReactivated', this.state);
        logger.info('Explorer reactivated', { timestamp: this.state.timestamp });
    }

    public applyTemporalLock(duration: number): void {
        // Clear any existing lock
        if (this.lockTimeout) {
            clearTimeout(this.lockTimeout);
        }

        // Apply new lock
        this.isolateExplorer('Temporal lock applied');
        this.emit('temporalLockApplied', { duration, timestamp: new Date().toISOString() });
        logger.info('Applying temporal lock', { duration, timestamp: new Date().toISOString() });

        // Set timeout to remove lock
        this.lockTimeout = setTimeout(() => {
            this.removeTemporalLock();
        }, duration);
    }

    public removeTemporalLock(): void {
        if (this.lockTimeout) {
            clearTimeout(this.lockTimeout);
            this.lockTimeout = null;
        }
        this.reactivateExplorer();
        this.emit('temporalLockRemoved', { timestamp: new Date().toISOString() });
        logger.info('Removing temporal lock', { timestamp: new Date().toISOString() });
    }

    public getExplorerStatus(): IsolationState {
        return { ...this.state };
    }
} 