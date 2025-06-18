import { HybridEncryption } from './HybridEncryption';
import { ICryptoPrimitives, KeyPair, CryptoPrimitive } from '../interfaces/ICryptoPrimitives';

class MockCryptoPrimitives implements ICryptoPrimitives {
    async generateRandomBytes(length: number): Promise<Uint8Array> {
        return new Uint8Array(length);
    }

    async generateRSAKeyPair(bits: number): Promise<KeyPair> {
        return {
            publicKey: new Uint8Array(32),
            privateKey: new Uint8Array(32),
            algorithm: 'RSA',
            securityLevel: 256
        };
    }

    async generateLatticeKeyPair(): Promise<KeyPair> {
        return {
            publicKey: new Uint8Array(32),
            privateKey: new Uint8Array(32),
            algorithm: 'Lattice',
            securityLevel: 256
        };
    }

    async generateECKeyPair(): Promise<KeyPair> {
        return {
            publicKey: new Uint8Array(32),
            privateKey: new Uint8Array(32),
            algorithm: 'EC',
            securityLevel: 256
        };
    }

    async generateHashBasedSignature(): Promise<KeyPair> {
        return {
            publicKey: new Uint8Array(32),
            privateKey: new Uint8Array(32),
            algorithm: 'HashBased',
            securityLevel: 256
        };
    }

    async generateCodeBasedKeyPair(): Promise<KeyPair> {
        return {
            publicKey: new Uint8Array(32),
            privateKey: new Uint8Array(32),
            algorithm: 'CodeBased',
            securityLevel: 256
        };
    }

    async generateHybridKeyPair(): Promise<{ classical: KeyPair; quantum: KeyPair }> {
        return {
            classical: {
                publicKey: new Uint8Array(32),
                privateKey: new Uint8Array(32),
                algorithm: 'RSA',
                securityLevel: 256
            },
            quantum: {
                publicKey: new Uint8Array(32),
                privateKey: new Uint8Array(32),
                algorithm: 'Lattice',
                securityLevel: 256
            }
        };
    }

    async generateAESKey(bits: number): Promise<Uint8Array> {
        return new Uint8Array(bits / 8);
    }

    async encryptAES(data: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
        return data;
    }

    async decryptAES(data: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
        return data;
    }

    async encryptRSA(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array> {
        return data;
    }

    async decryptRSA(data: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
        return data;
    }

    async encryptLattice(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array> {
        return data;
    }

    async decryptLattice(data: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
        return data;
    }

    async encryptHybrid(data: Uint8Array, publicKeys: { classical: Uint8Array; quantum: Uint8Array }): Promise<{ classical: Uint8Array; quantum: Uint8Array }> {
        return {
            classical: data,
            quantum: data
        };
    }

    async hash(data: Uint8Array): Promise<Uint8Array> {
        return data;
    }

    async deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
        return new Uint8Array(32);
    }

    async getAvailablePrimitives(): Promise<CryptoPrimitive[]> {
        return [{
            name: 'RSA',
            type: 'classical',
            securityLevel: 256,
            keySize: 4096,
            isQuantumResistant: false
        }];
    }

    async getRecommendedPrimitive(securityLevel: number): Promise<CryptoPrimitive> {
        return {
            name: 'RSA',
            type: 'classical',
            securityLevel: securityLevel,
            keySize: 4096,
            isQuantumResistant: false
        };
    }
}

describe('HybridEncryption', () => {
    let bridge: ICryptoPrimitives;
    let hybrid: HybridEncryption;

    beforeAll(() => {
        bridge = new MockCryptoPrimitives();
        hybrid = HybridEncryption.getInstance(bridge);
    });

    describe('Key Generation', () => {
        it('should generate valid hybrid key pairs', async () => {
            const keyPair = await hybrid.generateHybridKeyPair();
            
            expect(keyPair.classical).toBeDefined();
            expect(keyPair.quantum).toBeDefined();
            expect(keyPair.timestamp).toBeDefined();
            expect(keyPair.version).toBeDefined();
            
            expect(keyPair.classical.publicKey).toBeInstanceOf(Uint8Array);
            expect(keyPair.classical.privateKey).toBeInstanceOf(Uint8Array);
            expect(keyPair.quantum.publicKey).toBeInstanceOf(Uint8Array);
            expect(keyPair.quantum.privateKey).toBeInstanceOf(Uint8Array);
        });

        it('should generate different key pairs each time', async () => {
            const keyPair1 = await hybrid.generateHybridKeyPair();
            const keyPair2 = await hybrid.generateHybridKeyPair();
            
            expect(keyPair1.classical.publicKey).not.toEqual(keyPair2.classical.publicKey);
            expect(keyPair1.quantum.publicKey).not.toEqual(keyPair2.quantum.publicKey);
        });
    });

    describe('Encryption and Decryption', () => {
        let keyPair: any;
        const testData = new TextEncoder().encode('Test data for hybrid encryption');

        beforeAll(async () => {
            keyPair = await hybrid.generateHybridKeyPair();
        });

        it('should encrypt and decrypt data successfully', async () => {
            const encrypted = await hybrid.encrypt(testData, {
                classical: keyPair.classical.publicKey,
                quantum: keyPair.quantum.publicKey
            });

            expect(encrypted.classical).toBeInstanceOf(Uint8Array);
            expect(encrypted.quantum).toBeInstanceOf(Uint8Array);
            expect(encrypted.data).toBeInstanceOf(Uint8Array);
            expect(encrypted.metadata).toBeDefined();

            const decrypted = await hybrid.decrypt(encrypted, {
                classical: keyPair.classical.privateKey,
                quantum: keyPair.quantum.privateKey
            });

            expect(decrypted).toEqual(testData);
        });

        it('should fail to decrypt with wrong keys', async () => {
            const wrongKeyPair = await hybrid.generateHybridKeyPair();
            const encrypted = await hybrid.encrypt(testData, {
                classical: keyPair.classical.publicKey,
                quantum: keyPair.quantum.publicKey
            });

            await expect(hybrid.decrypt(encrypted, {
                classical: wrongKeyPair.classical.privateKey,
                quantum: wrongKeyPair.quantum.privateKey
            })).rejects.toThrow();
        });

        it('should fall back to quantum decryption if classical fails', async () => {
            const encrypted = await hybrid.encrypt(testData, {
                classical: keyPair.classical.publicKey,
                quantum: keyPair.quantum.publicKey
            });

            // Corrupt classical encrypted data
            encrypted.classical = new Uint8Array(encrypted.classical.length);

            const decrypted = await hybrid.decrypt(encrypted, {
                classical: keyPair.classical.privateKey,
                quantum: keyPair.quantum.privateKey
            });

            expect(decrypted).toEqual(testData);
        });
    });

    describe('Key Rotation', () => {
        it('should not rotate keys before interval', async () => {
            const keyPair = await hybrid.generateHybridKeyPair();
            const newKeyPair = await hybrid.rotateKeys(keyPair);
            
            expect(newKeyPair).toEqual(keyPair);
        });

        it('should rotate keys after interval', async () => {
            const keyPair = await hybrid.generateHybridKeyPair();
            
            // Mock timestamp to be older than rotation interval
            keyPair.timestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours
            
            const newKeyPair = await hybrid.rotateKeys(keyPair);
            
            expect(newKeyPair).not.toEqual(keyPair);
            expect(newKeyPair.timestamp).toBeGreaterThan(keyPair.timestamp);
        });
    });

    describe('Metadata Verification', () => {
        it('should verify valid metadata', async () => {
            const keyPair = await hybrid.generateHybridKeyPair();
            const encrypted = await hybrid.encrypt(
                new TextEncoder().encode('Test data'),
                {
                    classical: keyPair.classical.publicKey,
                    quantum: keyPair.quantum.publicKey
                }
            );

            const isValid = await hybrid.verifyMetadata(encrypted);
            expect(isValid).toBe(true);
        });

        it('should reject data with wrong version', async () => {
            const keyPair = await hybrid.generateHybridKeyPair();
            const encrypted = await hybrid.encrypt(
                new TextEncoder().encode('Test data'),
                {
                    classical: keyPair.classical.publicKey,
                    quantum: keyPair.quantum.publicKey
                }
            );

            encrypted.metadata.version = '0.0.0';
            const isValid = await hybrid.verifyMetadata(encrypted);
            expect(isValid).toBe(false);
        });

        it('should reject old data', async () => {
            const keyPair = await hybrid.generateHybridKeyPair();
            const encrypted = await hybrid.encrypt(
                new TextEncoder().encode('Test data'),
                {
                    classical: keyPair.classical.publicKey,
                    quantum: keyPair.quantum.publicKey
                }
            );

            encrypted.metadata.timestamp = Date.now() - (8 * 24 * 60 * 60 * 1000); // 8 days
            const isValid = await hybrid.verifyMetadata(encrypted);
            expect(isValid).toBe(false);
        });
    });

    describe('Reencryption', () => {
        it('should reencrypt data with new keys', async () => {
            const oldKeyPair = await hybrid.generateHybridKeyPair();
            const newKeyPair = await hybrid.generateHybridKeyPair();
            
            const originalData = new TextEncoder().encode('Test data');
            const encrypted = await hybrid.encrypt(originalData, {
                classical: oldKeyPair.classical.publicKey,
                quantum: oldKeyPair.quantum.publicKey
            });

            const reencrypted = await hybrid.reencrypt(encrypted, oldKeyPair, newKeyPair);
            
            const decrypted = await hybrid.decrypt(reencrypted, {
                classical: newKeyPair.classical.privateKey,
                quantum: newKeyPair.quantum.privateKey
            });

            expect(decrypted).toEqual(originalData);
        });

        it('should fail reencryption with wrong old keys', async () => {
            const oldKeyPair = await hybrid.generateHybridKeyPair();
            const newKeyPair = await hybrid.generateHybridKeyPair();
            const wrongKeyPair = await hybrid.generateHybridKeyPair();
            
            const encrypted = await hybrid.encrypt(
                new TextEncoder().encode('Test data'),
                {
                    classical: oldKeyPair.classical.publicKey,
                    quantum: oldKeyPair.quantum.publicKey
                }
            );

            await expect(hybrid.reencrypt(encrypted, wrongKeyPair, newKeyPair))
                .rejects.toThrow();
        });
    });
}); 