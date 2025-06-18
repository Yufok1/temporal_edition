"use strict";
exports.__esModule = true;
var RiddlerExplorerService_1 = require("../services/RiddlerExplorerService");
// Test steward (human)
var humanSteward = { id: 'human2', type: 'human', name: 'Bob', status: 'pending', lastRecognized: null };
// Instantiate RiddlerExplorerService
var riddler = new RiddlerExplorerService_1.RiddlerExplorerService();
// Recognition (should enter acclimatizing/training)
console.log('--- Recognition & Onboarding ---');
console.log('Recognition status:', riddler.requestRecognition(humanSteward));
// Simulate actions during training
console.log('\n--- Training Actions ---');
for (var i = 0; i < 3; i++) {
    var allowed = riddler.checkpoint(humanSteward.id, 'observe', { target: 'system', attempt: i + 1 });
    console.log("Training attempt ".concat(i + 1, ":"), allowed);
}
// Simulate actions during grace period
console.log('\n--- Grace Period Actions ---');
for (var i = 3; i < 5; i++) {
    var allowed = riddler.checkpoint(humanSteward.id, 'observe', { target: 'system', attempt: i + 1 });
    console.log("Grace attempt ".concat(i + 1, ":"), allowed);
}
// Simulate action that triggers escalation to quarantine
console.log('\n--- Escalation to Quarantine ---');
var escalated = riddler.checkpoint(humanSteward.id, 'observe', { target: 'system', attempt: 6 });
console.log('Escalation attempt 6:', escalated);
// Attempt action after quarantine
console.log('\n--- Post-Quarantine Action ---');
var postQuarantine = riddler.checkpoint(humanSteward.id, 'observe', { target: 'system', attempt: 7 });
console.log('Post-quarantine attempt 7:', postQuarantine);
// Review audit log
console.log('\n--- Audit Log ---');
console.log(JSON.stringify(riddler.getAuditLog(), null, 2));
