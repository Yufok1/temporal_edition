import { Registry, Counter, Gauge, Histogram } from 'prom-client';
declare const register: Registry<"text/plain; version=0.0.4; charset=utf-8">;
export declare const rugMetrics: {
    currentDepth: Gauge<string>;
    stabilityScore: Gauge<string>;
    acclimationProgress: Gauge<string>;
};
export declare const uicsMetrics: {
    comprehensionLevel: Gauge<string>;
    adaptationRate: Gauge<string>;
    interactionSuccess: Counter<string>;
};
export declare const rebMetrics: {
    boundaryViolations: Counter<string>;
    cooldownActive: Gauge<string>;
    stabilityViolations: Counter<string>;
};
export declare const rscMetrics: {
    errorRate: Gauge<string>;
    responseTime: Histogram<string>;
    autoRemediationCount: Counter<string>;
};
export declare const healthMetrics: {
    cpuUsage: Gauge<string>;
    memoryUsage: Gauge<string>;
    uptime: Gauge<string>;
};
export { register };
