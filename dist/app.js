"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailQueueService_1 = require("./EmailQueueService");
const EmailService_1 = require("./EmailService");
const QueueMetricsService_1 = require("./QueueMetricsService");
const RetryStrategyService_1 = require("./RetryStrategyService");
const MonitoringService_1 = require("./MonitoringService");
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
const notification_types_1 = require("./notification_types");
const express_1 = __importDefault(require("express"));
const prom_client_1 = require("prom-client");
const DjinnCouncilService_1 = require("./DjinnCouncilService");
class Application {
    constructor() {
        logger_1.default.info('Initializing application...');
        // Initialize services
        this.emailService = new EmailService_1.EmailService();
        this.metricsService = new QueueMetricsService_1.QueueMetricsService();
        this.retryStrategyService = new RetryStrategyService_1.RetryStrategyService();
        this.monitoringService = new MonitoringService_1.MonitoringService();
        this.djinnCouncil = new DjinnCouncilService_1.DjinnCouncilService();
        // Initialize queue service with dependencies
        this.emailQueueService = new EmailQueueService_1.EmailQueueService(this.emailService, this.metricsService, this.retryStrategyService);
        // Initialize Express app
        this.app = (0, express_1.default)();
        this.setupExpressRoutes();
        logger_1.default.info('Application initialized successfully');
    }
    setupExpressRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            const isHealthy = true; // Add your health check logic here
            this.monitoringService.updateSystemHealth('api', isHealthy);
            res.status(isHealthy ? 200 : 503).json({ status: isHealthy ? 'healthy' : 'unhealthy' });
        });
        // Metrics endpoint for Prometheus
        this.app.get('/metrics', async (req, res) => {
            try {
                const metrics = await prom_client_1.register.metrics();
                res.set('Content-Type', prom_client_1.register.contentType);
                res.end(metrics);
            }
            catch (error) {
                logger_1.default.error('Error getting metrics', { error });
                res.status(500).end();
            }
        });
        // Queue status endpoint
        this.app.get('/queue/status', async (req, res) => {
            try {
                const status = await this.emailQueueService.getQueueStatus();
                this.monitoringService.updateQueueMetrics({
                    size: status.waiting + status.active,
                    processingTime: 0,
                    errorRate: status.failed / (status.completed + status.failed),
                    retryRate: 0 // Calculate from metrics
                });
                res.json(status);
            }
            catch (error) {
                logger_1.default.error('Error getting queue status', { error });
                res.status(500).json({ error: 'Failed to get queue status' });
            }
        });
        // Metrics endpoint
        this.app.get('/metrics', async (req, res) => {
            try {
                const metrics = await this.djinnCouncil.getMetrics();
                res.set('Content-Type', 'text/plain');
                res.send(metrics);
            }
            catch (error) {
                logger_1.default.error('Error fetching metrics', { error });
                res.status(500).json({ error: 'Failed to fetch metrics' });
            }
        });
        // Component health endpoint
        this.app.get('/health/components', async (req, res) => {
            try {
                const health = await this.djinnCouncil.getComponentHealth();
                res.json(health);
            }
            catch (error) {
                logger_1.default.error('Error fetching component health', { error });
                res.status(500).json({ error: 'Failed to fetch component health' });
            }
        });
        // Network latency endpoint
        this.app.get('/metrics/network', async (req, res) => {
            try {
                const latency = await this.djinnCouncil.getNetworkLatency();
                res.json(latency);
            }
            catch (error) {
                logger_1.default.error('Error fetching network latency', { error });
                res.status(500).json({ error: 'Failed to fetch network latency' });
            }
        });
        // Data integrity endpoint
        this.app.get('/metrics/integrity', async (req, res) => {
            try {
                const integrity = await this.djinnCouncil.getDataIntegrity();
                res.json(integrity);
            }
            catch (error) {
                logger_1.default.error('Error fetching data integrity', { error });
                res.status(500).json({ error: 'Failed to fetch data integrity' });
            }
        });
        // Dependency health endpoint
        this.app.get('/health/dependencies', async (req, res) => {
            try {
                const dependencies = await this.djinnCouncil.getDependencyHealth();
                res.json(dependencies);
            }
            catch (error) {
                logger_1.default.error('Error fetching dependency health', { error });
                res.status(500).json({ error: 'Failed to fetch dependency health' });
            }
        });
        // Job processing stats endpoint
        this.app.get('/metrics/jobs', async (req, res) => {
            try {
                const stats = await this.djinnCouncil.getJobProcessingStats();
                res.json(stats);
            }
            catch (error) {
                logger_1.default.error('Error fetching job processing stats', { error });
                res.status(500).json({ error: 'Failed to fetch job processing stats' });
            }
        });
        // Error distribution endpoint
        this.app.get('/metrics/errors', async (req, res) => {
            try {
                const errors = await this.djinnCouncil.getErrorDistribution();
                res.json(errors);
            }
            catch (error) {
                logger_1.default.error('Error fetching error distribution', { error });
                res.status(500).json({ error: 'Failed to fetch error distribution' });
            }
        });
        // System status endpoint
        this.app.get('/status', async (req, res) => {
            try {
                const [componentHealth, dependencyHealth, dataIntegrity] = await Promise.all([
                    this.djinnCouncil.getComponentHealth(),
                    this.djinnCouncil.getDependencyHealth(),
                    this.djinnCouncil.getDataIntegrity()
                ]);
                res.json({
                    components: componentHealth,
                    dependencies: dependencyHealth,
                    dataIntegrity: dataIntegrity,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                logger_1.default.error('Error fetching system status', { error });
                res.status(500).json({ error: 'Failed to fetch system status' });
            }
        });
    }
    async start() {
        try {
            // Start Express server
            const port = config_1.config.app.port || 3000;
            this.app.listen(port, () => {
                logger_1.default.info(`Server listening on port ${port}`);
            });
            // Example: Add a test email to the queue
            await this.emailQueueService.addToQueue({
                recipient: 'test@example.com',
                subject: 'Test Email',
                text: 'This is a test email',
                html: '<p>This is a test email</p>',
                priority: notification_types_1.NotificationPriority.MEDIUM,
                type: 'test',
                metadata: {
                    source: 'test',
                    timestamp: new Date().toISOString()
                }
            });
            logger_1.default.info('Application started successfully');
        }
        catch (error) {
            logger_1.default.error('Failed to start application', { error });
            throw error;
        }
    }
    async stop() {
        try {
            logger_1.default.info('Stopping application...');
            await this.emailQueueService.close();
            logger_1.default.info('Application stopped successfully');
        }
        catch (error) {
            logger_1.default.error('Error while stopping application', { error });
            throw error;
        }
    }
}
// Create and start the application
const app = new Application();
// Handle process termination
process.on('SIGTERM', async () => {
    logger_1.default.info('Received SIGTERM signal');
    await app.stop();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.default.info('Received SIGINT signal');
    await app.stop();
    process.exit(0);
});
// Start the application
app.start().catch(error => {
    logger_1.default.error('Application failed to start', { error });
    process.exit(1);
});
//# sourceMappingURL=app.js.map