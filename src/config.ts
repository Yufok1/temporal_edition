import dotenv from 'dotenv';
import { NotificationPriority } from './notification_types';

// Load environment variables
dotenv.config();

export const config = {
    redis: {
        host: 'localhost',
        port: 6379,
        password: undefined,
        useMock: true, // Use mock Redis in development
    },
    sendgrid: {
        apiKey: 'mock-key',
        fromEmail: 'dev@whale-steward.local',
        useMock: true, // Use mock email service in development
    },
    app: {
        env: 'development',
        logLevel: 'info',
        port: 3000,
    },
    metrics: {
        prometheusPort: 9090,
        grafanaPort: 3000,
        useMock: true, // Use mock metrics in development
    },
    retry: {
        maxRetries: 3,
        baseDelay: 5000,
    },
    queue: {
        priorities: {
            [NotificationPriority.URGENT]: 1,
            [NotificationPriority.HIGH]: 2,
            [NotificationPriority.MEDIUM]: 3,
            [NotificationPriority.LOW]: 4,
        },
    },
    whale: {
        vocalRange: {
            min: 20,
            max: 20000,
        },
        harmonicComplexity: 0.75,
        emotionalSensitivity: 0.9,
        useMock: true, // Use mock whale interaction in development
    },
} as const;

// Skip validation in development mode
if (process.env.NODE_ENV === 'production') {
    const requiredEnvVars = ['SENDGRID_API_KEY', 'FROM_EMAIL'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }
} 