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

export interface FeatureFlags {
  whaleOperationsEnabled: boolean;
  auricleAIEnabled: boolean;
  cryptoSecuritiesEnabled: boolean;
  temporalEditioningEnabled: boolean;
  riddlerDashboardEnabled: boolean;
}

export const DEFAULT_FEATURES: FeatureFlags = {
  whaleOperationsEnabled: false, // Disabled by default for disassociation
  auricleAIEnabled: true,
  cryptoSecuritiesEnabled: true,
  temporalEditioningEnabled: true,
  riddlerDashboardEnabled: true,
};

export const getFeatureFlags = (): FeatureFlags => {
  // Allow environment variables to override defaults
  return {
    whaleOperationsEnabled: process.env.REACT_APP_WHALE_OPS_ENABLED === 'true' || DEFAULT_FEATURES.whaleOperationsEnabled,
    auricleAIEnabled: process.env.REACT_APP_AURICLE_AI_ENABLED !== 'false' && DEFAULT_FEATURES.auricleAIEnabled,
    cryptoSecuritiesEnabled: process.env.REACT_APP_CRYPTO_SECURITIES_ENABLED !== 'false' && DEFAULT_FEATURES.cryptoSecuritiesEnabled,
    temporalEditioningEnabled: process.env.REACT_APP_TEMPORAL_EDITING_ENABLED !== 'false' && DEFAULT_FEATURES.temporalEditioningEnabled,
    riddlerDashboardEnabled: process.env.REACT_APP_RIDDLER_DASHBOARD_ENABLED !== 'false' && DEFAULT_FEATURES.riddlerDashboardEnabled,
  };
};