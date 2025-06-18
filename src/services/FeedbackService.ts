// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

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