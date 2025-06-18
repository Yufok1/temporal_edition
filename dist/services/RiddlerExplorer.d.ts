/// <reference types="node" />
import { EventEmitter } from 'events';
export interface RiddleState {
    complexity: number;
    count: number;
    lastRiddle: string;
    timestamp: string;
}
export declare class RiddlerExplorer extends EventEmitter {
    private riddleCount;
    private complexityLevel;
    private theme;
    private state;
    constructor();
    generateRiddle(): string;
    private createRiddle;
    processRiddle(riddle: string): boolean;
    startRiddleBattle(): void;
    getState(): RiddleState;
    reset(): void;
}
