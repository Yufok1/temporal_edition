"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SodiumCryptoProvider = void 0;
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
class SodiumCryptoProvider {
    constructor() {
        this.initialized = false;
        this.initialize();
    }
    async initialize() {
        if (!this.initialized) {
            await libsodium_wrappers_1.default.ready;
            this.initialized = true;
        }
    }
    async generateEncryptionKeyPair() {
        await this.initialize();
        const keyPair = libsodium_wrappers_1.default.crypto_box_keypair();
        return {
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey
        };
    }
    async generateSigningKeyPair() {
        await this.initialize();
        const keyPair = libsodium_wrappers_1.default.crypto_sign_keypair();
        return {
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey
        };
    }
    async sign(message, privateKey) {
        await this.initialize();
        return libsodium_wrappers_1.default.crypto_sign_detached(message, privateKey);
    }
    async verify(message, signature, publicKey) {
        await this.initialize();
        try {
            return libsodium_wrappers_1.default.crypto_sign_verify_detached(signature, message, publicKey);
        }
        catch (error) {
            return false;
        }
    }
    async encrypt(data, publicKey) {
        await this.initialize();
        const ephemeralKeyPair = libsodium_wrappers_1.default.crypto_box_keypair();
        const nonce = libsodium_wrappers_1.default.randombytes_buf(libsodium_wrappers_1.default.crypto_box_NONCEBYTES);
        const encryptedMessage = libsodium_wrappers_1.default.crypto_box_easy(data, nonce, publicKey, ephemeralKeyPair.privateKey);
        // Combine ephemeral public key, nonce, and encrypted message
        const combined = new Uint8Array(ephemeralKeyPair.publicKey.length + nonce.length + encryptedMessage.length);
        combined.set(ephemeralKeyPair.publicKey, 0);
        combined.set(nonce, ephemeralKeyPair.publicKey.length);
        combined.set(encryptedMessage, ephemeralKeyPair.publicKey.length + nonce.length);
        return combined;
    }
    async decrypt(encryptedData, privateKey) {
        await this.initialize();
        // Extract ephemeral public key, nonce, and encrypted message
        const ephemeralPublicKey = encryptedData.slice(0, libsodium_wrappers_1.default.crypto_box_PUBLICKEYBYTES);
        const nonce = encryptedData.slice(libsodium_wrappers_1.default.crypto_box_PUBLICKEYBYTES, libsodium_wrappers_1.default.crypto_box_PUBLICKEYBYTES + libsodium_wrappers_1.default.crypto_box_NONCEBYTES);
        const encryptedMessage = encryptedData.slice(libsodium_wrappers_1.default.crypto_box_PUBLICKEYBYTES + libsodium_wrappers_1.default.crypto_box_NONCEBYTES);
        return libsodium_wrappers_1.default.crypto_box_open_easy(encryptedMessage, nonce, ephemeralPublicKey, privateKey);
    }
    getAlgorithm() {
        return 'libsodium-crypto-box-v1';
    }
}
exports.SodiumCryptoProvider = SodiumCryptoProvider;
//# sourceMappingURL=SodiumCryptoProvider.js.map