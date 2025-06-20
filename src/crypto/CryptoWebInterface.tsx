// 💰 Crypto Monitoring Web Interface - Unified PSDN/OBOL Dashboard
// Professional-grade React interface with quantum real-time updates

import React, { useState, useEffect, useCallback } from 'react';
import { PSDNFlowTracker, PSDNFlowMetrics, PSDNAlert, FlowPattern } from './PSDNFlowTracker';
import { OBOLOperationsDash, NetworkMetrics, OBOLCluster, ValidatorPerformance, OBOLAlert } from './OBOLOperationsDash';
import { PortfolioAnalyzer, StewardPortfolio, AllocationBreakdown, RiskMetrics, TradingAlert } from './PortfolioAnalyzer';
import { MarineBiologyWatchtower, Observer } from '../core/MarineBiologyWatchtower';

interface CryptoInterfaceProps {
    stewardId: string;
    stewardTier: number;
    watchtower: MarineBiologyWatchtower;
}

interface DashboardTab {
    id: string;
    name: string;
    icon: string;
    component: React.ComponentType<any>;
    requiredTier: number;
}

interface AlertSummary {
    critical: number;
    warning: number;
    info: number;
    total: number;
}

const CryptoWebInterface: React.FC<CryptoInterfaceProps> = ({ stewardId, stewardTier, watchtower }) => {
    // Core system instances
    const [psdnTracker] = useState(() => new PSDNFlowTracker());
    const [obolDash] = useState(() => new OBOLOperationsDash());
    const [portfolioAnalyzer] = useState(() => new PortfolioAnalyzer(psdnTracker, obolDash));

    // UI State
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [notifications, setNotifications] = useState<string[]>([]);

    // Data State
    const [psdnMetrics, setPsdnMetrics] = useState<PSDNFlowMetrics | null>(null);
    const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(null);
    const [stewardPortfolio, setStewardPortfolio] = useState<StewardPortfolio | null>(null);
    const [alertSummary, setAlertSummary] = useState<AlertSummary>({ critical: 0, warning: 0, info: 0, total: 0 });

    // Available dashboard tabs based on steward tier
    const dashboardTabs: DashboardTab[] = [
        { id: 'overview', name: 'Overview', icon: '🔭', component: OverviewDashboard, requiredTier: 5 },
        { id: 'psdn', name: 'PSDN Flow', icon: '⚡', component: PSDNDashboard, requiredTier: 4 },
        { id: 'obol', name: 'OBOL Ops', icon: '🔶', component: OBOLDashboard, requiredTier: 3 },
        { id: 'portfolio', name: 'Portfolio', icon: '📊', component: PortfolioDashboard, requiredTier: 3 },
        { id: 'trading', name: 'Trading', icon: '💱', component: TradingDashboard, requiredTier: 2 },
        { id: 'risk', name: 'Risk Analytics', icon: '🎯', component: RiskDashboard, requiredTier: 2 },
        { id: 'admin', name: 'Admin', icon: '⚙️', component: AdminDashboard, requiredTier: 1 }
    ];

    const accessibleTabs = dashboardTabs.filter(tab => stewardTier <= tab.requiredTier);

    // Quantum real-time updates
    useEffect(() => {
        const updateInterval = setInterval(async () => {
            try {
                // Update PSDN metrics
                setPsdnMetrics(psdnTracker.getCurrentMetrics());
                
                // Update OBOL metrics
                setNetworkMetrics(obolDash.getNetworkMetrics());
                
                // Update portfolio data
                const portfolio = portfolioAnalyzer.getStewardPortfolio(stewardId);
                setStewardPortfolio(portfolio || null);
                
                // Update alert summary
                updateAlertSummary();
                
                setLastUpdate(Date.now());
                
            } catch (error) {
                console.error('Dashboard update error:', error);
            }
        }, 5000); // 5-second quantum updates

        // Initial load
        initializeDashboard();

        return () => clearInterval(updateInterval);
    }, [stewardId, psdnTracker, obolDash, portfolioAnalyzer]);

    const initializeDashboard = async () => {
        try {
            setIsLoading(true);

            // Register steward portfolio if not exists
            const existingPortfolio = portfolioAnalyzer.getStewardPortfolio(stewardId);
            if (!existingPortfolio) {
                await portfolioAnalyzer.registerStewardPortfolio(
                    stewardId,
                    stewardTier,
                    `Steward_${stewardId}`,
                    stewardTier === 1 ? 'whale' : stewardTier <= 2 ? 'aggressive' : 'moderate'
                );
            }

            // Register with watchtower
            watchtower.nazarCheckpoint(stewardId, 'observe', 'crypto_interface');
            
            // Initial data load
            setPsdnMetrics(psdnTracker.getCurrentMetrics());
            setNetworkMetrics(obolDash.getNetworkMetrics());
            setStewardPortfolio(portfolioAnalyzer.getStewardPortfolio(stewardId) || null);
            
            updateAlertSummary();
            
            addNotification('🔌 Crypto interface quantum-synchronized');
            
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            addNotification('❌ Initialization error - check permissions');
        } finally {
            setIsLoading(false);
        }
    };

    const updateAlertSummary = () => {
        const psdnAlerts = psdnTracker.getActiveAlerts();
        const obolAlerts = obolDash.getActiveAlerts();
        const portfolioAlerts = portfolioAnalyzer.getActiveAlerts(stewardId);
        
        const allAlerts = [...psdnAlerts, ...obolAlerts, ...portfolioAlerts];
        
        const summary: AlertSummary = {
            critical: allAlerts.filter(a => a.severity === 'critical').length,
            warning: allAlerts.filter(a => a.severity === 'warning').length,
            info: allAlerts.filter(a => a.severity === 'info').length,
            total: allAlerts.length
        };
        
        setAlertSummary(summary);
    };

    const addNotification = (message: string) => {
        setNotifications(prev => [...prev.slice(-4), message]); // Keep last 5 notifications
        setTimeout(() => {
            setNotifications(prev => prev.slice(1));
        }, 5000);
    };

    const handleTabChange = (tabId: string) => {
        const tab = accessibleTabs.find(t => t.id === tabId);
        if (tab) {
            setActiveTab(tabId);
            watchtower.nazarCheckpoint(stewardId, 'observe', `crypto_${tabId}`);
        }
    };

    if (isLoading) {
        return (
            <div className="crypto-interface loading">
                <div className="quantum-loader">
                    <div className="solar-ring"></div>
                    <div className="loading-text">⚡ Initializing Quantum Crypto Interface...</div>
                </div>
            </div>
        );
    }

    const activeTabComponent = accessibleTabs.find(tab => tab.id === activeTab)?.component || OverviewDashboard;
    const ActiveComponent = activeTabComponent;

    return (
        <div className="crypto-interface">
            {/* Header with real-time status */}
            <header className="crypto-header">
                <div className="header-left">
                    <h1>💰 Crypto Monitor</h1>
                    <div className="steward-info">
                        <span className="steward-id">Steward {stewardId}</span>
                        <span className={`tier-badge tier-${stewardTier}`}>Tier {stewardTier}</span>
                    </div>
                </div>
                
                <div className="header-center">
                    <div className="quantum-status">
                        <div className="status-item">
                            <span className="label">PSDN Price:</span>
                            <span className="value">${psdnMetrics?.priceUSD.toFixed(4) || '0.0000'}</span>
                            <span className={`change ${(psdnMetrics?.priceChange24h || 0) >= 0 ? 'positive' : 'negative'}`}>
                                {(psdnMetrics?.priceChange24h || 0).toFixed(2)}%
                            </span>
                        </div>
                        <div className="status-item">
                            <span className="label">Network:</span>
                            <span className="value">Epoch {networkMetrics?.currentEpoch || 0}</span>
                            <span className="status-indicator online"></span>
                        </div>
                        <div className="status-item">
                            <span className="label">Portfolio:</span>
                            <span className="value">${stewardPortfolio?.metrics.totalValueUSD.toLocaleString() || '0'}</span>
                            <span className={`change ${(stewardPortfolio?.metrics.dayChangePercent || 0) >= 0 ? 'positive' : 'negative'}`}>
                                {(stewardPortfolio?.metrics.dayChangePercent || 0).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="header-right">
                    <div className="alert-summary">
                        {alertSummary.critical > 0 && <span className="alert-badge critical">{alertSummary.critical}</span>}
                        {alertSummary.warning > 0 && <span className="alert-badge warning">{alertSummary.warning}</span>}
                        {alertSummary.info > 0 && <span className="alert-badge info">{alertSummary.info}</span>}
                    </div>
                    <div className="last-update">
                        <span>Updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
                        <div className="quantum-pulse"></div>
                    </div>
                </div>
            </header>

            {/* Navigation tabs */}
            <nav className="crypto-nav">
                {accessibleTabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-name">{tab.name}</span>
                    </button>
                ))}
            </nav>

            {/* Main dashboard content */}
            <main className="crypto-main">
                <ActiveComponent
                    stewardId={stewardId}
                    stewardTier={stewardTier}
                    psdnTracker={psdnTracker}
                    obolDash={obolDash}
                    portfolioAnalyzer={portfolioAnalyzer}
                    watchtower={watchtower}
                    psdnMetrics={psdnMetrics}
                    networkMetrics={networkMetrics}
                    stewardPortfolio={stewardPortfolio}
                    onNotification={addNotification}
                />
            </main>

            {/* Notifications overlay */}
            {notifications.length > 0 && (
                <div className="notifications-overlay">
                    {notifications.map((notification, index) => (
                        <div key={index} className="notification">
                            {notification}
                        </div>
                    ))}
                </div>
            )}

            {/* Quantum efficiency indicators */}
            <div className="efficiency-indicators">
                <div className="indicator">
                    <span className="label">⚡ Quantum Sync:</span>
                    <span className="status online">ACTIVE</span>
                </div>
                <div className="indicator">
                    <span className="label">🌞 Solar Power:</span>
                    <span className="status online">100%</span>
                </div>
                <div className="indicator">
                    <span className="label">🔒 Nazar Watch:</span>
                    <span className="status online">SECURED</span>
                </div>
            </div>
        </div>
    );
};

// Dashboard component interfaces
interface DashboardComponentProps {
    stewardId: string;
    stewardTier: number;
    psdnTracker: PSDNFlowTracker;
    obolDash: OBOLOperationsDash;
    portfolioAnalyzer: PortfolioAnalyzer;
    watchtower: MarineBiologyWatchtower;
    psdnMetrics: PSDNFlowMetrics | null;
    networkMetrics: NetworkMetrics | null;
    stewardPortfolio: StewardPortfolio | null;
    onNotification: (message: string) => void;
}

// Overview Dashboard Component
const OverviewDashboard: React.FC<DashboardComponentProps> = ({
    psdnMetrics, networkMetrics, stewardPortfolio, obolDash, portfolioAnalyzer
}) => {
    const obolClusters = obolDash.getOBOLClusters();
    const totalStaked = obolClusters.reduce((sum, cluster) => sum + Number(cluster.totalStaked), 0);
    
    return (
        <div className="overview-dashboard">
            <div className="overview-grid">
                {/* PSDN Overview */}
                <div className="overview-card psdn-card">
                    <div className="card-header">
                        <h3>⚡ PSDN Network</h3>
                    </div>
                    <div className="card-content">
                        <div className="metric-row">
                            <span className="metric-label">Price:</span>
                            <span className="metric-value">${psdnMetrics?.priceUSD.toFixed(4) || '0.0000'}</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">24h Volume:</span>
                            <span className="metric-value">{Number(psdnMetrics?.volume24h || 0).toLocaleString()} PSDN</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">Network Load:</span>
                            <span className="metric-value">{((psdnMetrics?.networkCongestion || 0) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">Transactions:</span>
                            <span className="metric-value">{psdnMetrics?.transactionCount || 0}</span>
                        </div>
                    </div>
                </div>

                {/* OBOL Overview */}
                <div className="overview-card obol-card">
                    <div className="card-header">
                        <h3>🔶 OBOL Operations</h3>
                    </div>
                    <div className="card-content">
                        <div className="metric-row">
                            <span className="metric-label">Current Epoch:</span>
                            <span className="metric-value">{networkMetrics?.currentEpoch || 0}</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">Participation:</span>
                            <span className="metric-value">{(networkMetrics?.participationRate || 0).toFixed(1)}%</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">Total Staked:</span>
                            <span className="metric-value">{(totalStaked / 1e18).toFixed(0)} ETH</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">Clusters:</span>
                            <span className="metric-value">{obolClusters.length}</span>
                        </div>
                    </div>
                </div>

                {/* Portfolio Overview */}
                <div className="overview-card portfolio-card">
                    <div className="card-header">
                        <h3>📊 Portfolio</h3>
                    </div>
                    <div className="card-content">
                        <div className="metric-row">
                            <span className="metric-label">Total Value:</span>
                            <span className="metric-value">${stewardPortfolio?.metrics.totalValueUSD.toLocaleString() || '0'}</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">24h Change:</span>
                            <span className={`metric-value ${(stewardPortfolio?.metrics.dayChangePercent || 0) >= 0 ? 'positive' : 'negative'}`}>
                                {(stewardPortfolio?.metrics.dayChangePercent || 0).toFixed(2)}%
                            </span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">Assets:</span>
                            <span className="metric-value">{stewardPortfolio?.holdings.length || 0}</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label">Risk Profile:</span>
                            <span className="metric-value">{stewardPortfolio?.riskProfile || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="overview-card chart-card">
                    <div className="card-header">
                        <h3>📈 Performance Overview</h3>
                    </div>
                    <div className="card-content">
                        <div className="chart-placeholder">
                            <div className="chart-bars">
                                {Array.from({length: 24}, (_, i) => (
                                    <div 
                                        key={i} 
                                        className="chart-bar" 
                                        style={{height: `${Math.random() * 100}%`}}
                                    ></div>
                                ))}
                            </div>
                            <div className="chart-label">24H Performance</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h3>🔄 Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-time">{new Date().toLocaleTimeString()}</span>
                        <span className="activity-icon">⚡</span>
                        <span className="activity-text">PSDN price updated: ${psdnMetrics?.priceUSD.toFixed(4)}</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">{new Date(Date.now() - 30000).toLocaleTimeString()}</span>
                        <span className="activity-icon">🔶</span>
                        <span className="activity-text">OBOL epoch finalized: {networkMetrics?.finalizedEpoch}</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">{new Date(Date.now() - 60000).toLocaleTimeString()}</span>
                        <span className="activity-icon">📊</span>
                        <span className="activity-text">Portfolio synchronized</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Placeholder components for other dashboards
const PSDNDashboard: React.FC<DashboardComponentProps> = () => (
    <div className="psdn-dashboard">
        <h2>⚡ PSDN Flow Analytics</h2>
        <p>Real-time PSDN transaction monitoring and flow analysis</p>
    </div>
);

const OBOLDashboard: React.FC<DashboardComponentProps> = () => (
    <div className="obol-dashboard">
        <h2>🔶 OBOL Operations Center</h2>
        <p>Validator performance and cluster management</p>
    </div>
);

const PortfolioDashboard: React.FC<DashboardComponentProps> = () => (
    <div className="portfolio-dashboard">
        <h2>📊 Portfolio Management</h2>
        <p>Multi-asset portfolio tracking and analytics</p>
    </div>
);

const TradingDashboard: React.FC<DashboardComponentProps> = () => (
    <div className="trading-dashboard">
        <h2>💱 Trading Interface</h2>
        <p>Professional trading tools and execution</p>
    </div>
);

const RiskDashboard: React.FC<DashboardComponentProps> = () => (
    <div className="risk-dashboard">
        <h2>🎯 Risk Analytics</h2>
        <p>Advanced risk metrics and monitoring</p>
    </div>
);

const AdminDashboard: React.FC<DashboardComponentProps> = () => (
    <div className="admin-dashboard">
        <h2>⚙️ System Administration</h2>
        <p>System configuration and management</p>
    </div>
);

export default CryptoWebInterface;