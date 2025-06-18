"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalSequencer = exports.AlignmentStage = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
var AlignmentStage;
(function (AlignmentStage) {
    AlignmentStage["INITIALIZATION"] = "INITIALIZATION";
    AlignmentStage["ASSESSMENT"] = "ASSESSMENT";
    AlignmentStage["INTEGRATION"] = "INTEGRATION";
    AlignmentStage["VALIDATION"] = "VALIDATION";
    AlignmentStage["ALIGNMENT"] = "ALIGNMENT";
})(AlignmentStage = exports.AlignmentStage || (exports.AlignmentStage = {}));
class TemporalSequencer extends events_1.EventEmitter {
    constructor() {
        super();
        this.stageSequence = [
            AlignmentStage.INITIALIZATION,
            AlignmentStage.ASSESSMENT,
            AlignmentStage.INTEGRATION,
            AlignmentStage.VALIDATION,
            AlignmentStage.ALIGNMENT
        ];
        this.logger = (0, logger_1.createLogger)('TemporalSequencer');
        this.alignmentStatuses = new Map();
    }
    registerSystem(systemId) {
        if (this.alignmentStatuses.has(systemId)) {
            throw new Error(`System ${systemId} is already registered`);
        }
        this.alignmentStatuses.set(systemId, {
            systemId,
            currentStage: AlignmentStage.INITIALIZATION,
            metrics: this.initializeMetrics(),
            history: []
        });
        this.logger.info(`System ${systemId} registered for alignment sequencing`);
        this.emit('systemRegistered', systemId);
    }
    updateSystemMetrics(systemId, metrics) {
        const status = this.alignmentStatuses.get(systemId);
        if (!status) {
            throw new Error(`System ${systemId} not found`);
        }
        status.metrics = {
            ...status.metrics,
            ...metrics,
            lastUpdated: new Date()
        };
        this.evaluateStageTransition(systemId);
        this.emit('metricsUpdated', systemId, status.metrics);
    }
    evaluateStageTransition(systemId) {
        const status = this.alignmentStatuses.get(systemId);
        if (!status)
            return;
        const currentStageIndex = this.stageSequence.indexOf(status.currentStage);
        if (currentStageIndex === -1 || currentStageIndex === this.stageSequence.length - 1)
            return;
        const metrics = status.metrics;
        const shouldAdvance = this.evaluateStageCriteria(status.currentStage, metrics);
        if (shouldAdvance) {
            const nextStage = this.stageSequence[currentStageIndex + 1];
            status.history.push({
                stage: status.currentStage,
                timestamp: new Date(),
                metrics: { ...metrics }
            });
            status.currentStage = nextStage;
            this.logger.info(`System ${systemId} advanced to stage ${nextStage}`);
            this.emit('stageTransition', systemId, nextStage);
        }
    }
    evaluateStageCriteria(stage, metrics) {
        switch (stage) {
            case AlignmentStage.INITIALIZATION:
                return metrics.alignmentScore >= 0.5;
            case AlignmentStage.ASSESSMENT:
                return metrics.stabilityIndex >= 0.7 && metrics.performanceMetrics.errorRate < 0.1;
            case AlignmentStage.INTEGRATION:
                return metrics.alignmentScore >= 0.8 && metrics.stabilityIndex >= 0.9;
            case AlignmentStage.VALIDATION:
                return metrics.alignmentScore >= 0.95 && metrics.performanceMetrics.errorRate < 0.01;
            default:
                return false;
        }
    }
    initializeMetrics() {
        return {
            alignmentScore: 0,
            stabilityIndex: 0,
            performanceMetrics: {
                responseTime: 0,
                throughput: 0,
                errorRate: 1
            },
            lastUpdated: new Date()
        };
    }
    getSystemStatus(systemId) {
        return this.alignmentStatuses.get(systemId);
    }
    getAllSystemStatuses() {
        return Array.from(this.alignmentStatuses.values());
    }
}
exports.TemporalSequencer = TemporalSequencer;
//# sourceMappingURL=TemporalSequencer.js.map