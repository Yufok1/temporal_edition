#!/usr/bin/env python3
"""
Blockchain Logger for MKP Resonance Anomalies
Logs resonance anomalies to blockchain and provides configurable anomaly detection
"""

import json
import hashlib
import time
import hmac
from datetime import datetime
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, asdict
from enum import Enum
import logging

class AnomalySeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class BlockchainType(Enum):
    ETHEREUM = "ethereum"
    POLYGON = "polygon"
    ARBITRUM = "arbitrum"
    OPTIMISM = "optimism"
    LOCAL = "local"

@dataclass
class ResonanceAnomaly:
    timestamp: str
    gate_id: str
    anomaly_type: str
    severity: AnomalySeverity
    entropy_score: float
    resonance_level: str
    echo_signature: str
    mirror_depth: int
    reason: str
    evidence: Dict[str, Any]
    blockchain_hash: Optional[str] = None
    blockchain_tx: Optional[str] = None

@dataclass
class BlockchainConfig:
    blockchain_type: BlockchainType
    rpc_url: str
    contract_address: Optional[str] = None
    private_key: Optional[str] = None
    gas_limit: int = 300000
    gas_price: Optional[int] = None
    enabled: bool = True

class MKPBlockchainLogger:
    def __init__(self, config: BlockchainConfig):
        self.config = config
        self.anomalies: List[ResonanceAnomaly] = []
        self.anomaly_patterns: Dict[str, Dict[str, Any]] = {}
        self.logger = logging.getLogger('mkp_blockchain_logger')
        
        # Initialize anomaly patterns
        self._initialize_anomaly_patterns()
        
    def _initialize_anomaly_patterns(self):
        """Initialize known anomaly patterns"""
        self.anomaly_patterns = {
            'entropy_threshold_violation': {
                'description': 'Request entropy below acceptable threshold',
                'severity': AnomalySeverity.MEDIUM,
                'threshold': 0.3
            },
            'mirror_depth_exceeded': {
                'description': 'Mirror depth limit exceeded',
                'severity': AnomalySeverity.HIGH,
                'threshold': 5
            },
            'resonance_mismatch': {
                'description': 'Resonance level does not match expected pattern',
                'severity': AnomalySeverity.HIGH,
                'threshold': 0.2
            },
            'echo_signature_collision': {
                'description': 'Echo signature collision detected',
                'severity': AnomalySeverity.CRITICAL,
                'threshold': 0.0
            },
            'session_key_abuse': {
                'description': 'Session key usage pattern indicates abuse',
                'severity': AnomalySeverity.HIGH,
                'threshold': 10
            },
            'gate_access_anomaly': {
                'description': 'Unusual gate access pattern detected',
                'severity': AnomalySeverity.MEDIUM,
                'threshold': 0.5
            },
            'temporal_anomaly': {
                'description': 'Temporal pattern anomaly detected',
                'severity': AnomalySeverity.CRITICAL,
                'threshold': 0.0
            }
        }
        
    def detect_anomaly(self, 
                      gate_id: str, 
                      entropy_score: float, 
                      resonance_level: str, 
                      mirror_depth: int,
                      echo_signature: str,
                      session_key: Optional[str] = None,
                      access_pattern: Optional[Dict[str, Any]] = None) -> Optional[ResonanceAnomaly]:
        """Detect anomalies in resonance requests"""
        detected_anomalies = []
        
        # Check entropy threshold
        if entropy_score < self.anomaly_patterns['entropy_threshold_violation']['threshold']:
            detected_anomalies.append({
                'type': 'entropy_threshold_violation',
                'severity': AnomalySeverity.MEDIUM,
                'reason': f'Entropy {entropy_score:.3f} below threshold {self.anomaly_patterns["entropy_threshold_violation"]["threshold"]}',
                'evidence': {'entropy_score': entropy_score, 'threshold': self.anomaly_patterns['entropy_threshold_violation']['threshold']}
            })
            
        # Check mirror depth
        if mirror_depth > self.anomaly_patterns['mirror_depth_exceeded']['threshold']:
            detected_anomalies.append({
                'type': 'mirror_depth_exceeded',
                'severity': AnomalySeverity.HIGH,
                'reason': f'Mirror depth {mirror_depth} exceeds limit {self.anomaly_patterns["mirror_depth_exceeded"]["threshold"]}',
                'evidence': {'mirror_depth': mirror_depth, 'limit': self.anomaly_patterns['mirror_depth_exceeded']['threshold']}
            })
            
        # Check echo signature collision
        if self._check_echo_signature_collision(echo_signature):
            detected_anomalies.append({
                'type': 'echo_signature_collision',
                'severity': AnomalySeverity.CRITICAL,
                'reason': 'Echo signature collision detected',
                'evidence': {'echo_signature': echo_signature, 'collision_count': self._get_echo_signature_count(echo_signature)}
            })
            
        # Check session key abuse
        if session_key and self._check_session_key_abuse(session_key):
            detected_anomalies.append({
                'type': 'session_key_abuse',
                'severity': AnomalySeverity.HIGH,
                'reason': 'Session key abuse pattern detected',
                'evidence': {'session_key': session_key[:16] + '...', 'usage_count': self._get_session_key_usage(session_key)}
            })
            
        # Check access pattern anomalies
        if access_pattern and self._check_access_pattern_anomaly(gate_id, access_pattern):
            detected_anomalies.append({
                'type': 'gate_access_anomaly',
                'severity': AnomalySeverity.MEDIUM,
                'reason': 'Unusual gate access pattern',
                'evidence': {'access_pattern': access_pattern, 'gate_id': gate_id}
            })
            
        # Return the highest severity anomaly
        if detected_anomalies:
            highest_severity = max(detected_anomalies, key=lambda x: x['severity'].value)
            return self._create_anomaly_record(gate_id, highest_severity, entropy_score, resonance_level, mirror_depth, echo_signature)
            
        return None
        
    def _check_echo_signature_collision(self, echo_signature: str) -> bool:
        """Check for echo signature collisions"""
        # Count occurrences of this echo signature
        count = sum(1 for anomaly in self.anomalies if anomaly.echo_signature == echo_signature)
        return count > 1
        
    def _get_echo_signature_count(self, echo_signature: str) -> int:
        """Get count of echo signature occurrences"""
        return sum(1 for anomaly in self.anomalies if anomaly.echo_signature == echo_signature)
        
    def _check_session_key_abuse(self, session_key: str) -> bool:
        """Check for session key abuse patterns"""
        # This would integrate with your session tracking system
        # For now, using a simple heuristic
        return len(session_key) < 32  # Suspiciously short session key
        
    def _get_session_key_usage(self, session_key: str) -> int:
        """Get session key usage count"""
        # This would integrate with your session tracking system
        return 1  # Placeholder
        
    def _check_access_pattern_anomaly(self, gate_id: str, access_pattern: Dict[str, Any]) -> bool:
        """Check for access pattern anomalies"""
        # Simple heuristic: check if access frequency is too high
        frequency = access_pattern.get('frequency', 0)
        return frequency > 100  # More than 100 requests per minute
        
    def _create_anomaly_record(self, 
                              gate_id: str, 
                              anomaly_info: Dict[str, Any],
                              entropy_score: float,
                              resonance_level: str,
                              mirror_depth: int,
                              echo_signature: str) -> ResonanceAnomaly:
        """Create an anomaly record"""
        return ResonanceAnomaly(
            timestamp=datetime.now().isoformat(),
            gate_id=gate_id,
            anomaly_type=anomaly_info['type'],
            severity=anomaly_info['severity'],
            entropy_score=entropy_score,
            resonance_level=resonance_level,
            echo_signature=echo_signature,
            mirror_depth=mirror_depth,
            reason=anomaly_info['reason'],
            evidence=anomaly_info['evidence']
        )
        
    def log_anomaly(self, anomaly: ResonanceAnomaly) -> bool:
        """Log anomaly to blockchain and local storage"""
        try:
            # Add to local storage
            self.anomalies.append(anomaly)
            
            # Generate blockchain hash
            blockchain_hash = self._generate_blockchain_hash(anomaly)
            anomaly.blockchain_hash = blockchain_hash
            
            # Log to blockchain if enabled
            if self.config.enabled:
                tx_hash = self._submit_to_blockchain(anomaly)
                anomaly.blockchain_tx = tx_hash
                
            # Log to file
            self._log_to_file(anomaly)
            
            self.logger.info(f"Anomaly logged: {anomaly.anomaly_type} - {anomaly.severity.value} - {blockchain_hash}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to log anomaly: {e}")
            return False
            
    def _generate_blockchain_hash(self, anomaly: ResonanceAnomaly) -> str:
        """Generate blockchain hash for anomaly"""
        data = {
            'timestamp': anomaly.timestamp,
            'gate_id': anomaly.gate_id,
            'anomaly_type': anomaly.anomaly_type,
            'severity': anomaly.severity.value,
            'entropy_score': anomaly.entropy_score,
            'resonance_level': anomaly.resonance_level,
            'echo_signature': anomaly.echo_signature,
            'mirror_depth': anomaly.mirror_depth,
            'reason': anomaly.reason,
            'evidence': anomaly.evidence
        }
        
        # Create deterministic JSON string
        json_str = json.dumps(data, sort_keys=True, separators=(',', ':'))
        
        # Generate hash
        return hashlib.sha256(json_str.encode()).hexdigest()
        
    def _submit_to_blockchain(self, anomaly: ResonanceAnomaly) -> str:
        """Submit anomaly to blockchain"""
        if not self.config.enabled:
            return "disabled"
            
        try:
            # This would integrate with actual blockchain interaction
            # For now, simulating blockchain submission
            
            if self.config.blockchain_type == BlockchainType.LOCAL:
                # Local simulation
                return f"local_tx_{int(time.time())}_{anomaly.blockchain_hash[:8]}"
            else:
                # Real blockchain submission would go here
                # Using web3.py or similar library
                return f"blockchain_tx_{int(time.time())}_{anomaly.blockchain_hash[:8]}"
                
        except Exception as e:
            self.logger.error(f"Blockchain submission failed: {e}")
            return "failed"
            
    def _log_to_file(self, anomaly: ResonanceAnomaly):
        """Log anomaly to file"""
        log_entry = {
            'timestamp': anomaly.timestamp,
            'gate_id': anomaly.gate_id,
            'anomaly_type': anomaly.anomaly_type,
            'severity': anomaly.severity.value,
            'entropy_score': anomaly.entropy_score,
            'resonance_level': anomaly.resonance_level,
            'echo_signature': anomaly.echo_signature,
            'mirror_depth': anomaly.mirror_depth,
            'reason': anomaly.reason,
            'evidence': anomaly.evidence,
            'blockchain_hash': anomaly.blockchain_hash,
            'blockchain_tx': anomaly.blockchain_tx
        }
        
        with open('mkp_anomalies.jsonl', 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
            
    def get_anomaly_statistics(self) -> Dict[str, Any]:
        """Get anomaly statistics"""
        if not self.anomalies:
            return {'error': 'No anomalies recorded'}
            
        severity_counts = {}
        type_counts = {}
        gate_counts = {}
        
        for anomaly in self.anomalies:
            # Count by severity
            severity = anomaly.severity.value
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
            
            # Count by type
            anomaly_type = anomaly.anomaly_type
            type_counts[anomaly_type] = type_counts.get(anomaly_type, 0) + 1
            
            # Count by gate
            gate_id = anomaly.gate_id
            gate_counts[gate_id] = gate_counts.get(gate_id, 0) + 1
            
        return {
            'total_anomalies': len(self.anomalies),
            'severity_distribution': severity_counts,
            'type_distribution': type_counts,
            'gate_distribution': gate_counts,
            'average_entropy': sum(a.entropy_score for a in self.anomalies) / len(self.anomalies),
            'blockchain_logged': sum(1 for a in self.anomalies if a.blockchain_tx and a.blockchain_tx != 'failed'),
            'recent_anomalies': [
                {
                    'timestamp': a.timestamp,
                    'gate_id': a.gate_id,
                    'anomaly_type': a.anomaly_type,
                    'severity': a.severity.value
                }
                for a in self.anomalies[-10:]  # Last 10 anomalies
            ]
        }
        
    def export_anomalies(self, filename: str = 'mkp_anomalies_export.json'):
        """Export all anomalies to JSON file"""
        export_data = {
            'export_timestamp': datetime.now().isoformat(),
            'total_anomalies': len(self.anomalies),
            'statistics': self.get_anomaly_statistics(),
            'anomalies': [asdict(anomaly) for anomaly in self.anomalies]
        }
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2)
            
        self.logger.info(f"Anomalies exported to {filename}")
        
    def verify_blockchain_integrity(self) -> Dict[str, Any]:
        """Verify blockchain integrity of logged anomalies"""
        verification_results = []
        
        for anomaly in self.anomalies:
            if anomaly.blockchain_hash:
                # Verify hash matches current data
                expected_hash = self._generate_blockchain_hash(anomaly)
                hash_valid = expected_hash == anomaly.blockchain_hash
                
                verification_results.append({
                    'timestamp': anomaly.timestamp,
                    'gate_id': anomaly.gate_id,
                    'anomaly_type': anomaly.anomaly_type,
                    'hash_valid': hash_valid,
                    'blockchain_tx': anomaly.blockchain_tx,
                    'expected_hash': expected_hash,
                    'stored_hash': anomaly.blockchain_hash
                })
                
        return {
            'total_verified': len(verification_results),
            'valid_hashes': sum(1 for r in verification_results if r['hash_valid']),
            'invalid_hashes': sum(1 for r in verification_results if not r['hash_valid']),
            'verification_results': verification_results
        }

def main():
    """Example usage of the blockchain logger"""
    # Configure blockchain logger
    config = BlockchainConfig(
        blockchain_type=BlockchainType.LOCAL,
        rpc_url="http://localhost:8545",
        enabled=True
    )
    
    logger = MKPBlockchainLogger(config)
    
    print("=== MKP Blockchain Logger Demo ===")
    
    # Simulate some anomalies
    test_cases = [
        {
            'gate_id': 'wallet-divine',
            'entropy_score': 0.1,  # Low entropy
            'resonance_level': 'high',
            'mirror_depth': 3,
            'echo_signature': 'echo_123',
            'session_key': 'short_key'
        },
        {
            'gate_id': 'djinn-council',
            'entropy_score': 0.8,
            'resonance_level': 'critical',
            'mirror_depth': 7,  # Exceeds limit
            'echo_signature': 'echo_456',
            'session_key': 'valid_session_key_32_chars_long'
        },
        {
            'gate_id': 'cryptographer-core',
            'entropy_score': 0.6,
            'resonance_level': 'critical',
            'mirror_depth': 2,
            'echo_signature': 'echo_123',  # Collision with first case
            'session_key': 'another_valid_key'
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n--- Test Case {i} ---")
        
        # Detect anomaly
        anomaly = logger.detect_anomaly(**test_case)
        
        if anomaly:
            print(f"Anomaly detected: {anomaly.anomaly_type}")
            print(f"Severity: {anomaly.severity.value}")
            print(f"Reason: {anomaly.reason}")
            
            # Log to blockchain
            success = logger.log_anomaly(anomaly)
            print(f"Logged to blockchain: {'✓' if success else '✗'}")
            print(f"Blockchain hash: {anomaly.blockchain_hash}")
            print(f"Transaction: {anomaly.blockchain_tx}")
        else:
            print("No anomaly detected")
            
    # Get statistics
    print(f"\n--- Anomaly Statistics ---")
    stats = logger.get_anomaly_statistics()
    print(f"Total anomalies: {stats['total_anomalies']}")
    print(f"Severity distribution: {stats['severity_distribution']}")
    print(f"Type distribution: {stats['type_distribution']}")
    
    # Verify blockchain integrity
    print(f"\n--- Blockchain Integrity Verification ---")
    integrity = logger.verify_blockchain_integrity()
    print(f"Valid hashes: {integrity['valid_hashes']}/{integrity['total_verified']}")
    
    # Export anomalies
    logger.export_anomalies()
    print(f"\nAnomalies exported to mkp_anomalies_export.json")

if __name__ == "__main__":
    main() 