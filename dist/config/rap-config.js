"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.RecursiveAcclimationConfig = void 0;
const zod_1 = require("zod");
exports.RecursiveAcclimationConfig = zod_1.z.object({
    // Recursive Understanding Gradient (RUG)
    rug: zod_1.z.object({
        initialDepth: zod_1.z.number().min(1).max(10).default(1),
        maxDepth: zod_1.z.number().min(1).max(10).default(5),
        acclimationRate: zod_1.z.number().min(0.1).max(1).default(0.2),
        stabilityThreshold: zod_1.z.number().min(0.5).max(1).default(0.8),
    }),
    // User Interaction Comprehension Scaler (UICS)
    uics: zod_1.z.object({
        initialComprehensionLevel: zod_1.z.number().min(0).max(1).default(0.3),
        maxComprehensionLevel: zod_1.z.number().min(0).max(1).default(0.9),
        learningRate: zod_1.z.number().min(0.01).max(0.5).default(0.1),
        adaptationThreshold: zod_1.z.number().min(0.5).max(1).default(0.7),
    }),
    // Recursive Escalation Boundaries (REB)
    reb: zod_1.z.object({
        maxRecursionDepth: zod_1.z.number().min(1).max(10).default(5),
        stabilityThreshold: zod_1.z.number().min(0.5).max(1).default(0.8),
        cooldownPeriod: zod_1.z.number().min(1000).max(3600000).default(300000), // 5 minutes
    }),
    // Recursive Safety Catch (RSC)
    rsc: zod_1.z.object({
        maxErrorRate: zod_1.z.number().min(0).max(1).default(0.1),
        maxResponseTime: zod_1.z.number().min(100).max(10000).default(2000),
        autoRemediationEnabled: zod_1.z.boolean().default(true),
    }),
});
exports.defaultConfig = {
    rug: {
        initialDepth: 1,
        maxDepth: 5,
        acclimationRate: 0.2,
        stabilityThreshold: 0.8,
    },
    uics: {
        initialComprehensionLevel: 0.3,
        maxComprehensionLevel: 0.9,
        learningRate: 0.1,
        adaptationThreshold: 0.7,
    },
    reb: {
        maxRecursionDepth: 5,
        stabilityThreshold: 0.8,
        cooldownPeriod: 300000,
    },
    rsc: {
        maxErrorRate: 0.1,
        maxResponseTime: 2000,
        autoRemediationEnabled: true,
    },
};
//# sourceMappingURL=rap-config.js.map