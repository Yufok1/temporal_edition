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

import { EventEmitter } from 'node:events';
import { createHash, randomBytes } from 'node:crypto';
import { CryptographerCore } from './CryptographerCore';
import { DjinnCouncilService } from './DjinnCouncilService';
import { WalletDivinationService } from './WalletDivinationService';
import { error, warn, info } from '../utils/environment';

export interface GateConfig {
    id: string;
    service: string;
    endpoint: string;
    resonanceLevel: 'low' | 'medium' | 'high' | 'critical';
    requiredResonance: string[];
    mirrorDepthLimit: number;
    entropyThreshold: number;
    auditLevel: 'basic' | 'detailed' | 'comprehensive';
}

export interface ResonanceRequest {
    gateId: string;
    signature?: string;
    sigil?: string;
    sessionKey?: string;
    message?: string;
    mirrorDepth?: number;
    timestamp: number;
    entropy: number;
}

export interface ResonanceResponse {
    allowed: boolean;
    reason?: string;
    echoSignature?: string;
    mirrorResponse?: any;
    auditData: {
        gateId: string;
        resonanceLevel: string;
        entropy: number;
        timestamp: number;
        duration: number;
    };
}

export class MKPGateResonanceMesh extends EventEmitter {
    private gates: Map<string, GateConfig> = new Map();
    private sessionKeys: Map<string, { valid: boolean; expires: number }> = new Map();
    private cryptographer: CryptographerCore;
    private djinnCouncil: DjinnCouncilService;
    private walletDivination: WalletDivinationService;
    private validSigils: Set<string> = new Set(['glyph-hash-01', 'glyph-hash-02', 'djinn-resonance-01']);

    constructor() {
        super();
        this.cryptographer = CryptographerCore.getInstance();
        this.djinnCouncil = new DjinnCouncilService();
        this.walletDivination = new WalletDivinationService('http://localhost:8545');
        this.initializeDefaultGates();
    }

    private initializeDefaultGates(): void {
        const defaultGates: GateConfig[] = [
            {
                id: 'wallet-divine',
                service: 'WalletDivinationService',
                endpoint: '/wallet/divine',
                resonanceLevel: 'high',
                requiredResonance: ['wallet-signature', 'sigil', 'session-key'],
                mirrorDepthLimit: 5,
                entropyThreshold: 0.3,
                auditLevel: 'comprehensive'
            },
            {
                id: 'djinn-council',
                service: 'DjinnCouncilService',
                endpoint: '/djinn/council',
                resonanceLevel: 'critical',
                requiredResonance: ['wallet-signature', 'sigil'],
                mirrorDepthLimit: 3,
                entropyThreshold: 0.5,
                auditLevel: 'comprehensive'
            },
            {
                id: 'cryptographer-core',
                service: 'CryptographerCore',
                endpoint: '/crypto/operations',
                resonanceLevel: 'critical',
                requiredResonance: ['wallet-signature', 'session-key'],
                mirrorDepthLimit: 2,
                entropyThreshold: 0.7,
                auditLevel: 'detailed'
            },
            {
                id: 'codex-access',
                service: 'CodexAccess',
                endpoint: '/codex/access',
                resonanceLevel: 'medium',
                requiredResonance: ['sigil', 'session-key'],
                mirrorDepthLimit: 4,
                entropyThreshold: 0.4,
                auditLevel: 'detailed'
            },
            {
                id: 'governance-api',
                service: 'GovernanceAPI',
                endpoint: '/governance/api',
                resonanceLevel: 'high',
                requiredResonance: ['wallet-signature', 'session-key'],
                mirrorDepthLimit: 4,
                entropyThreshold: 0.4,
                auditLevel: 'comprehensive'
            }
        ];

        defaultGates.forEach(gate => this.gates.set(gate.id, gate));
        info(`[GRM] Initialized ${defaultGates.length} default gates`);
    }

    /**
     * Register a new gate in the resonance mesh
     */
    public registerGate(config: GateConfig): void {
        this.gates.set(config.id, config);
        this.emit('gate_registered', config);
        info(`[GRM] Registered gate: ${config.id} for service: ${config.service}`);
    }

    /**
     * Unregister a gate from the resonance mesh
     */
    public unregisterGate(gateId: string): boolean {
        const removed = this.gates.delete(gateId);
        if (removed) {
            this.emit('gate_unregistered', gateId);
            info(`[GRM] Unregistered gate: ${gateId}`);
        }
        return removed;
    }

    /**
     * Validate resonance request against gate configuration
     */
    public async validateResonance(request: ResonanceRequest): Promise<ResonanceResponse> {
        const startTime = Date.now();
        const gate = this.gates.get(request.gateId);
        
        if (!gate) {
            return {
                allowed: false,
                reason: 'Gate not found',
                auditData: {
                    gateId: request.gateId,
                    resonanceLevel: 'unknown',
                    entropy: request.entropy,
                    timestamp: request.timestamp,
                    duration: Date.now() - startTime
                }
            };
        }

        // Check mirror depth limit
        if (request.mirrorDepth && request.mirrorDepth > gate.mirrorDepthLimit) {
            return this.generateMirrorResponse(request, gate, 'Mirror depth exceeded', startTime);
        }

        // Check entropy threshold
        if (request.entropy < gate.entropyThreshold) {
            return this.generateMirrorResponse(request, gate, 'Insufficient entropy', startTime);
        }

        // Validate resonance requirements
        const resonanceResult = await this.validateResonanceRequirements(request, gate);
        
        if (!resonanceResult.valid) {
            return this.generateMirrorResponse(request, gate, resonanceResult.reason, startTime);
        }

        // Log successful access
        this.logAuditEvent(request, gate, 'access_granted', startTime);
        
        return {
            allowed: true,
            auditData: {
                gateId: request.gateId,
                resonanceLevel: gate.resonanceLevel,
                entropy: request.entropy,
                timestamp: request.timestamp,
                duration: Date.now() - startTime
            }
        };
    }

    /**
     * Validate specific resonance requirements for a gate
     */
    private async validateResonanceRequirements(request: ResonanceRequest, gate: GateConfig): Promise<{ valid: boolean; reason?: string }> {
        const validations: { [key: string]: boolean } = {};

        // Wallet signature validation
        if (gate.requiredResonance.includes('wallet-signature') && request.signature) {
            validations['wallet-signature'] = await this.validateWalletSignature(request.signature, request.message || '');
        }

        // Sigil validation
        if (gate.requiredResonance.includes('sigil') && request.sigil) {
            validations['sigil'] = this.validSigils.has(request.sigil);
        }

        // Session key validation
        if (gate.requiredResonance.includes('session-key') && request.sessionKey) {
            validations['session-key'] = this.validateSessionKey(request.sessionKey);
        }

        // Check if at least one required resonance is valid
        const requiredResonance = gate.requiredResonance.filter(req => validations[req] !== undefined);
        const validResonance = requiredResonance.filter(req => validations[req]);

        if (validResonance.length === 0) {
            return {
                valid: false,
                reason: `No valid resonance found. Required: ${gate.requiredResonance.join(', ')}`
            };
        }

        return { valid: true };
    }

    /**
     * Validate wallet signature using cryptographer
     */
    private async validateWalletSignature(signature: string, message: string): Promise<boolean> {
        try {
            // This would integrate with your actual wallet signature validation
            // For now, using a simple hash check
            const expectedHash = createHash('sha256').update(message).digest('hex');
            return signature === expectedHash;
        } catch (err) {
            error('Wallet signature validation failed:', err);
            return false;
        }
    }

    /**
     * Validate session key
     */
    private validateSessionKey(sessionKey: string): boolean {
        const session = this.sessionKeys.get(sessionKey);
        if (!session) return false;
        
        if (Date.now() > session.expires) {
            this.sessionKeys.delete(sessionKey);
            return false;
        }
        
        return session.valid;
    }

    /**
     * Generate session key for lawful access
     */
    public generateSessionKey(validityMinutes: number = 60): string {
        const sessionKey = randomBytes(32).toString('hex');
        this.sessionKeys.set(sessionKey, {
            valid: true,
            expires: Date.now() + (validityMinutes * 60 * 1000)
        });
        
        this.emit('session_key_generated', sessionKey);
        return sessionKey;
    }

    /**
     * Generate mirror response for failed resonance
     */
    private generateMirrorResponse(request: ResonanceRequest, gate: GateConfig, reason: string, startTime: number): ResonanceResponse {
        const echoSignature = this.generateEchoSignature(request, gate);
        const mirrorResponse = this.createMirrorPayload(request, gate, reason);
        
        this.logAuditEvent(request, gate, 'mirror_trap_activated', startTime, { reason, echoSignature });
        
        return {
            allowed: false,
            reason,
            echoSignature,
            mirrorResponse,
            auditData: {
                gateId: request.gateId,
                resonanceLevel: gate.resonanceLevel,
                entropy: request.entropy,
                timestamp: request.timestamp,
                duration: Date.now() - startTime
            }
        };
    }

    /**
     * Generate echo signature for mirror responses
     */
    private generateEchoSignature(request: ResonanceRequest, gate: GateConfig): string {
        const data = `${request.gateId}-${request.timestamp}-${gate.resonanceLevel}-${request.entropy}`;
        return createHash('sha256').update(data).digest('hex');
    }

    /**
     * Create mirror payload for failed requests
     */
    private createMirrorPayload(request: ResonanceRequest, gate: GateConfig, reason: string): any {
        return {
            mirror: true,
            timestamp: Date.now(),
            echo_signature: this.generateEchoSignature(request, gate),
            reason,
            synthetic_data: {
                service: gate.service,
                endpoint: gate.endpoint,
                resonance_level: gate.resonanceLevel,
                mirror_depth: request.mirrorDepth || 0
            }
        };
    }

    /**
     * Log audit event
     */
    private logAuditEvent(request: ResonanceRequest, gate: GateConfig, event: string, startTime: number, additionalData?: any): void {
        const auditEvent = {
            timestamp: Date.now(),
            event,
            gateId: request.gateId,
            service: gate.service,
            resonanceLevel: gate.resonanceLevel,
            entropy: request.entropy,
            mirrorDepth: request.mirrorDepth || 0,
            duration: Date.now() - startTime,
            ...additionalData
        };

        this.emit('audit_event', auditEvent);
        
        if (gate.auditLevel === 'comprehensive') {
            info(`[GRM Audit] ${event} | Gate: ${gate.id} | Service: ${gate.service} | Entropy: ${request.entropy.toFixed(4)}`);
        }
    }

    /**
     * Get all registered gates
     */
    public getGates(): GateConfig[] {
        return Array.from(this.gates.values());
    }

    /**
     * Get gate configuration
     */
    public getGate(gateId: string): GateConfig | undefined {
        return this.gates.get(gateId);
    }

    /**
     * Update gate configuration
     */
    public updateGate(gateId: string, updates: Partial<GateConfig>): boolean {
        const gate = this.gates.get(gateId);
        if (!gate) return false;

        const updatedGate = { ...gate, ...updates };
        this.gates.set(gateId, updatedGate);
        
        this.emit('gate_updated', updatedGate);
        info(`[GRM] Updated gate: ${gateId}`);
        
        return true;
    }

    /**
     * Clean up expired session keys
     */
    public cleanupExpiredSessions(): number {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, session] of this.sessionKeys.entries()) {
            if (now > session.expires) {
                this.sessionKeys.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            info(`[GRM] Cleaned up ${cleaned} expired session keys`);
        }
        
        return cleaned;
    }

    /**
     * Get mesh statistics
     */
    public getMeshStats(): any {
        return {
            totalGates: this.gates.size,
            activeSessions: this.sessionKeys.size,
            validSigils: this.validSigils.size,
            services: Array.from(new Set(Array.from(this.gates.values()).map(g => g.service)))
        };
    }
} 