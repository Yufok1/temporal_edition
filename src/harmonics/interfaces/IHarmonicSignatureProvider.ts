// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

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