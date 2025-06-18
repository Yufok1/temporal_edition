export const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  wsUrl: process.env.REACT_APP_WS_URL,
  environment: 'production',
  debug: false,
  version: process.env.REACT_APP_VERSION,
  
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
    sessionTimeout: 15 * 60 * 1000, // 15 minutes
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds
    encryptionKey: process.env.REACT_APP_ENCRYPTION_KEY
  }
}; 