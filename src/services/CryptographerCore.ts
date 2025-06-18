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

import { SodiumCryptoProvider } from '../crypto/implementations/SodiumCryptoProvider';
import { EncryptionKeyPair, SigningKeyPair } from '../crypto/interfaces/ICryptoProvider';
import { Steward, PeckingTier, RecognitionStatus } from './RiddlerExplorerService';

// Symbolic state types
interface GlyphState {
    symbol: string;
    resonance: number;
    echoCount: number;
    lastResolved: number;
    anchorState?: string;
}

interface AuditLogEntry {
    timestamp: number;
    operation: string;
    details: any;
    success: boolean;
}

interface KeyRotationState {
    currentKey: Uint8Array;
    previousKey?: Uint8Array;
    nextRotation: number;
    rotationInterval: number;
}

export class CryptographerCore {
    private static instance: CryptographerCore;
    private sodium: SodiumCryptoProvider;
    private glyphIndex: Map<string, GlyphState> = new Map();
    private echoMemory: Array<{ glyph: string; timestamp: number }> = [];
    private resolutionCache: Map<string, string> = new Map();
    private lastSweep: number = 0;
    private auditLog: AuditLogEntry[] = [];
    private encryptionKeyState!: KeyRotationState;
    private signingKeyState!: KeyRotationState;
    private readonly MAX_AUDIT_LOG_SIZE = 1000;
    private readonly KEY_ROTATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

    private constructor() {
        this.sodium = new SodiumCryptoProvider();
        this.initializeKeyRotation();
    }

    private async initializeKeyRotation() {
        const encryptionPair = await this.sodium.generateEncryptionKeyPair();
        const signingPair = await this.sodium.generateSigningKeyPair();
        
        this.encryptionKeyState = {
            currentKey: encryptionPair.publicKey,
            nextRotation: Date.now() + this.KEY_ROTATION_INTERVAL,
            rotationInterval: this.KEY_ROTATION_INTERVAL
        };

        this.signingKeyState = {
            currentKey: signingPair.publicKey,
            nextRotation: Date.now() + this.KEY_ROTATION_INTERVAL,
            rotationInterval: this.KEY_ROTATION_INTERVAL
        };
    }

    private logAudit(operation: string, details: any, success: boolean) {
        this.auditLog.push({
            timestamp: Date.now(),
            operation,
            details,
            success
        });

        if (this.auditLog.length > this.MAX_AUDIT_LOG_SIZE) {
            this.auditLog = this.auditLog.slice(-this.MAX_AUDIT_LOG_SIZE);
        }
    }

    private async rotateKeysIfNeeded() {
        const now = Date.now();
        
        if (now >= this.encryptionKeyState.nextRotation) {
            const newPair = await this.sodium.generateEncryptionKeyPair();
            this.encryptionKeyState.previousKey = this.encryptionKeyState.currentKey;
            this.encryptionKeyState.currentKey = newPair.publicKey;
            this.encryptionKeyState.nextRotation = now + this.KEY_ROTATION_INTERVAL;
            this.logAudit('encryption_key_rotation', { timestamp: now }, true);
        }

        if (now >= this.signingKeyState.nextRotation) {
            const newPair = await this.sodium.generateSigningKeyPair();
            this.signingKeyState.previousKey = this.signingKeyState.currentKey;
            this.signingKeyState.currentKey = newPair.publicKey;
            this.signingKeyState.nextRotation = now + this.KEY_ROTATION_INTERVAL;
            this.logAudit('signing_key_rotation', { timestamp: now }, true);
        }
    }

    public static getInstance(): CryptographerCore {
        if (!CryptographerCore.instance) {
            CryptographerCore.instance = new CryptographerCore();
        }
        return CryptographerCore.instance;
    }

    // --- SodiumCryptoProvider wrappers ---
    async generateEncryptionKeyPair(): Promise<EncryptionKeyPair> {
        return this.sodium.generateEncryptionKeyPair();
    }
    async generateSigningKeyPair(): Promise<SigningKeyPair> {
        return this.sodium.generateSigningKeyPair();
    }
    async encrypt(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array> {
        try {
            await this.rotateKeysIfNeeded();
            const result = await this.sodium.encrypt(data, publicKey);
            this.logAudit('encrypt', { dataLength: data.length }, true);
            return result;
        } catch (err: unknown) {
            const error = err as Error;
            this.logAudit('encrypt', { error: error.message }, false);
            throw error;
        }
    }
    async decrypt(encryptedData: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
        try {
            await this.rotateKeysIfNeeded();
            const result = await this.sodium.decrypt(encryptedData, privateKey);
            this.logAudit('decrypt', { dataLength: encryptedData.length }, true);
            return result;
        } catch (err: unknown) {
            const error = err as Error;
            this.logAudit('decrypt', { error: error.message }, false);
            throw error;
        }
    }
    async sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
        try {
            await this.rotateKeysIfNeeded();
            const result = await this.sodium.sign(message, privateKey);
            this.logAudit('sign', { messageLength: message.length }, true);
            return result;
        } catch (err: unknown) {
            const error = err as Error;
            this.logAudit('sign', { error: error.message }, false);
            throw error;
        }
    }
    async verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
        try {
            await this.rotateKeysIfNeeded();
            const result = await this.sodium.verify(message, signature, publicKey);
            this.logAudit('verify', { messageLength: message.length, result }, true);
            return result;
        } catch (err: unknown) {
            const error = err as Error;
            this.logAudit('verify', { error: error.message }, false);
            throw error;
        }
    }
    getAlgorithm(): string {
        return this.sodium.getAlgorithm();
    }

    // --- Symbolic cryptography (glyphs, anchors, echoes) ---
    resolveAnchor(kernelId: string): string | undefined {
        if (this.resolutionCache.has(kernelId)) {
            return this.resolutionCache.get(kernelId);
        }
        const glyph = this.generateGlyph(kernelId);
        let state = this.glyphIndex.get(glyph);
        if (state) {
            state.lastResolved = Date.now();
            state.echoCount += 1;
            return state.anchorState;
        }
        state = {
            symbol: glyph,
            resonance: 0,
            echoCount: 0,
            lastResolved: Date.now(),
            anchorState: this.determineAnchorState(glyph)
        };
        this.glyphIndex.set(glyph, state);
        this.resolutionCache.set(kernelId, state.anchorState!);
        return state.anchorState;
    }
    generateGlyph(kernelId: string): string {
        // Use SHA-256 and take first 16 chars (simulate with JS hash for now)
        return this.simpleHash(kernelId).slice(0, 16);
    }
    private simpleHash(input: string): string {
        // Simple hash for demonstration (replace with real SHA-256 if needed)
        let hash = 0, i, chr;
        for (i = 0; i < input.length; i++) {
            chr = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return Math.abs(hash).toString(16).padStart(16, '0');
    }
    private determineAnchorState(glyph: string): string {
        if (glyph.startsWith('0')) return 'breath_origin';
        if (glyph.startsWith('1')) return 'dredd_anchor';
        if (glyph.startsWith('2')) return 'telos_anchor';
        if (glyph.startsWith('3')) return 'entropy_modulator';
        if (glyph.startsWith('4')) return 'coherence_anchor';
        return 'recursive_node';
    }
    sweepEchoes(): void {
        const now = Date.now();
        if (now - this.lastSweep < 60000) return;
        this.echoMemory = this.echoMemory.filter(e => now - e.timestamp < 300000);
        for (const [glyph, state] of this.glyphIndex.entries()) {
            const recentEchoes = this.echoMemory.filter(e => e.glyph === glyph && now - e.timestamp < 60000).length;
            state.resonance = Math.min(1.0, recentEchoes / 10.0);
        }
        this.lastSweep = now;
    }
    getGlyphState(glyph: string): GlyphState | undefined {
        return this.glyphIndex.get(glyph);
    }
    recordEcho(glyph: string): void {
        this.echoMemory.push({ glyph, timestamp: Date.now() });
        const state = this.glyphIndex.get(glyph);
        if (state) state.echoCount += 1;
    }

    // New methods for audit and key management
    getAuditLog(): AuditLogEntry[] {
        return [...this.auditLog];
    }

    getKeyRotationState(): { encryption: KeyRotationState; signing: KeyRotationState } {
        return {
            encryption: { ...this.encryptionKeyState },
            signing: { ...this.signingKeyState }
        };
    }

    /**
     * Returns the cryptographer's steward object for privileged system use.
     */
    public static getStewardObject(): Steward {
        return {
            id: 'loki1',
            type: 'loki',
            name: 'Loki',
            status: 'approved',
            lastRecognized: Date.now(),
            peckingTier: 1,
            privileges: ['bypassRiddler', 'governingAgent', 'ruleRewriter', 'systemTrigger']
        };
    }
}

// Export singleton instance
export const cryptographer = CryptographerCore.getInstance(); 