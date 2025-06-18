"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("./logger");
class RedisClient {
    constructor() {
        this.client = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });
        this.client.on('error', (error) => {
            logger_1.logger.error('Redis client error:', error);
        });
        this.client.on('connect', () => {
            logger_1.logger.info('Redis client connected');
        });
    }
    async set(key, value) {
        try {
            await this.client.set(key, value);
        }
        catch (error) {
            logger_1.logger.error(`Error setting Redis key ${key}:`, error);
            throw error;
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (error) {
            logger_1.logger.error(`Error getting Redis key ${key}:`, error);
            throw error;
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch (error) {
            logger_1.logger.error(`Error deleting Redis key ${key}:`, error);
            throw error;
        }
    }
    async close() {
        try {
            await this.client.quit();
        }
        catch (error) {
            logger_1.logger.error('Error closing Redis client:', error);
            throw error;
        }
    }
}
exports.RedisClient = RedisClient;
//# sourceMappingURL=redis.js.map