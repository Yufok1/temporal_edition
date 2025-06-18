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
exports.MonitoringService = void 0;
var prom_client_1 = require("prom-client");
var logger_1 = require("./logger");
var MonitoringService = /** @class */ (function () {
    function MonitoringService() {
        this.temporalData = [];
        this.sessionEvents = [];
        this.ALERT_THRESHOLDS = {
            queueSize: 1000,
            errorRate: 0.1,
            processingTime: 30000,
            retryRate: 0.2,
            recursiveDepth: 10,
            coherenceThreshold: 0.8,
            stabilityThreshold: 0.9
        };
        // Initialize Prometheus metrics
        this.systemHealthGauge = new prom_client_1.Gauge({
            name: 'system_health',
            help: 'Overall system health status (1 = healthy, 0 = unhealthy)',
            labelNames: ['component']
        });
        this.alertCounter = new prom_client_1.Counter({
            name: 'system_alerts_total',
            help: 'Total number of system alerts',
            labelNames: ['severity', 'component', 'type']
        });
        this.queueHealthGauge = new prom_client_1.Gauge({
            name: 'queue_health',
            help: 'Queue health metrics',
            labelNames: ['metric']
        });
        this.processingTimeGauge = new prom_client_1.Gauge({
            name: 'job_processing_time',
            help: 'Average job processing time in milliseconds',
            labelNames: ['priority']
        });
        this.errorRateGauge = new prom_client_1.Gauge({
            name: 'error_rate',
            help: 'Error rate per priority level',
            labelNames: ['priority']
        });
        // Initialize new metrics for recursive monitoring
        this.recursiveScanGauge = new prom_client_1.Gauge({
            name: 'recursive_scan_depth',
            help: 'Current depth of recursive scanning',
            labelNames: ['component']
        });
        this.selfAwarenessGauge = new prom_client_1.Gauge({
            name: 'self_awareness_level',
            help: 'System self-awareness metrics',
            labelNames: ['metric']
        });
        this.coherenceGauge = new prom_client_1.Gauge({
            name: 'recursive_coherence',
            help: 'Recursive coherence metrics',
            labelNames: ['component']
        });
        this.interactionFlowGauge = new prom_client_1.Gauge({
            name: 'interaction_flow',
            help: 'Interaction flow metrics',
            labelNames: ['type']
        });
        this.stabilityGauge = new prom_client_1.Gauge({
            name: 'system_stability',
            help: 'System stability metrics',
            labelNames: ['component']
        });
        logger_1["default"].info('Enhanced MonitoringService initialized with recursive capabilities');
    }
    MonitoringService.prototype.updateSystemHealth = function (component, isHealthy) {
        this.systemHealthGauge.set({ component: component }, isHealthy ? 1 : 0);
        if (!isHealthy) {
            this.recordAlert('critical', component, 'health_check_failed');
            logger_1["default"].error("System health check failed for component: ".concat(component));
        }
    };
    MonitoringService.prototype.updateQueueMetrics = function (metrics) {
        // Update queue size
        this.queueHealthGauge.set({ metric: 'size' }, metrics.size);
        if (metrics.size > this.ALERT_THRESHOLDS.queueSize) {
            this.recordAlert('warning', 'queue', 'size_threshold_exceeded');
            logger_1["default"].warn("Queue size threshold exceeded: ".concat(metrics.size));
        }
        // Update processing time
        this.queueHealthGauge.set({ metric: 'processing_time' }, metrics.processingTime);
        if (metrics.processingTime > this.ALERT_THRESHOLDS.processingTime) {
            this.recordAlert('warning', 'queue', 'processing_time_threshold_exceeded');
            logger_1["default"].warn("Processing time threshold exceeded: ".concat(metrics.processingTime, "ms"));
        }
        // Update error rate
        this.queueHealthGauge.set({ metric: 'error_rate' }, metrics.errorRate);
        if (metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            this.recordAlert('error', 'queue', 'error_rate_threshold_exceeded');
            logger_1["default"].error("Error rate threshold exceeded: ".concat(metrics.errorRate));
        }
        // Update retry rate
        this.queueHealthGauge.set({ metric: 'retry_rate' }, metrics.retryRate);
        if (metrics.retryRate > this.ALERT_THRESHOLDS.retryRate) {
            this.recordAlert('warning', 'queue', 'retry_rate_threshold_exceeded');
            logger_1["default"].warn("Retry rate threshold exceeded: ".concat(metrics.retryRate));
        }
    };
    MonitoringService.prototype.updatePriorityMetrics = function (priority, metrics) {
        this.processingTimeGauge.set({ priority: priority }, metrics.processingTime);
        this.errorRateGauge.set({ priority: priority }, metrics.errorRate);
        if (metrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
            this.recordAlert('error', 'priority', "error_rate_".concat(priority.toLowerCase()));
            logger_1["default"].error("Error rate threshold exceeded for priority ".concat(priority, ": ").concat(metrics.errorRate));
        }
    };
    MonitoringService.prototype.updateRecursiveScanMetrics = function (component, depth, coherence) {
        this.recursiveScanGauge.set({ component: component }, depth);
        this.coherenceGauge.set({ component: component }, coherence);
        if (depth > this.ALERT_THRESHOLDS.recursiveDepth) {
            this.recordAlert('warning', component, 'recursive_depth_exceeded');
            logger_1["default"].warn("Recursive depth threshold exceeded for ".concat(component, ": ").concat(depth));
        }
        if (coherence < this.ALERT_THRESHOLDS.coherenceThreshold) {
            this.recordAlert('warning', component, 'coherence_threshold_below');
            logger_1["default"].warn("Coherence threshold below acceptable level for ".concat(component, ": ").concat(coherence));
        }
    };
    MonitoringService.prototype.updateSelfAwarenessMetrics = function (metrics) {
        this.selfAwarenessGauge.set({ metric: 'recognition' }, metrics.recognitionLevel);
        this.selfAwarenessGauge.set({ metric: 'state' }, metrics.stateAwareness);
        this.selfAwarenessGauge.set({ metric: 'adaptation' }, metrics.adaptationRate);
    };
    MonitoringService.prototype.updateInteractionFlowMetrics = function (metrics) {
        this.interactionFlowGauge.set({ type: 'requests' }, metrics.requestRate);
        this.interactionFlowGauge.set({ type: 'response_time' }, metrics.responseTime);
        this.interactionFlowGauge.set({ type: 'errors' }, metrics.errorRate);
        this.interactionFlowGauge.set({ type: 'throughput' }, metrics.throughput);
    };
    MonitoringService.prototype.updateSystemStability = function (component, stability) {
        this.stabilityGauge.set({ component: component }, stability);
        if (stability < this.ALERT_THRESHOLDS.stabilityThreshold) {
            this.recordAlert('warning', component, 'stability_threshold_below');
            logger_1["default"].warn("System stability below threshold for ".concat(component, ": ").concat(stability));
        }
    };
    MonitoringService.prototype.recordAlert = function (severity, component, type) {
        this.alertCounter.inc({ severity: severity, component: component, type: type });
    };
    MonitoringService.prototype.getMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prom_client_1.register.metrics()];
            });
        });
    };
    MonitoringService.prototype.logTemporalData = function (data) {
        this.temporalData.push(data);
        console.log('Temporal data logged:', data);
    };
    MonitoringService.prototype.logSessionEvent = function (event) {
        this.sessionEvents.push(event);
        console.log('Session event logged:', event);
    };
    MonitoringService.prototype.getTemporalData = function () {
        return this.temporalData;
    };
    MonitoringService.prototype.getSessionEvents = function () {
        return this.sessionEvents;
    };
    MonitoringService.prototype.clearData = function () {
        this.temporalData = [];
        this.sessionEvents = [];
    };
    return MonitoringService;
}());
exports.MonitoringService = MonitoringService;
