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

import { v4 as uuidv4 } from 'uuid';
import { ICryptoProvider } from '../../crypto/interfaces/ICryptoProvider';
import { Entity, HarmonicSignature, IHarmonicSignatureProvider } from '../interfaces/IHarmonicSignatureProvider';

export class DataHashHarmonicSignatureProvider implements IHarmonicSignatureProvider {
    private cryptoProvider: ICryptoProvider | null = null;
    private initialized: boolean = false;
    private keyPair: { publicKey: Uint8Array; privateKey: Uint8Array } | null = null;

    async initialize(cryptoProvider: ICryptoProvider): Promise<void> {
        this.cryptoProvider = cryptoProvider;
        this.keyPair = await this.cryptoProvider.generateSigningKeyPair();
        this.initialized = true;
    }

    async generateSignature(entity: Entity): Promise<HarmonicSignature> {
        if (!this.initialized || !this.cryptoProvider || !this.keyPair) {
            throw new Error('Provider not initialized');
        }

        // Generate a hash of the entity's data
        const dataHash = await this.cryptoProvider.sign(entity.data, this.keyPair.privateKey);

        // Create the harmonic signature
        const signature: HarmonicSignature = {
            id: uuidv4(),
            signature: dataHash,
            timestamp: Date.now(),
            metadata: {
                entityId: entity.id,
                dataLength: entity.data.length,
                publicKey: this.keyPair.publicKey,
                ...entity.metadata
            }
        };

        return signature;
    }

    async verifySignature(signature: HarmonicSignature, entity: Entity): Promise<boolean> {
        if (!this.initialized || !this.cryptoProvider) {
            throw new Error('Provider not initialized');
        }

        try {
            // Get the public key from the signature metadata
            const publicKey = signature.metadata?.publicKey as Uint8Array;
            if (!publicKey) {
                return false;
            }

            // Verify the signature against the entity's data
            return await this.cryptoProvider.verify(entity.data, signature.signature, publicKey);
        } catch (error) {
            return false;
        }
    }

    getSignatureType(): string {
        return 'data-hash-harmonic-v1';
    }
} 