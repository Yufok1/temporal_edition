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

import { Registry, Counter, Gauge, Histogram } from 'prom-client';

const register = new Registry();

// Recursive Understanding Gradient (RUG) Metrics
export const rugMetrics = {
  currentDepth: new Gauge({
    name: 'rug_current_depth',
    help: 'Current recursion depth of the system',
    registers: [register],
  }),
  stabilityScore: new Gauge({
    name: 'rug_stability_score',
    help: 'Current stability score of the system (0-1)',
    registers: [register],
  }),
  acclimationProgress: new Gauge({
    name: 'rug_acclimation_progress',
    help: 'Progress of system acclimation (0-1)',
    registers: [register],
  }),
};

// User Interaction Comprehension Scaler (UICS) Metrics
export const uicsMetrics = {
  comprehensionLevel: new Gauge({
    name: 'uics_comprehension_level',
    help: 'Current comprehension level of user interactions (0-1)',
    registers: [register],
  }),
  adaptationRate: new Gauge({
    name: 'uics_adaptation_rate',
    help: 'Rate of adaptation to user interactions',
    registers: [register],
  }),
  interactionSuccess: new Counter({
    name: 'uics_interaction_success_total',
    help: 'Total number of successful user interactions',
    registers: [register],
  }),
};

// Recursive Escalation Boundaries (REB) Metrics
export const rebMetrics = {
  boundaryViolations: new Counter({
    name: 'reb_boundary_violations_total',
    help: 'Total number of recursive boundary violations',
    registers: [register],
  }),
  cooldownActive: new Gauge({
    name: 'reb_cooldown_active',
    help: 'Whether the system is in cooldown mode (0 or 1)',
    registers: [register],
  }),
  stabilityViolations: new Counter({
    name: 'reb_stability_violations_total',
    help: 'Total number of stability threshold violations',
    registers: [register],
  }),
};

// Recursive Safety Catch (RSC) Metrics
export const rscMetrics = {
  errorRate: new Gauge({
    name: 'rsc_error_rate',
    help: 'Current error rate of the system (0-1)',
    registers: [register],
  }),
  responseTime: new Histogram({
    name: 'rsc_response_time_seconds',
    help: 'Response time distribution in seconds',
    buckets: [0.1, 0.5, 1, 2, 5],
    registers: [register],
  }),
  autoRemediationCount: new Counter({
    name: 'rsc_auto_remediation_total',
    help: 'Total number of automatic remediation actions taken',
    registers: [register],
  }),
};

// System Health Metrics
export const healthMetrics = {
  cpuUsage: new Gauge({
    name: 'system_cpu_usage',
    help: 'CPU usage percentage',
    registers: [register],
  }),
  memoryUsage: new Gauge({
    name: 'system_memory_usage_bytes',
    help: 'Memory usage in bytes',
    registers: [register],
  }),
  uptime: new Gauge({
    name: 'system_uptime_seconds',
    help: 'System uptime in seconds',
    registers: [register],
  }),
};

export { register }; 