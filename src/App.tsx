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

import React, { useState, useEffect } from 'react';
import './styles/App.css';
import { getFeatureFlags } from './config/features';
import { MonitoringService } from './MonitoringService';
import { DjinnAudioService } from './services/DjinnAudioService';
import { TemporalEditionService } from './services/TemporalEditionService';
import { RiddlerExplorerService } from './services/RiddlerExplorerService';

// Conditional imports based on feature flags
const featureFlags = getFeatureFlags();

// Auricle AI imports
const AuricleInterface = featureFlags.auricleAIEnabled 
  ? React.lazy(() => import('./components/AuricleInterface').then(m => ({ default: m.AuricleInterface })))
  : null;

// Whale operations imports  
const SecureWhaleInterface = featureFlags.whaleOperationsEnabled
  ? React.lazy(() => import('./components/SecureWhaleInterface').then(m => ({ default: m.SecureWhaleInterface })))
  : null;

// Riddler dashboard import
const RiddlerDashboard = featureFlags.riddlerDashboardEnabled
  ? React.lazy(() => import('./components/RiddlerDashboard'))
  : null;

const App: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [monitoringService] = useState(() => new MonitoringService());
  const [audioService] = useState(() => new DjinnAudioService(monitoringService));
  
  // Create minimal riddler and steward for temporal service
  const [riddlerService] = useState(() => new RiddlerExplorerService());
  const [defaultSteward] = useState(() => ({
    id: 'app-steward',
    type: 'ai' as const,
    name: 'App Steward',
    status: 'approved' as const,
    lastRecognized: Date.now(),
    peckingTier: 2 as const,
    privileges: []
  }));
  const [temporalService] = useState(() => new TemporalEditionService(monitoringService, riddlerService, defaultSteward));
  const [systemMode, setSystemMode] = useState<'auricle' | 'whale' | 'standalone'>('auricle');

  useEffect(() => {
    // Determine system mode based on feature flags
    if (featureFlags.auricleAIEnabled && !featureFlags.whaleOperationsEnabled) {
      setSystemMode('auricle');
    } else if (featureFlags.whaleOperationsEnabled && !featureFlags.auricleAIEnabled) {
      setSystemMode('whale');
    } else {
      setSystemMode('standalone');
    }
  }, []);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize common services
        if (featureFlags.temporalEditioningEnabled) {
          await temporalService.initialize();
          
          // Start collecting temporal data
          const interval = setInterval(async () => {
            // generateAndExportReports doesn't return data, it exports internally
            await temporalService.generateAndExportReports();
          }, 60000); // Collect data every minute

          return () => clearInterval(interval);
        }

        // Initialize audio service if needed by either system
        if (featureFlags.auricleAIEnabled || featureFlags.whaleOperationsEnabled) {
          await audioService.initialize();
        }

      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initializeServices();
  }, [audioService, temporalService, monitoringService]);

  const handleSessionStart = () => {
    setIsSessionActive(true);
    monitoringService.logSessionEvent({
      type: 'session_start',
      timestamp: Date.now(),
      metadata: {
        identity: 'user',
        mode: systemMode
      }
    });
  };

  const handleSessionEnd = () => {
    setIsSessionActive(false);
    monitoringService.logSessionEvent({
      type: 'session_end',
      timestamp: Date.now(),
      metadata: {
        identity: 'user',
        mode: systemMode
      }
    });
  };

  // Render different interfaces based on feature flags
  const renderPrimaryInterface = () => {
    if (featureFlags.auricleAIEnabled && AuricleInterface) {
      return (
        <React.Suspense fallback={<div className="loading">Loading Auricle AI...</div>}>
          <AuricleInterface
            configuration={{
              cryptoEnabled: featureFlags.cryptoSecuritiesEnabled,
              audioProcessingEnabled: true,
              temporalAnalysisEnabled: featureFlags.temporalEditioningEnabled,
              securityLevel: 'enhanced'
            }}
            onStatusChange={(status) => {
              console.log('Auricle status:', status);
            }}
          />
        </React.Suspense>
      );
    }

    if (featureFlags.whaleOperationsEnabled && SecureWhaleInterface) {
      return (
        <React.Suspense fallback={<div className="loading">Loading Whale Operations...</div>}>
          <SecureWhaleInterface
            riddler={riddlerService}
            steward={defaultSteward}
            onSessionStart={handleSessionStart}
            onSessionEnd={handleSessionEnd}
          />
        </React.Suspense>
      );
    }

    // Fallback interface when neither whale ops nor auricle are enabled
    return (
      <div className="standalone-interface">
        <h1>Temporal Edition System</h1>
        <p>System running in standalone mode</p>
        <div className="feature-status">
          <h3>Feature Status:</h3>
          <ul>
            <li>Whale Operations: {featureFlags.whaleOperationsEnabled ? 'Enabled' : 'Disabled'}</li>
            <li>Auricle AI: {featureFlags.auricleAIEnabled ? 'Enabled' : 'Disabled'}</li>
            <li>Crypto Securities: {featureFlags.cryptoSecuritiesEnabled ? 'Enabled' : 'Disabled'}</li>
            <li>Temporal Editing: {featureFlags.temporalEditioningEnabled ? 'Enabled' : 'Disabled'}</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="system-header">
        <div className="mode-indicator">
          Mode: {systemMode.toUpperCase()}
        </div>
        <div className="separation-status">
          {!featureFlags.whaleOperationsEnabled && featureFlags.auricleAIEnabled && 
            "✓ Whale Operations Disassociated"}
        </div>
      </div>
      
      {renderPrimaryInterface()}
      
      {featureFlags.riddlerDashboardEnabled && RiddlerDashboard && (
        <React.Suspense fallback={<div>Loading Dashboard...</div>}>
          <RiddlerDashboard />
        </React.Suspense>
      )}
    </div>
  );
};

export default App; 