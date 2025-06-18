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

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.RiddlerExplorerService = void 0;
var events_1 = require("events");
var RiddlerExplorerService = /** @class */ (function (_super) {
    __extends(RiddlerExplorerService, _super);
    function RiddlerExplorerService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stewards = new Map();
        _this.auditLog = [];
        _this.rateLimitWindow = 10000; // 10 seconds
        _this.maxActionsPerWindow = 5;
        _this.acclimatizationThreshold = 3;
        _this.graceThreshold = 2;
        return _this;
    }
    // Quantum recognition protocol
    RiddlerExplorerService.prototype.requestRecognition = function (steward) {
        var status;
        var acclimatizationState = 'none';
        if (steward.type === 'human' || steward.type === 'ai') {
            status = 'acclimatizing';
            acclimatizationState = 'training';
        }
        else if (steward.type === 'whale') {
            status = 'denied';
        }
        else {
            status = 'quarantined';
        }
        this.stewards.set(steward.id, __assign(__assign({}, steward), { status: status, lastRecognized: null, quarantineLevel: status === 'quarantined' ? 1 : 0, deceptionLevel: status === 'quarantined' ? 1 : 0, rateLimitCount: 0, lastActionTime: 0, failedAttempts: 0, acclimatizationState: acclimatizationState }));
        this.logEvent(steward.id, 'recognition', { status: status });
        return status;
    };
    // Checkpoint for observation/interaction
    RiddlerExplorerService.prototype.checkpoint = function (stewardId, action, details) {
        var steward = this.stewards.get(stewardId);
        if (!steward) {
            this.logEvent(stewardId, 'checkpoint_denied', { action: action, details: details, result: 'unknown_steward', feedback: 'Unrecognized entity. Please request recognition.' });
            return false;
        }
        // Acclimatization logic
        if (steward.status === 'acclimatizing') {
            steward.failedAttempts = (steward.failedAttempts || 0);
            if (steward.acclimatizationState === 'training') {
                this.logEvent(stewardId, 'checkpoint_training', { action: action, details: details, result: 'training', feedback: 'You are in training mode. Please follow the guidance provided.' });
                // Relax enforcement: allow most actions, but log and provide feedback
                if (steward.failedAttempts < this.acclimatizationThreshold) {
                    return true;
                }
                else {
                    steward.acclimatizationState = 'grace';
                    this.logEvent(stewardId, 'acclimatization_grace', { feedback: 'You are now in a grace period. Please proceed carefully.' });
                }
            }
            if (steward.acclimatizationState === 'grace') {
                if (steward.failedAttempts < this.acclimatizationThreshold + this.graceThreshold) {
                    this.logEvent(stewardId, 'checkpoint_grace', { action: action, details: details, result: 'grace', feedback: 'You are in a grace period. Mistakes are tolerated, but repeated failures will escalate.' });
                    return true;
                }
                else {
                    steward.acclimatizationState = 'escalate';
                    steward.status = 'quarantined';
                    this.logEvent(stewardId, 'acclimatization_escalated', { feedback: 'You have exceeded the grace period. Escalating to quarantine.' });
                    return false;
                }
            }
            if (steward.acclimatizationState === 'escalate') {
                this.logEvent(stewardId, 'checkpoint_quarantined', { action: action, details: details, result: 'quarantined', feedback: 'You are now quarantined. Please contact the council for review.' });
                return false;
            }
        }
        // Rate limiting
        var now = Date.now();
        if (steward.lastActionTime && now - steward.lastActionTime < this.rateLimitWindow) {
            steward.rateLimitCount = (steward.rateLimitCount || 0) + 1;
            if (steward.rateLimitCount > this.maxActionsPerWindow) {
                this.logEvent(stewardId, 'checkpoint_denied', { action: action, details: details, result: 'rate_limited', feedback: 'You are being rate limited. Please slow down.' });
                return false;
            }
        }
        else {
            steward.rateLimitCount = 1;
            steward.lastActionTime = now;
        }
        // Quarantine and deception for non-stewards
        if (steward.status === 'quarantined' || steward.type === 'non-steward') {
            this.logEvent(stewardId, 'checkpoint_quarantined', { action: action, details: details, result: 'quarantined', feedback: 'You are quarantined. No real actions are allowed.' });
            // Deception: return decoy/false data, do not allow real action
            return false;
        }
        if (steward.status !== 'approved') {
            steward.failedAttempts = (steward.failedAttempts || 0) + 1;
            this.logEvent(stewardId, 'checkpoint_denied', { action: action, details: details, result: 'not_approved', feedback: 'You are not yet approved. Please complete acclimatization or contact the council.' });
            return false;
        }
        this.logEvent(stewardId, action, __assign(__assign({}, details), { result: 'allowed', feedback: 'Action allowed.' }));
        return true;
    };
    // Log all events for audit
    RiddlerExplorerService.prototype.logEvent = function (stewardId, action, details) {
        this.auditLog.push({
            stewardId: stewardId,
            action: action,
            timestamp: Date.now(),
            details: details
        });
        this.emit('audit', { stewardId: stewardId, action: action, details: details });
    };
    // Expose audit log for review
    RiddlerExplorerService.prototype.getAuditLog = function () {
        return __spreadArray([], this.auditLog, true);
    };
    // Revoke or suspend recognition
    RiddlerExplorerService.prototype.revokeRecognition = function (stewardId) {
        var steward = this.stewards.get(stewardId);
        if (steward) {
            steward.status = 'denied';
            this.logEvent(stewardId, 'recognition_revoked');
        }
    };
    // List all stewards and their status
    RiddlerExplorerService.prototype.listStewards = function () {
        return Array.from(this.stewards.values());
    };
    // Djinn Council hooks
    RiddlerExplorerService.prototype.escalateQuarantine = function (stewardId, level) {
        if (level === void 0) { level = 2; }
        var steward = this.stewards.get(stewardId);
        if (steward) {
            steward.status = 'quarantined';
            steward.quarantineLevel = level;
            this.logEvent(stewardId, 'quarantine_escalated', { level: level });
        }
    };
    RiddlerExplorerService.prototype.setDeceptionLevel = function (stewardId, level) {
        if (level === void 0) { level = 1; }
        var steward = this.stewards.get(stewardId);
        if (steward) {
            steward.deceptionLevel = level;
            this.logEvent(stewardId, 'deception_level_set', { level: level });
        }
    };
    // Honor system/defense hooks
    RiddlerExplorerService.prototype.engageDefenseProtocol = function (stewardId, protocol) {
        this.logEvent(stewardId, 'defense_protocol_engaged', { protocol: protocol });
        // Integrate with external defense systems as needed
    };
    RiddlerExplorerService.prototype.destroyOrDisseminate = function (stewardId, action) {
        this.logEvent(stewardId, 'destroy_or_disseminate', { action: action });
        // Integrate with external honor/defense systems as needed
    };
    return RiddlerExplorerService;
}(events_1.EventEmitter));
exports.RiddlerExplorerService = RiddlerExplorerService;
