import { ICryptoProvider } from '../../crypto/interfaces/ICryptoProvider';

/**
 * Represents a harmonic signature for an entity or data
 */
export interface HarmonicSignature {
    /** The unique identifier for this signature */
    id: string;
    /** The actual signature data */
    signature: Uint8Array;
    /** Timestamp when the signature was created */
    timestamp: number;
    /** Optional metadata about the signature */
    metadata?: Record<string, unknown>;
}

/**
 * Represents an entity that can have a harmonic signature
 */
export interface Entity {
    /** Unique identifier for the entity */
    id: string;
    /** Data that represents the entity's state or characteristics */
    data: Uint8Array;
    /** Optional metadata about the entity */
    metadata?: Record<string, unknown>;
}

/**
 * Interface for generating and verifying harmonic signatures
 */
export interface IHarmonicSignatureProvider {
    /**
     * Initialize the provider with necessary cryptographic components
     * @param cryptoProvider The cryptographic provider to use for signing/verification
     */
    initialize(cryptoProvider: ICryptoProvider): Promise<void>;

    /**
     * Generate a harmonic signature for an entity
     * @param entity The entity to generate a signature for
     * @returns A promise that resolves to the generated harmonic signature
     */
    generateSignature(entity: Entity): Promise<HarmonicSignature>;

    /**
     * Verify if a signature matches an entity
     * @param signature The harmonic signature to verify
     * @param entity The entity to verify against
     * @returns A promise that resolves to true if the signature is valid
     */
    verifySignature(signature: HarmonicSignature, entity: Entity): Promise<boolean>;

    /**
     * Get the type of harmonic signature this provider generates
     * @returns A string describing the signature type
     */
    getSignatureType(): string;
} 