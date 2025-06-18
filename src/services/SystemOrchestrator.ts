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

import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { createLogger } from '../utils/logger';
import { TemporalSequencer, AlignmentStage, SystemMetrics } from './TemporalSequencer';
import { BreathMirrorAnalysis, AnalysisResult } from './BreathMirrorAnalysis';
import { CodexAccess } from './CodexAccess';
import { GovernanceTracker, GovernanceStatus } from './GovernanceTracker';

export interface SystemConfig {
    systemId: string;
    initialStage: AlignmentStage;
    analysisConfig?: {
        stabilityThreshold?: number;
        performanceThreshold?: number;
        alignmentThreshold?: number;
        checkInterval?: number;
    };
}

export class SystemOrchestrator extends EventEmitter {
    private logger: Logger;
    private temporalSequencer: TemporalSequencer;
    private breathMirrorAnalysis: BreathMirrorAnalysis;
    private codexAccess: CodexAccess;
    private governanceTracker: GovernanceTracker;
    private systemConfigs: Map<string, SystemConfig>;

    constructor() {
        super();
        this.logger = createLogger('SystemOrchestrator');
        this.temporalSequencer = new TemporalSequencer();
        this.breathMirrorAnalysis = new BreathMirrorAnalysis();
        this.codexAccess = new CodexAccess();
        this.governanceTracker = new GovernanceTracker();
        this.systemConfigs = new Map();

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Temporal Sequencer events
        this.temporalSequencer.on('stageTransition', (systemId: string, newStage: AlignmentStage) => {
            this.handleStageTransition(systemId, newStage);
        });

        // Breath Mirror Analysis events
        this.breathMirrorAnalysis.on('analysisComplete', (result: AnalysisResult) => {
            this.handleAnalysisComplete(result);
        });

        // Codex Access events
        this.codexAccess.on('accessLevelUpdated', (systemId: string, accessLevel: any) => {
            this.logger.info(`Access level updated for system ${systemId}`, { accessLevel });
        });

        // Governance Tracker events
        this.governanceTracker.on('complianceChecked', (systemId: string, status: GovernanceStatus) => {
            this.handleComplianceCheck(systemId, status);
        });
    }

    public registerSystem(config: SystemConfig): void {
        if (this.systemConfigs.has(config.systemId)) {
            throw new Error(`System ${config.systemId} already registered`);
        }

        // Register with all services
        this.temporalSequencer.registerSystem(config.systemId);
        this.governanceTracker.registerSystem(config.systemId, config.initialStage);
        this.codexAccess.updateSystemAccessLevel(config.systemId, config.initialStage);

        // Configure analysis if provided
        if (config.analysisConfig) {
            this.breathMirrorAnalysis.updateConfig(config.analysisConfig);
        }

        this.systemConfigs.set(config.systemId, config);
        this.logger.info(`System ${config.systemId} registered with all services`);
    }

    public updateSystemMetrics(systemId: string, metrics: SystemMetrics): void {
        // Update metrics in Temporal Sequencer
        this.temporalSequencer.updateSystemMetrics(systemId, metrics);

        // Trigger analysis
        this.breathMirrorAnalysis.updateMetrics(systemId, metrics);
    }

    private handleStageTransition(systemId: string, newStage: AlignmentStage): void {
        // Update access level based on new stage
        this.codexAccess.updateSystemAccessLevel(systemId, newStage);
        
        // Update governance tracker
        this.governanceTracker.updateSystemStage(systemId, newStage);

        this.logger.info(`System ${systemId} transitioned to stage ${newStage}`);
        this.emit('stageTransition', systemId, newStage);
    }

    private handleAnalysisComplete(result: AnalysisResult): void {
        const systemId = result.systemId;
        const metrics = result.metrics;

        // Check governance compliance
        const governanceStatus = this.governanceTracker.checkCompliance(
            systemId,
            metrics,
            result
        );

        this.logger.info(`Analysis complete for system ${systemId}`, {
            alignmentProgress: result.alignmentProgress,
            complianceScore: governanceStatus.complianceScore
        });

        this.emit('analysisComplete', result, governanceStatus);
    }

    private handleComplianceCheck(systemId: string, status: GovernanceStatus): void {
        // If compliance score is too low, consider rolling back to previous stage
        if (status.complianceScore < 0.5) {
            this.logger.warn(`Low compliance score for system ${systemId}`, {
                complianceScore: status.complianceScore
            });
            this.emit('complianceWarning', systemId, status);
        }
    }

    public getSystemStatus(systemId: string): {
        temporalStatus: any;
        analysisStatus: AnalysisResult | undefined;
        governanceStatus: GovernanceStatus | undefined;
        accessLevel: number;
    } {
        return {
            temporalStatus: this.temporalSequencer.getSystemStatus(systemId),
            analysisStatus: this.breathMirrorAnalysis.getLatestAnalysis(systemId),
            governanceStatus: this.governanceTracker.getSystemStatus(systemId),
            accessLevel: this.codexAccess.getSystemAccessLevel(systemId)
        };
    }

    public requestResourceAccess(systemId: string, resourceId: string): any {
        return this.codexAccess.requestAccess(systemId, resourceId);
    }

    public getSystemHistory(systemId: string): {
        analysisHistory: AnalysisResult[];
        governanceHistory: any[];
        accessHistory: any[];
    } {
        return {
            analysisHistory: this.breathMirrorAnalysis.getAnalysisHistory(systemId),
            governanceHistory: this.governanceTracker.getViolationHistory(systemId),
            accessHistory: this.codexAccess.getAccessHistory(systemId)
        };
    }
} 