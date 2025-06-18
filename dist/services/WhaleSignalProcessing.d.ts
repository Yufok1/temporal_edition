import { WhaleSignal, EnvironmentalSignal } from '../types/whale';
import { EnvironmentalDataIntegrator } from './EnvironmentalDataIntegrator';
export declare class WhaleSignalProcessing {
    private environmentalIntegrator;
    private signalHistory;
    private adaptiveThresholds;
    constructor(environmentalIntegrator: EnvironmentalDataIntegrator);
    addWhaleSignal(signal: WhaleSignal): void;
    addEnvironmentalSignal(signal: EnvironmentalSignal): void;
    private updateAdaptiveThresholds;
    analyzePatternsWithFourier(): any;
    analyzeWithBayesianModel(): any;
    getAdaptiveThresholds(): {
        [key: string]: number;
    };
    getSignalHistory(): WhaleSignal[];
}
