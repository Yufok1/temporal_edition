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
import { SecureWhaleInterface } from './components/SecureWhaleInterface';
import { MonitoringService } from './MonitoringService';
import { DjinnAudioService } from './services/DjinnAudioService';
import { TemporalEditionService } from './services/TemporalEditionService';
import RiddlerDashboard from './components/RiddlerDashboard';

const App: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [monitoringService] = useState(() => new MonitoringService());
  const [audioService] = useState(() => new DjinnAudioService(monitoringService));
  const [temporalService] = useState(() => new TemporalEditionService(monitoringService));

  useEffect(() => {
    const initializeServices = async () => {
      try {
        await audioService.initialize();
        await temporalService.initialize();
        
        // Start collecting temporal data
        const interval = setInterval(async () => {
          const data = await temporalService.generateAndExportReports();
          monitoringService.logTemporalData(data);
        }, 60000); // Collect data every minute

        return () => clearInterval(interval);
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
        identity: 'monkey-king',
        mode: 'whale_communication'
      }
    });
  };

  const handleSessionEnd = () => {
    setIsSessionActive(false);
    monitoringService.logSessionEvent({
      type: 'session_end',
      timestamp: Date.now(),
      metadata: {
        identity: 'monkey-king',
        mode: 'whale_communication'
      }
    });
  };

  return (
    <div className="App">
      <SecureWhaleInterface
        onSessionStart={handleSessionStart}
        onSessionEnd={handleSessionEnd}
      />
      <RiddlerDashboard />
    </div>
  );
};

export default App; 