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

import Queue from 'bull';
import { NotificationPriority } from './notification_types';
import { metricsService } from './utils/metrics';

export class QueueMetricsService {
    // Browser-safe metrics storage
    private metrics = {
        jobsCompleted: new Map<string, number>(),
        jobsFailed: new Map<string, number>(),
        jobProcessingTimes: new Map<string, number[]>(),
        queueSize: 0,
        retries: new Map<string, number>(),
        errors: 0
    };

    constructor() {
        console.log('📊 Queue Metrics Service initialized (browser-safe)');
    }

    recordJobCompleted(job: Queue.Job, processingTime: number): void {
        const priority = job.data.priority as NotificationPriority;
        const key = `priority_${priority}`;
        
        // Update completion count
        const current = this.metrics.jobsCompleted.get(key) || 0;
        this.metrics.jobsCompleted.set(key, current + 1);
        
        // Record processing time
        if (!this.metrics.jobProcessingTimes.has(key)) {
            this.metrics.jobProcessingTimes.set(key, []);
        }
        const times = this.metrics.jobProcessingTimes.get(key)!;
        times.push(processingTime / 1000); // Convert to seconds
        
        // Keep only last 100 measurements
        if (times.length > 100) {
            times.shift();
        }
        
        // Update browser-safe metrics
        metricsService.recordCounter('email_jobs_completed', { priority });
        metricsService.recordHistogram('email_job_processing_seconds', processingTime / 1000, { priority });
    }

    recordJobFailed(job: Queue.Job, error: Error): void {
        const priority = job.data.priority as NotificationPriority;
        const errorType = error.name || 'UnknownError';
        const key = `${priority}_${errorType}`;
        
        const current = this.metrics.jobsFailed.get(key) || 0;
        this.metrics.jobsFailed.set(key, current + 1);
        
        metricsService.recordCounter('email_jobs_failed', { priority, error_type: errorType });
    }

    recordJobAdded(priority: NotificationPriority): void {
        // This seems to be a typo in the original - should probably not increment completed counter
        metricsService.recordCounter('email_jobs_added', { priority });
    }

    updateQueueSize(size: number): void {
        this.metrics.queueSize = size;
        metricsService.recordGauge('email_queue_size', size);
    }

    recordRetryAttempt(
        jobId: string,
        priority: NotificationPriority,
        delay: number,
        error: Error
    ): void {
        const key = `priority_${priority}`;
        const current = this.metrics.retries.get(key) || 0;
        this.metrics.retries.set(key, current + 1);
        
        metricsService.recordCounter('email_job_retries', { priority });
    }

    recordRetryExhausted(
        jobId: string,
        priority: NotificationPriority,
        error: Error
    ): void {
        const errorType = 'RetryExhausted';
        const key = `${priority}_${errorType}`;
        
        const current = this.metrics.jobsFailed.get(key) || 0;
        this.metrics.jobsFailed.set(key, current + 1);
        
        metricsService.recordCounter('email_jobs_failed', { priority, error_type: errorType });
    }

    recordQueueError(error: Error): void {
        this.metrics.errors++;
        metricsService.recordCounter('email_queue_errors');
    }

    getMetrics(): any {
        const processingStats = new Map<string, any>();
        
        this.metrics.jobProcessingTimes.forEach((times, priority) => {
            if (times.length > 0) {
                const avg = times.reduce((a, b) => a + b, 0) / times.length;
                const min = Math.min(...times);
                const max = Math.max(...times);
                processingStats.set(priority, { avg, min, max, count: times.length });
            }
        });
        
        return {
            jobsCompleted: Object.fromEntries(this.metrics.jobsCompleted),
            jobsFailed: Object.fromEntries(this.metrics.jobsFailed),
            processingStats: Object.fromEntries(processingStats),
            queueSize: this.metrics.queueSize,
            retries: Object.fromEntries(this.metrics.retries),
            totalErrors: this.metrics.errors
        };
    }
} 