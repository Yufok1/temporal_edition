"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudioInterface = void 0;
const react_1 = __importStar(require("react"));
const StudioInterface = ({ jamSessionService, feedbackService }) => {
    const [isSessionActive, setIsSessionActive] = (0, react_1.useState)(false);
    const [currentVocalization, setCurrentVocalization] = (0, react_1.useState)(null);
    const [currentResponse, setCurrentResponse] = (0, react_1.useState)(null);
    const [feedback, setFeedback] = (0, react_1.useState)('');
    const [harmonicStability, setHarmonicStability] = (0, react_1.useState)('');
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
            setHarmonicStability(currentVocalization.frequency > 400
                ? "Warning: High-frequency detected, adjusting..."
                : "Harmonic frequency is stable.");
            // Engage prodigal system
            jamSessionService.interactWithProdigalSystem();
        }
    };
    return (<div className="studio-interface">
            <h1>Wonka's Wonderland Studio</h1>
            
            <div className="session-controls">
                <button onClick={startSession} disabled={isSessionActive} className="control-button start">
                    Start Session
                </button>
                <button onClick={endSession} disabled={!isSessionActive} className="control-button end">
                    End Session
                </button>
            </div>

            {isSessionActive && (<div className="session-display">
                    <div className="vocalization-display">
                        <h2>Whale Vocalization</h2>
                        {currentVocalization && (<div className="vocalization-details">
                                <p>Frequency: {currentVocalization.frequency} Hz</p>
                                <p>Pitch: {currentVocalization.pitch}</p>
                                <p>Tone: {currentVocalization.tone}</p>
                                <p>Duration: {currentVocalization.duration}s</p>
                                <p>Emotional State: {currentVocalization.emotionalState}</p>
                            </div>)}
                    </div>

                    <div className="response-display">
                        <h2>Steward Response</h2>
                        {currentResponse && (<div className="response-details">
                                <p>Modulation: {currentResponse.modulationType}</p>
                                <p>Intensity: {currentResponse.intensity}</p>
                                <p>Tone: {currentResponse.responseTone}</p>
                            </div>)}
                    </div>

                    <div className="feedback-display">
                        <h2>Real-Time Feedback</h2>
                        <p className="feedback-text">{feedback}</p>
                        <p className="stability-text">{harmonicStability}</p>
                    </div>

                    <button onClick={handleProdigalInteraction} className="control-button interact">
                        Engage Prodigal System
                    </button>
                </div>)}
        </div>);
};
exports.StudioInterface = StudioInterface;
//# sourceMappingURL=StudioInterface.js.map