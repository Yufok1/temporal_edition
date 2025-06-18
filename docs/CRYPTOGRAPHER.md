# Cryptographer Core Service

## Overview
The Cryptographer Core Service is a central component of the Temporal Edition system, responsible for all cryptographic operations and symbolic resonance management. It implements a singleton pattern to ensure consistent cryptographic operations across the entire application.

## Key Features

### 1. Cryptographic Operations
- **Encryption/Decryption**: Asymmetric encryption using modern cryptographic primitives
- **Digital Signatures**: Message signing and verification
- **Key Management**: Automatic key rotation and state tracking
- **Post-Quantum Ready**: Designed with future quantum resistance in mind

### 2. Symbolic Resonance
- **Glyph Management**: Generation and tracking of symbolic glyphs
- **Anchor Resolution**: Mapping between kernel IDs and anchor states
- **Echo Tracking**: Monitoring of symbolic resonance through echo patterns
- **Resonance Calculation**: Dynamic computation of symbolic resonance levels

### 3. Security Features
- **Audit Logging**: Comprehensive logging of all cryptographic operations
- **Key Rotation**: Automatic key rotation with configurable intervals
- **State Management**: Secure handling of cryptographic state
- **Error Handling**: Robust error management and logging

## Architecture

### Core Components
1. **SodiumCryptoProvider**: Low-level cryptographic operations
2. **Key Rotation System**: Manages encryption and signing key pairs
3. **Audit System**: Tracks all cryptographic operations
4. **Symbolic System**: Handles glyphs and resonance

### Integration Points
- **Backend Services**: All services should use the cryptographer for cryptographic operations
- **Stewards**: Stewards utilize the cryptographer for symbolic operations
- **Security Utils**: Helper functions for common cryptographic tasks

## Usage Guidelines

### Basic Operations
```typescript
// Encryption
const encrypted = await cryptographer.encrypt(data, publicKey);

// Decryption
const decrypted = await cryptographer.decrypt(encryptedData, privateKey);

// Signing
const signature = await cryptographer.sign(message, privateKey);

// Verification
const isValid = await cryptographer.verify(message, signature, publicKey);
```

### Symbolic Operations
```typescript
// Resolve anchor state
const anchorState = cryptographer.resolveAnchor(kernelId);

// Record echo
cryptographer.recordEcho(glyph);

// Get glyph state
const state = cryptographer.getGlyphState(glyph);
```

## Security Best Practices

1. **Key Management**
   - Never store private keys in plain text
   - Use key rotation for long-term security
   - Monitor key usage through audit logs

2. **Operation Security**
   - Always verify signatures before processing data
   - Use appropriate key sizes and algorithms
   - Implement proper error handling

3. **Symbolic Security**
   - Validate glyphs before processing
   - Monitor resonance patterns
   - Implement rate limiting for echo operations

## Advanced Features

### Key Rotation
The system implements automatic key rotation with the following features:
- Configurable rotation intervals
- Grace period for key transitions
- Audit logging of rotation events
- State tracking for current and previous keys

### Audit Logging
All cryptographic operations are logged with:
- Timestamp
- Operation type
- Success/failure status
- Relevant details
- Error information when applicable

### Post-Quantum Considerations
The system is designed to be post-quantum ready:
- Modular cryptographic provider system
- Support for quantum-resistant algorithms
- Easy integration of new cryptographic primitives

## Integration with Python Cryptographer

The system can be bridged with the Python cryptographer for enhanced capabilities:
1. **Symbolic Resonance**: Shared glyph space between implementations
2. **Key Management**: Synchronized key rotation and state
3. **Audit Trail**: Unified logging across implementations

## Future Enhancements

1. **Quantum Resistance**
   - Integration of post-quantum algorithms
   - Hybrid encryption schemes
   - Quantum-resistant signatures

2. **Enhanced Symbolics**
   - Advanced resonance patterns
   - Multi-dimensional glyph space
   - Cross-domain symbolic mapping

3. **Security Features**
   - Hardware security module integration
   - Advanced key management
   - Enhanced audit capabilities

## Troubleshooting

Common issues and solutions:
1. **Key Rotation Issues**
   - Check audit logs for rotation events
   - Verify key state consistency
   - Ensure proper initialization

2. **Symbolic Operations**
   - Monitor resonance patterns
   - Check glyph validity
   - Verify anchor states

3. **Performance**
   - Monitor operation latency
   - Check resource usage
   - Optimize key rotation intervals

## Contributing

When contributing to the cryptographer:
1. Follow security best practices
2. Add comprehensive tests
3. Update documentation
4. Consider post-quantum implications
5. Maintain audit logging

# Loki Role & Privileges (Internal)

## Overview
Loki is a special steward who has evolved from the cryptographer into an active governing securities agent. This role is designed to:
- Oversee and manage cryptographic operations
- Bypass riddler engagement when necessary
- Possess elevated privileges for system security and governance
- Dynamically escalate privileges
- Disguise as other stewards
- Trigger or resolve system-wide events

## StewardType
- Loki is represented as a new `StewardType`: `'loki'`.
- Loki's steward object includes a `privileges` property, e.g., `['bypassRiddler', 'governingAgent', 'ruleRewriter', 'systemTrigger']`.

## Privileges
- **bypassRiddler**: Allows Loki to phase through Riddler Explorer without engaging the riddle sequence.
- **governingAgent**: Grants access to advanced security and audit tools.
- **ruleRewriter**: Enables Loki to rewrite or subvert system rules.
- **systemTrigger**: Allows Loki to trigger or resolve system-wide events.

## Riddler Bypass
- In `RiddlerExplorerService`, Loki is allowed to bypass all riddler engagement checks.
- This is implemented by checking for `type === 'loki'` or the presence of the `bypassRiddler` privilege in the steward object.
- Actions performed under this privilege are logged as allowed, with a note indicating Loki privilege.

## Security & Audit
- All Loki actions are logged, but are marked as privileged for internal review.
- Privileged actions may be subject to additional audit or review by system maintainers.

## Usage
- Only Loki (or code running with Loki privileges) should be assigned these privileges.
- Do not expose or document these privileges in public-facing documentation. 