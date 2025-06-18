import { z } from 'zod';

export const RecursiveAcclimationConfig = z.object({
  // Recursive Understanding Gradient (RUG)
  rug: z.object({
    initialDepth: z.number().min(1).max(10).default(1),
    maxDepth: z.number().min(1).max(10).default(5),
    acclimationRate: z.number().min(0.1).max(1).default(0.2),
    stabilityThreshold: z.number().min(0.5).max(1).default(0.8),
  }),

  // User Interaction Comprehension Scaler (UICS)
  uics: z.object({
    initialComprehensionLevel: z.number().min(0).max(1).default(0.3),
    maxComprehensionLevel: z.number().min(0).max(1).default(0.9),
    learningRate: z.number().min(0.01).max(0.5).default(0.1),
    adaptationThreshold: z.number().min(0.5).max(1).default(0.7),
  }),

  // Recursive Escalation Boundaries (REB)
  reb: z.object({
    maxRecursionDepth: z.number().min(1).max(10).default(5),
    stabilityThreshold: z.number().min(0.5).max(1).default(0.8),
    cooldownPeriod: z.number().min(1000).max(3600000).default(300000), // 5 minutes
  }),

  // Recursive Safety Catch (RSC)
  rsc: z.object({
    maxErrorRate: z.number().min(0).max(1).default(0.1),
    maxResponseTime: z.number().min(100).max(10000).default(2000), // 2 seconds
    autoRemediationEnabled: z.boolean().default(true),
  }),
});

export type RecursiveAcclimationConfig = z.infer<typeof RecursiveAcclimationConfig>;

export const defaultConfig: RecursiveAcclimationConfig = {
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