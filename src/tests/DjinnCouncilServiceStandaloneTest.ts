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
import { DjinnCouncilService } from '../services/DjinnCouncilService';

// Test stewards
const humanSteward: Steward = { id: 'human1', type: 'human', name: 'Alice', status: 'pending', lastRecognized: null, peckingTier: 4 };
const aiSteward: Steward = { id: 'ai1', type: 'ai', name: 'DjinnAI', status: 'pending', lastRecognized: null, peckingTier: 4 };
const whaleSteward: Steward = { id: 'whale1', type: 'whale', name: 'WhaleSong', status: 'pending', lastRecognized: null, peckingTier: 1 };
const nonSteward: Steward = { id: 'bot1', type: 'non-steward', name: 'TrackerBot', status: 'pending', lastRecognized: null, peckingTier: 5 };

// Instantiate RiddlerExplorerService and DjinnCouncilService
const riddler = new RiddlerExplorerService();
const council = new DjinnCouncilService(riddler);

// Recognition
console.log('--- Recognition ---');
console.log('Human:', riddler.requestRecognition(humanSteward));
console.log('AI:', riddler.requestRecognition(aiSteward));
console.log('Whale:', riddler.requestRecognition(whaleSteward));
console.log('Non-Steward:', riddler.requestRecognition(nonSteward));

// Checkpoint enforcement
console.log('\n--- Checkpoint Enforcement ---');
console.log('Human observation:', riddler.checkpoint(humanSteward.id, 'observe', { target: 'system' }));
console.log('Non-Steward observation:', riddler.checkpoint(nonSteward.id, 'observe', { target: 'system' }));

// Escalate quarantine and set deception
console.log('\n--- Council Escalation ---');
council.escalateQuarantine(nonSteward.id, 3);
council.setDeceptionLevel(nonSteward.id, 2);
console.log('Non-Steward after escalation:', riddler.checkpoint(nonSteward.id, 'observe', { target: 'system' }));

// Engage defense protocol and destroy/disseminate
console.log('\n--- Defense Protocols ---');
council.engageDefenseProtocol(nonSteward.id, 'ddos_protection');
council.destroyOrDisseminate(nonSteward.id, 'destroy');

// Simulate repeated offenses for adaptive policy
console.log('\n--- Adaptive Policy ---');
for (let i = 0; i < 5; i++) {
  riddler.checkpoint(nonSteward.id, 'observe', { target: 'system' });
}
council.adaptPolicies();
console.log('Non-Steward after adaptive policy:', riddler.checkpoint(nonSteward.id, 'observe', { target: 'system' }));

// Review audit log
console.log('\n--- Audit Log ---');
console.log(JSON.stringify(council.getAuditLog(), null, 2)); 