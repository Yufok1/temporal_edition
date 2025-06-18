import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { createLogger } from '../utils/logger';
import { AlignmentStage } from './TemporalSequencer';

export interface AccessLevel {
    level: number;
    name: string;
    description: string;
    requiredAlignmentStage: AlignmentStage;
}

export interface AccessRequest {
    systemId: string;
    resourceId: string;
    timestamp: Date;
    status: 'pending' | 'granted' | 'denied';
    reason?: string;
}

export interface AccessPolicy {
    resourceId: string;
    requiredAccessLevel: number;
    description: string;
    metadata?: Record<string, unknown>;
}

export class CodexAccess extends EventEmitter {
    private logger: Logger;
    private accessLevels: AccessLevel[];
    private accessPolicies: Map<string, AccessPolicy>;
    private accessRequests: Map<string, AccessRequest[]>;
    private systemAccessLevels: Map<string, number>;

    constructor() {
        super();
        this.logger = createLogger('CodexAccess');
        this.accessPolicies = new Map();
        this.accessRequests = new Map();
        this.systemAccessLevels = new Map();
        this.accessLevels = [
            {
                level: 1,
                name: 'Basic',
                description: 'Basic read-only access to public resources',
                requiredAlignmentStage: AlignmentStage.INITIALIZATION
            },
            {
                level: 2,
                name: 'Standard',
                description: 'Standard access to common resources',
                requiredAlignmentStage: AlignmentStage.ASSESSMENT
            },
            {
                level: 3,
                name: 'Advanced',
                description: 'Advanced access to specialized resources',
                requiredAlignmentStage: AlignmentStage.INTEGRATION
            },
            {
                level: 4,
                name: 'Full',
                description: 'Full access to all resources',
                requiredAlignmentStage: AlignmentStage.ALIGNMENT
            }
        ];
    }

    public registerResource(policy: AccessPolicy): void {
        if (this.accessPolicies.has(policy.resourceId)) {
            throw new Error(`Resource ${policy.resourceId} already registered`);
        }
        this.accessPolicies.set(policy.resourceId, policy);
        this.logger.info(`Resource ${policy.resourceId} registered with access level ${policy.requiredAccessLevel}`);
    }

    public updateSystemAccessLevel(systemId: string, alignmentStage: AlignmentStage): void {
        const accessLevel = this.accessLevels.find(level => level.requiredAlignmentStage === alignmentStage);
        if (!accessLevel) {
            throw new Error(`No access level defined for alignment stage ${alignmentStage}`);
        }

        this.systemAccessLevels.set(systemId, accessLevel.level);
        this.logger.info(`System ${systemId} access level updated to ${accessLevel.name}`);
        this.emit('accessLevelUpdated', systemId, accessLevel);
    }

    public requestAccess(systemId: string, resourceId: string): AccessRequest {
        const policy = this.accessPolicies.get(resourceId);
        if (!policy) {
            throw new Error(`Resource ${resourceId} not found`);
        }

        const systemLevel = this.systemAccessLevels.get(systemId) || 0;
        const request: AccessRequest = {
            systemId,
            resourceId,
            timestamp: new Date(),
            status: 'pending'
        };

        if (systemLevel >= policy.requiredAccessLevel) {
            request.status = 'granted';
            this.logger.info(`Access granted to system ${systemId} for resource ${resourceId}`);
        } else {
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

    public getAccessHistory(systemId: string): AccessRequest[] {
        return this.accessRequests.get(systemId) || [];
    }

    public getSystemAccessLevel(systemId: string): number {
        return this.systemAccessLevels.get(systemId) || 0;
    }

    public getAccessLevelInfo(level: number): AccessLevel | undefined {
        return this.accessLevels.find(l => l.level === level);
    }

    public getResourcePolicy(resourceId: string): AccessPolicy | undefined {
        return this.accessPolicies.get(resourceId);
    }

    public getAllResources(): AccessPolicy[] {
        return Array.from(this.accessPolicies.values());
    }
} 