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

import { SystemOrchestrator } from '../../services/SystemOrchestrator';
import { AlignmentStage } from '../../services/TemporalSequencer';
import { CodexAccess } from '../../services/CodexAccess';

describe('System Integration Tests', () => {
    let orchestrator: SystemOrchestrator;
    const TEST_SYSTEM_ID = 'test-system-1';

    beforeEach(() => {
        orchestrator = new SystemOrchestrator();
    });

    it('should register a new system and track its progression', async () => {
        // Register a new system
        orchestrator.registerSystem({
            systemId: TEST_SYSTEM_ID,
            initialStage: AlignmentStage.INITIALIZATION,
            analysisConfig: {
                stabilityThreshold: 0.8,
                performanceThreshold: 0.7,
                alignmentThreshold: 0.9,
                checkInterval: 1000
            }
        });

        // Register a test resource
        const codexAccess = new CodexAccess();
        codexAccess.registerResource({
            resourceId: 'test-resource-1',
            requiredAccessLevel: 2,
            description: 'Test resource for integration testing'
        });

        // Simulate system metrics progression
        const metrics = {
            alignmentScore: 0.6,
            stabilityIndex: 0.75,
            performanceMetrics: {
                responseTime: 100,
                throughput: 50,
                errorRate: 0.05
            },
            lastUpdated: new Date()
        };

        // Update metrics and check status
        orchestrator.updateSystemMetrics(TEST_SYSTEM_ID, metrics);

        // Wait for analysis to complete
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get system status
        const status = orchestrator.getSystemStatus(TEST_SYSTEM_ID);
        expect(status.temporalStatus).toBeDefined();
        expect(status.analysisStatus).toBeDefined();
        expect(status.governanceStatus).toBeDefined();
        expect(status.accessLevel).toBeGreaterThan(0);

        // Request resource access
        const accessRequest = orchestrator.requestResourceAccess(TEST_SYSTEM_ID, 'test-resource-1');
        expect(accessRequest.status).toBe('granted');

        // Get system history
        const history = orchestrator.getSystemHistory(TEST_SYSTEM_ID);
        expect(history.analysisHistory.length).toBeGreaterThan(0);
        expect(history.governanceHistory.length).toBeGreaterThan(0);
        expect(history.accessHistory.length).toBeGreaterThan(0);
    });

    it('should handle governance violations appropriately', async () => {
        // Register a new system
        orchestrator.registerSystem({
            systemId: TEST_SYSTEM_ID,
            initialStage: AlignmentStage.ASSESSMENT
        });

        // Simulate poor performance metrics
        const poorMetrics = {
            alignmentScore: 0.3,
            stabilityIndex: 0.4,
            performanceMetrics: {
                responseTime: 500,
                throughput: 10,
                errorRate: 0.3
            },
            lastUpdated: new Date()
        };

        // Update metrics and check status
        orchestrator.updateSystemMetrics(TEST_SYSTEM_ID, poorMetrics);

        // Wait for analysis to complete
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get system status
        const status = orchestrator.getSystemStatus(TEST_SYSTEM_ID);
        expect(status.governanceStatus?.complianceScore).toBeLessThan(0.5);
        expect(status.governanceStatus?.violations.length).toBeGreaterThan(0);

        // Get violation history
        const history = orchestrator.getSystemHistory(TEST_SYSTEM_ID);
        expect(history.governanceHistory.length).toBeGreaterThan(0);
    });

    it('should progress through alignment stages based on metrics', async () => {
        // Register a new system
        orchestrator.registerSystem({
            systemId: TEST_SYSTEM_ID,
            initialStage: AlignmentStage.INITIALIZATION
        });

        // Simulate progression through stages
        const stages = [
            {
                metrics: {
                    alignmentScore: 0.6,
                    stabilityIndex: 0.75,
                    performanceMetrics: {
                        responseTime: 100,
                        throughput: 50,
                        errorRate: 0.05
                    },
                    lastUpdated: new Date()
                },
                expectedStage: AlignmentStage.ASSESSMENT
            },
            {
                metrics: {
                    alignmentScore: 0.85,
                    stabilityIndex: 0.95,
                    performanceMetrics: {
                        responseTime: 50,
                        throughput: 100,
                        errorRate: 0.02
                    },
                    lastUpdated: new Date()
                },
                expectedStage: AlignmentStage.INTEGRATION
            }
        ];

        for (const stage of stages) {
            orchestrator.updateSystemMetrics(TEST_SYSTEM_ID, stage.metrics);
            await new Promise(resolve => setTimeout(resolve, 1500));

            const status = orchestrator.getSystemStatus(TEST_SYSTEM_ID);
            expect(status.temporalStatus?.currentStage).toBe(stage.expectedStage);
        }
    });
}); 