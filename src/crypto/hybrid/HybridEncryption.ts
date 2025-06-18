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

import { ICryptoPrimitives, KeyPair } from '../interfaces/ICryptoPrimitives';
import { error, warn } from '../../utils/environment';

interface HybridKeyPair {
    classical: KeyPair;
    quantum: KeyPair;
    timestamp: number;
    version: string;
}

interface HybridEncryptedData {
    classical: Uint8Array;
    quantum: Uint8Array;
    data: Uint8Array;
    metadata: {
        timestamp: number;
        version: string;
        algorithm: string;
        securityLevel: number;
    };
}

export class HybridEncryption {
    private static instance: HybridEncryption;
    private crypto: ICryptoPrimitives;
    private keyRotationInterval: number = 24 * 60 * 60 * 1000; // 24 hours
    private readonly VERSION = '1.0.0';

    private constructor(crypto: ICryptoPrimitives) {
        this.crypto = crypto;
    }

    public static getInstance(crypto: ICryptoPrimitives): HybridEncryption {
        if (!HybridEncryption.instance) {
            HybridEncryption.instance = new HybridEncryption(crypto);
        }
        return HybridEncryption.instance;
    }

    public async generateHybridKeyPair(): Promise<HybridKeyPair> {
        try {
            const [classical, quantum] = await Promise.all([
                this.crypto.generateRSAKeyPair(4096),
                this.crypto.generateLatticeKeyPair()
            ]);

            return {
                classical,
                quantum,
                timestamp: Date.now(),
                version: this.VERSION
            };
        } catch (err) {
            error('Failed to generate hybrid key pair:', err);
            throw new Error('Hybrid key pair generation failed');
        }
    }

    public async encrypt(data: Uint8Array, publicKeys: { classical: Uint8Array; quantum: Uint8Array }): Promise<HybridEncryptedData> {
        try {
            // Generate a random AES key
            const aesKey = await this.crypto.generateAESKey(256);
            
            // Encrypt the data with AES
            const encryptedData = await this.crypto.encryptAES(data, aesKey);
            
            // Encrypt the AES key with both classical and post-quantum methods
            const [classicalEncrypted, quantumEncrypted] = await Promise.all([
                this.crypto.encryptRSA(aesKey, publicKeys.classical),
                this.crypto.encryptLattice(aesKey, publicKeys.quantum)
            ]);

            return {
                classical: classicalEncrypted,
                quantum: quantumEncrypted,
                data: encryptedData,
                metadata: {
                    timestamp: Date.now(),
                    version: this.VERSION,
                    algorithm: 'Hybrid-AES-RSA-Kyber',
                    securityLevel: 256
                }
            };
        } catch (err) {
            error('Hybrid encryption failed:', err);
            throw new Error('Hybrid encryption failed');
        }
    }

    public async decrypt(encrypted: HybridEncryptedData, privateKeys: { classical: Uint8Array; quantum: Uint8Array }): Promise<Uint8Array> {
        try {
            // Try to decrypt the AES key using both methods
            let aesKey: Uint8Array;
            try {
                // First try classical decryption
                aesKey = await this.crypto.decryptRSA(encrypted.classical, privateKeys.classical);
            } catch (err) {
                warn('Classical decryption failed, trying quantum:', err);
                // If classical fails, try quantum
                aesKey = await this.crypto.decryptLattice(encrypted.quantum, privateKeys.quantum);
            }

            // Decrypt the data with the recovered AES key
            return await this.crypto.decryptAES(encrypted.data, aesKey);
        } catch (err) {
            error('Hybrid decryption failed:', err);
            throw new Error('Hybrid decryption failed');
        }
    }

    public async rotateKeys(currentKeys: HybridKeyPair): Promise<HybridKeyPair> {
        const now = Date.now();
        if (now - currentKeys.timestamp < this.keyRotationInterval) {
            return currentKeys;
        }

        try {
            return await this.generateHybridKeyPair();
        } catch (err) {
            error('Key rotation failed:', err);
            throw new Error('Key rotation failed');
        }
    }

    public async verifyMetadata(encrypted: HybridEncryptedData): Promise<boolean> {
        try {
            // Check version compatibility
            if (encrypted.metadata.version !== this.VERSION) {
                warn('Incompatible version:', {
                    expected: this.VERSION,
                    received: encrypted.metadata.version
                });
                return false;
            }

            // Check timestamp (reject if too old)
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
            if (Date.now() - encrypted.metadata.timestamp > maxAge) {
                warn('Encrypted data too old:', {
                    age: Date.now() - encrypted.metadata.timestamp,
                    maxAge
                });
                return false;
            }

            // Check security level
            if (encrypted.metadata.securityLevel < 256) {
                warn('Insufficient security level:', {
                    required: 256,
                    provided: encrypted.metadata.securityLevel
                });
                return false;
            }

            return true;
        } catch (err) {
            error('Metadata verification failed:', err);
            return false;
        }
    }

    public async reencrypt(encrypted: HybridEncryptedData, oldKeys: HybridKeyPair, newKeys: HybridKeyPair): Promise<HybridEncryptedData> {
        try {
            // Decrypt with old keys
            const decrypted = await this.decrypt(encrypted, {
                classical: oldKeys.classical.privateKey,
                quantum: oldKeys.quantum.privateKey
            });

            // Encrypt with new keys
            return await this.encrypt(decrypted, {
                classical: newKeys.classical.publicKey,
                quantum: newKeys.quantum.publicKey
            });
        } catch (err) {
            error('Reencryption failed:', err);
            throw new Error('Reencryption failed');
        }
    }
} 