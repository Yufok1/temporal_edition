/// <reference types="node" />
import { EventEmitter } from 'events';
export interface IsolationState {
    isIsolated: boolean;
    timestamp: string;
    reason?: string;
}
export declare class TemporalIsolation extends EventEmitter {
    private state;
    private lockTimeout;
    constructor();
    isolateExplorer(reason?: string): void;
    reactivateExplorer(): void;
    applyTemporalLock(duration: number): void;
    removeTemporalLock(): void;
    getExplorerStatus(): IsolationState;
}
