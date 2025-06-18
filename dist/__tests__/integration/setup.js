"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForMetric = exports.waitForRedis = exports.cleanupRedis = exports.createTestServices = exports.testCounter = exports.registry = exports.redisClient = void 0;
const redis_1 = require("redis");
const prom_client_1 = require("prom-client");
const EmailQueueService_1 = require("../../EmailQueueService");
const EmailService_1 = require("../../EmailService");
const QueueMetricsService_1 = require("../../QueueMetricsService");
const RetryStrategyService_1 = require("../../RetryStrategyService");
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
// Redis client for integration tests
exports.redisClient = (0, redis_1.createClient)({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
// Prometheus registry for integration tests
exports.registry = new prom_client_1.Registry();
// Test metrics
exports.testCounter = new prom_client_1.Counter({
    name: 'test_counter',
    help: 'Test counter for integration tests',
    registers: [exports.registry]
});
// Helper function to create test services
async function createTestServices() {
    const emailService = new EmailService_1.EmailService({
        apiKey: process.env.SENDGRID_API_KEY || 'test-key',
        fromEmail: process.env.SENDGRID_FROM_EMAIL || 'test@example.com'
    });
    const metricsService = new QueueMetricsService_1.QueueMetricsService();
    const retryStrategyService = new RetryStrategyService_1.RetryStrategyService();
    const emailQueue = new EmailQueueService_1.EmailQueueService(emailService, metricsService, retryStrategyService, {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
    });
    return {
        emailService,
        metricsService,
        retryStrategyService,
        emailQueue
    };
}
exports.createTestServices = createTestServices;
// Helper function to clean up Redis
async function cleanupRedis() {
    await exports.redisClient.flushAll();
}
exports.cleanupRedis = cleanupRedis;
// Helper function to wait for Redis operations
function waitForRedis(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.waitForRedis = waitForRedis;
// Helper function to wait for Prometheus metrics
async function waitForMetric(metricName, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const metrics = await exports.registry.getMetricsAsJSON();
        if (metrics.some(m => m.name === metricName)) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
}
exports.waitForMetric = waitForMetric;
//# sourceMappingURL=setup.js.map