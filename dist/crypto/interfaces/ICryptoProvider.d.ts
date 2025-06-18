/**
 * Interface defining the core operations for quantum-safe cryptography
 * This interface serves as the foundation for all cryptographic implementations
 */
export interface EncryptionKeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
}
export interface SigningKeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
}
export interface ICryptoProvider {
    generateEncryptionKeyPair(): Promise<EncryptionKeyPair>;
    generateSigningKeyPair(): Promise<SigningKeyPair>;
    encrypt(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array>;
    decrypt(encryptedData: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
    getAlgorithm(): string;
}
