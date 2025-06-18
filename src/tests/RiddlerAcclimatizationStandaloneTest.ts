import { RiddlerExplorerService, Steward } from '../services/RiddlerExplorerService';

// Test steward (human)
const humanSteward: Steward = { id: 'human2', type: 'human', name: 'Bob', status: 'pending', lastRecognized: null };

// Instantiate RiddlerExplorerService
const riddler = new RiddlerExplorerService();

// Recognition (should enter acclimatizing/training)
console.log('--- Recognition & Onboarding ---');
console.log('Recognition status:', riddler.requestRecognition(humanSteward));

// Simulate actions during training
console.log('\n--- Training Actions ---');
for (let i = 0; i < 3; i++) {
  const allowed = riddler.checkpoint(humanSteward.id, 'observe', { target: 'system', attempt: i+1 });
  console.log(`Training attempt ${i+1}:`, allowed);
}

// Simulate actions during grace period
console.log('\n--- Grace Period Actions ---');
for (let i = 3; i < 5; i++) {
  const allowed = riddler.checkpoint(humanSteward.id, 'observe', { target: 'system', attempt: i+1 });
  console.log(`Grace attempt ${i+1}:`, allowed);
}

// Simulate action that triggers escalation to quarantine
console.log('\n--- Escalation to Quarantine ---');
const escalated = riddler.checkpoint(humanSteward.id, 'observe', { target: 'system', attempt: 6 });
console.log('Escalation attempt 6:', escalated);

// Attempt action after quarantine
console.log('\n--- Post-Quarantine Action ---');
const postQuarantine = riddler.checkpoint(humanSteward.id, 'observe', { target: 'system', attempt: 7 });
console.log('Post-quarantine attempt 7:', postQuarantine);

// Review audit log
console.log('\n--- Audit Log ---');
console.log(JSON.stringify(riddler.getAuditLog(), null, 2)); 