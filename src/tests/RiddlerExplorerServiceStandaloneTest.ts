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

import { RiddlerExplorerService, Steward } from '../services/RiddlerExplorerService';
import { TemporalEditionService } from '../services/TemporalEditionService';
import { MonitoringService } from '../MonitoringService';
import { WhaleStewardSystem } from '../services/WhaleStewardSystem';

// Mock MonitoringService
class MockMonitoringService {
  async initialize() { return true; }
  async getSystemMetrics() { return { cpu: 0.5, memory: 0.5, cycleTime: 100 }; }
}

// Test stewards
const humanSteward: Steward = { id: 'human1', type: 'human', name: 'Alice', status: 'pending', lastRecognized: null, peckingTier: 4 };
const aiSteward: Steward = { id: 'ai1', type: 'ai', name: 'DjinnAI', status: 'pending', lastRecognized: null, peckingTier: 4 };
const whaleSteward: Steward = { id: 'whale1', type: 'whale', name: 'WhaleSong', status: 'pending', lastRecognized: null, peckingTier: 1 };

// Instantiate RiddlerExplorerService
const riddler = new RiddlerExplorerService();

// Test 1: Recognition
console.log('--- Recognition Tests ---');
console.log('Human:', riddler.requestRecognition(humanSteward)); // Should be approved
console.log('AI:', riddler.requestRecognition(aiSteward)); // Should be approved
console.log('Whale:', riddler.requestRecognition(whaleSteward)); // Should be denied

// Test 2: Checkpoint enforcement
console.log('\n--- Checkpoint Tests ---');
console.log('Human observation:', riddler.checkpoint(humanSteward.id, 'observe', { target: 'system' })); // true
console.log('AI control:', riddler.checkpoint(aiSteward.id, 'control', { command: 'start' })); // true
console.log('Whale observation:', riddler.checkpoint(whaleSteward.id, 'observe', { target: 'system' })); // false

// Test 3: Revocation
console.log('\n--- Revocation Test ---');
riddler.revokeRecognition(humanSteward.id);
console.log('Human after revocation:', riddler.checkpoint(humanSteward.id, 'observe', { target: 'system' })); // false

// Test 4: Integration with TemporalEditionService
console.log('\n--- TemporalEditionService Integration ---');
const monitoringService = new MockMonitoringService() as unknown as MonitoringService;
const temporalEditioner = new TemporalEditionService(monitoringService, riddler, aiSteward);
(async () => {
  await temporalEditioner.initialize();
  await temporalEditioner.generateAndExportReports(); // Should be allowed and logged
})();

// Test 5: Integration with WhaleStewardSystem
console.log('\n--- WhaleStewardSystem Integration ---');
const whaleSystem = new WhaleStewardSystem(riddler, aiSteward);
console.log('AI executeCommand:', whaleSystem.executeCommand('testCommand', { foo: 'bar' })); // true
console.log('AI requestData:', whaleSystem.requestData('metrics', { })); // {}
console.log('Whale executeCommand:', (new WhaleStewardSystem(riddler, whaleSteward)).executeCommand('testCommand', { foo: 'bar' })); // false

// Test 6: Audit Log Review
console.log('\n--- Audit Log ---');
console.log(JSON.stringify(riddler.getAuditLog(), null, 2)); 