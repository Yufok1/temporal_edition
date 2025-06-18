export enum NotificationPriority {
    URGENT = 'URGENT',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export interface EmailJobData {
    recipient: string;
    subject: string;
    text: string;
    html: string;
    metadata?: Record<string, any>;
    type: string;
    priority: NotificationPriority;
    retryCount?: number;
}

export interface EmailServiceConfig {
    apiKey: string;
    fromEmail: string;
}

export interface QueueMetrics {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
}

export interface RetryStrategy {
    shouldRetry: boolean;
    delay: number;
    maxRetries: number;
} 