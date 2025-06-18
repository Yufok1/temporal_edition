import dotenv from 'dotenv';
import { config } from '../config';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set default test environment variables if not set
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';
process.env.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'test-key';
process.env.SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'test@example.com';
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests 

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001'; // Use a different port for testing

// Mock logger to prevent console output during tests
jest.mock('../utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    },
}));

// Global test timeout
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
    // Add any cleanup code here
}); 