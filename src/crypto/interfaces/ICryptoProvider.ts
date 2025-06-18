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