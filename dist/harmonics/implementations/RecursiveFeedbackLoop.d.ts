import { IHarmonicSignatureProvider } from '../interfaces/IHarmonicSignatureProvider';
import { Feedback, IRecursiveFeedbackLoop, SystemState } from '../interfaces/IRecursiveFeedbackLoop';
export declare class RecursiveFeedbackLoop implements IRecursiveFeedbackLoop {
    private signatureProvider;
    private currentState;
    private initialized;
    private readonly maxHistorySize;
    initialize(initialState: SystemState): Promise<void>;
    setSignatureProvider(provider: IHarmonicSignatureProvider): void;
    submitFeedback(feedback: Feedback): Promise<void>;
    getState(): SystemState;
    detectHarmonicResonance(feedback: Feedback): Promise<boolean>;
    rollback(version: number): Promise<void>;
    getFeedbackLoopType(): string;
    private arraysEqual;
}
