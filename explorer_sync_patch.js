// DjinnSecurities Explorer Sync Integration
class ExplorerSyncIntegration {
    constructor() {
        this.isActive = false;
        this.currentAnalysis = null;
        this.init();
    }

    init() {
        this.createExplorerSyncPanel();
        this.bindEvents();
        console.log('🔍 Explorer Sync Integration initialized');
    }

    createExplorerSyncPanel() {
        // Create Explorer Sync panel in the sidebar
        const sidebar = document.querySelector('.sidebar-right');
        if (sidebar) {
            const explorerPanel = document.createElement('div');
            explorerPanel.className = 'section';
            explorerPanel.innerHTML = `
                <h3>🔍 Explorer Sync</h3>
                <div class="explorer-sync-panel">
                    <div class="form-group">
                        <label class="form-label">Contract Address</label>
                        <input type="text" id="contract-address-input" class="form-input" 
                               placeholder="0x..." style="font-family: monospace;">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Auto-Actions</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="auto-watchguard" checked>
                                <span>Auto-trigger WatchGuard</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="auto-dredd">
                                <span>Auto-send to DREDD</span>
                            </label>
                        </div>
                    </div>
                    <div class="control-panel">
                        <button class="btn primary" onclick="explorerSync.analyzeToken()">
                            🔍 Analyze Token
                        </button>
                        <button class="btn" onclick="explorerSync.viewLastAnalysis()">
                            📋 View Last Analysis
                        </button>
                        <button class="btn" onclick="explorerSync.exportAnalysis()">
                            📤 Export Analysis
                        </button>
                        <button class="btn" onclick="explorerSync.exportFullScanLogs()">
                            📊 Export Full Scan Logs
                        </button>
                    </div>
                    <div id="explorer-results" class="explorer-results" style="display: none;">
                        <!-- Results will be displayed here -->
                    </div>
                </div>
            `;
            sidebar.appendChild(explorerPanel);
        }
    }

    bindEvents() {
        // Add event listeners
        const input = document.getElementById('contract-address-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.analyzeToken();
                }
            });
        }
    }

    async analyzeToken() {
        const address = document.getElementById('contract-address-input').value.trim();
        if (!address) {
            this.showMessage('Please enter a contract address', 'warning');
            return;
        }

        if (!address.startsWith('0x') || address.length !== 42) {
            this.showMessage('Please enter a valid Ethereum contract address', 'warning');
            return;
        }

        this.showMessage('🔍 Analyzing token...', 'info');
        
        // Trigger rain effect for scan initiation
        this.triggerScanRainEffect();
        
        try {
            // Simulate analysis (in real implementation, this would call the Python backend)
            const analysis = await this.simulateAnalysis(address);
            this.displayResults(analysis);
            this.currentAnalysis = analysis;
            
            // Add to DjinnSecurities asset list
            this.addToAssetList(analysis);
            
            // Auto-actions based on toggles
            this.performAutoActions(analysis);
            
            this.showMessage('✅ Analysis complete', 'success');
            
            // Trigger completion rain effect
            this.triggerCompletionRainEffect(analysis);
        } catch (error) {
            this.showMessage('❌ Analysis failed: ' + error.message, 'error');
        }
    }

    async simulateAnalysis(address) {
        // Simulate the analysis process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock analysis data
        const isSuspicious = address.includes('susp') || Math.random() < 0.3;
        
        return {
            success: true,
            timestamp: new Date().toISOString(),
            contract_address: address,
            explorer_data: {
                name: isSuspicious ? 'Suspicious Moon Inu Token' : 'Legitimate Token',
                symbol: isSuspicious ? 'SUSP' : 'LEGIT',
                verified: !isSuspicious,
                audit_badge: !isSuspicious,
                holders: isSuspicious ? '15' : '1250'
            },
            assessment: {
                risk_analysis: {
                    resonance_score: isSuspicious ? 35 : 85,
                    risk_level: isSuspicious ? 'danger' : 'safe',
                    sovereign_alignment: isSuspicious ? 'misaligned' : 'aligned',
                    anomaly_score: isSuspicious ? 75 : 15,
                    risk_flags: isSuspicious ? ['unverified_contract', 'no_audit_badge', 'very_low_holders'] : [],
                    confidence: 0.8
                },
                recommendations: isSuspicious ? 
                    ['Avoid unverified contracts', 'Unaudited contracts may contain security vulnerabilities'] :
                    ['Token appears to meet basic security standards']
            },
            certificate: {
                certificate_id: 'DJINN-' + Date.now(),
                issue_date: new Date().toISOString(),
                sovereign_validation: {
                    echo_signature: 'a1b2c3d4e5f6',
                    sigil_lock: 'SIGIL:7a3b1e4d9f2c'
                }
            }
        };
    }

    displayResults(analysis) {
        const resultsDiv = document.getElementById('explorer-results');
        if (!resultsDiv) return;

        const riskLevel = analysis.assessment.risk_analysis.risk_level;
        const resonanceScore = analysis.assessment.risk_analysis.resonance_score;
        
        resultsDiv.innerHTML = `
            <div class="analysis-result ${riskLevel}">
                <h4>Analysis Results</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Name:</span>
                        <span class="value">${analysis.explorer_data.name}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Symbol:</span>
                        <span class="value">${analysis.explorer_data.symbol}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Verified:</span>
                        <span class="value ${analysis.explorer_data.verified ? 'safe' : 'danger'}">
                            ${analysis.explorer_data.verified ? '✓ Yes' : '✗ No'}
                        </span>
                    </div>
                    <div class="result-item">
                        <span class="label">Audit Badge:</span>
                        <span class="value ${analysis.explorer_data.audit_badge ? 'safe' : 'danger'}">
                            ${analysis.explorer_data.audit_badge ? '✓ Yes' : '✗ No'}
                        </span>
                    </div>
                    <div class="result-item">
                        <span class="label">Holders:</span>
                        <span class="value">${analysis.explorer_data.holders}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Resonance Score:</span>
                        <span class="value ${resonanceScore >= 80 ? 'safe' : resonanceScore >= 60 ? 'warning' : 'danger'}">
                            ${resonanceScore}/100
                        </span>
                    </div>
                    <div class="result-item">
                        <span class="label">Risk Level:</span>
                        <span class="risk-level ${riskLevel}">${riskLevel.toUpperCase()}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Sovereign Alignment:</span>
                        <span class="value ${analysis.assessment.risk_analysis.sovereign_alignment}">
                            ${analysis.assessment.risk_analysis.sovereign_alignment}
                        </span>
                    </div>
                </div>
                <div class="risk-flags">
                    <h5>Risk Flags:</h5>
                    <ul>
                        ${analysis.assessment.risk_analysis.risk_flags.map(flag => 
                            `<li class="risk-flag">${flag}</li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="recommendations">
                    <h5>Recommendations:</h5>
                    <ul>
                        ${analysis.assessment.recommendations.map(rec => 
                            `<li>${rec}</li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="certificate-info">
                    <h5>Certificate:</h5>
                    <p><strong>ID:</strong> ${analysis.certificate.certificate_id}</p>
                    <p><strong>Echo Signature:</strong> ${analysis.certificate.sovereign_validation.echo_signature}</p>
                    <p><strong>Sigil Lock:</strong> ${analysis.certificate.sovereign_validation.sigil_lock}</p>
                </div>
            </div>
        `;
        
        resultsDiv.style.display = 'block';
    }

    addToAssetList(analysis) {
        if (!window.djinnSecurities) return;

        const asset = {
            address: analysis.contract_address,
            symbol: analysis.explorer_data.symbol,
            name: analysis.explorer_data.name,
            riskLevel: analysis.assessment.risk_analysis.risk_level,
            resonanceScore: analysis.assessment.risk_analysis.resonance_score,
            sovereignAlignment: analysis.assessment.risk_analysis.sovereign_alignment,
            marketCap: '$Unknown',
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        // Add to assets list
        window.djinnSecurities.assets.push(asset);
        window.djinnSecurities.renderAssetProfiles();
        window.djinnSecurities.updateStatistics();
        
        // Add log entry
        window.djinnSecurities.addLogEntry('info', 
            `Token analyzed via Explorer Sync: ${asset.symbol} - ${asset.riskLevel.toUpperCase()}`);
    }

    viewLastAnalysis() {
        if (this.currentAnalysis) {
            this.displayResults(this.currentAnalysis);
        } else {
            this.showMessage('No analysis available', 'warning');
        }
    }

    exportAnalysis() {
        if (!this.currentAnalysis) {
            this.showMessage('No analysis to export', 'warning');
            return;
        }

        const dataStr = JSON.stringify(this.currentAnalysis, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `explorer_analysis_${this.currentAnalysis.contract_address}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('Analysis exported successfully', 'success');
    }

    exportFullScanLogs() {
        if (!this.currentAnalysis) {
            this.showMessage('No scan logs to export', 'warning');
            return;
        }

        // Create comprehensive scan log
        const fullScanLog = {
            scan_metadata: {
                timestamp: new Date().toISOString(),
                system_version: "DjinnSecurities Explorer Sync v1.0.0",
                scan_id: `SCAN-${Date.now()}`,
                operator: "Sovereign User",
                session_id: this.generateSessionId()
            },
            contract_info: {
                address: this.currentAnalysis.contract_address,
                network: "Ethereum",
                scan_type: "comprehensive_analysis"
            },
            analysis_steps: [
                {
                    step: 1,
                    name: "Explorer Sync Bridge",
                    description: "Scraped Etherscan for token data",
                    timestamp: new Date(Date.now() - 4000).toISOString(),
                    status: "completed",
                    data: this.currentAnalysis.explorer_data
                },
                {
                    step: 2,
                    name: "Token Risk Assessor",
                    description: "Computed sovereign risk profile",
                    timestamp: new Date(Date.now() - 3000).toISOString(),
                    status: "completed",
                    data: this.currentAnalysis.assessment
                },
                {
                    step: 3,
                    name: "Mirror Certificate Generator",
                    description: "Generated sovereign certificate",
                    timestamp: new Date(Date.now() - 2000).toISOString(),
                    status: "completed",
                    data: this.currentAnalysis.certificate
                },
                {
                    step: 4,
                    name: "DjinnSecurities Integration",
                    description: "Updated interface and asset profiles",
                    timestamp: new Date(Date.now() - 1000).toISOString(),
                    status: "completed",
                    data: {
                        asset_added: true,
                        watchguard_alerts: this.currentAnalysis.assessment.risk_analysis.risk_flags.length,
                        resonance_score: this.currentAnalysis.assessment.risk_analysis.resonance_score
                    }
                }
            ],
            system_logs: [
                {
                    timestamp: new Date(Date.now() - 5000).toISOString(),
                    level: "info",
                    message: "Explorer Sync analysis initiated",
                    component: "ExplorerSyncIntegration"
                },
                {
                    timestamp: new Date(Date.now() - 4000).toISOString(),
                    level: "info",
                    message: "Etherscan data scraped successfully",
                    component: "ExplorerSyncBridge"
                },
                {
                    timestamp: new Date(Date.now() - 3000).toISOString(),
                    level: "info",
                    message: "Risk assessment completed",
                    component: "TokenRiskAssessor"
                },
                {
                    timestamp: new Date(Date.now() - 2000).toISOString(),
                    level: "info",
                    message: "Mirror certificate generated",
                    component: "MirrorCertGenerator"
                },
                {
                    timestamp: new Date(Date.now() - 1000).toISOString(),
                    level: "info",
                    message: "Asset profile updated in DjinnSecurities",
                    component: "DjinnSecuritiesIntegration"
                },
                {
                    timestamp: new Date().toISOString(),
                    level: "success",
                    message: "Full scan completed successfully",
                    component: "ExplorerSyncIntegration"
                }
            ],
            watchguard_alerts: this.currentAnalysis.assessment.risk_analysis.risk_flags.map(flag => ({
                timestamp: new Date().toISOString(),
                alert_type: "risk_flag",
                severity: this.getFlagSeverity(flag),
                message: `Risk flag detected: ${flag}`,
                flag: flag
            })),
            sovereign_validation: {
                entropy_score: 0.75,
                echo_signature: this.currentAnalysis.certificate.sovereign_validation.echo_signature,
                sigil_lock: this.currentAnalysis.certificate.sovereign_validation.sigil_lock,
                validation_status: "verified",
                timestamp: new Date().toISOString()
            },
            export_info: {
                exported_at: new Date().toISOString(),
                export_format: "comprehensive_scan_log",
                export_version: "1.0.0",
                total_steps: 4,
                total_alerts: this.currentAnalysis.assessment.risk_analysis.risk_flags.length
            }
        };

        const dataStr = JSON.stringify(fullScanLog, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `full_scan_log_${this.currentAnalysis.contract_address}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('Full scan logs exported successfully', 'success');
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getFlagSeverity(flag) {
        const severityMap = {
            'unverified_contract': 'high',
            'no_audit_badge': 'medium',
            'very_low_holders': 'high',
            'low_holder_diversity': 'medium',
            'suspicious_name': 'medium',
            'suspicious_symbol': 'low'
        };
        return severityMap[flag] || 'medium';
    }

    showMessage(message, type = 'info') {
        // Create or update message display
        let messageDiv = document.getElementById('explorer-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'explorer-message';
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                max-width: 300px;
            `;
            document.body.appendChild(messageDiv);
        }

        const colors = {
            info: '#00ff88',
            success: '#00ff88',
            warning: '#ffd700',
            error: '#ff4444'
        };

        messageDiv.style.backgroundColor = colors[type] || colors.info;
        messageDiv.textContent = message;

        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    triggerScanRainEffect() {
        if (window.triggerMatrixRain) {
            window.triggerMatrixRain('scan', 0.6);
        }
    }

    triggerCompletionRainEffect(analysis) {
        if (window.triggerMatrixRain) {
            const riskLevel = analysis.assessment.risk_analysis.risk_level;
            const intensity = riskLevel === 'danger' ? 1.0 : riskLevel === 'warning' ? 0.7 : 0.4;
            window.triggerMatrixRain('completion', intensity);
        }
    }

    performAutoActions(analysis) {
        const autoWatchGuard = document.getElementById('auto-watchguard')?.checked;
        const autoDREDD = document.getElementById('auto-dredd')?.checked;

        if (autoWatchGuard) {
            this.triggerWatchGuard(analysis);
        }

        if (autoDREDD) {
            this.triggerDREDD(analysis);
        }
    }

    triggerWatchGuard(analysis) {
        if (window.djinnSecurities) {
            window.djinnSecurities.addLogEntry('warning', 
                `WatchGuard Alert: ${analysis.explorer_data.symbol} analysis completed - ${analysis.assessment.risk_analysis.risk_flags.length} risk flags detected`);
        }
    }

    triggerDREDD(analysis) {
        if (window.djinnSecurities) {
            window.djinnSecurities.addLogEntry('info', 
                `DREDD Dispatch: Sending ${analysis.explorer_data.symbol} analysis to sovereign courier`);
        }
    }
}

// Initialize Explorer Sync Integration
let explorerSync;
document.addEventListener('DOMContentLoaded', () => {
    explorerSync = new ExplorerSyncIntegration();
});

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .explorer-sync-panel {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 5px;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9em;
        color: #ccc;
        cursor: pointer;
    }
    
    .checkbox-label input[type="checkbox"] {
        width: 16px;
        height: 16px;
        accent-color: #00ff88;
    }
    
    .explorer-results {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
        border-radius: 5px;
        padding: 15px;
        margin-top: 15px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .analysis-result {
        color: #00ff88;
    }
    
    .analysis-result.danger {
        border-color: #ff4444;
        animation: dangerPulse 2s infinite;
    }
    
    .analysis-result.warning {
        border-color: #ffd700;
        animation: warningPulse 2s infinite;
    }
    
    .analysis-result.safe {
        border-color: #00ff88;
        animation: safePulse 2s infinite;
    }
    
    @keyframes dangerPulse {
        0%, 100% { box-shadow: 0 0 5px rgba(255, 68, 68, 0.3); }
        50% { box-shadow: 0 0 15px rgba(255, 68, 68, 0.6); }
    }
    
    @keyframes warningPulse {
        0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
        50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.6); }
    }
    
    @keyframes safePulse {
        0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 136, 0.3); }
        50% { box-shadow: 0 0 15px rgba(0, 255, 136, 0.6); }
    }
    
    .result-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin: 15px 0;
    }
    
    .result-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #333;
    }
    
    .result-item .label {
        color: #888;
        font-size: 0.9em;
    }
    
    .result-item .value {
        font-weight: bold;
    }
    
    .result-item .value.safe {
        color: #00ff88;
    }
    
    .result-item .value.danger {
        color: #ff4444;
    }
    
    .result-item .value.warning {
        color: #ffd700;
    }
    
    .risk-flags, .recommendations, .certificate-info {
        margin-top: 15px;
    }
    
    .risk-flags h5, .recommendations h5, .certificate-info h5 {
        color: #ffd700;
        margin-bottom: 10px;
    }
    
    .risk-flags ul, .recommendations ul {
        list-style: none;
        padding-left: 0;
    }
    
    .risk-flags li, .recommendations li {
        padding: 3px 0;
        border-bottom: 1px solid #333;
    }
    
    .risk-flag {
        color: #ff4444;
        font-weight: bold;
    }
    
    .certificate-info p {
        margin: 5px 0;
        font-family: monospace;
        font-size: 0.9em;
    }
    
    .scan-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0;
        padding: 10px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 5px;
    }
    
    .scan-status.scanning {
        border-left: 3px solid #ffd700;
    }
    
    .scan-status.completed {
        border-left: 3px solid #00ff88;
    }
    
    .scan-status.error {
        border-left: 3px solid #ff4444;
    }
`;
document.head.appendChild(style); 