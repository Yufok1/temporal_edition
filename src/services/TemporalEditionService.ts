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

import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import { MonitoringService } from '../MonitoringService';
import { RiddlerExplorerService, Steward } from './RiddlerExplorerService';

export interface TemporalData {
  timestamp: number;
  metrics: {
    cpu: number;
    memory: number;
    cycleTime: number;
  };
  state: any;
}

export class TemporalEditionService extends EventEmitter {
  private monitoringService: MonitoringService;
  private riddler?: RiddlerExplorerService;
  private isInitialized: boolean = false;
  private reportSchedule: NodeJS.Timeout | null = null;
  private steward?: Steward;

  constructor(monitoringService: MonitoringService, riddler?: RiddlerExplorerService, steward?: Steward) {
    super();
    this.monitoringService = monitoringService;
    this.riddler = riddler;
    this.steward = steward;
    
    // Only request recognition if riddler and steward are provided
    if (this.riddler && this.steward) {
      this.riddler.requestRecognition({
        id: this.steward.id,
        type: this.steward.type,
        name: this.steward.name
      });
    }
  }

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing Temporal Edition Service...');
      // MonitoringService might not have initialize method in browser
      if ('initialize' in this.monitoringService && typeof this.monitoringService.initialize === 'function') {
        await this.monitoringService.initialize();
      }
      this.setupReportScheduling();
      this.isInitialized = true;
      logger.info('Temporal Edition Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Temporal Edition Service:', error);
      throw error;
    }
  }

  private setupReportScheduling(): void {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    this.reportSchedule = setInterval(() => {
      this.generateAndExportReports();
    }, 24 * 60 * 60 * 1000);
    setTimeout(() => {
      this.generateAndExportReports();
    }, timeUntilMidnight);
  }

  async generateAndExportReports(): Promise<TemporalData | void> {
    if (!this.riddler || !this.steward) {
      logger.warn('Riddler or steward not initialized');
      return;
    }
    if (!this.riddler.checkpoint(this.steward.id, 'generateAndExportReports')) {
      logger.warn('Riddler denied report generation for steward:', this.steward.id);
      return;
    }
    try {
      logger.info('Generating temporal reports...');
      const metrics = this.monitoringService.getMetrics ? 
        await this.monitoringService.getMetrics() : 
        { cpu: 0, memory: 0, cycleTime: 0 };
      const reportData = {
        timestamp: Date.now(),
        metrics,
        state: await this.getCurrentState()
      };
      await this.exportReports(reportData);
      logger.info('Reports generated and exported successfully');
      return reportData; // Return the data for App.tsx
    } catch (error) {
      logger.error('Failed to generate reports:', error);
      throw error;
    }
  }

  private async getCurrentState(): Promise<any> {
    return {};
  }

  private async exportReports(data: TemporalData): Promise<void> {
    if (!this.riddler || !this.steward) {
      logger.warn('Riddler or steward not initialized');
      return;
    }
    if (!this.riddler.checkpoint(this.steward.id, 'exportReports', data)) {
      logger.warn('Riddler denied report export for steward:', this.steward.id);
      return;
    }
    logger.info('Exporting reports...');
  }

  async shutdown(): Promise<void> {
    try {
      logger.info('Shutting down Temporal Edition Service...');
      if (this.reportSchedule) {
        clearInterval(this.reportSchedule);
      }
      await this.saveState();
      this.isInitialized = false;
      logger.info('Temporal Edition Service shut down successfully');
    } catch (error) {
      logger.error('Failed to shut down Temporal Edition Service:', error);
      throw error;
    }
  }

  private async saveState(): Promise<void> {
    logger.info('Saving final state...');
  }
} 