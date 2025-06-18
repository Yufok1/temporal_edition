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

import { SodiumCryptoProvider } from '../../crypto/implementations/SodiumCryptoProvider';
import { DataHashHarmonicSignatureProvider } from '../implementations/DataHashHarmonicSignatureProvider';

describe('DataHashHarmonicSignatureProvider', () => {
    let provider: DataHashHarmonicSignatureProvider;
    let cryptoProvider: SodiumCryptoProvider;

    beforeEach(async () => {
        provider = new DataHashHarmonicSignatureProvider();
        cryptoProvider = new SodiumCryptoProvider();
        await provider.initialize(cryptoProvider);
    });

    describe('Initialization', () => {
        it('should initialize with a crypto provider', async () => {
            const newProvider = new DataHashHarmonicSignatureProvider();
            await newProvider.initialize(cryptoProvider);
            expect(newProvider.getSignatureType()).toBe('data-hash-harmonic-v1');
        });

        it('should throw if not initialized', async () => {
            const newProvider = new DataHashHarmonicSignatureProvider();
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('test data')
            };
            await expect(newProvider.generateSignature(entity)).rejects.toThrow('Provider not initialized');
        });
    });

    describe('Signature Generation', () => {
        it('should generate valid signatures', async () => {
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('test data')
            };

            const signature = await provider.generateSignature(entity);
            expect(signature).toBeDefined();
            expect(signature.id).toBeDefined();
            expect(signature.signature).toBeDefined();
            expect(signature.timestamp).toBeDefined();
            expect(signature.metadata?.entityId).toBe(entity.id);
        });

        it('should generate unique signatures for different entities', async () => {
            const entity1 = {
                id: 'test1',
                data: new TextEncoder().encode('test data 1')
            };
            const entity2 = {
                id: 'test2',
                data: new TextEncoder().encode('test data 2')
            };

            const signature1 = await provider.generateSignature(entity1);
            const signature2 = await provider.generateSignature(entity2);

            expect(signature1.id).not.toBe(signature2.id);
            expect(signature1.signature).not.toEqual(signature2.signature);
        });
    });

    describe('Signature Verification', () => {
        it('should verify valid signatures', async () => {
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('test data')
            };

            const signature = await provider.generateSignature(entity);
            const isValid = await provider.verifySignature(signature, entity);
            expect(isValid).toBe(true);
        });

        it('should reject invalid signatures', async () => {
            const entity = {
                id: 'test',
                data: new TextEncoder().encode('test data')
            };
            const wrongEntity = {
                id: 'test',
                data: new TextEncoder().encode('wrong data')
            };

            const signature = await provider.generateSignature(entity);
            const isValid = await provider.verifySignature(signature, wrongEntity);
            expect(isValid).toBe(false);
        });

        it('should handle empty data', async () => {
            const entity = {
                id: 'test',
                data: new Uint8Array(0)
            };

            const signature = await provider.generateSignature(entity);
            const isValid = await provider.verifySignature(signature, entity);
            expect(isValid).toBe(true);
        });
    });
}); 