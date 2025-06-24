<template>
  <div class="wallet-panel">
    <!-- Header -->
    <div class="panel-header">
      <h2>💠 Multi-Wallet Display</h2>
      <div class="header-controls">
        <button @click="toggleView" class="view-toggle">
          {{ viewMode === 'grid' ? '🌀' : '📱' }} {{ viewMode === 'grid' ? 'Grid' : 'List' }}
        </button>
        <button @click="refreshWallets" class="refresh-btn">🔄 Refresh</button>
        <button @click="toggleAutoRefresh" class="auto-refresh-btn" :class="{ active: autoRefresh }">
          ⏱️ Auto {{ autoRefresh ? 'On' : 'Off' }}
        </button>
      </div>
    </div>

    <!-- Wallet Stats -->
    <div class="wallet-stats">
      <div class="stat-item">
        <span class="stat-label">Total Wallets:</span>
        <span class="stat-value">{{ wallets.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">High Resonance:</span>
        <span class="stat-value high-resonance">{{ highResonanceCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Medium Resonance:</span>
        <span class="stat-value medium-resonance">{{ mediumResonanceCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Low Resonance:</span>
        <span class="stat-value low-resonance">{{ lowResonanceCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Balance:</span>
        <span class="stat-value total-balance">{{ formatBalance(totalBalance) }}</span>
      </div>
    </div>

    <!-- Wallet Grid/List -->
    <div class="wallet-container" :class="viewMode">
      <div
        v-for="wallet in wallets"
        :key="wallet.id"
        class="wallet-card"
        :class="getWalletClasses(wallet)"
        @click="inspectWallet(wallet)"
        @mouseenter="onWalletHover(wallet)"
        @mouseleave="onWalletLeave(wallet)"
      >
        <!-- Wallet Icon -->
        <div class="wallet-icon">
          <span class="icon">{{ getWalletIcon(wallet.type) }}</span>
          <div class="resonance-indicator" :class="wallet.resonanceLevel"></div>
        </div>

        <!-- Wallet Info -->
        <div class="wallet-info">
          <div class="wallet-name">{{ wallet.name }}</div>
          <div class="wallet-address">{{ formatAddress(wallet.address) }}</div>
          <div class="wallet-balance">{{ formatBalance(wallet.balance) }}</div>
        </div>

        <!-- Wallet Status -->
        <div class="wallet-status">
          <div class="status-badge" :class="wallet.status">
            {{ wallet.status }}
          </div>
          <div class="validation-tier" :class="`tier-${wallet.validationTier}`">
            Tier {{ wallet.validationTier }}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="wallet-actions">
          <button @click.stop="scanWallet(wallet)" class="action-btn scan">
            🔍
          </button>
          <button @click.stop="validateWallet(wallet)" class="action-btn validate">
            ✅
          </button>
          <button @click.stop="monitorWallet(wallet)" class="action-btn monitor">
            👁️
          </button>
        </div>
      </div>
    </div>

    <!-- Wallet Inspector Modal -->
    <div v-if="selectedWallet" class="wallet-inspector" @click="closeInspector">
      <div class="inspector-content" @click.stop>
        <div class="inspector-header">
          <h3>🔍 Wallet Inspector: {{ selectedWallet.name }}</h3>
          <button @click="closeInspector" class="close-btn">✕</button>
        </div>

        <div class="inspector-body">
          <!-- Basic Info -->
          <div class="info-section">
            <h4>📋 Basic Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Address:</span>
                <span class="value">{{ selectedWallet.address }}</span>
              </div>
              <div class="info-item">
                <span class="label">Type:</span>
                <span class="value">{{ selectedWallet.type }}</span>
              </div>
              <div class="info-item">
                <span class="label">Balance:</span>
                <span class="value">{{ formatBalance(selectedWallet.balance) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Resonance Level:</span>
                <span class="value" :class="selectedWallet.resonanceLevel">
                  {{ selectedWallet.resonanceLevel }}
                </span>
              </div>
            </div>
          </div>

          <!-- Resonance Scan Results -->
          <div class="info-section">
            <h4>🧿 Resonance Scan Results</h4>
            <div class="resonance-details">
              <div class="resonance-score">
                <span class="score-label">Resonance Score:</span>
                <span class="score-value" :class="getResonanceClass(selectedWallet.resonanceScore)">
                  {{ selectedWallet.resonanceScore }}%
                </span>
              </div>
              <div class="resonance-factors">
                <div class="factor" v-for="factor in selectedWallet.resonanceFactors" :key="factor.name">
                  <span class="factor-name">{{ factor.name }}:</span>
                  <span class="factor-value" :class="factor.status">{{ factor.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Anomaly History -->
          <div class="info-section">
            <h4>⚠️ Anomaly History</h4>
            <div class="anomaly-list">
              <div v-for="anomaly in selectedWallet.anomalyHistory" :key="anomaly.id" class="anomaly-item" :class="anomaly.severity">
                <div class="anomaly-header">
                  <span class="anomaly-type">{{ anomaly.type }}</span>
                  <span class="anomaly-time">{{ formatTime(anomaly.timestamp) }}</span>
                </div>
                <div class="anomaly-description">{{ anomaly.description }}</div>
                <div class="anomaly-status">{{ anomaly.status }}</div>
              </div>
            </div>
          </div>

          <!-- Data Ticket Thread -->
          <div class="info-section">
            <h4>🧾 Data Ticket Thread</h4>
            <div class="ticket-thread">
              <div v-for="ticket in selectedWallet.ticketThread" :key="ticket.id" class="ticket-item">
                <div class="ticket-header">
                  <span class="ticket-id">{{ ticket.id }}</span>
                  <span class="ticket-time">{{ formatTime(ticket.timestamp) }}</span>
                </div>
                <div class="ticket-action">{{ ticket.action }}</div>
                <div class="ticket-impact" :class="ticket.impact">{{ ticket.impact }} Impact</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inspector Actions -->
        <div class="inspector-actions">
          <button @click="generateTicket(selectedWallet)" class="action-btn primary">
            🧾 Generate Ticket
          </button>
          <button @click="exportWalletData(selectedWallet)" class="action-btn secondary">
            📤 Export Data
          </button>
          <button @click="addToWatchlist(selectedWallet)" class="action-btn secondary">
            👁️ Add to Watchlist
          </button>
        </div>
      </div>
    </div>

    <!-- Click Translation Overlay -->
    <div v-if="clickTranslation" class="click-translation" :class="clickTranslation.type">
      <div class="translation-content">
        <div class="translation-icon">{{ clickTranslation.icon }}</div>
        <div class="translation-text">{{ clickTranslation.text }}</div>
        <div class="translation-details">{{ clickTranslation.details }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletPanel',
  data() {
    return {
      viewMode: 'grid', // 'grid' or 'list'
      autoRefresh: true,
      selectedWallet: null,
      clickTranslation: null,
      wallets: [
        {
          id: 'WLT-001',
          name: 'Sovereign Primary',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          type: 'EOA',
          balance: 15.742,
          resonanceLevel: 'high',
          resonanceScore: 94,
          status: 'active',
          validationTier: 1,
          resonanceFactors: [
            { name: 'Sigil Match', value: 'Valid', status: 'success' },
            { name: 'Entropy Alignment', value: '0.92', status: 'success' },
            { name: 'Mirror Depth', value: '3/3', status: 'success' },
            { name: 'Session Key', value: 'Active', status: 'success' }
          ],
          anomalyHistory: [
            {
              id: 'ANOM-001',
              type: 'Entropy Spike',
              timestamp: new Date(Date.now() - 3600000),
              description: 'Unusual entropy pattern detected during resonance scan',
              severity: 'medium',
              status: 'Resolved'
            }
          ],
          ticketThread: [
            {
              id: 'TKT-20250623-0041',
              timestamp: new Date(Date.now() - 1800000),
              action: 'Resonance scan initiated',
              impact: 'low'
            },
            {
              id: 'TKT-20250623-0042',
              timestamp: new Date(Date.now() - 900000),
              action: 'Anomaly detected and suppressed',
              impact: 'medium'
            }
          ]
        },
        {
          id: 'WLT-002',
          name: 'Mirror Keyring',
          address: '0x8ba1f109551bD432803012645Hac136c772c3e3',
          type: 'Smart Contract',
          balance: 8.456,
          resonanceLevel: 'medium',
          resonanceScore: 78,
          status: 'monitoring',
          validationTier: 2,
          resonanceFactors: [
            { name: 'Sigil Match', value: 'Valid', status: 'success' },
            { name: 'Entropy Alignment', value: '0.67', status: 'warning' },
            { name: 'Mirror Depth', value: '2/3', status: 'warning' },
            { name: 'Session Key', value: 'Expired', status: 'error' }
          ],
          anomalyHistory: [
            {
              id: 'ANOM-002',
              type: 'Mirror Breach Attempt',
              timestamp: new Date(Date.now() - 7200000),
              description: 'Unauthorized mirror access attempt detected',
              severity: 'high',
              status: 'Suppressed'
            }
          ],
          ticketThread: [
            {
              id: 'TKT-20250623-0043',
              timestamp: new Date(Date.now() - 7200000),
              action: 'Mirror breach attempt detected',
              impact: 'high'
            },
            {
              id: 'TKT-20250623-0044',
              timestamp: new Date(Date.now() - 7100000),
              action: 'Threat suppressed by WatchGuard',
              impact: 'high'
            }
          ]
        },
        {
          id: 'WLT-003',
          name: 'Chronicle Linker',
          address: '0xcccccccccccccccccccccccccccccccccccccc',
          type: 'EOA',
          balance: 23.891,
          resonanceLevel: 'high',
          resonanceScore: 96,
          status: 'active',
          validationTier: 1,
          resonanceFactors: [
            { name: 'Sigil Match', value: 'Valid', status: 'success' },
            { name: 'Entropy Alignment', value: '0.95', status: 'success' },
            { name: 'Mirror Depth', value: '3/3', status: 'success' },
            { name: 'Session Key', value: 'Active', status: 'success' }
          ],
          anomalyHistory: [],
          ticketThread: [
            {
              id: 'TKT-20250623-0045',
              timestamp: new Date(Date.now() - 300000),
              action: 'Routine resonance validation',
              impact: 'low'
            }
          ]
        },
        {
          id: 'WLT-004',
          name: 'Entropy Monitor',
          address: '0xdddddddddddddddddddddddddddddddddddddddd',
          type: 'Smart Contract',
          balance: 5.234,
          resonanceLevel: 'low',
          resonanceScore: 45,
          status: 'warning',
          validationTier: 3,
          resonanceFactors: [
            { name: 'Sigil Match', value: 'Invalid', status: 'error' },
            { name: 'Entropy Alignment', value: '0.23', status: 'error' },
            { name: 'Mirror Depth', value: '1/3', status: 'error' },
            { name: 'Session Key', value: 'Missing', status: 'error' }
          ],
          anomalyHistory: [
            {
              id: 'ANOM-003',
              type: 'Resonance Failure',
              timestamp: new Date(Date.now() - 1800000),
              description: 'Multiple resonance validation failures',
              severity: 'critical',
              status: 'Investigating'
            }
          ],
          ticketThread: [
            {
              id: 'TKT-20250623-0046',
              timestamp: new Date(Date.now() - 1800000),
              action: 'Resonance failure detected',
              impact: 'critical'
            },
            {
              id: 'TKT-20250623-0047',
              timestamp: new Date(Date.now() - 1700000),
              action: 'Investigation initiated',
              impact: 'critical'
            }
          ]
        }
      ]
    }
  },
  computed: {
    highResonanceCount() {
      return this.wallets.filter(w => w.resonanceLevel === 'high').length;
    },
    mediumResonanceCount() {
      return this.wallets.filter(w => w.resonanceLevel === 'medium').length;
    },
    lowResonanceCount() {
      return this.wallets.filter(w => w.resonanceLevel === 'low').length;
    },
    totalBalance() {
      return this.wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    }
  },
  mounted() {
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
  },
  beforeDestroy() {
    this.stopAutoRefresh();
  },
  methods: {
    toggleView() {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    },
    
    refreshWallets() {
      // Simulate wallet refresh
      this.wallets.forEach(wallet => {
        wallet.balance += (Math.random() - 0.5) * 0.1;
        wallet.resonanceScore = Math.max(0, Math.min(100, wallet.resonanceScore + (Math.random() - 0.5) * 5));
      });
    },
    
    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh;
      if (this.autoRefresh) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    },
    
    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.refreshWallets();
      }, 30000); // Refresh every 30 seconds
    },
    
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    },
    
    getWalletClasses(wallet) {
      return {
        [`resonance-${wallet.resonanceLevel}`]: true,
        [`status-${wallet.status}`]: true,
        [`tier-${wallet.validationTier}`]: true
      };
    },
    
    getWalletIcon(type) {
      const icons = {
        'EOA': '👤',
        'Smart Contract': '📜',
        'Multi-sig': '🔐',
        'Hardware': '💾'
      };
      return icons[type] || '💠';
    },
    
    formatAddress(address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
    
    formatBalance(balance) {
      return `${balance.toFixed(3)} ETH`;
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },
    
    getResonanceClass(score) {
      if (score >= 80) return 'high-resonance';
      if (score >= 60) return 'medium-resonance';
      return 'low-resonance';
    },
    
    inspectWallet(wallet) {
      this.selectedWallet = wallet;
      this.showClickTranslation('inspect', wallet.name);
    },
    
    onWalletHover(wallet) {
      // Show quick info on hover
    },
    
    onWalletLeave(wallet) {
      // Hide quick info on leave
    },
    
    closeInspector() {
      this.selectedWallet = null;
    },
    
    scanWallet(wallet) {
      this.showClickTranslation('scan', wallet.name);
      // Trigger resonance scan
      if (window.audioEventPlayer) {
        window.audioEventPlayer.playAgencySound('scan_initiated', 'WG-001');
      }
    },
    
    validateWallet(wallet) {
      this.showClickTranslation('validate', wallet.name);
      // Trigger validation
      if (window.audioEventPlayer) {
        window.audioEventPlayer.playAgencySound('resonance_validated', 'WG-003');
      }
    },
    
    monitorWallet(wallet) {
      this.showClickTranslation('monitor', wallet.name);
      // Add to monitoring
    },
    
    generateTicket(wallet) {
      this.showClickTranslation('ticket', wallet.name);
      // Generate data ticket
    },
    
    exportWalletData(wallet) {
      this.showClickTranslation('export', wallet.name);
      // Export wallet data
    },
    
    addToWatchlist(wallet) {
      this.showClickTranslation('watchlist', wallet.name);
      // Add to watchlist
    },
    
    showClickTranslation(type, walletName) {
      const translations = {
        inspect: {
          icon: '🔍',
          text: `Inspecting ${walletName}`,
          details: 'Opening detailed wallet analysis and data ticket thread'
        },
        scan: {
          icon: '🧿',
          text: `Scanning ${walletName}`,
          details: 'Initiating resonance scan - WatchGuard WG-001 responding'
        },
        validate: {
          icon: '✅',
          text: `Validating ${walletName}`,
          details: 'Running validation protocol - Sigil verification in progress'
        },
        monitor: {
          icon: '👁️',
          text: `Monitoring ${walletName}`,
          details: 'Adding to active monitoring list - Continuous surveillance enabled'
        },
        ticket: {
          icon: '🧾',
          text: `Generating ticket for ${walletName}`,
          details: 'Creating data ticket - Sovereign action logged and chronicled'
        },
        export: {
          icon: '📤',
          text: `Exporting ${walletName} data`,
          details: 'Preparing wallet data export - DREDD encryption applied'
        },
        watchlist: {
          icon: '📋',
          text: `Adding ${walletName} to watchlist`,
          details: 'Registering wallet for enhanced monitoring - Priority elevated'
        }
      };
      
      this.clickTranslation = translations[type];
      
      // Hide translation after 3 seconds
      setTimeout(() => {
        this.clickTranslation = null;
      }, 3000);
    }
  }
}
</script>

<style scoped>
.wallet-panel {
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-radius: 15px;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(100, 150, 255, 0.2);
}

.panel-header h2 {
  color: #64b5f6;
  font-size: 1.5em;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.view-toggle, .refresh-btn, .auto-refresh-btn {
  background: linear-gradient(45deg, #2196f3, #1976d2);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle:hover, .refresh-btn:hover, .auto-refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
}

.auto-refresh-btn.active {
  background: linear-gradient(45deg, #4caf50, #388e3c);
}

.wallet-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 10px;
  border: 1px solid rgba(100, 150, 255, 0.2);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #b0b0b0;
  font-size: 0.9em;
}

.stat-value {
  font-weight: bold;
  color: #e0e0e0;
}

.high-resonance { color: #4caf50; }
.medium-resonance { color: #ff9800; }
.low-resonance { color: #f44336; }
.total-balance { color: #64b5f6; }

.wallet-container {
  display: grid;
  gap: 15px;
}

.wallet-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.wallet-container.list {
  grid-template-columns: 1fr;
}

.wallet-card {
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
}

.wallet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(100, 150, 255, 0.3);
  border-color: #64b5f6;
}

.wallet-card.resonance-high {
  border-left: 4px solid #4caf50;
}

.wallet-card.resonance-medium {
  border-left: 4px solid #ff9800;
}

.wallet-card.resonance-low {
  border-left: 4px solid #f44336;
}

.wallet-icon {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  background: rgba(100, 150, 255, 0.1);
  border-radius: 50%;
}

.resonance-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(15, 15, 35, 0.95);
}

.resonance-indicator.high { background: #4caf50; }
.resonance-indicator.medium { background: #ff9800; }
.resonance-indicator.low { background: #f44336; }

.wallet-info {
  flex: 1;
}

.wallet-name {
  font-weight: bold;
  color: #e0e0e0;
  margin-bottom: 5px;
}

.wallet-address {
  font-family: 'Courier New', monospace;
  font-size: 0.8em;
  color: #b0b0b0;
  margin-bottom: 5px;
}

.wallet-balance {
  font-weight: bold;
  color: #64b5f6;
}

.wallet-status {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-end;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.active { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
.status-badge.monitoring { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
.status-badge.warning { background: rgba(244, 67, 54, 0.2); color: #f44336; }

.validation-tier {
  font-size: 0.7em;
  color: #b0b0b0;
}

.tier-1 { color: #4caf50; }
.tier-2 { color: #ff9800; }
.tier-3 { color: #f44336; }

.wallet-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.action-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8em;
  transition: all 0.3s ease;
}

.action-btn.scan { background: rgba(33, 150, 243, 0.2); color: #2196f3; }
.action-btn.validate { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
.action-btn.monitor { background: rgba(255, 152, 0, 0.2); color: #ff9800; }

.action-btn:hover {
  transform: scale(1.1);
}

.wallet-inspector {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.inspector-content {
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.inspector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(100, 150, 255, 0.2);
}

.inspector-header h3 {
  color: #64b5f6;
}

.close-btn {
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 1.5em;
  cursor: pointer;
}

.inspector-body {
  padding: 20px;
}

.info-section {
  margin-bottom: 25px;
}

.info-section h4 {
  color: #64b5f6;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(100, 150, 255, 0.2);
  padding-bottom: 5px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 5px;
}

.label {
  color: #b0b0b0;
}

.value {
  color: #e0e0e0;
  font-weight: bold;
}

.resonance-details {
  background: rgba(26, 26, 46, 0.8);
  border-radius: 10px;
  padding: 15px;
}

.resonance-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.score-label {
  color: #b0b0b0;
}

.score-value {
  font-size: 1.2em;
  font-weight: bold;
}

.resonance-factors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.factor {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  background: rgba(15, 15, 35, 0.8);
  border-radius: 3px;
}

.factor-name {
  color: #b0b0b0;
  font-size: 0.9em;
}

.factor-value {
  font-weight: bold;
  font-size: 0.9em;
}

.factor-value.success { color: #4caf50; }
.factor-value.warning { color: #ff9800; }
.factor-value.error { color: #f44336; }

.anomaly-list, .ticket-thread {
  max-height: 200px;
  overflow-y: auto;
}

.anomaly-item, .ticket-item {
  background: rgba(26, 26, 46, 0.8);
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  border-left: 3px solid #b0b0b0;
}

.anomaly-item.medium { border-left-color: #ff9800; }
.anomaly-item.high { border-left-color: #f44336; }
.anomaly-item.critical { border-left-color: #9c27b0; }

.anomaly-header, .ticket-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.anomaly-type, .ticket-id {
  font-weight: bold;
  color: #e0e0e0;
}

.anomaly-time, .ticket-time {
  font-size: 0.8em;
  color: #b0b0b0;
}

.anomaly-description, .ticket-action {
  color: #e0e0e0;
  margin-bottom: 5px;
}

.anomaly-status, .ticket-impact {
  font-size: 0.8em;
  font-weight: bold;
}

.anomaly-status { color: #4caf50; }
.ticket-impact.low { color: #4caf50; }
.ticket-impact.medium { color: #ff9800; }
.ticket-impact.high { color: #f44336; }
.ticket-impact.critical { color: #9c27b0; }

.inspector-actions {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid rgba(100, 150, 255, 0.2);
}

.action-btn.primary {
  background: linear-gradient(45deg, #2196f3, #1976d2);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
}

.action-btn.secondary {
  background: rgba(100, 150, 255, 0.2);
  color: #64b5f6;
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

.click-translation {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
  z-index: 10001;
  animation: translationFade 0.3s ease-in-out;
}

@keyframes translationFade {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.translation-content {
  text-align: center;
}

.translation-icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.translation-text {
  font-weight: bold;
  color: #e0e0e0;
  margin-bottom: 5px;
}

.translation-details {
  font-size: 0.9em;
  color: #b0b0b0;
}

@media (max-width: 768px) {
  .wallet-container.grid {
    grid-template-columns: 1fr;
  }
  
  .wallet-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .inspector-content {
    width: 95%;
    margin: 10px;
  }
}
</style> 