// 📊 Portfolio Analyzer - Multi-Asset Crypto Portfolio Management
// Quantum precision tracking with solar-powered efficiency for all stewards

import { PSDNFlowTracker, PSDNFlowMetrics } from './PSDNFlowTracker';
import { OBOLOperationsDash, RewardProjection } from './OBOLOperationsDash';

export interface Asset {
    symbol: string;
    name: string;
    type: 'token' | 'staking' | 'defi' | 'nft' | 'other';
    contractAddress?: string;
    chainId: number;
    decimals: number;
    coingeckoId?: string;
}

export interface Holding {
    asset: Asset;
    balance: bigint;
    valueUSD: number;
    lastUpdated: number;
    source: 'wallet' | 'exchange' | 'staking' | 'defi_protocol';
    location: string; // wallet address, exchange name, etc.
}

export interface PortfolioMetrics {
    totalValueUSD: number;
    dayChange: number;
    dayChangePercent: number;
    weekChange: number;
    weekChangePercent: number;
    monthChange: number;
    monthChangePercent: number;
    allTimeHigh: number;
    allTimeLow: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
}

export interface AllocationBreakdown {
    byAsset: Record<string, number>;
    byType: Record<string, number>;
    byChain: Record<string, number>;
    byLocation: Record<string, number>;
}

export interface PerformanceSnapshot {
    timestamp: number;
    totalValue: number;
    assetPrices: Record<string, number>;
    returns: Record<string, number>;
    benchmark?: number;
}

export interface RiskMetrics {
    valueAtRisk95: number; // 95% VaR (1-day)
    expectedShortfall: number; // Conditional VaR
    beta: number; // vs crypto market
    correlation: Record<string, number>; // correlation matrix
    concentrationRisk: number; // Herfindahl index
    liquidityRisk: number; // 0-1 scale
    counterpartyRisk: number; // 0-1 scale
}

export interface TradingAlert {
    id: string;
    timestamp: number;
    stewardId: string;
    type: 'price_target' | 'stop_loss' | 'rebalance' | 'risk_limit' | 'opportunity';
    severity: 'info' | 'warning' | 'critical';
    asset: string;
    message: string;
    actionRequired: boolean;
    acknowledged: boolean;
}

export interface StewardPortfolio {
    stewardId: string;
    stewardTier: number;
    name: string;
    holdings: Holding[];
    metrics: PortfolioMetrics;
    riskProfile: 'conservative' | 'moderate' | 'aggressive' | 'whale';
    permissions: string[];
    lastAccess: number;
}

export class PortfolioAnalyzer {
    private stewardPortfolios: Map<string, StewardPortfolio> = new Map();
    private masterPortfolio: Holding[] = [];
    private priceHistory: Map<string, number[]> = new Map();
    private performanceHistory: PerformanceSnapshot[] = [];
    private alerts: TradingAlert[] = [];
    private assets: Map<string, Asset> = new Map();
    
    // External integrations
    private psdnTracker: PSDNFlowTracker;
    private obolDash: OBOLOperationsDash;
    
    // Quantum analysis parameters
    private readonly QUANTUM_PRICE_INTERVAL = 30000; // 30 seconds
    private readonly SOLAR_BATCH_SIZE = 10; // assets per API call
    private readonly RISK_CALCULATION_WINDOW = 30; // days
    private readonly PORTFOLIO_SYNC_INTERVAL = 300000; // 5 minutes

    constructor(psdnTracker: PSDNFlowTracker, obolDash: OBOLOperationsDash) {
        this.psdnTracker = psdnTracker;
        this.obolDash = obolDash;
        this.initializeAssets();
        this.startQuantumPriceFeeds();
        this.startSolarPortfolioSync();
    }

    private initializeAssets(): void {
        // Core assets
        const coreAssets: Asset[] = [
            {
                symbol: 'PSDN',
                name: 'Poseidon Network',
                type: 'token',
                contractAddress: '0xPSDN_CONTRACT_ADDRESS',
                chainId: 1,
                decimals: 18,
                coingeckoId: 'poseidon-network'
            },
            {
                symbol: 'ETH',
                name: 'Ethereum',
                type: 'token',
                chainId: 1,
                decimals: 18,
                coingeckoId: 'ethereum'
            },
            {
                symbol: 'stETH',
                name: 'Staked Ethereum (OBOL)',
                type: 'staking',
                contractAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
                chainId: 1,
                decimals: 18,
                coingeckoId: 'staked-ether'
            },
            {
                symbol: 'BTC',
                name: 'Bitcoin',
                type: 'token',
                chainId: 1,
                decimals: 8,
                coingeckoId: 'bitcoin'
            },
            {
                symbol: 'USDC',
                name: 'USD Coin',
                type: 'token',
                contractAddress: '0xA0b86a33E6441c2e12323f3b9B1c6c4Cc24FbDa',
                chainId: 1,
                decimals: 6,
                coingeckoId: 'usd-coin'
            }
        ];

        coreAssets.forEach(asset => {
            this.assets.set(asset.symbol, asset);
        });

        console.log('📊 Portfolio Analyzer: Core assets initialized');
    }

    // ⚡ Quantum price feed system
    private startQuantumPriceFeeds(): void {
        setInterval(async () => {
            await this.updateAllPrices();
        }, this.QUANTUM_PRICE_INTERVAL);

        // Initial price fetch
        this.updateAllPrices();
    }

    private async updateAllPrices(): Promise<void> {
        try {
            const assetIds = Array.from(this.assets.values())
                .filter(asset => asset.coingeckoId)
                .map(asset => asset.coingeckoId!);

            // Batch API calls for solar efficiency
            const batches = this.chunkArray(assetIds, this.SOLAR_BATCH_SIZE);
            
            for (const batch of batches) {
                await this.fetchPriceBatch(batch);
                // Small delay between batches for rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Integrate PSDN price from tracker
            this.integratePSDNPrice();

        } catch (error) {
            console.error('Price update error:', error);
        }
    }

    private async fetchPriceBatch(coingeckoIds: string[]): Promise<void> {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds.join(',')}&vs_currencies=usd&include_24hr_change=true`
            );
            const data = await response.json();

            for (const [id, priceData] of Object.entries(data)) {
                const asset = Array.from(this.assets.values()).find(a => a.coingeckoId === id);
                if (asset && typeof priceData === 'object' && priceData !== null) {
                    const price = (priceData as any).usd;
                    if (typeof price === 'number') {
                        this.updateAssetPrice(asset.symbol, price);
                    }
                }
            }

        } catch (error) {
            console.error('Batch price fetch error:', error);
        }
    }

    private integratePSDNPrice(): void {
        const psdnMetrics = this.psdnTracker.getCurrentMetrics();
        if (psdnMetrics.priceUSD > 0) {
            this.updateAssetPrice('PSDN', psdnMetrics.priceUSD);
        }
    }

    private updateAssetPrice(symbol: string, price: number): void {
        if (!this.priceHistory.has(symbol)) {
            this.priceHistory.set(symbol, []);
        }
        
        const history = this.priceHistory.get(symbol)!;
        history.push(price);
        
        // Keep last 1000 price points for solar efficiency
        if (history.length > 1000) {
            this.priceHistory.set(symbol, history.slice(-1000));
        }
    }

    // 🌞 Solar-powered portfolio management
    public async registerStewardPortfolio(
        stewardId: string,
        stewardTier: number,
        name: string,
        riskProfile: StewardPortfolio['riskProfile']
    ): Promise<void> {
        const permissions = this.generatePermissions(stewardTier);
        
        const portfolio: StewardPortfolio = {
            stewardId,
            stewardTier,
            name,
            holdings: [],
            metrics: this.initializeMetrics(),
            riskProfile,
            permissions,
            lastAccess: Date.now()
        };

        this.stewardPortfolios.set(stewardId, portfolio);
        console.log(`📊 Steward portfolio registered: ${name} (Tier ${stewardTier})`);
    }

    private generatePermissions(tier: number): string[] {
        const basePermissions = ['view_portfolio', 'view_prices'];
        
        switch (tier) {
            case 1: // Whale
                return [...basePermissions, 'trade', 'manage_risk', 'view_all_portfolios', 'system_override'];
            case 2: // Senior
                return [...basePermissions, 'trade', 'manage_risk', 'view_team_portfolios'];
            case 3: // Observer
                return [...basePermissions, 'trade', 'view_own_portfolio'];
            case 4: // Trainee
                return [...basePermissions, 'paper_trade'];
            default: // External
                return ['view_prices'];
        }
    }

    public async addHolding(stewardId: string, holding: Omit<Holding, 'valueUSD' | 'lastUpdated'>): Promise<void> {
        const portfolio = this.stewardPortfolios.get(stewardId);
        if (!portfolio) {
            throw new Error(`Portfolio not found for steward ${stewardId}`);
        }

        if (!portfolio.permissions.includes('trade') && !portfolio.permissions.includes('view_portfolio')) {
            throw new Error(`Insufficient permissions for steward ${stewardId}`);
        }

        const asset = this.assets.get(holding.asset.symbol);
        if (!asset) {
            throw new Error(`Asset ${holding.asset.symbol} not supported`);
        }

        const currentPrice = this.getCurrentPrice(holding.asset.symbol);
        const completeHolding: Holding = {
            ...holding,
            valueUSD: Number(holding.balance) / Math.pow(10, holding.asset.decimals) * currentPrice,
            lastUpdated: Date.now()
        };

        // Update existing holding or add new one
        const existingIndex = portfolio.holdings.findIndex(
            h => h.asset.symbol === holding.asset.symbol && h.location === holding.location
        );

        if (existingIndex >= 0) {
            portfolio.holdings[existingIndex] = completeHolding;
        } else {
            portfolio.holdings.push(completeHolding);
        }

        await this.recalculatePortfolioMetrics(stewardId);
        console.log(`📊 Updated holding: ${holding.asset.symbol} for steward ${portfolio.name}`);
    }

    // 📈 Performance analysis
    private async recalculatePortfolioMetrics(stewardId: string): Promise<void> {
        const portfolio = this.stewardPortfolios.get(stewardId);
        if (!portfolio) return;

        const totalValue = portfolio.holdings.reduce((sum, holding) => sum + holding.valueUSD, 0);
        
        // Historical performance calculation
        const performanceData = this.calculateHistoricalPerformance(portfolio.holdings);
        
        portfolio.metrics = {
            totalValueUSD: totalValue,
            dayChange: performanceData.dayChange,
            dayChangePercent: performanceData.dayChangePercent,
            weekChange: performanceData.weekChange,
            weekChangePercent: performanceData.weekChangePercent,
            monthChange: performanceData.monthChange,
            monthChangePercent: performanceData.monthChangePercent,
            allTimeHigh: performanceData.allTimeHigh,
            allTimeLow: performanceData.allTimeLow,
            volatility: performanceData.volatility,
            sharpeRatio: performanceData.sharpeRatio,
            maxDrawdown: performanceData.maxDrawdown,
            winRate: performanceData.winRate
        };

        // Check for alerts
        this.checkPortfolioAlerts(stewardId);
    }

    private calculateHistoricalPerformance(holdings: Holding[]): PortfolioMetrics {
        // Simplified performance calculation
        const totalValue = holdings.reduce((sum, holding) => sum + holding.valueUSD, 0);
        
        // In real implementation, would use historical price data
        return {
            totalValueUSD: totalValue,
            dayChange: totalValue * 0.02, // Mock 2% gain
            dayChangePercent: 2.0,
            weekChange: totalValue * 0.05,
            weekChangePercent: 5.0,
            monthChange: totalValue * 0.15,
            monthChangePercent: 15.0,
            allTimeHigh: totalValue * 1.2,
            allTimeLow: totalValue * 0.6,
            volatility: 25.5, // Mock volatility
            sharpeRatio: 1.8,
            maxDrawdown: -12.5,
            winRate: 67.3
        };
    }

    // 🎯 Risk analysis
    public calculateRiskMetrics(stewardId: string): RiskMetrics {
        const portfolio = this.stewardPortfolios.get(stewardId);
        if (!portfolio || portfolio.holdings.length === 0) {
            return this.getEmptyRiskMetrics();
        }

        const totalValue = portfolio.holdings.reduce((sum, h) => sum + h.valueUSD, 0);
        
        // Calculate concentration risk (Herfindahl index)
        const concentrationRisk = this.calculateConcentrationRisk(portfolio.holdings, totalValue);
        
        // Calculate VaR (simplified Monte Carlo simulation)
        const var95 = this.calculateValueAtRisk(portfolio.holdings, 0.95);
        
        // Mock other risk metrics (would be calculated from historical data)
        return {
            valueAtRisk95: var95,
            expectedShortfall: var95 * 1.3,
            beta: 1.2, // vs crypto market
            correlation: this.calculateCorrelationMatrix(portfolio.holdings),
            concentrationRisk,
            liquidityRisk: this.calculateLiquidityRisk(portfolio.holdings),
            counterpartyRisk: this.calculateCounterpartyRisk(portfolio.holdings)
        };
    }

    private calculateConcentrationRisk(holdings: Holding[], totalValue: number): number {
        if (totalValue === 0) return 0;
        
        const weights = holdings.map(h => h.valueUSD / totalValue);
        const herfindahl = weights.reduce((sum, w) => sum + w * w, 0);
        
        return herfindahl; // 0 = perfectly diversified, 1 = concentrated
    }

    private calculateValueAtRisk(holdings: Holding[], confidence: number): number {
        // Simplified VaR calculation
        const totalValue = holdings.reduce((sum, h) => sum + h.valueUSD, 0);
        const portfolioVolatility = 0.25; // 25% annual volatility (mock)
        const dailyVolatility = portfolioVolatility / Math.sqrt(365);
        
        // Normal distribution approximation
        const zScore = confidence === 0.95 ? 1.645 : 1.96; // 95% or 99%
        return totalValue * dailyVolatility * zScore;
    }

    private calculateCorrelationMatrix(holdings: Holding[]): Record<string, number> {
        const correlations: Record<string, number> = {};
        
        // Mock correlations (would calculate from price history)
        holdings.forEach(holding => {
            if (holding.asset.symbol === 'PSDN') {
                correlations['ETH'] = 0.75;
                correlations['BTC'] = 0.45;
            } else if (holding.asset.symbol === 'ETH') {
                correlations['PSDN'] = 0.75;
                correlations['BTC'] = 0.65;
            }
        });
        
        return correlations;
    }

    private calculateLiquidityRisk(holdings: Holding[]): number {
        let weightedLiquidityRisk = 0;
        const totalValue = holdings.reduce((sum, h) => sum + h.valueUSD, 0);
        
        holdings.forEach(holding => {
            const weight = holding.valueUSD / totalValue;
            let liquidityScore = 0;
            
            // Assign liquidity scores based on asset type and location
            if (holding.source === 'exchange') {
                liquidityScore = 0.1; // High liquidity
            } else if (holding.source === 'staking') {
                liquidityScore = 0.6; // Lower liquidity
            } else if (holding.source === 'defi_protocol') {
                liquidityScore = 0.4; // Medium liquidity
            }
            
            weightedLiquidityRisk += weight * liquidityScore;
        });
        
        return weightedLiquidityRisk;
    }

    private calculateCounterpartyRisk(holdings: Holding[]): number {
        let weightedCounterpartyRisk = 0;
        const totalValue = holdings.reduce((sum, h) => sum + h.valueUSD, 0);
        
        holdings.forEach(holding => {
            const weight = holding.valueUSD / totalValue;
            let counterpartyScore = 0;
            
            // Assign counterparty risk scores
            if (holding.source === 'wallet') {
                counterpartyScore = 0.1; // Self-custody, low risk
            } else if (holding.source === 'exchange') {
                counterpartyScore = 0.5; // Exchange risk
            } else if (holding.source === 'defi_protocol') {
                counterpartyScore = 0.3; // Smart contract risk
            }
            
            weightedCounterpartyRisk += weight * counterpartyScore;
        });
        
        return weightedCounterpartyRisk;
    }

    // 🚨 Alert system
    private checkPortfolioAlerts(stewardId: string): void {
        const portfolio = this.stewardPortfolios.get(stewardId);
        if (!portfolio) return;

        const riskMetrics = this.calculateRiskMetrics(stewardId);
        
        // Risk limit alerts
        if (riskMetrics.concentrationRisk > 0.5) {
            this.createAlert(
                stewardId,
                'risk_limit',
                'warning',
                'PORTFOLIO',
                `High concentration risk: ${(riskMetrics.concentrationRisk * 100).toFixed(1)}%`
            );
        }

        if (riskMetrics.valueAtRisk95 > portfolio.metrics.totalValueUSD * 0.1) {
            this.createAlert(
                stewardId,
                'risk_limit',
                'critical',
                'PORTFOLIO',
                `High VaR detected: $${riskMetrics.valueAtRisk95.toLocaleString()}`
            );
        }

        // Performance alerts
        if (portfolio.metrics.dayChangePercent < -10) {
            this.createAlert(
                stewardId,
                'stop_loss',
                'warning',
                'PORTFOLIO',
                `Portfolio down ${portfolio.metrics.dayChangePercent.toFixed(1)}% today`
            );
        }

        // Rebalancing opportunities
        if (riskMetrics.concentrationRisk > 0.4 && portfolio.stewardTier <= 2) {
            this.createAlert(
                stewardId,
                'rebalance',
                'info',
                'PORTFOLIO',
                'Consider rebalancing to reduce concentration risk'
            );
        }
    }

    private createAlert(
        stewardId: string,
        type: TradingAlert['type'],
        severity: TradingAlert['severity'],
        asset: string,
        message: string
    ): void {
        const alert: TradingAlert = {
            id: `portfolio_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            stewardId,
            type,
            severity,
            asset,
            message,
            actionRequired: severity === 'critical',
            acknowledged: false
        };

        this.alerts.push(alert);
        
        // Solar efficiency: limit alerts
        if (this.alerts.length > 1000) {
            this.alerts = this.alerts.slice(-1000);
        }

        console.log(`🚨 Portfolio Alert [${severity.toUpperCase()}] for ${stewardId}: ${message}`);
    }

    // 📊 Public API methods
    public getStewardPortfolio(stewardId: string): StewardPortfolio | undefined {
        const portfolio = this.stewardPortfolios.get(stewardId);
        if (portfolio) {
            portfolio.lastAccess = Date.now();
        }
        return portfolio;
    }

    public getAllocationBreakdown(stewardId: string): AllocationBreakdown | null {
        const portfolio = this.stewardPortfolios.get(stewardId);
        if (!portfolio) return null;

        const totalValue = portfolio.holdings.reduce((sum, h) => sum + h.valueUSD, 0);
        if (totalValue === 0) return null;

        const breakdown: AllocationBreakdown = {
            byAsset: {},
            byType: {},
            byChain: {},
            byLocation: {}
        };

        portfolio.holdings.forEach(holding => {
            const weight = (holding.valueUSD / totalValue) * 100;
            
            breakdown.byAsset[holding.asset.symbol] = weight;
            breakdown.byType[holding.asset.type] = (breakdown.byType[holding.asset.type] || 0) + weight;
            breakdown.byChain[holding.asset.chainId.toString()] = (breakdown.byChain[holding.asset.chainId.toString()] || 0) + weight;
            breakdown.byLocation[holding.location] = (breakdown.byLocation[holding.location] || 0) + weight;
        });

        return breakdown;
    }

    public getActiveAlerts(stewardId?: string): TradingAlert[] {
        return this.alerts.filter(alert => 
            !alert.acknowledged && 
            (!stewardId || alert.stewardId === stewardId)
        );
    }

    public acknowledgeAlert(alertId: string): boolean {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            return true;
        }
        return false;
    }

    public getCurrentPrice(symbol: string): number {
        const history = this.priceHistory.get(symbol);
        return history && history.length > 0 ? history[history.length - 1] : 0;
    }

    public getPriceHistory(symbol: string, limit: number = 100): number[] {
        const history = this.priceHistory.get(symbol) || [];
        return history.slice(-limit);
    }

    public getTopPerformingPortfolios(limit: number = 10): StewardPortfolio[] {
        return Array.from(this.stewardPortfolios.values())
            .sort((a, b) => b.metrics.dayChangePercent - a.metrics.dayChangePercent)
            .slice(0, limit);
    }

    public getPortfolioLeaderboard(): { stewardId: string; name: string; totalValue: number; performance: number }[] {
        return Array.from(this.stewardPortfolios.values())
            .map(portfolio => ({
                stewardId: portfolio.stewardId,
                name: portfolio.name,
                totalValue: portfolio.metrics.totalValueUSD,
                performance: portfolio.metrics.monthChangePercent
            }))
            .sort((a, b) => b.performance - a.performance);
    }

    // 🛠️ Utility methods
    private initializeMetrics(): PortfolioMetrics {
        return {
            totalValueUSD: 0,
            dayChange: 0,
            dayChangePercent: 0,
            weekChange: 0,
            weekChangePercent: 0,
            monthChange: 0,
            monthChangePercent: 0,
            allTimeHigh: 0,
            allTimeLow: 0,
            volatility: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
            winRate: 0
        };
    }

    private getEmptyRiskMetrics(): RiskMetrics {
        return {
            valueAtRisk95: 0,
            expectedShortfall: 0,
            beta: 0,
            correlation: {},
            concentrationRisk: 0,
            liquidityRisk: 0,
            counterpartyRisk: 0
        };
    }

    private chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    private startSolarPortfolioSync(): void {
        setInterval(async () => {
            try {
                for (const stewardId of this.stewardPortfolios.keys()) {
                    await this.recalculatePortfolioMetrics(stewardId);
                }
            } catch (error) {
                console.error('Portfolio sync error:', error);
            }
        }, this.PORTFOLIO_SYNC_INTERVAL);
    }

    // Integration with PSDN and OBOL systems
    public integrateRewards(): void {
        // Integrate OBOL staking rewards
        const obolClusters = this.obolDash.getOBOLClusters();
        
        obolClusters.forEach(cluster => {
            cluster.operators.forEach(operatorAddress => {
                // Find steward portfolio for this operator
                const portfolio = Array.from(this.stewardPortfolios.values())
                    .find(p => p.holdings.some(h => h.location === operatorAddress));
                
                if (portfolio) {
                    const rewards = this.obolDash.calculateRewardProjections(cluster.clusterId);
                    // Add projected rewards to portfolio value (simplified)
                    portfolio.metrics.totalValueUSD += Number(rewards.daily) / 1e18 * this.getCurrentPrice('ETH');
                }
            });
        });
    }
}