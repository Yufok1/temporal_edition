import { WhaleVocalization, StewardResponse } from '../types/musical';

export class FeedbackService {
  logFeedback(vocalization: WhaleVocalization, response: StewardResponse) {
    console.log(`Whale vocalization: ${vocalization.emotionalState} | Steward response: ${response.responseTone}`);
  }

  checkHarmonicStability(vocalization: WhaleVocalization) {
    if (vocalization.frequency > 400) {
      console.log("Warning: High-frequency vocalization detected, adjusting...");
      // Adjust or feedback for stability
    } else {
      console.log("Harmonic frequency is stable.");
    }
  }
} 