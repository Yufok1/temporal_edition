import { ICryptoProvider, EncryptionKeyPair, SigningKeyPair } from '../interfaces/ICryptoProvider';
export declare class SodiumCryptoProvider implements ICryptoProvider {
    private initialized;
    constructor();
    initialize(): Promise<void>;
    generateEncryptionKeyPair(): Promise<EncryptionKeyPair>;
    generateSigningKeyPair(): Promise<SigningKeyPair>;
    sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;
    encrypt(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array>;
    decrypt(encryptedData: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
    getAlgorithm(): string;
}
