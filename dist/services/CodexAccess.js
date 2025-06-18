"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexAccess = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
const TemporalSequencer_1 = require("./TemporalSequencer");
class CodexAccess extends events_1.EventEmitter {
    constructor() {
        super();
        this.logger = (0, logger_1.createLogger)('CodexAccess');
        this.accessPolicies = new Map();
        this.accessRequests = new Map();
        this.systemAccessLevels = new Map();
        this.accessLevels = [
            {
                level: 1,
                name: 'Basic',
                description: 'Basic read-only access to public resources',
                requiredAlignmentStage: TemporalSequencer_1.AlignmentStage.INITIALIZATION
            },
            {
                level: 2,
                name: 'Standard',
                description: 'Standard access to common resources',
                requiredAlignmentStage: TemporalSequencer_1.AlignmentStage.ASSESSMENT
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Advanced access to specialized resources',
                requiredAlignmentStage: TemporalSequencer_1.AlignmentStage.INTEGRATION
            },
            {
                level: 4,
                name: 'Full',
                description: 'Full access to all resources',
                requiredAlignmentStage: TemporalSequencer_1.AlignmentStage.ALIGNMENT
            }
        ];
    }
    registerResource(policy) {
        if (this.accessPolicies.has(policy.resourceId)) {
            throw new Error(`Resource ${policy.resourceId} already registered`);
        }
        this.accessPolicies.set(policy.resourceId, policy);
        this.logger.info(`Resource ${policy.resourceId} registered with access level ${policy.requiredAccessLevel}`);
    }
    updateSystemAccessLevel(systemId, alignmentStage) {
        const accessLevel = this.accessLevels.find(level => level.requiredAlignmentStage === alignmentStage);
        if (!accessLevel) {
            throw new Error(`No access level defined for alignment stage ${alignmentStage}`);
        }
        this.systemAccessLevels.set(systemId, accessLevel.level);
        this.logger.info(`System ${systemId} access level updated to ${accessLevel.name}`);
        this.emit('accessLevelUpdated', systemId, accessLevel);
    }
    requestAccess(systemId, resourceId) {
        const policy = this.accessPolicies.get(resourceId);
        if (!policy) {
            throw new Error(`Resource ${resourceId} not found`);
        }
        const systemLevel = this.systemAccessLevels.get(systemId) || 0;
        const request = {
            systemId,
            resourceId,
            timestamp: new Date(),
            status: 'pending'
        };
        if (systemLevel >= policy.requiredAccessLevel) {
            request.status = 'granted';
            this.logger.info(`Access granted to system ${systemId} for resource ${resourceId}`);
        }
        else {
            request.status = 'denied';
            request.reason = `Insufficient access level. Required: ${policy.requiredAccessLevel}, Current: ${systemLevel}`;
            this.logger.warn(`Access denied to system ${systemId} for resource ${resourceId}`, { reason: request.reason });
        }
        const requests = this.accessRequests.get(systemId) || [];
        requests.push(request);
        this.accessRequests.set(systemId, requests);
        this.emit('accessRequestProcessed', request);
        return request;
    }
    getAccessHistory(systemId) {
        return this.accessRequests.get(systemId) || [];
    }
    getSystemAccessLevel(systemId) {
        return this.systemAccessLevels.get(systemId) || 0;
    }
    getAccessLevelInfo(level) {
        return this.accessLevels.find(l => l.level === level);
    }
    getResourcePolicy(resourceId) {
        return this.accessPolicies.get(resourceId);
    }
    getAllResources() {
        return Array.from(this.accessPolicies.values());
    }
}
exports.CodexAccess = CodexAccess;
//# sourceMappingURL=CodexAccess.js.map