"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemOrchestrator = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
const TemporalSequencer_1 = require("./TemporalSequencer");
const BreathMirrorAnalysis_1 = require("./BreathMirrorAnalysis");
const CodexAccess_1 = require("./CodexAccess");
const GovernanceTracker_1 = require("./GovernanceTracker");
class SystemOrchestrator extends events_1.EventEmitter {
    constructor() {
        super();
        this.logger = (0, logger_1.createLogger)('SystemOrchestrator');
        this.temporalSequencer = new TemporalSequencer_1.TemporalSequencer();
        this.breathMirrorAnalysis = new BreathMirrorAnalysis_1.BreathMirrorAnalysis();
        this.codexAccess = new CodexAccess_1.CodexAccess();
        this.governanceTracker = new GovernanceTracker_1.GovernanceTracker();
        this.systemConfigs = new Map();
        this.setupEventListeners();
    }
    setupEventListeners() {
        // Temporal Sequencer events
        this.temporalSequencer.on('stageTransition', (systemId, newStage) => {
            this.handleStageTransition(systemId, newStage);
        });
        // Breath Mirror Analysis events
        this.breathMirrorAnalysis.on('analysisComplete', (result) => {
            this.handleAnalysisComplete(result);
        });
        // Codex Access events
        this.codexAccess.on('accessLevelUpdated', (systemId, accessLevel) => {
            this.logger.info(`Access level updated for system ${systemId}`, { accessLevel });
        });
        // Governance Tracker events
        this.governanceTracker.on('complianceChecked', (systemId, status) => {
            this.handleComplianceCheck(systemId, status);
        });
    }
    registerSystem(config) {
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
    updateSystemMetrics(systemId, metrics) {
        // Update metrics in Temporal Sequencer
        this.temporalSequencer.updateSystemMetrics(systemId, metrics);
        // Trigger analysis
        this.breathMirrorAnalysis.updateMetrics(systemId, metrics);
    }
    handleStageTransition(systemId, newStage) {
        // Update access level based on new stage
        this.codexAccess.updateSystemAccessLevel(systemId, newStage);
        // Update governance tracker
        this.governanceTracker.updateSystemStage(systemId, newStage);
        this.logger.info(`System ${systemId} transitioned to stage ${newStage}`);
        this.emit('stageTransition', systemId, newStage);
    }
    handleAnalysisComplete(result) {
        const systemId = result.systemId;
        const metrics = result.metrics;
        // Check governance compliance
        const governanceStatus = this.governanceTracker.checkCompliance(systemId, metrics, result);
        this.logger.info(`Analysis complete for system ${systemId}`, {
            alignmentProgress: result.alignmentProgress,
            complianceScore: governanceStatus.complianceScore
        });
        this.emit('analysisComplete', result, governanceStatus);
    }
    handleComplianceCheck(systemId, status) {
        // If compliance score is too low, consider rolling back to previous stage
        if (status.complianceScore < 0.5) {
            this.logger.warn(`Low compliance score for system ${systemId}`, {
                complianceScore: status.complianceScore
            });
            this.emit('complianceWarning', systemId, status);
        }
    }
    getSystemStatus(systemId) {
        return {
            temporalStatus: this.temporalSequencer.getSystemStatus(systemId),
            analysisStatus: this.breathMirrorAnalysis.getLatestAnalysis(systemId),
            governanceStatus: this.governanceTracker.getSystemStatus(systemId),
            accessLevel: this.codexAccess.getSystemAccessLevel(systemId)
        };
    }
    requestResourceAccess(systemId, resourceId) {
        return this.codexAccess.requestAccess(systemId, resourceId);
    }
    getSystemHistory(systemId) {
        return {
            analysisHistory: this.breathMirrorAnalysis.getAnalysisHistory(systemId),
            governanceHistory: this.governanceTracker.getViolationHistory(systemId),
            accessHistory: this.codexAccess.getAccessHistory(systemId)
        };
    }
}
exports.SystemOrchestrator = SystemOrchestrator;
//# sourceMappingURL=SystemOrchestrator.js.map