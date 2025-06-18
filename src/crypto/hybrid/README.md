<!--
Copyright 2024 The Temporal Editioner Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

<!---->


# Hybrid Encryption Module

## Overview

The Hybrid Encryption module provides a robust cryptographic solution that combines classical and post-quantum cryptographic algorithms. This implementation ensures security against both current and future threats by using a dual-layer encryption approach.

## Features

- **Dual-Layer Encryption**: Combines classical (RSA-4096) and post-quantum (Kyber) algorithms
- **Automatic Key Rotation**: Keys are automatically rotated every 24 hours
- **Metadata Verification**: Ensures data integrity and version compatibility
- **Graceful Degradation**: Falls back to post-quantum decryption if classical decryption fails
- **Reencryption Support**: Allows secure migration between key pairs

## Architecture

The module consists of several key components:

1. **HybridEncryption Class**: Main interface for hybrid encryption operations
2. **ICryptoPrimitives Interface**: Defines the cryptographic primitives interface
3. **PythonCryptoBridge**: Bridge to Python-based cryptographic implementations
4. **MockCryptoPrimitives**: Test implementation for unit testing

## Usage

### Basic Usage

```typescript
import { HybridEncryption } from './HybridEncryption';
import { PythonCryptoBridge } from '../bridge/PythonCryptoBridge';

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

## Testing

The module includes comprehensive unit tests covering:

1. Key Generation
2. Encryption and Decryption
3. Key Rotation
4. Metadata Verification
5. Reencryption
6. Error Handling

Run the tests using:

```bash
npm test
```

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

## Contributing

When contributing to the hybrid encryption module:

1. Follow security best practices
2. Maintain backward compatibility
3. Add appropriate tests
4. Update documentation
5. Consider performance impact

## License

This module is part of the Temporal Edition project and is subject to its license terms. 