/// <reference types="node" />
import { EventEmitter } from 'events';
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
export declare class CodexAccess extends EventEmitter {
    private logger;
    private accessLevels;
    private accessPolicies;
    private accessRequests;
    private systemAccessLevels;
    constructor();
    registerResource(policy: AccessPolicy): void;
    updateSystemAccessLevel(systemId: string, alignmentStage: AlignmentStage): void;
    requestAccess(systemId: string, resourceId: string): AccessRequest;
    getAccessHistory(systemId: string): AccessRequest[];
    getSystemAccessLevel(systemId: string): number;
    getAccessLevelInfo(level: number): AccessLevel | undefined;
    getResourcePolicy(resourceId: string): AccessPolicy | undefined;
    getAllResources(): AccessPolicy[];
}
