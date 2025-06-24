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
import { AuricleIntegrationService, AuricleConfiguration } from '../services/AuricleIntegrationService';
import { AudioVisualizer } from './AudioVisualizer';
import '../styles/AuricleInterface.css';

interface AuricleInterfaceProps {
  configuration: AuricleConfiguration;
  onStatusChange?: (status: any) => void;
}

export const AuricleInterface: React.FC<AuricleInterfaceProps> = ({
  configuration,
  onStatusChange
}) => {
  const [auricleService] = useState(() => new AuricleIntegrationService(configuration));
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioState, setAudioState] = useState({
    isProcessing: false,
    currentAnalysis: null,
    volume: 0.7,
    processingMode: 'standard'
  });

  useEffect(() => {
    const initializeAuricle = async () => {
      try {
        await auricleService.initialize();
        const status = await auricleService.getSystemStatus();
        setSystemStatus(status);
        setIsInitialized(true);
        onStatusChange?.(status);
      } catch (err) {
        setError(`Failed to initialize Auricle AI: ${err}`);
        console.error('Auricle initialization error:', err);
      }
    };

    initializeAuricle();

    return () => {
      auricleService.shutdown().catch(console.error);
    };
  }, [auricleService, onStatusChange]);

  const handleAudioInput = useCallback(async (audioData: ArrayBuffer) => {
    if (!configuration.audioProcessingEnabled) {
      setError('Audio processing is disabled');
      return;
    }

    try {
      setAudioState(prev => ({ ...prev, isProcessing: true }));
      const analysis = await auricleService.processAudioInput(audioData);
      setAudioState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentAnalysis: analysis 
      }));
    } catch (err) {
      setError(`Audio processing failed: ${err}`);
      setAudioState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [auricleService, configuration.audioProcessingEnabled]);

  const handleSecurityLevelChange = useCallback((level: string) => {
    // Update security configuration
    console.log(`Security level changed to: ${level}`);
  }, []);

  if (error) {
    return (
      <div className="auricle-error">
        <h2>Auricle AI System Error</h2>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="auricle-loading">
        <div className="loading-spinner" />
        <p>Initializing Auricle AI System...</p>
      </div>
    );
  }

  return (
    <div className="auricle-interface">
      <header className="auricle-header">
        <h1>Auricle AI Interface</h1>
        <div className="system-status">
          <span className={`status-indicator ${systemStatus?.auricleStatus === 'active' ? 'active' : 'inactive'}`} />
          <span>System: {systemStatus?.auricleStatus}</span>
        </div>
      </header>

      <main className="auricle-content">
        <section className="service-status-panel">
          <h3>Service Status</h3>
          <div className="service-grid">
            <div className={`service-card ${systemStatus?.servicesStatus?.crypto ? 'enabled' : 'disabled'}`}>
              <h4>Cryptographic Services</h4>
              <p>Status: {systemStatus?.servicesStatus?.crypto ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className={`service-card ${systemStatus?.servicesStatus?.audio ? 'enabled' : 'disabled'}`}>
              <h4>Audio Processing</h4>
              <p>Status: {systemStatus?.servicesStatus?.audio ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className={`service-card ${systemStatus?.servicesStatus?.temporal ? 'enabled' : 'disabled'}`}>
              <h4>Temporal Analysis</h4>
              <p>Status: {systemStatus?.servicesStatus?.temporal ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </section>

        {configuration.audioProcessingEnabled && (
          <section className="audio-panel">
            <h3>Audio Processing</h3>
            <AudioVisualizer
              audioState={audioState}
              onVolumeChange={(volume) => setAudioState(prev => ({ ...prev, volume }))}
              onTempoChange={() => {}} // Not applicable for Auricle AI
            />
            <div className="processing-controls">
              <button
                className={`process-button ${audioState.isProcessing ? 'processing' : ''}`}
                disabled={audioState.isProcessing}
              >
                {audioState.isProcessing ? 'Processing...' : 'Process Audio'}
              </button>
            </div>
          </section>
        )}

        <section className="security-panel">
          <h3>Security Configuration</h3>
          <div className="security-controls">
            <label>
              Security Level:
              <select 
                value={systemStatus?.securityLevel || 'standard'}
                onChange={(e) => handleSecurityLevelChange(e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="enhanced">Enhanced</option>
                <option value="maximum">Maximum</option>
              </select>
            </label>
          </div>
        </section>
      </main>

      <footer className="auricle-footer">
        <div className="system-info">
          <span>Auricle AI v1.0</span>
          <span>•</span>
          <span>Independent of Whale Operations</span>
        </div>
      </footer>
    </div>
  );
};