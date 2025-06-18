import { SodiumCryptoProvider } from '../implementations/SodiumCryptoProvider';

describe('SodiumCryptoProvider', () => {
  let provider: SodiumCryptoProvider;

  beforeEach(async () => {
    provider = new SodiumCryptoProvider();
    await provider.initialize();
  });

  describe('Key Generation', () => {
    it('should generate valid encryption key pairs', async () => {
      const keyPair = await provider.generateEncryptionKeyPair();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey.length).toBeGreaterThan(0);
      expect(keyPair.privateKey.length).toBeGreaterThan(0);
    });

    it('should generate valid signing key pairs', async () => {
      const keyPair = await provider.generateSigningKeyPair();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey.length).toBeGreaterThan(0);
      expect(keyPair.privateKey.length).toBeGreaterThan(0);
    });

    it('should generate unique key pairs', async () => {
      const keyPair1 = await provider.generateEncryptionKeyPair();
      const keyPair2 = await provider.generateEncryptionKeyPair();
      expect(keyPair1.publicKey).not.toEqual(keyPair2.publicKey);
      expect(keyPair1.privateKey).not.toEqual(keyPair2.privateKey);
    });
  });

  describe('Signing and Verification', () => {
    it('should sign and verify messages correctly', async () => {
      const keyPair = await provider.generateSigningKeyPair();
      const message = new TextEncoder().encode('Test message');
      
      const signature = await provider.sign(message, keyPair.privateKey);
      expect(signature).toBeDefined();
      expect(signature.length).toBeGreaterThan(0);

      const isValid = await provider.verify(message, signature, keyPair.publicKey);
      expect(isValid).toBe(true);
    });

    it('should reject invalid signatures', async () => {
      const keyPair = await provider.generateSigningKeyPair();
      const message = new TextEncoder().encode('Test message');
      const wrongMessage = new TextEncoder().encode('Wrong message');
      
      const signature = await provider.sign(message, keyPair.privateKey);
      const isValid = await provider.verify(wrongMessage, signature, keyPair.publicKey);
      expect(isValid).toBe(false);
    });

    it('should handle empty messages', async () => {
      const keyPair = await provider.generateSigningKeyPair();
      const message = new Uint8Array(0);
      
      const signature = await provider.sign(message, keyPair.privateKey);
      const isValid = await provider.verify(message, signature, keyPair.publicKey);
      expect(isValid).toBe(true);
    });

    it('should handle large messages', async () => {
      const keyPair = await provider.generateSigningKeyPair();
      const message = new Uint8Array(32 * 1024); // 32KB message
      crypto.getRandomValues(message);
      
      const signature = await provider.sign(message, keyPair.privateKey);
      const isValid = await provider.verify(message, signature, keyPair.publicKey);
      expect(isValid).toBe(true);
    });
  });

  describe('Encryption and Decryption', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const keyPair = await provider.generateEncryptionKeyPair();
      const originalData = new TextEncoder().encode('Test message');
      
      const encrypted = await provider.encrypt(originalData, keyPair.publicKey);
      expect(encrypted).toBeDefined();
      expect(encrypted.length).toBeGreaterThan(originalData.length);

      const decrypted = await provider.decrypt(encrypted, keyPair.privateKey);
      expect(decrypted).toBeDefined();
      expect(new TextDecoder().decode(decrypted)).toBe('Test message');
    });

    it('should fail to decrypt with wrong key', async () => {
      const keyPair1 = await provider.generateEncryptionKeyPair();
      const keyPair2 = await provider.generateEncryptionKeyPair();
      const originalData = new TextEncoder().encode('Test message');
      
      const encrypted = await provider.encrypt(originalData, keyPair1.publicKey);
      await expect(provider.decrypt(encrypted, keyPair2.privateKey)).rejects.toThrow();
    });

    it('should handle empty messages', async () => {
      const keyPair = await provider.generateEncryptionKeyPair();
      const originalData = new Uint8Array(0);
      
      const encrypted = await provider.encrypt(originalData, keyPair.publicKey);
      const decrypted = await provider.decrypt(encrypted, keyPair.privateKey);
      expect(decrypted).toEqual(originalData);
    });

    it('should handle large messages', async () => {
      const keyPair = await provider.generateEncryptionKeyPair();
      const originalData = new Uint8Array(32 * 1024); // 32KB message
      crypto.getRandomValues(originalData);
      
      const encrypted = await provider.encrypt(originalData, keyPair.publicKey);
      const decrypted = await provider.decrypt(encrypted, keyPair.privateKey);
      expect(decrypted).toEqual(originalData);
    });

    it('should produce different ciphertexts for same plaintext', async () => {
      const keyPair = await provider.generateEncryptionKeyPair();
      const message = new TextEncoder().encode('Test message');
      
      const encrypted1 = await provider.encrypt(message, keyPair.publicKey);
      const encrypted2 = await provider.encrypt(message, keyPair.publicKey);
      
      expect(encrypted1).not.toEqual(encrypted2);
    });
  });

  describe('Security Properties', () => {
    it('should not expose private key material', async () => {
      const keyPair = await provider.generateEncryptionKeyPair();
      const message = new TextEncoder().encode('Test message');
      
      const encrypted = await provider.encrypt(message, keyPair.publicKey);
      expect(encrypted).not.toContain(keyPair.privateKey);
    });

    it('should handle invalid input gracefully', async () => {
      const keyPair = await provider.generateEncryptionKeyPair();
      const invalidData = new Uint8Array([1, 2, 3, 4]);
      
      await expect(provider.decrypt(invalidData, keyPair.privateKey)).rejects.toThrow();
    });
  });

  describe('Algorithm Information', () => {
    it('should return the correct algorithm name', () => {
      expect(provider.getAlgorithm()).toBe('libsodium-crypto-box-v1');
    });
  });

  describe('Performance', () => {
    it('should handle multiple operations efficiently', async () => {
      const keyPair = await provider.generateEncryptionKeyPair();
      const message = new TextEncoder().encode('Test message');
      
      const start = performance.now();
      
      // Perform 100 encryption/decryption operations
      for (let i = 0; i < 100; i++) {
        const encrypted = await provider.encrypt(message, keyPair.publicKey);
        const decrypted = await provider.decrypt(encrypted, keyPair.privateKey);
        expect(decrypted).toEqual(message);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Ensure operations complete within reasonable time (e.g., 5 seconds)
      expect(duration).toBeLessThan(5000);
    });
  });
}); 