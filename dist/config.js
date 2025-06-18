"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const notification_types_1 = require("./notification_types");
// Load environment variables
dotenv_1.default.config();
exports.config = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
    },
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY || '',
        fromEmail: process.env.FROM_EMAIL || '',
    },
    app: {
        env: process.env.NODE_ENV || 'development',
        logLevel: process.env.LOG_LEVEL || 'info',
        port: parseInt(process.env.PORT || '3000'),
    },
    metrics: {
        prometheusPort: parseInt(process.env.PROMETHEUS_PORT || '9090'),
        grafanaPort: parseInt(process.env.GRAFANA_PORT || '3000'),
    },
    retry: {
        maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
        baseDelay: parseInt(process.env.BASE_RETRY_DELAY || '5000'),
    },
    queue: {
        priorities: {
            [notification_types_1.NotificationPriority.URGENT]: 1,
            [notification_types_1.NotificationPriority.HIGH]: 2,
            [notification_types_1.NotificationPriority.MEDIUM]: 3,
            [notification_types_1.NotificationPriority.LOW]: 4,
        },
    },
};
// Validate required configuration
const requiredEnvVars = ['SENDGRID_API_KEY', 'FROM_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}
//# sourceMappingURL=config.js.map