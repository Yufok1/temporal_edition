"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const SystemOrchestrator_1 = require("./services/SystemOrchestrator");
const logger_1 = require("./utils/logger");
const metrics_1 = require("./utils/metrics");
const app = (0, express_1.default)();
const logger = (0, logger_1.createLogger)('Server');
const orchestrator = new SystemOrchestrator_1.SystemOrchestrator();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100 // limit each IP to 100 requests per windowMs
}));
// Metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        const metrics = await metrics_1.metricsService.getMetrics();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
    }
    catch (error) {
        logger.error('Error getting metrics:', error);
        res.status(500).json({ error: 'Failed to get metrics' });
    }
});
// System Registration
app.post('/systems', (req, res) => {
    try {
        const { systemId, initialStage, analysisConfig } = req.body;
        if (!systemId || !initialStage) {
            return res.status(400).json({ error: 'systemId and initialStage are required' });
        }
        orchestrator.registerSystem({
            systemId,
            initialStage: initialStage,
            analysisConfig
        });
        // Register system metrics
        metrics_1.metricsService.registerSystem(systemId);
        res.status(201).json({ message: `System ${systemId} registered successfully` });
    }
    catch (error) {
        logger.error('Error registering system:', error);
        res.status(500).json({ error: 'Failed to register system' });
    }
});
// Update System Metrics
app.post('/systems/:systemId/metrics', (req, res) => {
    try {
        const { systemId } = req.params;
        const metrics = req.body;
        orchestrator.updateSystemMetrics(systemId, metrics);
        metrics_1.metricsService.updateSystemMetrics(systemId, metrics);
        res.json({ message: 'Metrics updated successfully' });
    }
    catch (error) {
        logger.error('Error updating metrics:', error);
        res.status(500).json({ error: 'Failed to update metrics' });
    }
});
// Get System Status
app.get('/systems/:systemId/status', (req, res) => {
    try {
        const { systemId } = req.params;
        const status = orchestrator.getSystemStatus(systemId);
        res.json(status);
    }
    catch (error) {
        logger.error('Error getting system status:', error);
        res.status(500).json({ error: 'Failed to get system status' });
    }
});
// Get System History
app.get('/systems/:systemId/history', (req, res) => {
    try {
        const { systemId } = req.params;
        const history = orchestrator.getSystemHistory(systemId);
        res.json(history);
    }
    catch (error) {
        logger.error('Error getting system history:', error);
        res.status(500).json({ error: 'Failed to get system history' });
    }
});
// Request Resource Access
app.post('/systems/:systemId/access/:resourceId', (req, res) => {
    try {
        const { systemId, resourceId } = req.params;
        const accessRequest = orchestrator.requestResourceAccess(systemId, resourceId);
        res.json(accessRequest);
    }
    catch (error) {
        logger.error('Error requesting resource access:', error);
        res.status(500).json({ error: 'Failed to request resource access' });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map