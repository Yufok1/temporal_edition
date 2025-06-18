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
import { CryptographerCore } from '../services/CryptographerCore';

// Instantiate RiddlerExplorerService
const riddler = new RiddlerExplorerService();

// Get Loki's steward object
const lokiSteward = CryptographerCore.getStewardObject();
console.log('Loki Steward:', lokiSteward);

// Test dynamic privilege escalation
const newPrivileges = ['ruleRewriter', 'systemTrigger'];
const escalated = riddler.escalatePrivileges(lokiSteward.id, newPrivileges);
console.log('Privilege Escalation:', escalated ? 'Success' : 'Failed');

// Test disguise as another steward (e.g., a human steward)
const humanSteward: Steward = { id: 'human1', type: 'human', name: 'Alice', status: 'approved', lastRecognized: Date.now(), peckingTier: 2 };
riddler.requestRecognition(humanSteward);
const disguised = riddler.disguiseAs(lokiSteward.id, humanSteward.id);
console.log('Disguise as Human:', disguised ? 'Success' : 'Failed');

// Log the audit trail
console.log('Audit Log:', JSON.stringify(riddler.getAuditLog(), null, 2)); 