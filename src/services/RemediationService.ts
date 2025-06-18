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

import { logger } from '../utils/logger';
import { metricsService } from '../utils/metrics';
import { RedisClient } from '../utils/redis';
import { NotificationService } from './NotificationService';

export interface RemediationAction {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  condition: string;
  action: () => Promise<void>;
  cooldown: number; // milliseconds
}

export class RemediationService {
  private lastActionTime: Map<string, number> = new Map();
  private actions: RemediationAction[] = [];

  constructor(
    private redisClient: RedisClient,
    private notificationService: NotificationService
  ) {
    this.initializeActions();
  }

  private initializeActions() {
    this.actions = [
      {
        type: 'queue_backlog',
        severity: 'critical',
        condition: 'queue_backlog_size > 1000',
        action: async () => {
          logger.info('Executing queue backlog remediation');
          // Scale up processing capacity
          await this.redisClient.set('queue_processing_capacity', '2x');
          await this.notificationService.sendAlert({
            severity: 'critical',
            message: 'Queue backlog detected - scaling up processing capacity',
            details: { action: 'scale_up' }
          });
        },
        cooldown: 5 * 60 * 1000 // 5 minutes
      },
      {
        type: 'high_latency',
        severity: 'warning',
        condition: 'network_latency > 500',
        action: async () => {
          logger.info('Executing high latency remediation');
          // Implement circuit breaker
          await this.redisClient.set('circuit_breaker', 'enabled');
          await this.notificationService.sendAlert({
            severity: 'warning',
            message: 'High latency detected - enabling circuit breaker',
            details: { action: 'circuit_breaker' }
          });
        },
        cooldown: 2 * 60 * 1000 // 2 minutes
      },
      {
        type: 'memory_pressure',
        severity: 'critical',
        condition: 'memory_usage > 0.9',
        action: async () => {
          logger.info('Executing memory pressure remediation');
          // Trigger garbage collection
          if (global.gc) {
            global.gc();
          }
          await this.notificationService.sendAlert({
            severity: 'critical',
            message: 'High memory usage detected - triggering garbage collection',
            details: { action: 'gc' }
          });
        },
        cooldown: 10 * 60 * 1000 // 10 minutes
      },
      {
        type: 'alignment_drift',
        severity: 'warning',
        condition: 'solar_alignment_score < 0.7',
        action: async () => {
          logger.info('Executing alignment drift remediation');
          // Recalibrate alignment
          await this.redisClient.set('alignment_recalibration', 'in_progress');
          await this.notificationService.sendAlert({
            severity: 'warning',
            message: 'Alignment drift detected - initiating recalibration',
            details: { action: 'recalibrate' }
          });
        },
        cooldown: 15 * 60 * 1000 // 15 minutes
      }
    ];
  }

  async handleAlert(alert: { type: string; severity: string; condition: string }) {
    const matchingAction = this.actions.find(a => a.type === alert.type);
    if (!matchingAction) {
      logger.warn(`No remediation action found for alert type: ${alert.type}`);
      return;
    }

    const lastAction = this.lastActionTime.get(alert.type) || 0;
    const now = Date.now();
    if (now - lastAction < matchingAction.cooldown) {
      logger.info(`Skipping remediation for ${alert.type} due to cooldown`);
      return;
    }

    try {
      await matchingAction.action();
      this.lastActionTime.set(alert.type, now);
      metricsService.incrementRemediationCount('system', alert.type);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Remediation action failed for ${alert.type}:`, errorMessage);
      await this.notificationService.sendAlert({
        severity: 'critical',
        message: `Remediation action failed for ${alert.type}`,
        details: { error: errorMessage }
      });
    }
  }

  async getRemediationStatus(): Promise<Record<string, any>> {
    const status: Record<string, any> = {};
    for (const action of this.actions) {
      const lastAction = this.lastActionTime.get(action.type) || 0;
      const now = Date.now();
      const timeSinceLastAction = now - lastAction;
      const isInCooldown = timeSinceLastAction < action.cooldown;

      status[action.type] = {
        severity: action.severity,
        lastAction: lastAction ? new Date(lastAction).toISOString() : null,
        timeSinceLastAction,
        isInCooldown,
        cooldownRemaining: isInCooldown ? action.cooldown - timeSinceLastAction : 0
      };
    }
    return status;
  }
} 