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

export class WhaleSupremeMonitoring {
    private powerHistory: PowerMetrics[] = [];
    private decisionHistory: DecisionMetrics[] = [];
    private alerts: MonitoringAlert[] = [];
    private monitoringInterval: NodeJS.Timeout | null = null;
    private readonly POWER_THRESHOLD_LOW = 0.2;
    private readonly POWER_THRESHOLD_HIGH = 0.9;
    private readonly ETHICAL_THRESHOLD = 0.7;
    private readonly ECOLOGICAL_THRESHOLD = 0.7;

    constructor(
        private whaleSupreme: WhaleSupreme,
        private poseidon: PoseidonSystem,
        private processor: WhaleSignalProcessing
    ) {
        this.initializeMonitoring();
    }

    private initializeMonitoring(): void {
        // Start monitoring interval
        this.monitoringInterval = setInterval(() => {
            this.updatePowerMetrics();
            this.checkThresholds();
        }, 1000); // Update every second
    }

    private updatePowerMetrics(): void {
        const status = this.whaleSupreme.getStatus();
        const envData = this.poseidon.getEnvironmentalData();

        const powerMetrics: PowerMetrics = {
            timestamp: new Date(),
            currentLevel: status.powerLevel,
            consumptionRate: this.calculateConsumptionRate(),
            restorationRate: this.calculateRestorationRate(envData),
            environmentalStability: status.powerContext.environmentalStability
        };

        this.powerHistory.push(powerMetrics);
        this.trimHistory(this.powerHistory, 1000); // Keep last 1000 records
    }

    private calculateConsumptionRate(): number {
        if (this.powerHistory.length < 2) return 0;
        const recent = this.powerHistory.slice(-2);
        return (recent[0].currentLevel - recent[1].currentLevel) / 
               (recent[0].timestamp.getTime() - recent[1].timestamp.getTime());
    }

    private calculateRestorationRate(envData: EnvironmentalSignal): number {
        // Base restoration rate on environmental stability
        const stability = this.calculateEnvironmentalStability(envData);
        return stability * 0.1; // 10% of stability per second
    }

    private calculateEnvironmentalStability(envData: EnvironmentalSignal): number {
        // Calculate stability based on environmental factors
        const tempStability = 1 - Math.abs(envData.temperature - 15) / 10; // Optimal temp around 15°C
        const salinityStability = 1 - Math.abs(envData.salinity - 32.5) / 5; // Optimal salinity around 32.5
        const currentStability = 1 - Math.min(envData.currentSpeed / 5, 1); // Lower current is more stable

        return (tempStability + salinityStability + currentStability) / 3;
    }

    private checkThresholds(): void {
        const status = this.whaleSupreme.getStatus();
        
        // Check power thresholds
        if (status.powerLevel < this.POWER_THRESHOLD_LOW) {
            this.createAlert('power', 'high', 'Power level critically low', { powerLevel: status.powerLevel });
        } else if (status.powerLevel > this.POWER_THRESHOLD_HIGH) {
            this.createAlert('power', 'medium', 'Power level approaching maximum', { powerLevel: status.powerLevel });
        }

        // Check ethical and ecological thresholds
        if (status.ethicalAlignment < this.ETHICAL_THRESHOLD) {
            this.createAlert('ethical', 'high', 'Ethical alignment below threshold', { alignment: status.ethicalAlignment });
        }

        if (status.ecologicalBalance < this.ECOLOGICAL_THRESHOLD) {
            this.createAlert('ecological', 'high', 'Ecological balance below threshold', { balance: status.ecologicalBalance });
        }
    }

    public logDecision(decision: DecisionMetrics): void {
        this.decisionHistory.push(decision);
        this.trimHistory(this.decisionHistory, 1000); // Keep last 1000 records

        // Analyze decision impact
        this.analyzeDecisionImpact(decision);
    }

    private analyzeDecisionImpact(decision: DecisionMetrics): void {
        // Calculate impact on power levels
        const powerImpact = this.calculatePowerImpact(decision);
        
        // Calculate ethical and ecological impact
        const ethicalImpact = this.calculateEthicalImpact(decision);
        const ecologicalImpact = this.calculateEcologicalImpact(decision);

        // Log analysis results
        console.log(`Decision Impact Analysis:
            Power Impact: ${powerImpact}
            Ethical Impact: ${ethicalImpact}
            Ecological Impact: ${ecologicalImpact}`);
    }

    private calculatePowerImpact(decision: DecisionMetrics): number {
        // Calculate power impact based on decision type and context
        const baseImpact = 0.1; // Base power consumption
        return baseImpact * (1 + Math.random() * 0.2); // Add some randomness
    }

    private calculateEthicalImpact(decision: DecisionMetrics): number {
        // Calculate ethical impact based on decision context and alignment
        return decision.ethicalAlignment * (1 + Math.random() * 0.1);
    }

    private calculateEcologicalImpact(decision: DecisionMetrics): number {
        // Calculate ecological impact based on environmental context
        const envStability = this.calculateEnvironmentalStability(decision.environmentalContext);
        return decision.ecologicalImpact * envStability;
    }

    private createAlert(type: 'power' | 'ethical' | 'ecological', 
                       severity: 'low' | 'medium' | 'high', 
                       message: string, 
                       context: any): void {
        const alert: MonitoringAlert = {
            timestamp: new Date(),
            alertType: type,
            severity,
            message,
            context
        };

        this.alerts.push(alert);
        this.trimHistory(this.alerts, 100); // Keep last 100 alerts

        // Log alert
        console.log(`Alert: ${message} (${severity} severity)`);
    }

    private trimHistory<T>(history: T[], maxLength: number): void {
        if (history.length > maxLength) {
            history.splice(0, history.length - maxLength);
        }
    }

    public getPowerMetrics(): PowerMetrics[] {
        return [...this.powerHistory];
    }

    public getDecisionMetrics(): DecisionMetrics[] {
        return [...this.decisionHistory];
    }

    public getAlerts(): MonitoringAlert[] {
        return [...this.alerts];
    }

    public getRecentPowerTrend(): { trend: 'increasing' | 'decreasing' | 'stable', rate: number } {
        if (this.powerHistory.length < 2) {
            return { trend: 'stable', rate: 0 };
        }

        const recent = this.powerHistory.slice(-10);
        const firstLevel = recent[0].currentLevel;
        const lastLevel = recent[recent.length - 1].currentLevel;
        const rate = (lastLevel - firstLevel) / recent.length;

        if (Math.abs(rate) < 0.01) {
            return { trend: 'stable', rate };
        }
        return { 
            trend: rate > 0 ? 'increasing' : 'decreasing',
            rate
        };
    }

    public dispose(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }
} 