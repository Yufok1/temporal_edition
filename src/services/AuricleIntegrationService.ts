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

import { CryptographerCore } from './CryptographerCore';
import { TemporalEditionService } from './TemporalEditionService';
import { DjinnAudioService } from './DjinnAudioService';
import { MonitoringService } from './BrowserMonitoringService';
import { createLogger } from '../utils/logger';

export interface AuricleConfiguration {
  cryptoEnabled: boolean;
  audioProcessingEnabled: boolean;
  temporalAnalysisEnabled: boolean;
  securityLevel: 'standard' | 'enhanced' | 'maximum';
}

export class AuricleIntegrationService {
  private logger = createLogger('AuricleIntegration');
  private cryptographer: CryptographerCore;
  private temporalService: TemporalEditionService;
  private audioService: DjinnAudioService;
  private monitoringService: MonitoringService;
  private config: AuricleConfiguration;
  private isInitialized = false;

  constructor(config: AuricleConfiguration) {
    this.config = config;
    this.monitoringService = new MonitoringService();
    this.cryptographer = CryptographerCore.getInstance();
    this.temporalService = new TemporalEditionService(this.monitoringService);
    this.audioService = new DjinnAudioService(this.monitoringService);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.logger.info('Initializing Auricle AI system without whale operations');

      // Initialize core services based on configuration
      if (this.config.audioProcessingEnabled) {
        await this.audioService.initialize();
        this.logger.info('Audio processing enabled');
      }

      if (this.config.temporalAnalysisEnabled) {
        await this.temporalService.initialize();
        this.logger.info('Temporal analysis enabled');
      }

      if (this.config.cryptoEnabled) {
        // Crypto is already initialized via singleton
        this.logger.info('Cryptographic services enabled');
      }

      // Start monitoring and health checks
      this.startSystemMonitoring();

      this.isInitialized = true;
      this.logger.info('Auricle AI system initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize Auricle AI system', error);
      throw error;
    }
  }

  private startSystemMonitoring(): void {
    // Start collecting system metrics
    setInterval(async () => {
      try {
        if (this.config.temporalAnalysisEnabled) {
          const data = await this.temporalService.generateAndExportReports();
          this.monitoringService.logTemporalData(data);
        }
        
        // Log system health metrics
        this.monitoringService.logSessionEvent({
          type: 'system_health_check',
          timestamp: Date.now(),
          metadata: {
            auricleSystem: 'active',
            cryptoServices: this.config.cryptoEnabled ? 'enabled' : 'disabled',
            audioProcessing: this.config.audioProcessingEnabled ? 'enabled' : 'disabled',
            temporalAnalysis: this.config.temporalAnalysisEnabled ? 'enabled' : 'disabled'
          }
        });
      } catch (error) {
        this.logger.error('Error during system health check', error);
      }
    }, 60000); // Every minute
  }

  async processAudioInput(audioData: ArrayBuffer): Promise<any> {
    if (!this.config.audioProcessingEnabled) {
      throw new Error('Audio processing is disabled');
    }
    
    // Process audio through Auricle AI without whale operations
    return await this.audioService.processAudioInput(audioData);
  }

  async encryptData(data: Uint8Array): Promise<Uint8Array> {
    if (!this.config.cryptoEnabled) {
      throw new Error('Crypto services are disabled');
    }

    const keyPair = await this.cryptographer.generateEncryptionKeyPair();
    return await this.cryptographer.encrypt(data, keyPair.publicKey);
  }

  async getSystemStatus(): Promise<{
    auricleStatus: string;
    servicesStatus: Record<string, boolean>;
    securityLevel: string;
  }> {
    return {
      auricleStatus: this.isInitialized ? 'active' : 'inactive',
      servicesStatus: {
        crypto: this.config.cryptoEnabled,
        audio: this.config.audioProcessingEnabled,
        temporal: this.config.temporalAnalysisEnabled,
      },
      securityLevel: this.config.securityLevel
    };
  }

  async shutdown(): Promise<void> {
    this.logger.info('Shutting down Auricle AI system');
    
    try {
      // Clean shutdown of services
      if (this.config.audioProcessingEnabled) {
        // Stop audio processing
      }
      
      this.isInitialized = false;
      this.logger.info('Auricle AI system shutdown complete');
    } catch (error) {
      this.logger.error('Error during Auricle AI system shutdown', error);
      throw error;
    }
  }
}