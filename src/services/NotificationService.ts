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

export interface Alert {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  details?: Record<string, any>;
}

export class NotificationService {
  private slackWebhookUrl: string;

  constructor() {
    this.slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';
    if (!this.slackWebhookUrl) {
      logger.warn('SLACK_WEBHOOK_URL not set - notifications will be logged only');
    }
  }

  async sendAlert(alert: Alert): Promise<void> {
    logger.info('Sending alert:', alert);

    if (this.slackWebhookUrl) {
      try {
        const response = await fetch(this.slackWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: `*${alert.severity.toUpperCase()}*: ${alert.message}`,
            attachments: alert.details ? [
              {
                color: this.getSeverityColor(alert.severity),
                fields: Object.entries(alert.details).map(([key, value]) => ({
                  title: key,
                  value: JSON.stringify(value),
                  short: true
                }))
              }
            ] : []
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to send Slack notification: ${response.statusText}`);
        }
      } catch (error) {
        logger.error('Error sending Slack notification:', error);
        // Don't throw - we still want to log the alert even if Slack fails
      }
    }
  }

  private getSeverityColor(severity: Alert['severity']): string {
    switch (severity) {
      case 'critical':
        return '#FF0000';
      case 'warning':
        return '#FFA500';
      case 'info':
        return '#00FF00';
      default:
        return '#808080';
    }
  }
} 