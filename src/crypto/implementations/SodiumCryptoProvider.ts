// declare module 'libsodium-wrappers';
import sodium from 'libsodium-wrappers';
import { ICryptoProvider, EncryptionKeyPair, SigningKeyPair } from '../interfaces/ICryptoProvider';

export class SodiumCryptoProvider implements ICryptoProvider {
    private initialized: boolean = false;

    constructor() {
        this.initialize();
    }

    public async initialize(): Promise<void> {
        if (!this.initialized) {
            await sodium.ready;
            this.initialized = true;
        }
    }

    async generateEncryptionKeyPair(): Promise<EncryptionKeyPair> {
        await this.initialize();
        const keyPair = sodium.crypto_box_keypair();
        return {
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey
        };
    }

    async generateSigningKeyPair(): Promise<SigningKeyPair> {
        await this.initialize();
        const keyPair = sodium.crypto_sign_keypair();
        return {
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey
        };
    }

    async sign(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
        await this.initialize();
        return sodium.crypto_sign_detached(message, privateKey);
    }

    async verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
        await this.initialize();
        try {
            return sodium.crypto_sign_verify_detached(signature, message, publicKey);
        } catch (error) {
            return false;
        }
    }

    async encrypt(data: Uint8Array, publicKey: Uint8Array): Promise<Uint8Array> {
        await this.initialize();
        const ephemeralKeyPair = sodium.crypto_box_keypair();
        const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
        
        const encryptedMessage = sodium.crypto_box_easy(
            data,
            nonce,
            publicKey,
            ephemeralKeyPair.privateKey
        );

        // Combine ephemeral public key, nonce, and encrypted message
        const combined = new Uint8Array(
            ephemeralKeyPair.publicKey.length + nonce.length + encryptedMessage.length
        );
        combined.set(ephemeralKeyPair.publicKey, 0);
        combined.set(nonce, ephemeralKeyPair.publicKey.length);
        combined.set(encryptedMessage, ephemeralKeyPair.publicKey.length + nonce.length);

        return combined;
    }

    async decrypt(encryptedData: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
        await this.initialize();
        
        // Extract ephemeral public key, nonce, and encrypted message
        const ephemeralPublicKey = encryptedData.slice(0, sodium.crypto_box_PUBLICKEYBYTES);
        const nonce = encryptedData.slice(
            sodium.crypto_box_PUBLICKEYBYTES,
            sodium.crypto_box_PUBLICKEYBYTES + sodium.crypto_box_NONCEBYTES
        );
        const encryptedMessage = encryptedData.slice(
            sodium.crypto_box_PUBLICKEYBYTES + sodium.crypto_box_NONCEBYTES
        );

        return sodium.crypto_box_open_easy(
            encryptedMessage,
            nonce,
            ephemeralPublicKey,
            privateKey
        );
    }

    getAlgorithm(): string {
        return 'libsodium-crypto-box-v1';
    }
} 