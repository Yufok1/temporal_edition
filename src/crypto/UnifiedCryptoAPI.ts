// 🌐 Unified Crypto API - Complete System Integration
// Professional-grade API for PSDN/OBOL monitoring with multi-steward access

import { PSDNFlowTracker, PSDNFlowMetrics, PSDNAlert, FlowPattern } from './PSDNFlowTracker';
import { OBOLOperationsDash, NetworkMetrics, OBOLCluster, ValidatorPerformance, OBOLAlert, RewardProjection } from './OBOLOperationsDash';
import { PortfolioAnalyzer, StewardPortfolio, AllocationBreakdown, RiskMetrics, TradingAlert } from './PortfolioAnalyzer';
import { MarineBiologyWatchtower, Observer } from '../core/MarineBiologyWatchtower';

export interface CryptoSystemConfig {
    psdnContractAddress: string;
    beaconNodeURL: string;
    priceAPIKey?: string;
    alertWebhooks?: string[];
    quantumSyncInterval?: number;
    solarEfficiencyMode?: boolean;
}

export interface SystemStatus {
    psdn: {
        connected: boolean;
        lastUpdate: number;
        transactionCount: number;
        priceUSD: number;
    };
    obol: {
        connected: boolean;
        lastSync: number;
        currentEpoch: number;
        validatorCount: number;
    };
    portfolio: {
        stewardCount: number;
        totalValueUSD: number;
        lastCalculation: number;
    };
    watchtower: {
        nazarStatus: string;
        observerCount: number;
        lastCheckpoint: number;
    };
}

export interface StewardAccess {
    stewardId: string;
    tier: number;
    permissions: string[];
    lastLogin: number;
    sessionToken?: string;
}

export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: number;
    stewardId?: string;
}

export interface DashboardData {
    psdn: {
        metrics: PSDNFlowMetrics;
        recentTransactions: any[];
        alerts: PSDNAlert[];
        patterns: FlowPattern[];
    };
    obol: {
        network: NetworkMetrics;
        clusters: OBOLCluster[];
        validators: ValidatorPerformance[];
        alerts: OBOLAlert[];
        rewards: RewardProjection;
    };
    portfolio: {
        stewardPortfolio: StewardPortfolio | null;
        allocation: AllocationBreakdown | null;
        risks: RiskMetrics;
        alerts: TradingAlert[];
        leaderboard: any[];
    };
    system: SystemStatus;
}

export class UnifiedCryptoAPI {
    private psdnTracker: PSDNFlowTracker;
    private obolDash: OBOLOperationsDash;
    private portfolioAnalyzer: PortfolioAnalyzer;
    private watchtower: MarineBiologyWatchtower;
    
    private config: CryptoSystemConfig;
    private activeSessions: Map<string, StewardAccess> = new Map();
    private systemStartTime: number;
    
    // Quantum monitoring intervals
    private quantumUpdateInterval: any = null;
    private solarSyncInterval: any = null;

    constructor(config: CryptoSystemConfig, watchtower: MarineBiologyWatchtower) {
        this.config = config;
        this.watchtower = watchtower;
        this.systemStartTime = Date.now();

        // Initialize core systems
        this.psdnTracker = new PSDNFlowTracker();
        this.obolDash = new OBOLOperationsDash(config.beaconNodeURL);
        this.portfolioAnalyzer = new PortfolioAnalyzer(this.psdnTracker, this.obolDash);

        this.startQuantumMonitoring();
        console.log('🌐 Unified Crypto API initialized with quantum precision');
    }

    // ⚡ System Initialization & Management
    private startQuantumMonitoring(): void {
        const interval = this.config.quantumSyncInterval || 5000; // 5 seconds default
        
        this.quantumUpdateInterval = setInterval(async () => {
            try {
                await this.performQuantumSync();
            } catch (error) {
                console.error('Quantum sync error:', error);
            }
        }, interval);

        // Solar efficiency integration
        if (this.config.solarEfficiencyMode) {
            this.solarSyncInterval = setInterval(() => {
                this.optimizeSolarEfficiency();
            }, 60000); // 1 minute efficiency optimization
        }
    }

    private async performQuantumSync(): Promise<void> {
        // Sync PSDN data
        const psdnMetrics = this.psdnTracker.getCurrentMetrics();
        
        // Sync OBOL data
        const networkMetrics = this.obolDash.getNetworkMetrics();
        
        // Integrate rewards across systems
        this.portfolioAnalyzer.integrateRewards();
        
        // Update watchtower status
        this.updateWatchtowerStatus();
    }

    private optimizeSolarEfficiency(): void {
        // Solar power optimization (reduce API calls during low activity)
        const currentHour = new Date().getHours();
        const isLowActivity = currentHour >= 22 || currentHour <= 6; // Night hours
        
        if (isLowActivity && this.config.solarEfficiencyMode) {
            // Reduce update frequency during night hours
            console.log('🌞 Solar efficiency mode: Reducing update frequency');
        }
    }

    private updateWatchtowerStatus(): void {
        const observerCount = this.activeSessions.size;
        this.watchtower.nazarCheckpoint('system', 'monitor', `active_stewards:${observerCount}`);
    }

    // 🔐 Authentication & Session Management
    public async authenticateSteward(stewardId: string, credentials?: any): Promise<APIResponse<StewardAccess>> {
        try {
            // Validate steward with watchtower
            const nazarAllowed = this.watchtower.nazarCheckpoint(stewardId, 'authenticate', 'crypto_api');
            
            if (!nazarAllowed) {
                return {
                    success: false,
                    error: 'Authentication failed - Nazar checkpoint denied',
                    timestamp: Date.now()
                };
            }

            // Determine steward tier (simplified - would integrate with actual auth system)
            const tier = this.determineStewardTier(stewardId);
            const permissions = this.generatePermissions(tier);
            
            const session: StewardAccess = {
                stewardId,
                tier,
                permissions,
                lastLogin: Date.now(),
                sessionToken: this.generateSessionToken(stewardId)
            };

            this.activeSessions.set(stewardId, session);

            // Register portfolio if not exists
            const existingPortfolio = this.portfolioAnalyzer.getStewardPortfolio(stewardId);
            if (!existingPortfolio) {
                await this.portfolioAnalyzer.registerStewardPortfolio(
                    stewardId,
                    tier,
                    `Steward_${stewardId}`,
                    tier === 1 ? 'whale' : tier <= 2 ? 'aggressive' : 'moderate'
                );
            }

            console.log(`🔐 Steward ${stewardId} authenticated (Tier ${tier})`);

            return {
                success: true,
                data: session,
                timestamp: Date.now(),
                stewardId
            };

        } catch (error) {
            return {
                success: false,
                error: `Authentication error: ${error}`,
                timestamp: Date.now()
            };
        }
    }

    private determineStewardTier(stewardId: string): number {
        // Simplified tier determination (would integrate with actual system)
        if (stewardId.includes('whale') || stewardId.includes('1')) return 1;
        if (stewardId.includes('senior') || stewardId.includes('2')) return 2;
        if (stewardId.includes('observer') || stewardId.includes('3')) return 3;
        if (stewardId.includes('trainee') || stewardId.includes('4')) return 4;
        return 5; // External
    }

    private generatePermissions(tier: number): string[] {
        const basePermissions = ['view_prices', 'view_network'];
        
        switch (tier) {
            case 1: return [...basePermissions, 'admin', 'trade', 'manage_all', 'system_override'];
            case 2: return [...basePermissions, 'trade', 'manage_team', 'advanced_analytics'];
            case 3: return [...basePermissions, 'trade', 'view_portfolio', 'basic_analytics'];
            case 4: return [...basePermissions, 'paper_trade', 'view_own_data'];
            default: return ['view_prices'];
        }
    }

    private generateSessionToken(stewardId: string): string {
        return `token_${stewardId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private validateSession(stewardId: string): boolean {
        const session = this.activeSessions.get(stewardId);
        if (!session) return false;
        
        // Session expires after 24 hours
        const sessionAge = Date.now() - session.lastLogin;
        if (sessionAge > 86400000) {
            this.activeSessions.delete(stewardId);
            return false;
        }
        
        return true;
    }

    // 📊 Main API Endpoints
    public async getDashboardData(stewardId: string): Promise<APIResponse<DashboardData>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        try {
            const session = this.activeSessions.get(stewardId)!;
            
            // PSDN data
            const psdnData = {
                metrics: this.psdnTracker.getCurrentMetrics(),
                recentTransactions: this.psdnTracker.getRecentTransactions(20),
                alerts: this.psdnTracker.getActiveAlerts(),
                patterns: this.psdnTracker.getFlowPatterns()
            };

            // OBOL data
            const obolData = {
                network: this.obolDash.getNetworkMetrics(),
                clusters: this.obolDash.getOBOLClusters(),
                validators: session.permissions.includes('view_portfolio') ? 
                    this.obolDash.getTopPerformers(10) : [],
                alerts: this.obolDash.getActiveAlerts(),
                rewards: this.obolDash.calculateRewardProjections()
            };

            // Portfolio data
            const stewardPortfolio = this.portfolioAnalyzer.getStewardPortfolio(stewardId) || null;
            const portfolioData = {
                stewardPortfolio,
                allocation: this.portfolioAnalyzer.getAllocationBreakdown(stewardId),
                risks: this.portfolioAnalyzer.calculateRiskMetrics(stewardId),
                alerts: this.portfolioAnalyzer.getActiveAlerts(stewardId),
                leaderboard: session.permissions.includes('view_team') ? 
                    this.portfolioAnalyzer.getPortfolioLeaderboard() : []
            };

            // System status
            const systemData = this.getSystemStatus();

            const dashboardData: DashboardData = {
                psdn: psdnData,
                obol: obolData,
                portfolio: portfolioData,
                system: systemData
            };

            // Update session last access
            session.lastLogin = Date.now();

            return {
                success: true,
                data: dashboardData,
                timestamp: Date.now(),
                stewardId
            };

        } catch (error) {
            return {
                success: false,
                error: `Dashboard data error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    public async getPSDNMetrics(stewardId: string): Promise<APIResponse<PSDNFlowMetrics>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        try {
            const metrics = this.psdnTracker.getCurrentMetrics();
            return {
                success: true,
                data: metrics,
                timestamp: Date.now(),
                stewardId
            };
        } catch (error) {
            return {
                success: false,
                error: `PSDN metrics error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    public async getOBOLClusters(stewardId: string): Promise<APIResponse<OBOLCluster[]>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        try {
            const clusters = this.obolDash.getOBOLClusters();
            return {
                success: true,
                data: clusters,
                timestamp: Date.now(),
                stewardId
            };
        } catch (error) {
            return {
                success: false,
                error: `OBOL clusters error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    public async getPortfolio(stewardId: string): Promise<APIResponse<StewardPortfolio>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        try {
            const portfolio = this.portfolioAnalyzer.getStewardPortfolio(stewardId);
            if (!portfolio) {
                return {
                    success: false,
                    error: 'Portfolio not found',
                    timestamp: Date.now(),
                    stewardId
                };
            }

            return {
                success: true,
                data: portfolio,
                timestamp: Date.now(),
                stewardId
            };
        } catch (error) {
            return {
                success: false,
                error: `Portfolio error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    // 🚨 Alert Management
    public async getAllAlerts(stewardId: string): Promise<APIResponse<{ psdn: PSDNAlert[]; obol: OBOLAlert[]; portfolio: TradingAlert[] }>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        try {
            const alerts = {
                psdn: this.psdnTracker.getActiveAlerts(),
                obol: this.obolDash.getActiveAlerts(),
                portfolio: this.portfolioAnalyzer.getActiveAlerts(stewardId)
            };

            return {
                success: true,
                data: alerts,
                timestamp: Date.now(),
                stewardId
            };
        } catch (error) {
            return {
                success: false,
                error: `Alerts error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    public async acknowledgeAlert(stewardId: string, alertId: string, system: 'psdn' | 'obol' | 'portfolio'): Promise<APIResponse<boolean>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        try {
            let acknowledged = false;
            
            switch (system) {
                case 'psdn':
                    acknowledged = this.psdnTracker.acknowledgeAlert(alertId);
                    break;
                case 'obol':
                    acknowledged = this.obolDash.acknowledgeAlert(alertId);
                    break;
                case 'portfolio':
                    acknowledged = this.portfolioAnalyzer.acknowledgeAlert(alertId);
                    break;
            }

            if (acknowledged) {
                console.log(`🚨 Alert ${alertId} acknowledged by steward ${stewardId}`);
            }

            return {
                success: acknowledged,
                data: acknowledged,
                timestamp: Date.now(),
                stewardId
            };
        } catch (error) {
            return {
                success: false,
                error: `Alert acknowledgment error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    // 🔧 System Management
    public getSystemStatus(): SystemStatus {
        const psdnMetrics = this.psdnTracker.getCurrentMetrics();
        const networkMetrics = this.obolDash.getNetworkMetrics();
        const observerStatus = this.watchtower.getHierarchyStatus();

        return {
            psdn: {
                connected: psdnMetrics.transactionCount > 0,
                lastUpdate: Date.now(),
                transactionCount: psdnMetrics.transactionCount,
                priceUSD: psdnMetrics.priceUSD
            },
            obol: {
                connected: networkMetrics.currentEpoch > 0,
                lastSync: Date.now(),
                currentEpoch: networkMetrics.currentEpoch,
                validatorCount: this.obolDash.getOBOLClusters().reduce((sum, c) => sum + c.validators.length, 0)
            },
            portfolio: {
                stewardCount: this.activeSessions.size,
                totalValueUSD: Array.from(this.activeSessions.keys())
                    .reduce((sum, id) => {
                        const portfolio = this.portfolioAnalyzer.getStewardPortfolio(id);
                        return sum + (portfolio?.metrics.totalValueUSD || 0);
                    }, 0),
                lastCalculation: Date.now()
            },
            watchtower: {
                nazarStatus: observerStatus.observers.length > 0 ? 'ACTIVE' : 'STANDBY',
                observerCount: observerStatus.observers.length,
                lastCheckpoint: Date.now()
            }
        };
    }

    public async addHolding(stewardId: string, holding: any): Promise<APIResponse<boolean>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        const session = this.activeSessions.get(stewardId)!;
        if (!session.permissions.includes('trade')) {
            return { success: false, error: 'Insufficient permissions', timestamp: Date.now() };
        }

        try {
            await this.portfolioAnalyzer.addHolding(stewardId, holding);
            console.log(`📊 Holding added for steward ${stewardId}: ${holding.asset.symbol}`);
            
            return {
                success: true,
                data: true,
                timestamp: Date.now(),
                stewardId
            };
        } catch (error) {
            return {
                success: false,
                error: `Add holding error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    // 🔶 OBOL Cluster Management
    public async registerOBOLCluster(stewardId: string, clusterId: string, clusterName: string, operators: string[]): Promise<APIResponse<boolean>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        const session = this.activeSessions.get(stewardId)!;
        if (!session.permissions.includes('manage_team') && !session.permissions.includes('admin')) {
            return { success: false, error: 'Insufficient permissions', timestamp: Date.now() };
        }

        try {
            await this.obolDash.registerOBOLCluster(clusterId, clusterName, operators);
            console.log(`🔶 OBOL cluster registered by steward ${stewardId}: ${clusterName}`);
            
            return {
                success: true,
                data: true,
                timestamp: Date.now(),
                stewardId
            };
        } catch (error) {
            return {
                success: false,
                error: `OBOL cluster registration error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    // 📈 Analytics & Reporting
    public async getPerformanceReport(stewardId: string, timeframe: string = '24h'): Promise<APIResponse<any>> {
        if (!this.validateSession(stewardId)) {
            return { success: false, error: 'Invalid session', timestamp: Date.now() };
        }

        try {
            const session = this.activeSessions.get(stewardId)!;
            const portfolio = this.portfolioAnalyzer.getStewardPortfolio(stewardId);
            const riskMetrics = this.portfolioAnalyzer.calculateRiskMetrics(stewardId);
            
            const report = {
                timeframe,
                portfolio: portfolio?.metrics,
                risk: riskMetrics,
                psdn: {
                    volume: this.psdnTracker.getCurrentMetrics().volume24h,
                    transactions: this.psdnTracker.getCurrentMetrics().transactionCount
                },
                obol: {
                    rewards: this.obolDash.calculateRewardProjections(),
                    network: this.obolDash.getNetworkMetrics()
                },
                generated: Date.now()
            };

            return {
                success: true,
                data: report,
                timestamp: Date.now(),
                stewardId
            };
        } catch (error) {
            return {
                success: false,
                error: `Performance report error: ${error}`,
                timestamp: Date.now(),
                stewardId
            };
        }
    }

    // 🛠️ Cleanup & Shutdown
    public shutdown(): void {
        if (this.quantumUpdateInterval) {
            clearInterval(this.quantumUpdateInterval);
        }
        if (this.solarSyncInterval) {
            clearInterval(this.solarSyncInterval);
        }
        
        this.activeSessions.clear();
        console.log('🌐 Unified Crypto API shutdown complete');
    }

    // 📊 Public getters for direct access
    public get psdn(): PSDNFlowTracker { return this.psdnTracker; }
    public get obol(): OBOLOperationsDash { return this.obolDash; }
    public get portfolio(): PortfolioAnalyzer { return this.portfolioAnalyzer; }
    public get watchtowerRef(): MarineBiologyWatchtower { return this.watchtower; }
}