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

import { EmailQueueService } from './EmailQueueService';
import { EmailService } from './EmailService';
import { QueueMetricsService } from './QueueMetricsService';
import { RetryStrategyService } from './RetryStrategyService';
import { MonitoringService } from './MonitoringService';
import { config } from './config';
import logger from './logger';
import { NotificationPriority } from './notification_types';
import express, { Request, Response } from 'express';
import { register } from 'prom-client';
import { DjinnCouncilService } from './services/DjinnCouncilService';

class Application {
    private emailQueueService: EmailQueueService;
    private emailService: EmailService;
    private metricsService: QueueMetricsService;
    private retryStrategyService: RetryStrategyService;
    private monitoringService: MonitoringService;
    private app: express.Application;
    private djinnCouncil: DjinnCouncilService;

    constructor() {
        logger.info('Initializing application...');
        
        // Initialize services
        this.emailService = new EmailService();
        this.metricsService = new QueueMetricsService();
        this.retryStrategyService = new RetryStrategyService();
        this.monitoringService = new MonitoringService();
        this.djinnCouncil = new DjinnCouncilService();
        
        // Initialize queue service with dependencies
        this.emailQueueService = new EmailQueueService(
            this.emailService,
            this.metricsService,
            this.retryStrategyService
        );

        // Initialize Express app
        this.app = express();
        this.setupExpressRoutes();

        logger.info('Application initialized successfully');
    }

    private setupExpressRoutes(): void {
        // Health check endpoint
        this.app.get('/health', (req: Request, res: Response) => {
            const isHealthy = true; // Add your health check logic here
            // this.monitoringService.updateSystemHealth('api', isHealthy); // Method doesn't exist
            res.status(isHealthy ? 200 : 503).json({ status: isHealthy ? 'healthy' : 'unhealthy' });
        });

        // Metrics endpoint for Prometheus
        this.app.get('/metrics', async (req: Request, res: Response) => {
            try {
                const metrics = await register.metrics();
                res.set('Content-Type', register.contentType);
                res.end(metrics);
            } catch (error) {
                logger.error('Error getting metrics', { error });
                res.status(500).end();
            }
        });

        // Queue status endpoint
        this.app.get('/queue/status', async (req: Request, res: Response) => {
            try {
                const status = await this.emailQueueService.getQueueStatus();
                // this.monitoringService.updateQueueMetrics - Method doesn't exist
                res.json(status);
            } catch (error) {
                logger.error('Error getting queue status', { error });
                res.status(500).json({ error: 'Failed to get queue status' });
            }
        });

        // Metrics endpoint
        this.app.get('/metrics', async (req: Request, res: Response) => {
            try {
                const status = await this.djinnCouncil.getCouncilStatus();
                res.set('Content-Type', 'application/json');
                res.json(status.metrics);
            } catch (error) {
                logger.error('Error fetching metrics', { error });
                res.status(500).json({ error: 'Failed to fetch metrics' });
            }
        });

        // Component health endpoint
        this.app.get('/health/components', async (req: Request, res: Response) => {
            try {
                const status = await this.djinnCouncil.getCouncilStatus();
                res.json({ health: status.governanceHealth });
            } catch (error) {
                logger.error('Error fetching component health', { error });
                res.status(500).json({ error: 'Failed to fetch component health' });
            }
        });

        // Network latency endpoint
        this.app.get('/metrics/network', async (req: Request, res: Response) => {
            try {
                res.json({ latency: Math.random() * 100 + 10 }); // Demo data
            } catch (error) {
                logger.error('Error fetching network latency', { error });
                res.status(500).json({ error: 'Failed to fetch network latency' });
            }
        });

        // Data integrity endpoint
        this.app.get('/metrics/integrity', async (req: Request, res: Response) => {
            try {
                const status = await this.djinnCouncil.getCouncilStatus();
                res.json({ integrity: status.governanceHealth });
            } catch (error) {
                logger.error('Error fetching data integrity', { error });
                res.status(500).json({ error: 'Failed to fetch data integrity' });
            }
        });

        // Dependency health endpoint
        this.app.get('/health/dependencies', async (req: Request, res: Response) => {
            try {
                const status = await this.djinnCouncil.getCouncilStatus();
                res.json({ dependencies: { djinn_council: status.governanceHealth > 0.8 ? 'healthy' : 'degraded' } });
            } catch (error) {
                logger.error('Error fetching dependency health', { error });
                res.status(500).json({ error: 'Failed to fetch dependency health' });
            }
        });

        // Job processing stats endpoint
        this.app.get('/metrics/jobs', async (req: Request, res: Response) => {
            try {
                const status = await this.djinnCouncil.getCouncilStatus();
                res.json(status.metrics);
            } catch (error) {
                logger.error('Error fetching job processing stats', { error });
                res.status(500).json({ error: 'Failed to fetch job processing stats' });
            }
        });

        // Error distribution endpoint
        this.app.get('/metrics/errors', async (req: Request, res: Response) => {
            try {
                const status = await this.djinnCouncil.getCouncilStatus();
                res.json({ governanceViolations: status.metrics.governanceViolations });
            } catch (error) {
                logger.error('Error fetching error distribution', { error });
                res.status(500).json({ error: 'Failed to fetch error distribution' });
            }
        });

        // System status endpoint
        this.app.get('/status', async (req: Request, res: Response) => {
            try {
                const councilStatus = await this.djinnCouncil.getCouncilStatus();

                res.json({
                    components: { health: councilStatus.governanceHealth },
                    dependencies: { djinn_council: 'healthy' },
                    dataIntegrity: councilStatus.governanceHealth,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                logger.error('Error fetching system status', { error });
                res.status(500).json({ error: 'Failed to fetch system status' });
            }
        });
    }

    async start(): Promise<void> {
        try {
            // Start Express server
            const port = config.app.port || 3000;
            this.app.listen(port, () => {
                logger.info(`Server listening on port ${port}`);
            });

            // Example: Add a test email to the queue
            await this.emailQueueService.addToQueue({
                recipient: 'test@example.com',
                subject: 'Test Email',
                text: 'This is a test email',
                html: '<p>This is a test email</p>',
                priority: NotificationPriority.MEDIUM,
                type: 'test',
                metadata: {
                    source: 'test',
                    timestamp: new Date().toISOString()
                }
            });

            logger.info('Application started successfully');
        } catch (error) {
            logger.error('Failed to start application', { error });
            throw error;
        }
    }

    async stop(): Promise<void> {
        try {
            logger.info('Stopping application...');
            await this.emailQueueService.close();
            logger.info('Application stopped successfully');
        } catch (error) {
            logger.error('Error while stopping application', { error });
            throw error;
        }
    }
}

// Create and start the application
const app = new Application();

// Handle process termination
process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM signal');
    await app.stop();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('Received SIGINT signal');
    await app.stop();
    process.exit(0);
});

// Start the application
app.start().catch(error => {
    logger.error('Application failed to start', { error });
    process.exit(1);
}); 