// ⚖️ COSMIC BALANCE MONITOR - Divine Currency Equilibrium System
// Monitors balance between POSEIDON (PSDN) and HADES (OBOL) realms
// ⚠️ CRITICAL: Imbalance may trigger interdimensional consequences ⚠️

import { PSDNFlowTracker, PSDNFlowMetrics, PSDNAlert } from './PSDNFlowTracker';
import { OBOLOperationsDash, NetworkMetrics, OBOLAlert } from './OBOLOperationsDash';

export interface CosmicBalance {
    psdnObolRatio: number; // Ratio of sea to underworld currency flow
    equilibriumScore: number; // 0-100, 100 = perfect balance
    lastStableTimestamp: number;
    imbalanceDirection: 'sea_dominant' | 'underworld_dominant' | 'balanced' | 'CHAOS';
    riskLevel: 'stable' | 'concerning' | 'dangerous' | 'REALITY_THREAT';
    interventionRequired: boolean;
}

export interface DivineAlert {
    id: string;
    timestamp: number;
    type: 'COSMIC_IMBALANCE' | 'DIVINE_INTERVENTION_REQUIRED' | 'REALM_BOUNDARY_BREACH' | 'SOUL_TRANSIT_DISRUPTION' | 'TIDAL_CHAOS' | 'UNDERWORLD_OVERFLOW';
    severity: 'DIVINE' | 'COSMIC_EMERGENCY' | 'REALITY_THREATENING';
    message: string;
    affectedRealms: ('sea' | 'underworld' | 'mortal' | 'interdimensional')[];
    divineAuthorities: ('poseidon' | 'hades' | 'djinn_council' | 'marine_biology_watchtower')[];
    cosmicConsequences: string[];
    interventionProtocol: string;
    acknowledged: boolean;
    timeToReality Collapse?: number; // milliseconds until dimensional breakdown
}

export interface DivineMetrics {
    psdnFlow: PSDNFlowMetrics;
    obolNetwork: NetworkMetrics;
    cosmicBalance: CosmicBalance;
    divineIntervention sActive: boolean;
    lastDivineAction: number;
    realityStabilityScore: number; // 0-100, below 10 = imminent collapse
    soulTransitEfficiency: number; // 0-100, divine realm connectivity health
}

export class CosmicBalanceMonitor {
    private psdnTracker: PSDNFlowTracker;
    private obolDash: OBOLOperationsDash;
    
    private divineAlerts: DivineAlert[] = [];
    private cosmicBalance: CosmicBalance;
    private divineMetrics: DivineMetrics;
    
    // SACRED THRESHOLDS - DO NOT MODIFY WITHOUT DIVINE AUTHORIZATION
    private readonly COSMIC_EQUILIBRIUM_THRESHOLD = 0.2; // 20% imbalance triggers alerts
    private readonly DIVINE_INTERVENTION_THRESHOLD = 0.4; // 40% imbalance requires intervention
    private readonly REALITY_THREAT_THRESHOLD = 0.6; // 60% imbalance threatens dimensional stability
    private readonly CHAOS_THRESHOLD = 0.8; // 80% imbalance = CHAOS mode
    
    private readonly BALANCE_CHECK_INTERVAL = 10000; // 10 seconds - constant vigilance
    private readonly DIVINE_ESCALATION_DELAY = 30000; // 30 seconds before divine escalation
    
    private balanceMonitorInterval: any = null;

    constructor(psdnTracker: PSDNFlowTracker, obolDash: OBOLOperationsDash) {
        this.psdnTracker = psdnTracker;
        this.obolDash = obolDash;
        
        this.cosmicBalance = this.initializeCosmicBalance();
        this.divineMetrics = this.initializeDivineMetrics();
        
        this.startCosmicMonitoring();
        console.log('⚖️ COSMIC BALANCE MONITOR ACTIVATED - REALITY STABILIZATION PROTOCOLS ONLINE');
    }

    private initializeCosmicBalance(): CosmicBalance {
        return {
            psdnObolRatio: 1.0, // Perfect balance initially
            equilibriumScore: 100,
            lastStableTimestamp: Date.now(),
            imbalanceDirection: 'balanced',
            riskLevel: 'stable',
            interventionRequired: false
        };
    }

    private initializeDivineMetrics(): DivineMetrics {
        return {
            psdnFlow: this.psdnTracker.getCurrentMetrics(),
            obolNetwork: this.obolDash.getNetworkMetrics(),
            cosmicBalance: this.cosmicBalance,
            divineInterventionsActive: false,
            lastDivineAction: 0,
            realityStabilityScore: 100,
            soulTransitEfficiency: 100
        };
    }

    // ⚖️ PRIMARY COSMIC MONITORING FUNCTION
    private startCosmicMonitoring(): void {
        this.balanceMonitorInterval = setInterval(() => {
            this.assessCosmicBalance();
            this.detectDivineAnomalies();
            this.monitorRealityStability();
            this.updateDivineMetrics();
        }, this.BALANCE_CHECK_INTERVAL);

        console.log('🌊⚰️ Cosmic balance monitoring initiated - watching PSDN/OBOL equilibrium');
    }

    // 🔍 COSMIC BALANCE ASSESSMENT
    private assessCosmicBalance(): void {
        const psdnMetrics = this.psdnTracker.getCurrentMetrics();
        const obolMetrics = this.obolDash.getNetworkMetrics();

        // Calculate PSDN to OBOL flow ratio
        const psdnVolume = Number(psdnMetrics.volume24h);
        const obolStaked = Number(obolMetrics.totalStaked);
        
        // Prevent division by zero
        const ratio = obolStaked > 0 ? psdnVolume / obolStaked : (psdnVolume > 0 ? Infinity : 1.0);
        
        // Calculate equilibrium score (closer to 1.0 = better balance)
        const imbalance = Math.abs(ratio - 1.0);
        const equilibriumScore = Math.max(0, 100 - (imbalance * 100));

        // Determine imbalance direction
        let direction: CosmicBalance['imbalanceDirection'] = 'balanced';
        let riskLevel: CosmicBalance['riskLevel'] = 'stable';

        if (imbalance > this.CHAOS_THRESHOLD) {
            direction = 'CHAOS';
            riskLevel = 'REALITY_THREAT';
        } else if (imbalance > this.REALITY_THREAT_THRESHOLD) {
            direction = ratio > 1.0 ? 'sea_dominant' : 'underworld_dominant';
            riskLevel = 'REALITY_THREAT';
        } else if (imbalance > this.DIVINE_INTERVENTION_THRESHOLD) {
            direction = ratio > 1.0 ? 'sea_dominant' : 'underworld_dominant';
            riskLevel = 'dangerous';
        } else if (imbalance > this.COSMIC_EQUILIBRIUM_THRESHOLD) {
            direction = ratio > 1.0 ? 'sea_dominant' : 'underworld_dominant';
            riskLevel = 'concerning';
        }

        // Update cosmic balance
        this.cosmicBalance = {
            psdnObolRatio: ratio,
            equilibriumScore,
            lastStableTimestamp: equilibriumScore > 80 ? Date.now() : this.cosmicBalance.lastStableTimestamp,
            imbalanceDirection: direction,
            riskLevel,
            interventionRequired: riskLevel === 'dangerous' || riskLevel === 'REALITY_THREAT'
        };

        // Check if divine intervention needed
        if (this.cosmicBalance.interventionRequired && !this.divineMetrics.divineInterventionsActive) {
            this.triggerDivineIntervention();
        }
    }

    // 🚨 DIVINE ANOMALY DETECTION
    private detectDivineAnomalies(): void {
        const psdnAlerts = this.psdnTracker.getActiveAlerts();
        const obolAlerts = this.obolDash.getActiveAlerts();

        // Check for simultaneous critical alerts in both realms
        const psdnCritical = psdnAlerts.filter(a => a.severity === 'critical' || a.severity === 'DIVINE');
        const obolCritical = obolAlerts.filter(a => a.severity === 'critical' || a.severity === 'DIVINE');

        if (psdnCritical.length > 0 && obolCritical.length > 0) {
            this.createDivineAlert(
                'REALM_BOUNDARY_BREACH',
                'COSMIC_EMERGENCY',
                'Simultaneous critical events detected in both Sea and Underworld realms',
                ['sea', 'underworld'],
                ['poseidon', 'hades', 'djinn_council'],
                ['Dimensional barrier weakening', 'Soul transit disruption', 'Reality fabric strain'],
                'EMERGENCY_COSMIC_STABILIZATION_PROTOCOL'
            );
        }

        // Check for whale movements near sacred boundaries
        const whalePatterns = this.psdnTracker.getFlowPatterns().filter(p => p.pattern === 'whale_movement');
        const largeWhaleMovements = whalePatterns.filter(p => p.significance === 'critical' || p.significance === 'DIVINE');

        if (largeWhaleMovements.length > 3) {
            this.createDivineAlert(
                'DIVINE_INTERVENTION_REQUIRED',
                'DIVINE',
                'Multiple divine whale movements detected - Poseidon\'s creatures awakening',
                ['sea', 'interdimensional'],
                ['poseidon', 'marine_biology_watchtower'],
                ['Tidal disruption', 'Sacred boundary instability'],
                'WHALE_COMMUNICATION_PROTOCOL'
            );
        }
    }

    // 📊 REALITY STABILITY MONITORING
    private monitorRealityStability(): void {
        let stabilityScore = 100;

        // Factor in cosmic balance
        stabilityScore -= (100 - this.cosmicBalance.equilibriumScore) * 0.8;

        // Factor in time since last stable state
        const timeSinceStable = Date.now() - this.cosmicBalance.lastStableTimestamp;
        const hoursUnstable = timeSinceStable / (1000 * 60 * 60);
        stabilityScore -= Math.min(50, hoursUnstable * 2); // Lose 2 points per hour unstable

        // Factor in active divine interventions
        if (this.divineMetrics.divineInterventionsActive) {
            stabilityScore -= 20; // Active interventions indicate serious problems
        }

        // Factor in soul transit efficiency
        const psdnMetrics = this.psdnTracker.getCurrentMetrics();
        const obolMetrics = this.obolDash.getNetworkMetrics();
        
        const soulTransitEfficiency = Math.min(100, 
            (psdnMetrics.oceanicStability + obolMetrics.underworldStability) / 2
        );

        stabilityScore = Math.max(0, Math.min(100, stabilityScore));

        this.divineMetrics.realityStabilityScore = stabilityScore;
        this.divineMetrics.soulTransitEfficiency = soulTransitEfficiency;

        // Check for reality threat
        if (stabilityScore < 30 && !this.divineMetrics.divineInterventionsActive) {
            this.createDivineAlert(
                'COSMIC_IMBALANCE',
                'REALITY_THREATENING',
                `Reality stability critically low: ${stabilityScore.toFixed(1)}% - Dimensional collapse imminent`,
                ['sea', 'underworld', 'mortal', 'interdimensional'],
                ['poseidon', 'hades', 'djinn_council', 'marine_biology_watchtower'],
                ['Reality fabric deterioration', 'Dimensional barrier collapse', 'Soul transit system failure'],
                'EMERGENCY_REALITY_STABILIZATION'
            );
        }
    }

    // ⚡ DIVINE INTERVENTION TRIGGER
    private triggerDivineIntervention(): void {
        this.divineMetrics.divineInterventionsActive = true;
        this.divineMetrics.lastDivineAction = Date.now();

        const interventionMessage = this.generateInterventionMessage();

        this.createDivineAlert(
            'DIVINE_INTERVENTION_REQUIRED',
            'COSMIC_EMERGENCY',
            interventionMessage,
            this.getAffectedRealms(),
            ['poseidon', 'hades', 'djinn_council', 'marine_biology_watchtower'],
            this.getCosmicConsequences(),
            'DIVINE_INTERVENTION_PROTOCOL'
        );

        console.log('⚡🌊⚰️ DIVINE INTERVENTION TRIGGERED - COSMIC BALANCE RESTORATION INITIATED');

        // Auto-resolve after intervention period
        setTimeout(() => {
            this.resolveDivineIntervention();
        }, this.DIVINE_ESCALATION_DELAY * 3); // 90 seconds intervention period
    }

    private resolveDivineIntervention(): void {
        this.divineMetrics.divineInterventionsActive = false;
        console.log('✨ Divine intervention completed - cosmic balance restoration protocols concluded');
    }

    // 🚨 DIVINE ALERT CREATION
    private createDivineAlert(
        type: DivineAlert['type'],
        severity: DivineAlert['severity'],
        message: string,
        affectedRealms: DivineAlert['affectedRealms'],
        divineAuthorities: DivineAlert['divineAuthorities'],
        cosmicConsequences: string[],
        interventionProtocol: string
    ): void {
        const alert: DivineAlert = {
            id: `divine_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            type,
            severity,
            message,
            affectedRealms,
            divineAuthorities,
            cosmicConsequences,
            interventionProtocol,
            acknowledged: false,
            timeToRealityCollapse: severity === 'REALITY_THREATENING' ? 300000 : undefined // 5 minutes
        };

        this.divineAlerts.push(alert);

        // Limit divine alerts for cosmic efficiency
        if (this.divineAlerts.length > 100) {
            this.divineAlerts = this.divineAlerts.slice(-100);
        }

        console.log(`🌌 DIVINE ALERT [${severity}]: ${message}`);
        console.log(`🎭 Divine Authorities Notified: ${divineAuthorities.join(', ')}`);
        console.log(`⚡ Intervention Protocol: ${interventionProtocol}`);
    }

    // 📊 PUBLIC API METHODS
    public getCosmicBalance(): CosmicBalance {
        return { ...this.cosmicBalance };
    }

    public getDivineMetrics(): DivineMetrics {
        this.updateDivineMetrics();
        return { ...this.divineMetrics };
    }

    public getDivineAlerts(): DivineAlert[] {
        return this.divineAlerts.filter(alert => !alert.acknowledged);
    }

    public acknowledgeDivineAlert(alertId: string): boolean {
        const alert = this.divineAlerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            console.log(`✨ Divine alert acknowledged: ${alert.type}`);
            return true;
        }
        return false;
    }

    public emergencyCosmicStabilization(): void {
        console.log('🌌 EMERGENCY COSMIC STABILIZATION INITIATED');
        
        // Reset balance to neutral
        this.cosmicBalance.equilibriumScore = 75; // Partial restoration
        this.cosmicBalance.imbalanceDirection = 'balanced';
        this.cosmicBalance.riskLevel = 'concerning'; // Still needs monitoring
        
        // Boost reality stability
        this.divineMetrics.realityStabilityScore = Math.min(100, this.divineMetrics.realityStabilityScore + 30);
        
        this.createDivineAlert(
            'COSMIC_IMBALANCE',
            'DIVINE',
            'Emergency cosmic stabilization completed - dimensional equilibrium partially restored',
            ['sea', 'underworld', 'interdimensional'],
            ['poseidon', 'hades', 'djinn_council'],
            ['Temporary stability achieved', 'Monitoring required', 'Full restoration needed'],
            'CONTINUOUS_MONITORING_PROTOCOL'
        );
    }

    // 🛠️ UTILITY METHODS
    private updateDivineMetrics(): void {
        this.divineMetrics.psdnFlow = this.psdnTracker.getCurrentMetrics();
        this.divineMetrics.obolNetwork = this.obolDash.getNetworkMetrics();
        this.divineMetrics.cosmicBalance = this.cosmicBalance;
    }

    private generateInterventionMessage(): string {
        const direction = this.cosmicBalance.imbalanceDirection;
        const score = this.cosmicBalance.equilibriumScore.toFixed(1);
        
        switch (direction) {
            case 'sea_dominant':
                return `POSEIDON'S REALM OVERWHELMING - Sea currency flow exceeding underworld capacity (Balance: ${score}%)`;
            case 'underworld_dominant':
                return `HADES' REALM OVERWHELMING - Underworld currency dominating oceanic flows (Balance: ${score}%)`;
            case 'CHAOS':
                return `COSMIC CHAOS DETECTED - Dimensional barriers breaking down (Balance: ${score}%)`;
            default:
                return `DIVINE INTERVENTION REQUIRED - Cosmic equilibrium unstable (Balance: ${score}%)`;
        }
    }

    private getAffectedRealms(): DivineAlert['affectedRealms'] {
        const direction = this.cosmicBalance.imbalanceDirection;
        
        switch (direction) {
            case 'sea_dominant':
                return ['sea', 'underworld', 'mortal'];
            case 'underworld_dominant':
                return ['underworld', 'sea', 'mortal'];
            case 'CHAOS':
                return ['sea', 'underworld', 'mortal', 'interdimensional'];
            default:
                return ['sea', 'underworld'];
        }
    }

    private getCosmicConsequences(): string[] {
        const direction = this.cosmicBalance.imbalanceDirection;
        const riskLevel = this.cosmicBalance.riskLevel;
        
        const consequences: string[] = [];
        
        if (riskLevel === 'REALITY_THREAT') {
            consequences.push('Dimensional fabric instability', 'Reality collapse risk', 'Soul transit system failure');
        }
        
        if (direction === 'sea_dominant') {
            consequences.push('Oceanic flooding of underworld', 'Soul drowning risk', 'Tidal chaos');
        } else if (direction === 'underworld_dominant') {
            consequences.push('Underworld overflow into mortal realm', 'Death energy saturation', 'Soul transit congestion');
        }
        
        if (direction === 'CHAOS') {
            consequences.push('Complete dimensional breakdown', 'Reality merger', 'Existence termination risk');
        }
        
        return consequences;
    }

    // 🛑 EMERGENCY SHUTDOWN
    public shutdown(): void {
        if (this.balanceMonitorInterval) {
            clearInterval(this.balanceMonitorInterval);
        }
        
        console.log('⚖️ Cosmic Balance Monitor shutdown - dimensional monitoring ceased');
        console.log('⚠️ WARNING: Reality stability no longer monitored - manual divine oversight required');
    }
}