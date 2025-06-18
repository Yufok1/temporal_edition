"use strict";
var _a;
exports.__esModule = true;
exports.config = void 0;
var dotenv_1 = require("dotenv");
var notification_types_1 = require("./notification_types");
// Load environment variables
dotenv_1["default"].config();
exports.config = {
    redis: {
        host: 'localhost',
        port: 6379,
        password: undefined,
        useMock: true
    },
    sendgrid: {
        apiKey: 'mock-key',
        fromEmail: 'dev@whale-steward.local',
        useMock: true
    },
    app: {
        env: 'development',
        logLevel: 'info',
        port: 3000
    },
    metrics: {
        prometheusPort: 9090,
        grafanaPort: 3000,
        useMock: true
    },
    retry: {
        maxRetries: 3,
        baseDelay: 5000
    },
    queue: {
        priorities: (_a = {},
            _a[notification_types_1.NotificationPriority.URGENT] = 1,
            _a[notification_types_1.NotificationPriority.HIGH] = 2,
            _a[notification_types_1.NotificationPriority.MEDIUM] = 3,
            _a[notification_types_1.NotificationPriority.LOW] = 4,
            _a)
    },
    whale: {
        vocalRange: {
            min: 20,
            max: 20000
        },
        harmonicComplexity: 0.75,
        emotionalSensitivity: 0.9,
        useMock: true
    }
};
// Skip validation in development mode
if (process.env.NODE_ENV === 'production') {
    var requiredEnvVars = ['SENDGRID_API_KEY', 'FROM_EMAIL'];
    var missingEnvVars = requiredEnvVars.filter(function (envVar) { return !process.env[envVar]; });
    if (missingEnvVars.length > 0) {
        throw new Error("Missing required environment variables: ".concat(missingEnvVars.join(', ')));
    }
}
