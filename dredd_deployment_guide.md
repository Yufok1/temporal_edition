# 🕳️ DREDD Deployment Guide
## Discrete Resonant Echo-Derived Delivery Infrastructure

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Integration](#integration)
8. [Monitoring](#monitoring)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

---

## 🧬 Overview

DREDD (Discrete Resonant Echo-Derived Delivery) is a quantum-capable, resonance-bound messaging infrastructure designed for covert communication, payload delivery, and mirror-safe transmission across your sovereign lattice.

### Core Features
- 🔒 **Quantum-Hybrid Encryption**: Kyber + Dilithium + Classical fallback
- 🪞 **Mirror-Aware Payloads**: Self-disguising messages visible only to lawful recipients
- 🧿 **Sigil-Based Targeting**: Recipients identified via sigils, glyphs, or symbolic resonance states
- 🧬 **Temporal Obfuscation**: Message delay, reordering, and erasure layers
- 🔁 **One-Time Echo Channels**: Messages that self-destruct after single lawful resonance read
- 🧠 **Entropy-Validation Layer**: Message packets carry embedded resonance challenges and entropy scoring
- 🔭 **Stealth Mesh Relay**: Disperses across mirror nodes for decentralized retrieval

---

## ⚙️ Prerequisites

### System Requirements
- Python 3.8+
- Node.js 16+ (for relay nodes)
- Docker & Docker Compose
- Redis (for message queuing)
- PostgreSQL (for audit logs)

### Dependencies
```bash
# Python dependencies
pip install cryptography websockets asyncio dataclasses

# Node.js dependencies (for relay nodes)
npm install ws express redis prometheus-client
```

### Network Requirements
- WebSocket ports: 8080-8084
- Redis port: 6379
- PostgreSQL port: 5432
- Prometheus port: 9090
- Grafana port: 3000

---

## 🚀 Installation

### 1. Clone DREDD Repository
```bash
git clone <dredd-repository>
cd dredd-infrastructure
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Install Node.js Dependencies
```bash
cd relay-nodes
npm install
cd ..
```

### 4. Setup Database
```bash
# PostgreSQL setup
sudo -u postgres createdb dredd_audit
sudo -u postgres createdb dredd_messages

# Redis setup
redis-server --daemonize yes
```

---

## ⚙️ Configuration

### 1. Base Configuration
Copy and modify the base configuration:
```bash
cp dredd_config.json.example dredd_config.json
```

### 2. Configure Sigil Registry
Edit `dredd_config.json` to add your sigils:
```json
{
  "sigil_registry": {
    "your-sigil-01": "0xYourWalletAddressHere",
    "your-service-01": "0xYourServiceAddressHere"
  }
}
```

### 3. Configure Relay Nodes
Update relay node URLs in configuration:
```json
{
  "relay_nodes": [
    "ws://your-node1:8080/dredd",
    "ws://your-node2:8081/dredd",
    "ws://your-node3:8082/dredd"
  ]
}
```

### 4. Security Configuration
Set encryption levels and entropy thresholds:
```json
{
  "quantum_encryption": {
    "kyber_enabled": true,
    "dilithium_enabled": true,
    "classical_fallback": true
  },
  "entropy_thresholds": {
    "low": 0.3,
    "medium": 0.5,
    "high": 0.7,
    "critical": 0.9
  }
}
```

---

## 🚀 Deployment

### 1. Docker Deployment (Recommended)
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f dredd-dispatcher
```

### 2. Manual Deployment
```bash
# Start relay nodes
cd relay-nodes
node dredd-relay-1.js &
node dredd-relay-2.js &
node dredd-relay-3.js &

# Start DREDD dispatcher
python dredd_dispatch.py --daemon

# Start monitoring
python dredd_monitor.py --start
```

### 3. Service Integration
```bash
# Register services with DREDD
python dredd_api_hooks.py --register WalletDivinationService
python dredd_api_hooks.py --register DjinnCouncilService
python dredd_api_hooks.py --register GovernanceAPI
```

---

## 🧪 Testing

### 1. Basic Functionality Test
```bash
# Test message sending
python dredd_dispatch.py send --sigil your-sigil-01 --message "Test message" --resonance medium

# Test message receiving
python dredd_dispatch.py receive --sigil your-sigil-01 --timeout 30
```

### 2. SigilGram Parser Test
```bash
# Create test message
python sigilgram_parser.py --create-test-message --sigil your-sigil-01 --content "Secret content"

# Parse test message
python sigilgram_parser.py --input test_message.json --sigil your-sigil-01 --verbose
```

### 3. Integration Test
```bash
# Test service integration
python dredd_api_hooks.py --test-integration WalletDivinationService

# Test broadcast functionality
python dredd_api_hooks.py --broadcast --event-type test_event --target-services WalletDivinationService,DjinnCouncilService
```

### 4. Security Test
```bash
# Test mirror trap activation
python dredd_security_test.py --test-mirror-trap --invalid-sigil

# Test entropy validation
python dredd_security_test.py --test-entropy --low-entropy-score

# Test quantum encryption
python dredd_security_test.py --test-quantum-encryption
```

---

## 🔗 Integration

### 1. WalletDivinationService Integration
```python
from dredd_api_hooks import DREDDServiceIntegrator

# Initialize integrator
integrator = DREDDServiceIntegrator()

# Register service
integrator.register_service(
    'WalletDivinationService', 
    wallet_service_instance,
    sigil_target='wallet-divination-01',
    encryption_level='high'
)

# Use hooks
@integrator.hook_method('WalletDivinationService', 'check_balance', 'balance_alert')
async def check_balance(self, wallet_address: str):
    # Your balance check logic here
    result = await self._perform_balance_check(wallet_address)
    return result
```

### 2. DjinnCouncilService Integration
```python
# Register Djinn Council service
integrator.register_service(
    'DjinnCouncilService',
    council_service_instance,
    sigil_target='djinn-council-01',
    encryption_level='critical'
)

# Use governance hooks
@integrator.hook_method('DjinnCouncilService', 'make_ruling', 'governance_ruling')
async def make_ruling(self, ruling_type: str, affected_entities: List[str]):
    # Your governance logic here
    ruling = await self._create_ruling(ruling_type, affected_entities)
    return ruling
```

### 3. GovernanceAPI Integration
```python
# Register Governance API
integrator.register_service(
    'GovernanceAPI',
    governance_api_instance,
    sigil_target='governance-api-01',
    encryption_level='high'
)

# Use coordination hooks
@integrator.hook_method('GovernanceAPI', 'coordinate_stewards', 'steward_coordination')
async def coordinate_stewards(self, steward_id: str, coordination_type: str):
    # Your coordination logic here
    coordination = await self._perform_coordination(steward_id, coordination_type)
    return coordination
```

---

## 📊 Monitoring

### 1. Prometheus Metrics
DREDD exposes the following metrics:
- `dredd_messages_sent_total`
- `dredd_messages_received_total`
- `dredd_decryption_failures_total`
- `dredd_entropy_violations_total`
- `dredd_mirror_trap_activations_total`

### 2. Grafana Dashboard
Import the DREDD dashboard:
```bash
# Dashboard configuration
cp grafana/dashboards/dredd-dashboard.json /var/lib/grafana/dashboards/
```

### 3. Alerting Configuration
```yaml
# alertmanager.yml
groups:
  - name: dredd_alerts
    rules:
      - alert: DREDDMessageFailureRate
        expr: rate(dredd_messages_sent_total[5m]) < 0.95
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "DREDD message failure rate is high"
```

### 4. Log Monitoring
```bash
# View DREDD logs
tail -f /var/log/dredd/dredd.log

# Monitor audit logs
tail -f /var/log/dredd/audit.log

# Check error logs
tail -f /var/log/dredd/error.log
```

---

## 🔒 Security

### 1. Access Control
```json
{
  "security": {
    "access_control": {
      "ip_whitelist": ["192.168.1.0/24", "10.0.0.0/8"],
      "rate_limiting": {
        "messages_per_minute": 60,
        "burst_limit": 10
      },
      "authentication": {
        "required": true,
        "methods": ["sigil", "session_key", "entropy_validation"]
      }
    }
  }
}
```

### 2. Encryption Key Management
```bash
# Generate new quantum keys
python dredd_key_manager.py --generate-keys --quantum

# Rotate encryption keys
python dredd_key_manager.py --rotate-keys --force

# Backup keys securely
python dredd_key_manager.py --backup-keys --encrypted
```

### 3. Audit Trail
```bash
# Enable comprehensive auditing
python dredd_audit.py --enable --level comprehensive

# Review audit logs
python dredd_audit.py --review --date 2024-01-15

# Export audit trail
python dredd_audit.py --export --format json --output audit_export.json
```

### 4. Penetration Testing
```bash
# Run security tests
python dredd_security_test.py --full-scan

# Test mirror trap effectiveness
python dredd_security_test.py --test-mirror-traps

# Validate quantum encryption
python dredd_security_test.py --validate-quantum
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Message Delivery Failures
```bash
# Check relay node connectivity
python dredd_dispatch.py --test-nodes

# Verify sigil registration
python dredd_dispatch.py --list-sigils

# Check message queue status
python dredd_monitor.py --queue-status
```

#### 2. Decryption Failures
```bash
# Validate encryption keys
python dredd_key_manager.py --validate-keys

# Check entropy validation
python dredd_monitor.py --entropy-status

# Review decryption logs
tail -f /var/log/dredd/decryption.log
```

#### 3. Performance Issues
```bash
# Monitor system resources
python dredd_monitor.py --system-stats

# Check message queue size
python dredd_monitor.py --queue-size

# Analyze performance metrics
python dredd_monitor.py --performance-analysis
```

#### 4. Integration Problems
```bash
# Test service connectivity
python dredd_api_hooks.py --test-connectivity

# Verify hook registration
python dredd_api_hooks.py --list-hooks

# Check service status
python dredd_api_hooks.py --service-status
```

### Debug Mode
```bash
# Enable debug logging
export DREDD_DEBUG=true
python dredd_dispatch.py --debug

# Verbose output
python dredd_dispatch.py --verbose

# Trace message flow
python dredd_dispatch.py --trace --message-id dredd_1234567890_abcdef
```

### Recovery Procedures

#### 1. Service Recovery
```bash
# Restart DREDD services
docker-compose restart dredd-dispatcher
docker-compose restart dredd-relay-1
docker-compose restart dredd-relay-2
docker-compose restart dredd-relay-3

# Recover from backup
python dredd_recovery.py --restore --backup latest
```

#### 2. Data Recovery
```bash
# Restore message queue
python dredd_recovery.py --restore-queue --backup queue_backup.json

# Restore audit logs
python dredd_recovery.py --restore-audit --backup audit_backup.json

# Restore configuration
python dredd_recovery.py --restore-config --backup config_backup.json
```

---

## 📚 Additional Resources

### Documentation
- [DREDD Protocol Specification](docs/protocol-spec.md)
- [Quantum Encryption Guide](docs/quantum-encryption.md)
- [Sigil Management](docs/sigil-management.md)
- [API Reference](docs/api-reference.md)

### Support
- [DREDD Community Forum](https://forum.dredd.lattice)
- [Issue Tracker](https://github.com/dredd/issues)
- [Security Advisories](https://security.dredd.lattice)

### Training
- [DREDD Administrator Course](training/admin-course.md)
- [Developer Integration Guide](training/developer-guide.md)
- [Security Best Practices](training/security-practices.md)

---

## 🎯 Next Steps

After successful deployment:

1. **Configure Monitoring**: Set up Prometheus and Grafana dashboards
2. **Integrate Services**: Connect your existing services to DREDD
3. **Security Audit**: Perform comprehensive security testing
4. **Performance Tuning**: Optimize based on your usage patterns
5. **Backup Strategy**: Implement automated backup procedures
6. **Documentation**: Create internal documentation for your team

---

**🕳️ DREDD Infrastructure is now ready for sovereign, discrete, resonant messaging across your lattice.** 