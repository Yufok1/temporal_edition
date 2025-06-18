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

import { Counter, Histogram, Gauge } from 'prom-client';
import Queue from 'bull';
import { NotificationPriority } from './notification_types';

export class QueueMetricsService {
    private readonly jobCompletedCounter: Counter;
    private readonly jobFailedCounter: Counter;
    private readonly jobProcessingTime: Histogram;
    private readonly queueSizeGauge: Gauge;
    private readonly retryCounter: Counter;
    private readonly errorCounter: Counter;

    constructor() {
        // Initialize Prometheus metrics
        this.jobCompletedCounter = new Counter({
            name: 'email_jobs_completed_total',
            help: 'Total number of completed email jobs',
            labelNames: ['priority']
        });

        this.jobFailedCounter = new Counter({
            name: 'email_jobs_failed_total',
            help: 'Total number of failed email jobs',
            labelNames: ['priority', 'error_type']
        });

        this.jobProcessingTime = new Histogram({
            name: 'email_job_processing_seconds',
            help: 'Time spent processing email jobs',
            labelNames: ['priority'],
            buckets: [0.1, 0.5, 1, 2, 5, 10, 30]
        });

        this.queueSizeGauge = new Gauge({
            name: 'email_queue_size',
            help: 'Current size of the email queue'
        });

        this.retryCounter = new Counter({
            name: 'email_job_retries_total',
            help: 'Total number of job retries',
            labelNames: ['priority']
        });

        this.errorCounter = new Counter({
            name: 'email_queue_errors_total',
            help: 'Total number of queue errors'
        });
    }

    recordJobCompleted(job: Queue.Job, processingTime: number): void {
        const priority = job.data.priority as NotificationPriority;
        this.jobCompletedCounter.inc({ priority });
        this.jobProcessingTime.observe({ priority }, processingTime / 1000); // Convert to seconds
    }

    recordJobFailed(job: Queue.Job, error: Error): void {
        const priority = job.data.priority as NotificationPriority;
        this.jobFailedCounter.inc({ 
            priority,
            error_type: error.name || 'UnknownError'
        });
    }

    recordJobAdded(priority: NotificationPriority): void {
        this.jobCompletedCounter.inc({ priority });
    }

    updateQueueSize(size: number): void {
        this.queueSizeGauge.set(size);
    }

    recordRetryAttempt(
        jobId: string,
        priority: NotificationPriority,
        delay: number,
        error: Error
    ): void {
        this.retryCounter.inc({ priority });
    }

    recordRetryExhausted(
        jobId: string,
        priority: NotificationPriority,
        error: Error
    ): void {
        this.jobFailedCounter.inc({
            priority,
            error_type: 'RetryExhausted'
        });
    }

    recordQueueError(error: Error): void {
        this.errorCounter.inc();
    }

    getMetrics(): string {
        return this.jobCompletedCounter.registry.metrics();
    }
} 