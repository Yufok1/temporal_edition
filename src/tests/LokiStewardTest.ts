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