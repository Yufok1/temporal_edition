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

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { SystemOrchestrator } from './services/SystemOrchestrator';
import { AlignmentStage } from './services/TemporalSequencer';
import { createLogger } from './utils/logger';
import { metricsService } from './utils/metrics';

const app = express();
const logger = createLogger('Server');
const orchestrator = new SystemOrchestrator();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Metrics endpoint
app.get('/metrics', async (req: Request, res: Response) => {
    try {
        const metrics = await metricsService.getMetrics();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
    } catch (error) {
        logger.error('Error getting metrics:', error);
        res.status(500).json({ error: 'Failed to get metrics' });
    }
});

// System Registration
app.post('/systems', (req: Request, res: Response) => {
    try {
        const { systemId, initialStage, analysisConfig } = req.body;
        
        if (!systemId || !initialStage) {
            return res.status(400).json({ error: 'systemId and initialStage are required' });
        }

        orchestrator.registerSystem({
            systemId,
            initialStage: initialStage as AlignmentStage,
            analysisConfig
        });

        // Register system metrics
        metricsService.registerSystem(systemId);

        res.status(201).json({ message: `System ${systemId} registered successfully` });
    } catch (error) {
        logger.error('Error registering system:', error);
        res.status(500).json({ error: 'Failed to register system' });
    }
});

// Update System Metrics
app.post('/systems/:systemId/metrics', (req: Request, res: Response) => {
    try {
        const { systemId } = req.params;
        const metrics = req.body;

        orchestrator.updateSystemMetrics(systemId, metrics);
        metricsService.updateSystemMetrics(systemId, metrics);
        res.json({ message: 'Metrics updated successfully' });
    } catch (error) {
        logger.error('Error updating metrics:', error);
        res.status(500).json({ error: 'Failed to update metrics' });
    }
});

// Get System Status
app.get('/systems/:systemId/status', (req: Request, res: Response) => {
    try {
        const { systemId } = req.params;
        const status = orchestrator.getSystemStatus(systemId);
        res.json(status);
    } catch (error) {
        logger.error('Error getting system status:', error);
        res.status(500).json({ error: 'Failed to get system status' });
    }
});

// Get System History
app.get('/systems/:systemId/history', (req: Request, res: Response) => {
    try {
        const { systemId } = req.params;
        const history = orchestrator.getSystemHistory(systemId);
        res.json(history);
    } catch (error) {
        logger.error('Error getting system history:', error);
        res.status(500).json({ error: 'Failed to get system history' });
    }
});

// Request Resource Access
app.post('/systems/:systemId/access/:resourceId', (req: Request, res: Response) => {
    try {
        const { systemId, resourceId } = req.params;
        const accessRequest = orchestrator.requestResourceAccess(systemId, resourceId);
        res.json(accessRequest);
    } catch (error) {
        logger.error('Error requesting resource access:', error);
        res.status(500).json({ error: 'Failed to request resource access' });
    }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
}); 