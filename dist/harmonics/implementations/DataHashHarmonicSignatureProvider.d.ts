import { ICryptoProvider } from '../../crypto/interfaces/ICryptoProvider';
import { Entity, HarmonicSignature, IHarmonicSignatureProvider } from '../interfaces/IHarmonicSignatureProvider';
export declare class DataHashHarmonicSignatureProvider implements IHarmonicSignatureProvider {
    private cryptoProvider;
    private initialized;
    private keyPair;
    initialize(cryptoProvider: ICryptoProvider): Promise<void>;
    generateSignature(entity: Entity): Promise<HarmonicSignature>;
    verifySignature(signature: HarmonicSignature, entity: Entity): Promise<boolean>;
    getSignatureType(): string;
}
