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