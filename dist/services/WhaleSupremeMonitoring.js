"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhaleSupremeMonitoring = void 0;
class WhaleSupremeMonitoring {
    constructor(whaleSupreme, poseidon, processor) {
        this.whaleSupreme = whaleSupreme;
        this.poseidon = poseidon;
        this.processor = processor;
        this.powerHistory = [];
        this.decisionHistory = [];
        this.alerts = [];
        this.monitoringInterval = null;
        this.POWER_THRESHOLD_LOW = 0.2;
        this.POWER_THRESHOLD_HIGH = 0.9;
        this.ETHICAL_THRESHOLD = 0.7;
        this.ECOLOGICAL_THRESHOLD = 0.7;
        this.initializeMonitoring();
    }
    initializeMonitoring() {
        // Start monitoring interval
        this.monitoringInterval = setInterval(() => {
            this.updatePowerMetrics();
            this.checkThresholds();
        }, 1000); // Update every second
    }
    updatePowerMetrics() {
        const status = this.whaleSupreme.getStatus();
        const envData = this.poseidon.getEnvironmentalData();
        const powerMetrics = {
            timestamp: new Date(),
            currentLevel: status.powerLevel,
            consumptionRate: this.calculateConsumptionRate(),
            restorationRate: this.calculateRestorationRate(envData),
            environmentalStability: status.powerContext.environmentalStability
        };
        this.powerHistory.push(powerMetrics);
        this.trimHistory(this.powerHistory, 1000); // Keep last 1000 records
    }
    calculateConsumptionRate() {
        if (this.powerHistory.length < 2)
            return 0;
        const recent = this.powerHistory.slice(-2);
        return (recent[0].currentLevel - recent[1].currentLevel) /
            (recent[0].timestamp.getTime() - recent[1].timestamp.getTime());
    }
    calculateRestorationRate(envData) {
        // Base restoration rate on environmental stability
        const stability = this.calculateEnvironmentalStability(envData);
        return stability * 0.1; // 10% of stability per second
    }
    calculateEnvironmentalStability(envData) {
        // Calculate stability based on environmental factors
        const tempStability = 1 - Math.abs(envData.temperature - 15) / 10; // Optimal temp around 15°C
        const salinityStability = 1 - Math.abs(envData.salinity - 32.5) / 5; // Optimal salinity around 32.5
        const currentStability = 1 - Math.min(envData.currentSpeed / 5, 1); // Lower current is more stable
        return (tempStability + salinityStability + currentStability) / 3;
    }
    checkThresholds() {
        const status = this.whaleSupreme.getStatus();
        // Check power thresholds
        if (status.powerLevel < this.POWER_THRESHOLD_LOW) {
            this.createAlert('power', 'high', 'Power level critically low', { powerLevel: status.powerLevel });
        }
        else if (status.powerLevel > this.POWER_THRESHOLD_HIGH) {
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
    logDecision(decision) {
        this.decisionHistory.push(decision);
        this.trimHistory(this.decisionHistory, 1000); // Keep last 1000 records
        // Analyze decision impact
        this.analyzeDecisionImpact(decision);
    }
    analyzeDecisionImpact(decision) {
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
    calculatePowerImpact(decision) {
        // Calculate power impact based on decision type and context
        const baseImpact = 0.1; // Base power consumption
        return baseImpact * (1 + Math.random() * 0.2); // Add some randomness
    }
    calculateEthicalImpact(decision) {
        // Calculate ethical impact based on decision context and alignment
        return decision.ethicalAlignment * (1 + Math.random() * 0.1);
    }
    calculateEcologicalImpact(decision) {
        // Calculate ecological impact based on environmental context
        const envStability = this.calculateEnvironmentalStability(decision.environmentalContext);
        return decision.ecologicalImpact * envStability;
    }
    createAlert(type, severity, message, context) {
        const alert = {
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
    trimHistory(history, maxLength) {
        if (history.length > maxLength) {
            history.splice(0, history.length - maxLength);
        }
    }
    getPowerMetrics() {
        return [...this.powerHistory];
    }
    getDecisionMetrics() {
        return [...this.decisionHistory];
    }
    getAlerts() {
        return [...this.alerts];
    }
    getRecentPowerTrend() {
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
    dispose() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }
}
exports.WhaleSupremeMonitoring = WhaleSupremeMonitoring;
//# sourceMappingURL=WhaleSupremeMonitoring.js.map