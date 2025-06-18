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