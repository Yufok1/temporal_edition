"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataHashHarmonicSignatureProvider = void 0;
const uuid_1 = require("uuid");
class DataHashHarmonicSignatureProvider {
    constructor() {
        this.cryptoProvider = null;
        this.initialized = false;
        this.keyPair = null;
    }
    async initialize(cryptoProvider) {
        this.cryptoProvider = cryptoProvider;
        this.keyPair = await this.cryptoProvider.generateSigningKeyPair();
        this.initialized = true;
    }
    async generateSignature(entity) {
        if (!this.initialized || !this.cryptoProvider || !this.keyPair) {
            throw new Error('Provider not initialized');
        }
        // Generate a hash of the entity's data
        const dataHash = await this.cryptoProvider.sign(entity.data, this.keyPair.privateKey);
        // Create the harmonic signature
        const signature = {
            id: (0, uuid_1.v4)(),
            signature: dataHash,
            timestamp: Date.now(),
            metadata: {
                entityId: entity.id,
                dataLength: entity.data.length,
                publicKey: this.keyPair.publicKey,
                ...entity.metadata
            }
        };
        return signature;
    }
    async verifySignature(signature, entity) {
        if (!this.initialized || !this.cryptoProvider) {
            throw new Error('Provider not initialized');
        }
        try {
            // Get the public key from the signature metadata
            const publicKey = signature.metadata?.publicKey;
            if (!publicKey) {
                return false;
            }
            // Verify the signature against the entity's data
            return await this.cryptoProvider.verify(entity.data, signature.signature, publicKey);
        }
        catch (error) {
            return false;
        }
    }
    getSignatureType() {
        return 'data-hash-harmonic-v1';
    }
}
exports.DataHashHarmonicSignatureProvider = DataHashHarmonicSignatureProvider;
//# sourceMappingURL=DataHashHarmonicSignatureProvider.js.map