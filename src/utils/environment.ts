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