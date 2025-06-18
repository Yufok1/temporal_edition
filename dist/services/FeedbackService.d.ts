import { WhaleVocalization, StewardResponse } from '../types/musical';
export declare class FeedbackService {
    logFeedback(vocalization: WhaleVocalization, response: StewardResponse): void;
    checkHarmonicStability(vocalization: WhaleVocalization): void;
}
