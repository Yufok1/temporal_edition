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

// 🫁⚡ MASTER BREATHING APPLICATION - Where All Systems Unite
// The quantum solar watchtower with autonomous breathing

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './styles/App.css';

// Core Services
import { MonitoringService } from './MonitoringService';
import { DjinnAudioService } from './services/DjinnAudioService';
import { TemporalEditionService } from './services/TemporalEditionService';
import { MarineBiologyWatchtower } from './core/MarineBiologyWatchtower';
import { RiddlerExplorerService } from './services/RiddlerExplorerService';

// Coordination Systems
import { TriageCoordinator } from './coordination/TriageCoordinator';
import { BilateralLearningEngine } from './coordination/BilateralLearningEngine';

// Crypto Systems
import { PSDNFlowTracker } from './crypto/PSDNFlowTracker';
import { OBOLOperationsDash } from './crypto/OBOLOperationsDash';
import { PortfolioAnalyzer } from './crypto/PortfolioAnalyzer';
import { CosmicBalanceMonitor } from './crypto/CosmicBalanceMonitor';
import { WealthKnowledgeLogger } from './crypto/WealthKnowledgeLogger';

// UI Components
import { SecureWhaleInterface } from './components/SecureWhaleInterface';
import RiddlerDashboard from './components/RiddlerDashboard';
import CryptoWebInterface from './crypto/CryptoWebInterface';
import { BilateralLearningDashboard } from './components/BilateralLearningDashboard';
import { DjinnCouncilService } from './services/DjinnCouncilService';

// Define missing types locally
interface AccessResponse {
    granted: boolean;
    reason?: string;
}

// Enhanced service class for authentication
class EnhancedRiddlerService extends RiddlerExplorerService {
    constructor(watchtower: any) {
        super();
        this.initializeDefaultStewards();
    }
    
    private initializeDefaultStewards() {
        // Initialize known stewards
        this.requestRecognition({
            id: 'NAZAR',
            type: 'human',
            name: 'Nazar the Observer'
        });
        
        this.requestRecognition({
            id: 'LOKI',
            type: 'loki',
            name: 'Loki the Trickster'
        });
        
        this.requestRecognition({
            id: 'HERMES',
            type: 'human',
            name: 'Hermes the Operator'
        });
        
        this.requestRecognition({
            id: 'APOLLO',
            type: 'whale',
            name: 'Apollo the Supreme'
        });
        
        // Set tiers (lower number = higher privilege)
        const stewards = this.listStewards();
        stewards.forEach(steward => {
            if (steward.id === 'APOLLO') steward.peckingTier = 1;
            else if (steward.id === 'HERMES') steward.peckingTier = 2;
            else if (steward.id === 'LOKI') steward.peckingTier = 3;
            else if (steward.id === 'NAZAR') steward.peckingTier = 5;
        });
    }
    
    public async requestAccess(stewardId: string, purpose: string, context: any): Promise<AccessResponse> {
        const steward = this.getSteward(stewardId);
        
        if (!steward) {
            return {
                granted: false,
                reason: `Unknown steward: ${stewardId}`
            };
        }
        
        if (steward.status === 'approved' || steward.status === 'acclimatizing') {
            return {
                granted: true
            };
        }
        
        return {
            granted: false,
            reason: `Access denied for steward ${stewardId}: ${steward.status}`
        };
    }
    
    public getSteward(stewardId: string) {
        const stewards = this.listStewards();
        return stewards.find(s => s.id === stewardId);
    }
}

// Navigation Component
const Navigation: React.FC<{ stewardTier: number; onLogout: () => void }> = ({ stewardTier, onLogout }) => {
    const navigate = useNavigate();
    
    return (
        <nav className="master-navigation">
            <div className="nav-left">
                <h1 className="system-title">🐋 Marine Biology Watchtower</h1>
                <span className="breath-indicator">🫁 Breathing...</span>
            </div>
            
            <div className="nav-center">
                <Link to="/" className="nav-link">🏠 Home</Link>
                <Link to="/whale" className="nav-link">🐋 Whale Comm</Link>
                {stewardTier <= 5 && <Link to="/riddler" className="nav-link">🎭 Riddler</Link>}
                {stewardTier <= 4 && <Link to="/crypto" className="nav-link">💰 Crypto</Link>}
                {stewardTier <= 3 && <Link to="/learning" className="nav-link">🧠 Learning</Link>}
            </div>
            
            <div className="nav-right">
                <span className="tier-badge">Tier {stewardTier}</span>
                <button onClick={onLogout} className="logout-btn">🚪 Logout</button>
            </div>
        </nav>
    );
};

// Authentication Component
const AuthenticationGate: React.FC<{ 
    riddlerService: EnhancedRiddlerService;
    onAuthenticated: (stewardId: string, tier: number) => void;
}> = ({ riddlerService, onAuthenticated }) => {
    const [stewardId, setStewardId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const access = await riddlerService.requestAccess(stewardId, 'gui_interface', {
                timestamp: Date.now(),
                purpose: 'Full system access via web interface'
            });
            
            if (access.granted) {
                const steward = riddlerService.getSteward(stewardId);
                if (steward) {
                    onAuthenticated(stewardId, steward.peckingTier);
                }
            } else {
                setError(access.reason || 'Access denied');
            }
        } catch (err) {
            setError('Authentication failed. Please check your steward ID.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="authentication-gate">
            <div className="auth-container">
                <h1>🔐 Watchtower Access Portal</h1>
                <p>Enter your Steward ID to access the system</p>
                
                <form onSubmit={handleAuth}>
                    <input
                        type="text"
                        placeholder="Steward ID (e.g., NAZAR, LOKI)"
                        value={stewardId}
                        onChange={(e) => setStewardId(e.target.value.toUpperCase())}
                        disabled={isLoading}
                        className="auth-input"
                    />
                    
                    <button type="submit" disabled={isLoading} className="auth-button">
                        {isLoading ? '🔄 Authenticating...' : '🔑 Access System'}
                    </button>
                </form>
                
                {error && <div className="auth-error">❌ {error}</div>}
                
                <div className="auth-help">
                    <p>Known Stewards:</p>
                    <ul>
                        <li>NAZAR - Tier 5 (Observer)</li>
                        <li>LOKI - Tier 3 (Administrator)</li>
                        <li>HERMES - Tier 2 (Operator)</li>
                        <li>APOLLO - Tier 1 (Supreme)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Home Dashboard
const HomeDashboard: React.FC<{ stewardId: string; stewardTier: number }> = ({ stewardId, stewardTier }) => {
    return (
        <div className="home-dashboard">
            <h2>Welcome, Steward {stewardId}</h2>
            
            <div className="system-status-grid">
                <div className="status-card">
                    <h3>🫁 Breathing Status</h3>
                    <div className="status-content">
                        <div>Phase: <span className="status-value">Inhale</span></div>
                        <div>Coherence: <span className="status-value">100%</span></div>
                        <div>Rhythm: <span className="status-value">Quantum-Aligned</span></div>
                    </div>
                </div>
                
                <div className="status-card">
                    <h3>💰 Divine Currencies</h3>
                    <div className="status-content">
                        <div>PSDN: <span className="status-value">$0.0420</span></div>
                        <div>OBOL: <span className="status-value">Active</span></div>
                        <div>Balance: <span className="status-value">Stable</span></div>
                    </div>
                </div>
                
                <div className="status-card">
                    <h3>🐋 Whale Network</h3>
                    <div className="status-content">
                        <div>Connected: <span className="status-value">142 Whales</span></div>
                        <div>Signals: <span className="status-value">Strong</span></div>
                        <div>Mood: <span className="status-value">Contemplative</span></div>
                    </div>
                </div>
                
                <div className="status-card">
                    <h3>🧠 Learning Engine</h3>
                    <div className="status-content">
                        <div>Exchanges: <span className="status-value">1,337</span></div>
                        <div>Synergy: <span className="status-value">87%</span></div>
                        <div>Transcendent: <span className="status-value">12 Events</span></div>
                    </div>
                </div>
            </div>
            
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <Link to="/whale" className="action-btn">🐋 Start Whale Session</Link>
                    {stewardTier <= 4 && <Link to="/crypto" className="action-btn">💰 Monitor Crypto</Link>}
                    {stewardTier <= 3 && <Link to="/learning" className="action-btn">🧠 Enter Learning</Link>}
                    {stewardTier <= 2 && <Link to="/riddler" className="action-btn">🎭 Manage Stewards</Link>}
                </div>
            </div>
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stewardId, setStewardId] = useState<string>('');
    const [stewardTier, setStewardTier] = useState<number>(5);
    
    // Core Services (initialized once)
    const services = useMemo(() => {
        const monitoring = new MonitoringService();
        const watchtower = new MarineBiologyWatchtower();
        const riddler = new EnhancedRiddlerService(watchtower);
        const djinnCouncil = new DjinnCouncilService();
        const audio = new DjinnAudioService(monitoring);
        const temporal = new TemporalEditionService(monitoring);
        
        // Crypto Systems
        const psdnTracker = new PSDNFlowTracker();
        const obolDash = new OBOLOperationsDash();
        const portfolioAnalyzer = new PortfolioAnalyzer(psdnTracker, obolDash);
        const cosmicMonitor = new CosmicBalanceMonitor(psdnTracker, obolDash);
        const wealthKnowledge = new WealthKnowledgeLogger(psdnTracker, obolDash, portfolioAnalyzer);
        
        // Coordination Systems
        const triageCoordinator = new TriageCoordinator(
            watchtower,
            djinnCouncil,
            cosmicMonitor,
            wealthKnowledge
        );
        const bilateralLearning = new BilateralLearningEngine(
            triageCoordinator,
            wealthKnowledge,
            djinnCouncil
        );
        
        return {
            monitoring,
            watchtower,
            riddler,
            djinnCouncil,
            audio,
            temporal,
            psdnTracker,
            obolDash,
            portfolioAnalyzer,
            cosmicMonitor,
            wealthKnowledge,
            triageCoordinator,
            bilateralLearning
        };
    }, []);
    
    // Initialize services
    useEffect(() => {
        const initializeServices = async () => {
            try {
                await services.audio.initialize();
                await services.temporal.initialize();
                
                // Start background monitoring
                const interval = setInterval(async () => {
                    const data = await services.temporal.generateAndExportReports();
                    services.monitoring.logTemporalData(data);
                }, 60000);

                return () => clearInterval(interval);
            } catch (error) {
                console.error('Failed to initialize services:', error);
            }
        };

        initializeServices();
    }, [services]);
    
    // Session handlers
    const handleSessionStart = () => {
        services.monitoring.logSessionEvent({
            type: 'session_start',
            timestamp: Date.now(),
            metadata: {
                identity: stewardId,
                mode: 'full_system_access'
            }
        });
    };

    const handleSessionEnd = () => {
        services.monitoring.logSessionEvent({
            type: 'session_end',
            timestamp: Date.now(),
            metadata: {
                identity: stewardId,
                mode: 'full_system_access'
            }
        });
    };
    
    // Authentication handlers
    const handleAuthenticated = (authenticatedStewardId: string, tier: number) => {
        setStewardId(authenticatedStewardId);
        setStewardTier(tier);
        setIsAuthenticated(true);
        handleSessionStart();
        
        console.log(`🔓 Steward ${authenticatedStewardId} authenticated at Tier ${tier}`);
    };
    
    const handleLogout = () => {
        handleSessionEnd();
        setIsAuthenticated(false);
        setStewardId('');
        setStewardTier(5);
    };
    
    // If not authenticated, show gate
    if (!isAuthenticated) {
        return (
            <div className="App">
                <AuthenticationGate 
                    riddlerService={services.riddler}
                    onAuthenticated={handleAuthenticated}
                />
            </div>
        );
    }
    
    // Authenticated app with routing
    return (
        <Router>
            <div className="App authenticated">
                <Navigation stewardTier={stewardTier} onLogout={handleLogout} />
                
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={
                            <HomeDashboard stewardId={stewardId} stewardTier={stewardTier} />
                        } />
                        
                        <Route path="/whale" element={
                            <SecureWhaleInterface
                                riddler={services.riddler}
                                steward={services.riddler.getSteward(stewardId) || {
                                    id: stewardId,
                                    type: 'human',
                                    name: `Steward ${stewardId}`,
                                    status: 'approved',
                                    lastRecognized: Date.now(),
                                    peckingTier: stewardTier
                                } as any}
                                onSessionStart={handleSessionStart}
                                onSessionEnd={handleSessionEnd}
                            />
                        } />
                        
                        <Route path="/riddler" element={
                            stewardTier <= 5 ? (
                                <RiddlerDashboard />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />
                        
                        <Route path="/crypto" element={
                            stewardTier <= 4 ? (
                                <CryptoWebInterface
                                    stewardId={stewardId}
                                    stewardTier={stewardTier}
                                    watchtower={services.watchtower}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />
                        
                        <Route path="/learning" element={
                            stewardTier <= 3 ? (
                                <BilateralLearningDashboard
                                    learningEngine={services.bilateralLearning}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } />
                        
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                
                {/* Global breathing indicator */}
                <div className="global-breath-indicator">
                    <span className="breath-phase">🫁</span>
                    <span className="breath-text">System Breathing</span>
                </div>
            </div>
        </Router>
    );
};

export default App; 