import { HarmonicSignature } from './IHarmonicSignatureProvider';
/**
 * Represents feedback provided to the system
 */
export interface Feedback {
    /** Unique identifier for this feedback */
    id: string;
    /** The actual feedback data */
    data: Uint8Array;
    /** Timestamp when the feedback was created */
    timestamp: number;
    /** The harmonic signature of the entity providing feedback */
    signature: HarmonicSignature;
    /** Optional metadata about the feedback */
    metadata?: Record<string, unknown>;
}
/**
 * Represents the current state of the system
 */
export interface SystemState {
    /** Current version/iteration of the system */
    version: number;
    /** Current state data */
    data: Uint8Array;
    /** Timestamp of the last state update */
    lastUpdate: number;
    /** History of previous states for rollback capability */
    history: SystemState[];
    /** Optional metadata about the state */
    metadata?: Record<string, unknown>;
}
/**
 * Interface for the recursive feedback loop system
 */
export interface IRecursiveFeedbackLoop {
    /**
     * Initialize the feedback loop with necessary components
     * @param initialState The initial state of the system
     */
    initialize(initialState: SystemState): Promise<void>;
    /**
     * Submit feedback to the system
     * @param feedback The feedback to submit
     * @returns A promise that resolves when the feedback is processed
     */
    submitFeedback(feedback: Feedback): Promise<void>;
    /**
     * Get the current state of the system
     * @returns The current system state
     */
    getState(): SystemState;
    /**
     * Detect if feedback resonates with the current system state
     * @param feedback The feedback to check for resonance
     * @returns A promise that resolves to true if the feedback resonates
     */
    detectHarmonicResonance(feedback: Feedback): Promise<boolean>;
    /**
     * Rollback the system to a previous state
     * @param version The version to rollback to
     * @returns A promise that resolves when the rollback is complete
     */
    rollback(version: number): Promise<void>;
    /**
     * Get the type of feedback loop this system implements
     * @returns A string describing the feedback loop type
     */
    getFeedbackLoopType(): string;
}
