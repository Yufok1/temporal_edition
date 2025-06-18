"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.healthMetrics = exports.rscMetrics = exports.rebMetrics = exports.uicsMetrics = exports.rugMetrics = void 0;
const prom_client_1 = require("prom-client");
const register = new prom_client_1.Registry();
exports.register = register;
// Recursive Understanding Gradient (RUG) Metrics
exports.rugMetrics = {
    currentDepth: new prom_client_1.Gauge({
        name: 'rug_current_depth',
        help: 'Current recursion depth of the system',
        registers: [register],
    }),
    stabilityScore: new prom_client_1.Gauge({
        name: 'rug_stability_score',
        help: 'Current stability score of the system (0-1)',
        registers: [register],
    }),
    acclimationProgress: new prom_client_1.Gauge({
        name: 'rug_acclimation_progress',
        help: 'Progress of system acclimation (0-1)',
        registers: [register],
    }),
};
// User Interaction Comprehension Scaler (UICS) Metrics
exports.uicsMetrics = {
    comprehensionLevel: new prom_client_1.Gauge({
        name: 'uics_comprehension_level',
        help: 'Current comprehension level of user interactions (0-1)',
        registers: [register],
    }),
    adaptationRate: new prom_client_1.Gauge({
        name: 'uics_adaptation_rate',
        help: 'Rate of adaptation to user interactions',
        registers: [register],
    }),
    interactionSuccess: new prom_client_1.Counter({
        name: 'uics_interaction_success_total',
        help: 'Total number of successful user interactions',
        registers: [register],
    }),
};
// Recursive Escalation Boundaries (REB) Metrics
exports.rebMetrics = {
    boundaryViolations: new prom_client_1.Counter({
        name: 'reb_boundary_violations_total',
        help: 'Total number of recursive boundary violations',
        registers: [register],
    }),
    cooldownActive: new prom_client_1.Gauge({
        name: 'reb_cooldown_active',
        help: 'Whether the system is in cooldown mode (0 or 1)',
        registers: [register],
    }),
    stabilityViolations: new prom_client_1.Counter({
        name: 'reb_stability_violations_total',
        help: 'Total number of stability threshold violations',
        registers: [register],
    }),
};
// Recursive Safety Catch (RSC) Metrics
exports.rscMetrics = {
    errorRate: new prom_client_1.Gauge({
        name: 'rsc_error_rate',
        help: 'Current error rate of the system (0-1)',
        registers: [register],
    }),
    responseTime: new prom_client_1.Histogram({
        name: 'rsc_response_time_seconds',
        help: 'Response time distribution in seconds',
        buckets: [0.1, 0.5, 1, 2, 5],
        registers: [register],
    }),
    autoRemediationCount: new prom_client_1.Counter({
        name: 'rsc_auto_remediation_total',
        help: 'Total number of automatic remediation actions taken',
        registers: [register],
    }),
};
// System Health Metrics
exports.healthMetrics = {
    cpuUsage: new prom_client_1.Gauge({
        name: 'system_cpu_usage',
        help: 'CPU usage percentage',
        registers: [register],
    }),
    memoryUsage: new prom_client_1.Gauge({
        name: 'system_memory_usage_bytes',
        help: 'Memory usage in bytes',
        registers: [register],
    }),
    uptime: new prom_client_1.Gauge({
        name: 'system_uptime_seconds',
        help: 'System uptime in seconds',
        registers: [register],
    }),
};
//# sourceMappingURL=system-metrics.js.map