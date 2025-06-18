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

import React, { useEffect, useState } from 'react';
import { WhaleVocalization, StewardResponse, ProdigalSystem } from '../types/musical';
import { JamSessionService } from '../services/JamSessionService';
import { FeedbackService } from '../services/FeedbackService';

interface StudioInterfaceProps {
    jamSessionService: JamSessionService;
    feedbackService: FeedbackService;
}

export const StudioInterface: React.FC<StudioInterfaceProps> = ({ 
    jamSessionService, 
    feedbackService 
}) => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [currentVocalization, setCurrentVocalization] = useState<WhaleVocalization | null>(null);
    const [currentResponse, setCurrentResponse] = useState<StewardResponse | null>(null);
    const [feedback, setFeedback] = useState<string>('');
    const [harmonicStability, setHarmonicStability] = useState<string>('');

    const startSession = () => {
        jamSessionService.startSession();
        setIsSessionActive(true);
        // Get initial vocalization and response
        if (jamSessionService.whaleVocalizations.length > 0) {
            setCurrentVocalization(jamSessionService.whaleVocalizations[0]);
        }
        if (jamSessionService.stewardResponses.length > 0) {
            setCurrentResponse(jamSessionService.stewardResponses[0]);
        }
    };

    const endSession = () => {
        jamSessionService.endSession();
        setIsSessionActive(false);
        setCurrentVocalization(null);
        setCurrentResponse(null);
        setFeedback('');
        setHarmonicStability('');
    };

    const handleProdigalInteraction = () => {
        if (currentVocalization && currentResponse) {
            feedbackService.logFeedback(currentVocalization, currentResponse);
            feedbackService.checkHarmonicStability(currentVocalization);
            
            // Update feedback state
            setFeedback(`Whale: ${currentVocalization.emotionalState} | Steward: ${currentResponse.responseTone}`);
            setHarmonicStability(
                currentVocalization.frequency > 400 
                    ? "Warning: High-frequency detected, adjusting..." 
                    : "Harmonic frequency is stable."
            );

            // Engage prodigal system
            jamSessionService.interactWithProdigalSystem();
        }
    };

    return (
        <div className="studio-interface">
            <h1>Wonka's Wonderland Studio</h1>
            
            <div className="session-controls">
                <button 
                    onClick={startSession} 
                    disabled={isSessionActive}
                    className="control-button start"
                >
                    Start Session
                </button>
                <button 
                    onClick={endSession} 
                    disabled={!isSessionActive}
                    className="control-button end"
                >
                    End Session
                </button>
            </div>

            {isSessionActive && (
                <div className="session-display">
                    <div className="vocalization-display">
                        <h2>Whale Vocalization</h2>
                        {currentVocalization && (
                            <div className="vocalization-details">
                                <p>Frequency: {currentVocalization.frequency} Hz</p>
                                <p>Pitch: {currentVocalization.pitch}</p>
                                <p>Tone: {currentVocalization.tone}</p>
                                <p>Duration: {currentVocalization.duration}s</p>
                                <p>Emotional State: {currentVocalization.emotionalState}</p>
                            </div>
                        )}
                    </div>

                    <div className="response-display">
                        <h2>Steward Response</h2>
                        {currentResponse && (
                            <div className="response-details">
                                <p>Modulation: {currentResponse.modulationType}</p>
                                <p>Intensity: {currentResponse.intensity}</p>
                                <p>Tone: {currentResponse.responseTone}</p>
                            </div>
                        )}
                    </div>

                    <div className="feedback-display">
                        <h2>Real-Time Feedback</h2>
                        <p className="feedback-text">{feedback}</p>
                        <p className="stability-text">{harmonicStability}</p>
                    </div>

                    <button 
                        onClick={handleProdigalInteraction}
                        className="control-button interact"
                    >
                        Engage Prodigal System
                    </button>
                </div>
            )}
        </div>
    );
}; 