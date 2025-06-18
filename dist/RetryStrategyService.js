"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryStrategyService = void 0;
const notification_types_1 = require("./notification_types");
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
class RetryStrategyService {
    constructor() {
        logger_1.default.info('RetryStrategyService initialized', {
            maxRetries: config_1.config.retry.maxRetries,
            baseDelay: config_1.config.retry.baseDelay
        });
    }
    calculateRetryDelay(jobId, priority, error) {
        const retryCount = parseInt(jobId.split('-')[1] || '0');
        if (retryCount >= config_1.config.retry.maxRetries) {
            logger_1.default.warn('Retry attempts exhausted', { jobId, priority, error });
            return {
                shouldRetry: false,
                delay: 0,
                maxRetries: config_1.config.retry.maxRetries
            };
        }
        const delay = this.calculateExponentialBackoff(retryCount, priority);
        logger_1.default.info('Calculated retry delay', { jobId, priority, retryCount, delay });
        return {
            shouldRetry: true,
            delay,
            maxRetries: config_1.config.retry.maxRetries
        };
    }
    calculateExponentialBackoff(retryCount, priority) {
        const priorityMultiplier = this.getPriorityMultiplier(priority);
        const exponentialDelay = config_1.config.retry.baseDelay * Math.pow(2, retryCount);
        return Math.min(exponentialDelay * priorityMultiplier, 300000); // Max 5 minutes
    }
    getPriorityMultiplier(priority) {
        switch (priority) {
            case notification_types_1.NotificationPriority.URGENT:
                return 0.5; // Faster retries for urgent
            case notification_types_1.NotificationPriority.HIGH:
                return 0.75;
            case notification_types_1.NotificationPriority.MEDIUM:
                return 1;
            case notification_types_1.NotificationPriority.LOW:
                return 1.5; // Slower retries for low priority
            default:
                return 1;
        }
    }
}
exports.RetryStrategyService = RetryStrategyService;
//# sourceMappingURL=RetryStrategyService.js.map