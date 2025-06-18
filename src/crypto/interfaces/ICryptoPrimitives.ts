export interface CryptoPrimitive {
    name: string;
    type: 'classical' | 'post-quantum' | 'hybrid';
    securityLevel: number; // in bits
    keySize: number; // in bits
    isQuantumResistant: boolean;
}

export interface KeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
    algorithm: string;
    securityLevel: number;
}

export interface ICryptoPrimitives {
    // Classical primitives
    generateRSAKeyPair(bits: number): Promise<KeyPair>;
    generateECKeyPair(curve: string): Promise<KeyPair>;
    generateAESKey(bits: number): Promise<Uint8Array>;
    
    // Post-quantum primitives
    generateLatticeKeyPair(): Promise<KeyPair>;
    generateHashBasedSignature(): Promise<KeyPair>;
    generateCodeBasedKeyPair(): Promise<KeyPair>;
    
    // Hybrid primitives
    generateHybridKeyPair(): Promise<{
        classical: KeyPair;
        quantum: KeyPair;
    }>;
    
    // Symmetric operations
    encryptAES(data: Uint8Array, key: Uint8Array): Promise<Uint8Array>;
    decryptAES(encrypted: Uint8Array, key: Uint8Array): Promise<Uint8Array>;
    
    // Asymmetric operations
    encryptRSA(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array>;
    decryptRSA(encrypted: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    
    // Post-quantum operations
    encryptLattice(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array>;
    decryptLattice(encrypted: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    
    // Hybrid operations
    encryptHybrid(data: Uint8Array, publicKeys: { classical: Uint8Array; quantum: Uint8Array }): Promise<{
        classical: Uint8Array;
        quantum: Uint8Array;
    }>;
    
    // Hashing
    hash(data: Uint8Array, algorithm: 'SHA-256' | 'SHA-512' | 'SHA3-256' | 'SHA3-512'): Promise<Uint8Array>;
    
    // Key derivation
    deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array>;
    
    // Random number generation
    generateRandomBytes(length: number): Promise<Uint8Array>;
    
    // Utility functions
    getAvailablePrimitives(): Promise<CryptoPrimitive[]>;
    getRecommendedPrimitive(securityLevel: number): Promise<CryptoPrimitive>;
} 