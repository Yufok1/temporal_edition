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

import { createClient } from 'redis';
import { Counter, Registry } from 'prom-client';
import { EmailQueueService } from '../../EmailQueueService';
import { EmailService } from '../../EmailService';
import { QueueMetricsService } from '../../QueueMetricsService';
import { RetryStrategyService } from '../../RetryStrategyService';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Redis client for integration tests
export const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Prometheus registry for integration tests
export const registry = new Registry();

// Test metrics
export const testCounter = new Counter({
    name: 'test_counter',
    help: 'Test counter for integration tests',
    registers: [registry]
});

// Helper function to create test services
export async function createTestServices() {
    const emailService = new EmailService({
        apiKey: process.env.SENDGRID_API_KEY || 'test-key',
        fromEmail: process.env.SENDGRID_FROM_EMAIL || 'test@example.com'
    });

    const metricsService = new QueueMetricsService();
    const retryStrategyService = new RetryStrategyService();

    const emailQueue = new EmailQueueService(
        emailService,
        metricsService,
        retryStrategyService,
        {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD
        }
    );

    return {
        emailService,
        metricsService,
        retryStrategyService,
        emailQueue
    };
}

// Helper function to clean up Redis
export async function cleanupRedis() {
    await redisClient.flushAll();
}

// Helper function to wait for Redis operations
export function waitForRedis(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to wait for Prometheus metrics
export async function waitForMetric(metricName: string, timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const metrics = await registry.getMetricsAsJSON();
        if (metrics.some(m => m.name === metricName)) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
} 