import { WhaleSupreme } from './WhaleSupreme';
import { PoseidonSystem } from './PoseidonSystem';
import { WhaleSignalProcessing } from './WhaleSignalProcessing';
import { EnvironmentalSignal } from '../types/whale';
interface PowerMetrics {
    timestamp: Date;
    currentLevel: number;
    consumptionRate: number;
    restorationRate: number;
    environmentalStability: number;
}
interface DecisionMetrics {
    timestamp: Date;
    decisionType: string;
    powerLevel: number;
    ethicalAlignment: number;
    ecologicalImpact: number;
    environmentalContext: EnvironmentalSignal;
    decisionContext: string;
}
export interface MonitoringAlert {
    timestamp: Date;
    alertType: 'power' | 'ethical' | 'ecological';
    severity: 'low' | 'medium' | 'high';
    message: string;
    context: any;
}
export declare class WhaleSupremeMonitoring {
    private whaleSupreme;
    private poseidon;
    private processor;
    private powerHistory;
    private decisionHistory;
    private alerts;
    private monitoringInterval;
    private readonly POWER_THRESHOLD_LOW;
    private readonly POWER_THRESHOLD_HIGH;
    private readonly ETHICAL_THRESHOLD;
    private readonly ECOLOGICAL_THRESHOLD;
    constructor(whaleSupreme: WhaleSupreme, poseidon: PoseidonSystem, processor: WhaleSignalProcessing);
    private initializeMonitoring;
    private updatePowerMetrics;
    private calculateConsumptionRate;
    private calculateRestorationRate;
    private calculateEnvironmentalStability;
    private checkThresholds;
    logDecision(decision: DecisionMetrics): void;
    private analyzeDecisionImpact;
    private calculatePowerImpact;
    private calculateEthicalImpact;
    private calculateEcologicalImpact;
    private createAlert;
    private trimHistory;
    getPowerMetrics(): PowerMetrics[];
    getDecisionMetrics(): DecisionMetrics[];
    getAlerts(): MonitoringAlert[];
    getRecentPowerTrend(): {
        trend: 'increasing' | 'decreasing' | 'stable';
        rate: number;
    };
    dispose(): void;
}
export {};
