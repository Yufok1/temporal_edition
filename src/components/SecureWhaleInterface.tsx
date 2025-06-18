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

import React, { useState, useEffect, useCallback } from 'react';
import '../styles/SecureWhaleInterface.css';
import { DjinnAudioService } from '../services/DjinnAudioService';
import { MonitoringService } from '../MonitoringService';
import { AudioVisualizer } from './AudioVisualizer';
import { EnhancedAudioVisualizer } from './EnhancedAudioVisualizer';
import { RiddlerExplorerService, Steward } from '../services/RiddlerExplorerService';

interface SecureWhaleInterfaceProps {
  riddler: RiddlerExplorerService;
  steward: Steward;
  onSessionStart: () => void;
  onSessionEnd: () => void;
}

export const SecureWhaleInterface: React.FC<SecureWhaleInterfaceProps> = ({
  riddler,
  steward,
  onSessionStart,
  onSessionEnd
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [audioService] = useState(() => new DjinnAudioService(new MonitoringService()));
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentTone: 'C4',
    volume: 0.7,
    tempo: 120,
    harmony: ['C4', 'E4', 'G4'],
    analysis: null
  });

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await audioService.initialize();
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize audio service');
        console.error('Audio initialization error:', err);
      }
    };

    initializeAudio();
  }, [audioService]);

  const handleSessionStart = useCallback(async () => {
    try {
      setIsLoading(true);
      await audioService.startSession();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
      setIsSessionActive(true);
      onSessionStart();
      setIsLoading(false);
    } catch (err) {
      setError('Failed to start session');
      console.error('Session start error:', err);
    }
  }, [audioService, onSessionStart]);

  const handleSessionEnd = useCallback(async () => {
    try {
      setIsLoading(true);
      await audioService.endSession();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
      setIsSessionActive(false);
      onSessionEnd();
      setIsLoading(false);
    } catch (err) {
      setError('Failed to end session');
      console.error('Session end error:', err);
    }
  }, [audioService, onSessionEnd]);

  const handleVolumeChange = useCallback((volume: number) => {
    setAudioState(prev => ({ ...prev, volume }));
    audioService.setVolume(volume);
  }, [audioService]);

  const handleTempoChange = useCallback((tempo: number) => {
    setAudioState(prev => ({ ...prev, tempo }));
    audioService.setTempo(tempo);
  }, [audioService]);

  const handleEffectChange = useCallback((type: string, parameter: string, value: number) => {
    audioService.setEffectParameter(type, parameter, value);
  }, [audioService]);

  // Example: observation request
  const handleObservation = (action: string, details?: any) => {
    if (!riddler.checkpoint(steward.id, action, details)) {
      // Optionally show a warning or log denied observation
      return;
    }
    // ... existing observation logic ...
  };

  // Example: control request
  const handleControl = (command: string, args?: any) => {
    if (!riddler.checkpoint(steward.id, 'control', { command, args })) {
      // Optionally show a warning or log denied control
      return;
    }
    // ... existing control logic ...
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  return (
    <div className="secure-whale-interface">
      <header className="interface-header">
        <h1>Secure Whale Communication Interface</h1>
        <div className="identity-badge">
          <span className="badge-label">Identity:</span>
          <span className="badge-value">Monkey King</span>
        </div>
        <div className="role-badge">
          <span className="badge-label">Role:</span>
          <span className="badge-value">Whale Communicator</span>
        </div>
      </header>

      <main className="interface-content">
        <section className="visualization-panel">
          <AudioVisualizer
            audioState={audioState}
            onVolumeChange={handleVolumeChange}
            onTempoChange={handleTempoChange}
          />
          {audioState.analysis && (
            <EnhancedAudioVisualizer
              analysis={audioState.analysis}
              onEffectChange={handleEffectChange}
            />
          )}
        </section>

        <section className="control-panel">
          <div className="session-controls">
            <button
              className={`control-button ${isSessionActive ? 'end' : 'start'}`}
              onClick={isSessionActive ? handleSessionEnd : handleSessionStart}
            >
              {isSessionActive ? 'End Session' : 'Start Session'}
            </button>
          </div>

          <div className="trait-controls">
            <h3>Identity Traits</h3>
            <div className="slider-group">
              <label>
                Wisdom
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={0.9}
                  onChange={(e) => handleEffectChange('identity', 'wisdom', parseFloat(e.target.value))}
                />
              </label>
              <label>
                Possibility
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={0.95}
                  onChange={(e) => handleEffectChange('identity', 'possibility', parseFloat(e.target.value))}
                />
              </label>
              <label>
                Connection
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={0.85}
                  onChange={(e) => handleEffectChange('identity', 'connection', parseFloat(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="state-controls">
            <h3>Interaction State</h3>
            <div className="slider-group">
              <label>
                Focus
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={0.8}
                  onChange={(e) => handleEffectChange('state', 'focus', parseFloat(e.target.value))}
                />
              </label>
              <label>
                Intensity
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={0.8}
                  onChange={(e) => handleEffectChange('state', 'intensity', parseFloat(e.target.value))}
                />
              </label>
              <label>
                Adaptation
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={0.9}
                  onChange={(e) => handleEffectChange('state', 'adaptation', parseFloat(e.target.value))}
                />
              </label>
            </div>
          </div>
        </section>
      </main>

      <footer className="interface-footer">
        <div className="security-status">
          <span className="status-indicator secure" />
          <span className="status-text">Secure Connection Active</span>
        </div>
        <div className="session-info">
          <span className="session-id">Session ID: {Date.now().toString(36)}</span>
          <span className="session-time">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </footer>
    </div>
  );
}; 