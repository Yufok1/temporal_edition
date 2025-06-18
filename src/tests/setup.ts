/// <reference types="jest" />

// Increase timeout for tests that involve async operations
jest.setTimeout(10000);

// Mock console methods to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}; 