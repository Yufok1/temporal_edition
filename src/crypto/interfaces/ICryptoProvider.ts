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

/**
 * Interface defining the core operations for quantum-safe cryptography
 * This interface serves as the foundation for all cryptographic implementations
 */

// Types for keypairs
export interface EncryptionKeyPair {
    publicKey: Uint8Array; // Curve25519
    privateKey: Uint8Array;
}

export interface SigningKeyPair {
    publicKey: Uint8Array; // Ed25519
    privateKey: Uint8Array;
}

export interface ICryptoProvider {
    // Key generation
    generateEncryptionKeyPair(): Promise<EncryptionKeyPair>;
    generateSigningKeyPair(): Promise<SigningKeyPair>;

    // Encryption/Decryption
    encrypt(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array>;
    decrypt(encryptedData: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;

    // Signing/Verification
    sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;

    // Algorithm info
    getAlgorithm(): string;
} 