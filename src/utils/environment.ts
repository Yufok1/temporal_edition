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

// Browser-safe environment utilities
export const isDevelopment = () => process.env.NODE_ENV !== 'production';
export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDebugMode = () => isDevelopment();

export const getApiUrl = () => process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const getWsUrl = () => process.env.REACT_APP_WS_URL || 'ws://localhost:3000';
export const getVersion = () => process.env.REACT_APP_VERSION || '1.0.0';

// Default audio configuration
export const getAudioConfig = () => ({
  sampleRate: 44100,
  bufferSize: 2048,
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  minDecibels: -100,
  maxDecibels: -10,
  minFrequency: 20,
  maxFrequency: 20000
});

// Default visualization configuration
export const getVisualizationConfig = () => ({
  barWidth: 2,
  barGap: 1,
  barColor: '#4CAF50',
  backgroundColor: '#1a1a2e',
  gridColor: 'rgba(255, 255, 255, 0.1)',
  gridLineWidth: 1,
  gridLineDash: [5, 5]
});

// Default security configuration
export const getSecurityConfig = () => ({
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  encryptionKey: process.env.REACT_APP_ENCRYPTION_KEY || 'default-dev-key'
});

export const log = (message: string, ...args: any[]) => {
  if (isDebugMode()) {
    console.log(`[${new Date().toISOString()}] ${message}`, ...args);
  }
};

export const error = (message: string, ...args: any[]) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`, ...args);
};

export const warn = (message: string, ...args: any[]) => {
  console.warn(`[${new Date().toISOString()}] WARNING: ${message}`, ...args);
}; 