"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var RiddlerExplorerService_1 = require("../services/RiddlerExplorerService");
var TemporalEditionService_1 = require("../services/TemporalEditionService");
var WhaleStewardSystem_1 = require("../services/WhaleStewardSystem");
// Mock MonitoringService
var MockMonitoringService = /** @class */ (function () {
    function MockMonitoringService() {
    }
    MockMonitoringService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, true];
        }); });
    };
    MockMonitoringService.prototype.getSystemMetrics = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, { cpu: 0.5, memory: 0.5, cycleTime: 100 }];
        }); });
    };
    return MockMonitoringService;
}());
// Test stewards
var humanSteward = { id: 'human1', type: 'human', name: 'Alice', status: 'pending', lastRecognized: null };
var aiSteward = { id: 'ai1', type: 'ai', name: 'DjinnAI', status: 'pending', lastRecognized: null };
var whaleSteward = { id: 'whale1', type: 'whale', name: 'WhaleSong', status: 'pending', lastRecognized: null };
// Instantiate RiddlerExplorerService
var riddler = new RiddlerExplorerService_1.RiddlerExplorerService();
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
var monitoringService = new MockMonitoringService();
var temporalEditioner = new TemporalEditionService_1.TemporalEditionService(monitoringService, riddler, aiSteward);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, temporalEditioner.initialize()];
            case 1:
                _a.sent();
                return [4 /*yield*/, temporalEditioner.generateAndExportReports()];
            case 2:
                _a.sent(); // Should be allowed and logged
                return [2 /*return*/];
        }
    });
}); })();
// Test 5: Integration with WhaleStewardSystem
console.log('\n--- WhaleStewardSystem Integration ---');
var whaleSystem = new WhaleStewardSystem_1.WhaleStewardSystem(riddler, aiSteward);
console.log('AI executeCommand:', whaleSystem.executeCommand('testCommand', { foo: 'bar' })); // true
console.log('AI requestData:', whaleSystem.requestData('metrics', {})); // {}
console.log('Whale executeCommand:', (new WhaleStewardSystem_1.WhaleStewardSystem(riddler, whaleSteward)).executeCommand('testCommand', { foo: 'bar' })); // false
// Test 6: Audit Log Review
console.log('\n--- Audit Log ---');
console.log(JSON.stringify(riddler.getAuditLog(), null, 2));
