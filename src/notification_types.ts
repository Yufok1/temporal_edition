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