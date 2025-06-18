import config from '../config';

export const isDevelopment = () => config.environment === 'development';
export const isProduction = () => config.environment === 'production';
export const isDebugEnabled = () => config.debug;

export const getApiUrl = () => config.apiUrl;
export const getWsUrl = () => config.wsUrl;
export const getVersion = () => config.version;

export const getAudioConfig = () => config.audio;
export const getVisualizationConfig = () => config.visualization;
export const getSecurityConfig = () => config.security;

export const log = (message: string, ...args: any[]) => {
  if (isDebugEnabled()) {
    console.log(`[${new Date().toISOString()}] ${message}`, ...args);
  }
};

export const error = (message: string, ...args: any[]) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`, ...args);
};

export const warn = (message: string, ...args: any[]) => {
  console.warn(`[${new Date().toISOString()}] WARNING: ${message}`, ...args);
}; 