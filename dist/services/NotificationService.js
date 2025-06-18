"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const logger_1 = require("../utils/logger");
class NotificationService {
    constructor() {
        this.slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';
        if (!this.slackWebhookUrl) {
            logger_1.logger.warn('SLACK_WEBHOOK_URL not set - notifications will be logged only');
        }
    }
    async sendAlert(alert) {
        logger_1.logger.info('Sending alert:', alert);
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
            }
            catch (error) {
                logger_1.logger.error('Error sending Slack notification:', error);
                // Don't throw - we still want to log the alert even if Slack fails
            }
        }
    }
    getSeverityColor(severity) {
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
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map