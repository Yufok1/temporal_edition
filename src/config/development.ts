export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:3000',
  environment: process.env.REACT_APP_ENV || 'development',
  debug: process.env.REACT_APP_DEBUG === 'true',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Audio processing settings
  audio: {
    sampleRate: 44100,
    bufferSize: 2048,
    fftSize: 2048,
    smoothingTimeConstant: 0.8,
    minDecibels: -100,
    maxDecibels: -10,
    minFrequency: 20,
    maxFrequency: 20000
  },
  
  // Visualization settings
  visualization: {
    barWidth: 2,
    barGap: 1,
    barColor: '#4CAF50',
    backgroundColor: '#1a1a2e',
    gridColor: 'rgba(255, 255, 255, 0.1)',
    gridLineWidth: 1,
    gridLineDash: [5, 5]
  },
  
  // Security settings
  security: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    encryptionKey: process.env.REACT_APP_ENCRYPTION_KEY || 'default-dev-key'
  }
}; 