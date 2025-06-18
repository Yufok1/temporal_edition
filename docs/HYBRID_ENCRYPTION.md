# Hybrid Encryption System

## Overview

The hybrid encryption system combines classical and post-quantum cryptographic algorithms to provide robust security against both current and future threats. This implementation uses a combination of AES-256 for symmetric encryption, RSA-4096 for classical asymmetric encryption, and Kyber for post-quantum encryption.

## Features

- **Dual-Layer Encryption**: Combines classical (RSA) and post-quantum (Kyber) algorithms
- **Automatic Key Rotation**: Keys are automatically rotated every 24 hours
- **Metadata Verification**: Ensures data integrity and version compatibility
- **Graceful Degradation**: Falls back to post-quantum decryption if classical decryption fails
- **Reencryption Support**: Allows secure migration between key pairs

## Usage

### Basic Usage

```typescript
import { HybridEncryption } from '../crypto/hybrid/HybridEncryption';
import { PythonCryptoBridge } from '../crypto/bridge/PythonCryptoBridge';

// Initialize the crypto bridge
const bridge = new PythonCryptoBridge();
await bridge.initialize();

// Get hybrid encryption instance
const hybrid = HybridEncryption.getInstance(bridge);

// Generate key pairs
const keyPair = await hybrid.generateHybridKeyPair();

// Encrypt data
const data = new TextEncoder().encode('Sensitive data');
const encrypted = await hybrid.encrypt(data, {
    classical: keyPair.classical.publicKey,
    quantum: keyPair.quantum.publicKey
});

// Decrypt data
const decrypted = await hybrid.decrypt(encrypted, {
    classical: keyPair.classical.privateKey,
    quantum: keyPair.quantum.privateKey
});
```

### Key Rotation

```typescript
// Check if keys need rotation
const newKeyPair = await hybrid.rotateKeys(currentKeyPair);

// Reencrypt existing data with new keys
const reencrypted = await hybrid.reencrypt(encrypted, currentKeyPair, newKeyPair);
```

### Metadata Verification

```typescript
// Verify encrypted data metadata
const isValid = await hybrid.verifyMetadata(encrypted);
if (!isValid) {
    throw new Error('Invalid encrypted data');
}
```

## Security Features

### 1. Key Management
- Automatic key rotation every 24 hours
- Secure key generation using both classical and post-quantum methods
- Key versioning and timestamp tracking

### 2. Data Protection
- AES-256 for symmetric encryption
- RSA-4096 for classical asymmetric encryption
- Kyber for post-quantum encryption
- Metadata integrity verification

### 3. Security Checks
- Version compatibility verification
- Data age validation (7-day maximum)
- Security level verification (minimum 256-bit)
- Graceful fallback mechanisms

## Best Practices

1. **Key Management**
   - Always use the key rotation mechanism
   - Store keys securely
   - Monitor key usage and rotation

2. **Data Handling**
   - Verify metadata before decryption
   - Use appropriate security levels
   - Implement proper error handling

3. **Performance**
   - Cache key pairs when appropriate
   - Monitor encryption/decryption performance
   - Implement proper logging

## Error Handling

The system provides detailed error information for various scenarios:

```typescript
try {
    const decrypted = await hybrid.decrypt(encrypted, keys);
} catch (err) {
    if (err.message.includes('Classical decryption failed')) {
        // Handle classical decryption failure
    } else if (err.message.includes('Hybrid decryption failed')) {
        // Handle complete decryption failure
    }
}
```

## Security Considerations

1. **Algorithm Selection**
   - AES-256 provides strong symmetric encryption
   - RSA-4096 offers robust classical security
   - Kyber provides post-quantum security

2. **Key Security**
   - Private keys must be stored securely
   - Key rotation is mandatory
   - Key versioning is enforced

3. **Data Protection**
   - All sensitive data is encrypted
   - Metadata is verified
   - Age limits are enforced

## Future Enhancements

1. **Algorithm Updates**
   - Additional post-quantum algorithms
   - Enhanced classical algorithms
   - Improved hybrid combinations

2. **Security Features**
   - Additional metadata verification
   - Enhanced key rotation policies
   - Improved error handling

3. **Performance**
   - Optimized key generation
   - Improved encryption/decryption speed
   - Better caching mechanisms

## Troubleshooting

### Common Issues

1. **Decryption Failures**
   - Check key validity
   - Verify metadata
   - Ensure proper key rotation

2. **Performance Issues**
   - Monitor key generation
   - Check system resources
   - Verify algorithm selection

3. **Security Warnings**
   - Review key rotation
   - Check metadata validity
   - Verify security levels

## Contributing

When contributing to the hybrid encryption system:

1. Follow security best practices
2. Maintain backward compatibility
3. Add appropriate tests
4. Update documentation
5. Consider performance impact 