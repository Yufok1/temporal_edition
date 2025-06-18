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

import request from 'supertest';
import { Application } from '../app';
import { DjinnCouncilService } from '../DjinnCouncilService';
import { logger } from '../utils/logger';

describe('API Endpoints', () => {
    let app: Application;
    let djinnCouncil: DjinnCouncilService;

    beforeAll(() => {
        app = new Application();
        djinnCouncil = new DjinnCouncilService();
    });

    describe('Health Endpoints', () => {
        it('should return 200 for /health', async () => {
            const response = await request(app['app'])
                .get('/health')
                .expect(200);
            
            expect(response.body).toEqual({ status: 'healthy' });
        });

        it('should return component health status', async () => {
            const response = await request(app['app'])
                .get('/health/components')
                .expect(200);
            
            expect(response.body).toHaveProperty('components');
            expect(Array.isArray(response.body.components)).toBe(true);
        });

        it('should return dependency health status', async () => {
            const response = await request(app['app'])
                .get('/health/dependencies')
                .expect(200);
            
            expect(response.body).toHaveProperty('dependencies');
            expect(Array.isArray(response.body.dependencies)).toBe(true);
        });
    });

    describe('Metrics Endpoints', () => {
        it('should return Prometheus metrics', async () => {
            const response = await request(app['app'])
                .get('/metrics')
                .expect(200);
            
            expect(response.text).toContain('# HELP');
            expect(response.text).toContain('# TYPE');
        });

        it('should return network latency metrics', async () => {
            const response = await request(app['app'])
                .get('/metrics/network')
                .expect(200);
            
            expect(response.body).toHaveProperty('latency');
            expect(typeof response.body.latency).toBe('object');
        });

        it('should return data integrity metrics', async () => {
            const response = await request(app['app'])
                .get('/metrics/integrity')
                .expect(200);
            
            expect(response.body).toHaveProperty('integrity');
            expect(typeof response.body.integrity).toBe('object');
        });

        it('should return job processing statistics', async () => {
            const response = await request(app['app'])
                .get('/metrics/jobs')
                .expect(200);
            
            expect(response.body).toHaveProperty('stats');
            expect(typeof response.body.stats).toBe('object');
        });

        it('should return error distribution metrics', async () => {
            const response = await request(app['app'])
                .get('/metrics/errors')
                .expect(200);
            
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
        });
    });

    describe('System Status Endpoint', () => {
        it('should return comprehensive system status', async () => {
            const response = await request(app['app'])
                .get('/status')
                .expect(200);
            
            expect(response.body).toHaveProperty('components');
            expect(response.body).toHaveProperty('dependencies');
            expect(response.body).toHaveProperty('dataIntegrity');
            expect(response.body).toHaveProperty('timestamp');
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid endpoints gracefully', async () => {
            const response = await request(app['app'])
                .get('/invalid-endpoint')
                .expect(404);
            
            expect(response.body).toHaveProperty('error');
        });

        it('should handle service errors gracefully', async () => {
            // Mock a service error
            jest.spyOn(djinnCouncil, 'getComponentHealth').mockRejectedValueOnce(new Error('Service error'));

            const response = await request(app['app'])
                .get('/health/components')
                .expect(500);
            
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Failed to fetch component health');
        });
    });

    describe('Performance Tests', () => {
        it('should respond to health check within 100ms', async () => {
            const start = Date.now();
            await request(app['app']).get('/health');
            const duration = Date.now() - start;
            
            expect(duration).toBeLessThan(100);
        });

        it('should handle concurrent requests', async () => {
            const requests = Array(10).fill(null).map(() => 
                request(app['app']).get('/health')
            );
            
            const responses = await Promise.all(requests);
            responses.forEach(response => {
                expect(response.status).toBe(200);
            });
        });
    });
}); 