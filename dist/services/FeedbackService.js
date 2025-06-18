"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
class FeedbackService {
    logFeedback(vocalization, response) {
        console.log(`Whale vocalization: ${vocalization.emotionalState} | Steward response: ${response.responseTone}`);
    }
    checkHarmonicStability(vocalization) {
        if (vocalization.frequency > 400) {
            console.log("Warning: High-frequency vocalization detected, adjusting...");
            // Adjust or feedback for stability
        }
        else {
            console.log("Harmonic frequency is stable.");
        }
    }
}
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=FeedbackService.js.map