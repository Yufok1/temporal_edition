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
import { Logger } from 'winston';
import { createLogger } from '../utils/logger';
import { SystemMetrics } from './TemporalSequencer';
import { EnvironmentalSignal } from '../types/whale';

// Unified interfaces for all monitoring types
interface UnifiedMetrics {
  temporal: SystemMetrics;
  environmental: EnvironmentalSignal;
  whale: {
    powerLevel: number;
    decisions: any[];
    alerts: any[];
  };
  system: {
    cpuUsage: number;
    memoryUsage: number;
    networkLatency: number;
    errorRate: number;
  };
}

interface MonitoringAlert {
  id: string;
  type: 'temporal' | 'environmental' | 'whale' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  source: string;
  data?: any;
}

interface MonitoringConfig {
  intervals: {
    temporal: number;
    environmental: number;
    whale: number;
    system: number;
  };
  thresholds: {
    temporal: { [key: string]: number };
    environmental: { [key: string]: number };
    whale: { [key: string]: number };
    system: { [key: string]: number };
  };
  alerting: {
    enabled: boolean;
    channels: string[];
    debounceTime: number;
  };
}

export class UnifiedMonitoringService extends EventEmitter {
  private logger: Logger;
  private config: MonitoringConfig;
  private metrics: Map<string, UnifiedMetrics> = new Map();
  private alerts: MonitoringAlert[] = [];
  private activeMonitors: Map<string, any> = new Map();
  private lastAlertTimes: Map<string, number> = new Map();

  constructor(config?: Partial<MonitoringConfig>) {
    super();
    this.logger = createLogger('UnifiedMonitoringService');
    this.config = this.mergeConfig(config);
    this.startMonitoring();
  }

  private mergeConfig(config?: Partial<MonitoringConfig>): MonitoringConfig {
    const defaultConfig: MonitoringConfig = {
      intervals: {
        temporal: 30000,      // 30 seconds
        environmental: 60000, // 1 minute
        whale: 15000,         // 15 seconds
        system: 10000         // 10 seconds
      },
      thresholds: {
        temporal: {
          stabilityIndex: 0.3,
          alignmentScore: 0.5,
          errorRate: 0.1
        },
        environmental: {
          temperature: 25.0,
          salinity: 40.0,
          pressure: 1013.25
        },
        whale: {
          powerLevel: 0.2,
          alertCount: 10
        },
        system: {
          cpuUsage: 80,
          memoryUsage: 85,
          networkLatency: 1000,
          errorRate: 0.05
        }
      },
      alerting: {
        enabled: true,
        channels: ['log', 'prometheus'],
        debounceTime: 300000  // 5 minutes
      }
    };

    return {
      intervals: { ...defaultConfig.intervals, ...config?.intervals },
      thresholds: {
        temporal: { ...defaultConfig.thresholds.temporal, ...config?.thresholds?.temporal },
        environmental: { ...defaultConfig.thresholds.environmental, ...config?.thresholds?.environmental },
        whale: { ...defaultConfig.thresholds.whale, ...config?.thresholds?.whale },
        system: { ...defaultConfig.thresholds.system, ...config?.thresholds?.system }
      },
      alerting: { ...defaultConfig.alerting, ...config?.alerting }
    };
  }

  private startMonitoring(): void {
    // Start temporal monitoring
    this.activeMonitors.set('temporal', setInterval(() => {
      this.collectTemporalMetrics();
    }, this.config.intervals.temporal) as any);

    // Start environmental monitoring
    this.activeMonitors.set('environmental', setInterval(() => {
      this.collectEnvironmentalMetrics();
    }, this.config.intervals.environmental) as any);

    // Start whale monitoring
    this.activeMonitors.set('whale', setInterval(() => {
      this.collectWhaleMetrics();
    }, this.config.intervals.whale) as any);

    // Start system monitoring
    this.activeMonitors.set('system', setInterval(() => {
      this.collectSystemMetrics();
    }, this.config.intervals.system) as any);

    this.logger.info('Unified monitoring started for all subsystems');
  }

  private async collectTemporalMetrics(): Promise<void> {
    try {
      // Collect temporal metrics (consolidated from TemporalMonitoringService)
      const temporalMetrics: SystemMetrics = {
        alignmentScore: Math.random(),
        stabilityIndex: Math.random(),
        performanceMetrics: {
          responseTime: Math.random() * 500,
          throughput: Math.random() * 1000,
          errorRate: Math.random() * 0.1
        },
        lastUpdated: new Date()
      };

      this.updateMetrics('temporal', { temporal: temporalMetrics });
      this.checkTemporalThresholds(temporalMetrics);
      
    } catch (error) {
      this.logger.error('Failed to collect temporal metrics', error);
    }
  }

  private async collectEnvironmentalMetrics(): Promise<void> {
    try {
      // Collect environmental metrics (consolidated from EnvironmentalMonitoringService)
      const environmentalMetrics: EnvironmentalSignal = {
        timestamp: new Date(),
        temperature: 15 + Math.random() * 10,
        salinity: 30 + Math.random() * 10,
        currentSpeed: Math.random() * 5,
        currentDirection: Math.random() * 360,
        depth: 100 + Math.random() * 900,
        oxygenLevel: 6 + Math.random() * 4
      };

      this.updateMetrics('environmental', { environmental: environmentalMetrics });
      this.checkEnvironmentalThresholds(environmentalMetrics);
      
    } catch (error) {
      this.logger.error('Failed to collect environmental metrics', error);
    }
  }

  private async collectWhaleMetrics(): Promise<void> {
    try {
      // Collect whale metrics (consolidated from WhaleSupremeMonitoring)
      const whaleMetrics = {
        powerLevel: Math.random(),
        decisions: [],
        alerts: []
      };

      this.updateMetrics('whale', { whale: whaleMetrics });
      this.checkWhaleThresholds(whaleMetrics);
      
    } catch (error) {
      this.logger.error('Failed to collect whale metrics', error);
    }
  }

  private async collectSystemMetrics(): Promise<void> {
    try {
      // Collect system metrics (consolidated from MonitoringService)
      const systemMetrics = {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        networkLatency: Math.random() * 2000,
        errorRate: Math.random() * 0.1
      };

      this.updateMetrics('system', { system: systemMetrics });
      this.checkSystemThresholds(systemMetrics);
      
    } catch (error) {
      this.logger.error('Failed to collect system metrics', error);
    }
  }

  private updateMetrics(source: string, partialMetrics: Partial<UnifiedMetrics>): void {
    const existing = this.metrics.get(source) || {} as UnifiedMetrics;
    const updated = { ...existing, ...partialMetrics };
    this.metrics.set(source, updated);
    this.emit('metricsUpdated', source, updated);
  }

  private checkTemporalThresholds(metrics: SystemMetrics): void {
    const thresholds = this.config.thresholds.temporal;
    
    if (metrics.stabilityIndex < thresholds.stabilityIndex) {
      this.createAlert('temporal', 'high', 'Low stability index detected', 'temporal-stability', { 
        value: metrics.stabilityIndex, 
        threshold: thresholds.stabilityIndex 
      });
    }

    if (metrics.alignmentScore < thresholds.alignmentScore) {
      this.createAlert('temporal', 'medium', 'Low alignment score detected', 'temporal-alignment', {
        value: metrics.alignmentScore,
        threshold: thresholds.alignmentScore
      });
    }
  }

  private checkEnvironmentalThresholds(metrics: EnvironmentalSignal): void {
    const thresholds = this.config.thresholds.environmental;
    
    if (Math.abs(metrics.temperature - thresholds.temperature) > 5) {
      this.createAlert('environmental', 'medium', 'Temperature anomaly detected', 'env-temperature', {
        value: metrics.temperature,
        threshold: thresholds.temperature
      });
    }

    if (Math.abs(metrics.salinity - thresholds.salinity) > 5) {
      this.createAlert('environmental', 'medium', 'Salinity anomaly detected', 'env-salinity', {
        value: metrics.salinity,
        threshold: thresholds.salinity
      });
    }
  }

  private checkWhaleThresholds(metrics: any): void {
    const thresholds = this.config.thresholds.whale;
    
    if (metrics.powerLevel < thresholds.powerLevel) {
      this.createAlert('whale', 'high', 'Low whale power level detected', 'whale-power', {
        value: metrics.powerLevel,
        threshold: thresholds.powerLevel
      });
    }
  }

  private checkSystemThresholds(metrics: any): void {
    const thresholds = this.config.thresholds.system;
    
    if (metrics.cpuUsage > thresholds.cpuUsage) {
      this.createAlert('system', 'high', 'High CPU usage detected', 'sys-cpu', {
        value: metrics.cpuUsage,
        threshold: thresholds.cpuUsage
      });
    }

    if (metrics.memoryUsage > thresholds.memoryUsage) {
      this.createAlert('system', 'high', 'High memory usage detected', 'sys-memory', {
        value: metrics.memoryUsage,
        threshold: thresholds.memoryUsage
      });
    }
  }

  private createAlert(
    type: MonitoringAlert['type'],
    severity: MonitoringAlert['severity'],
    message: string,
    source: string,
    data?: any
  ): void {
    const alertKey = `${type}-${source}`;
    const now = Date.now();
    const lastAlert = this.lastAlertTimes.get(alertKey) || 0;

    // Debounce alerts
    if (now - lastAlert < this.config.alerting.debounceTime) {
      return;
    }

    const alert: MonitoringAlert = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      source,
      data
    };

    this.alerts.push(alert);
    this.lastAlertTimes.set(alertKey, now);
    
    // Limit alert history
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    this.emit('alert', alert);
    this.logger.warn(`Alert: ${message}`, { type, severity, source, data });
  }

  // Public API methods
  public getMetrics(source?: string): UnifiedMetrics | Map<string, UnifiedMetrics> {
    if (source) {
      return this.metrics.get(source) || {} as UnifiedMetrics;
    }
    return this.metrics;
  }

  public getAlerts(type?: MonitoringAlert['type']): MonitoringAlert[] {
    if (type) {
      return this.alerts.filter(alert => alert.type === type);
    }
    return [...this.alerts];
  }

  public updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = this.mergeConfig(config);
    this.logger.info('Monitoring configuration updated');
  }

  public stop(): void {
    this.activeMonitors.forEach((interval, key) => {
      clearInterval(interval as any);
      this.logger.info(`Stopped ${key} monitoring`);
    });
    this.activeMonitors.clear();
  }

  public restart(): void {
    this.stop();
    this.startMonitoring();
  }
}