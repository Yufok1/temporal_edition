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

import { SystemOrchestrator } from './services/SystemOrchestrator';
import { AlignmentStage } from './services/TemporalSequencer';
import { CodexAccess } from './services/CodexAccess';

async function runExample() {
    console.log('Starting Temporal Editioning System Example...\n');

    // Initialize the orchestrator
    const orchestrator = new SystemOrchestrator();

    // Register a test system
    const systemId = 'test-system-1';
    console.log(`Registering system: ${systemId}`);
    orchestrator.registerSystem({
        systemId,
        initialStage: AlignmentStage.INITIALIZATION,
        analysisConfig: {
            stabilityThreshold: 0.8,
            performanceThreshold: 0.7,
            alignmentThreshold: 0.9,
            checkInterval: 1000
        }
    });

    // Register some test resources
    const codexAccess = new CodexAccess();
    const resources = [
        {
            resourceId: 'basic-resource',
            requiredAccessLevel: 1,
            description: 'Basic resource available to all systems'
        },
        {
            resourceId: 'advanced-resource',
            requiredAccessLevel: 3,
            description: 'Advanced resource requiring higher alignment'
        },
        {
            resourceId: 'critical-resource',
            requiredAccessLevel: 4,
            description: 'Critical resource requiring full alignment'
        }
    ];

    resources.forEach(resource => {
        codexAccess.registerResource(resource);
        console.log(`Registered resource: ${resource.resourceId}`);
    });

    // Simulate system progression through stages
    const stages = [
        {
            name: 'Initial State',
            metrics: {
                alignmentScore: 0.3,
                stabilityIndex: 0.5,
                performanceMetrics: {
                    responseTime: 200,
                    throughput: 30,
                    errorRate: 0.2
                },
                lastUpdated: new Date()
            }
        },
        {
            name: 'Improving Performance',
            metrics: {
                alignmentScore: 0.6,
                stabilityIndex: 0.75,
                performanceMetrics: {
                    responseTime: 150,
                    throughput: 50,
                    errorRate: 0.1
                },
                lastUpdated: new Date()
            }
        },
        {
            name: 'Advanced Stage',
            metrics: {
                alignmentScore: 0.85,
                stabilityIndex: 0.9,
                performanceMetrics: {
                    responseTime: 100,
                    throughput: 80,
                    errorRate: 0.05
                },
                lastUpdated: new Date()
            }
        },
        {
            name: 'Fully Aligned',
            metrics: {
                alignmentScore: 0.95,
                stabilityIndex: 0.98,
                performanceMetrics: {
                    responseTime: 50,
                    throughput: 100,
                    errorRate: 0.01
                },
                lastUpdated: new Date()
            }
        }
    ];

    // Process each stage
    for (const stage of stages) {
        console.log(`\nProcessing stage: ${stage.name}`);
        console.log('Updating system metrics...');
        
        orchestrator.updateSystemMetrics(systemId, stage.metrics);
        
        // Wait for analysis to complete
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get and display current status
        const status = orchestrator.getSystemStatus(systemId);
        console.log('\nCurrent Status:');
        console.log('---------------');
        console.log(`Stage: ${status.temporalStatus?.currentStage}`);
        console.log(`Compliance Score: ${status.governanceStatus?.complianceScore.toFixed(2)}`);
        console.log(`Access Level: ${status.accessLevel}`);

        // Test resource access
        console.log('\nResource Access Tests:');
        console.log('---------------------');
        for (const resource of resources) {
            const accessRequest = orchestrator.requestResourceAccess(systemId, resource.resourceId);
            console.log(`${resource.resourceId}: ${accessRequest.status}`);
        }

        // Display any warnings or recommendations
        if (status.analysisStatus) {
            console.log('\nAnalysis Results:');
            console.log('----------------');
            if (status.analysisStatus.warnings.length > 0) {
                console.log('Warnings:');
                status.analysisStatus.warnings.forEach(warning => console.log(`- ${warning}`));
            }
            if (status.analysisStatus.recommendations.length > 0) {
                console.log('\nRecommendations:');
                status.analysisStatus.recommendations.forEach(rec => console.log(`- ${rec}`));
            }
        }

        console.log('\n' + '='.repeat(50));
    }

    // Display final history
    console.log('\nSystem History Summary:');
    console.log('=====================');
    const history = orchestrator.getSystemHistory(systemId);
    console.log(`Total Analysis Records: ${history.analysisHistory.length}`);
    console.log(`Total Governance Violations: ${history.governanceHistory.length}`);
    console.log(`Total Access Requests: ${history.accessHistory.length}`);
}

// Run the example
runExample().catch(error => {
    console.error('Error running example:', error);
    process.exit(1);
}); 