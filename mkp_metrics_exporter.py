#!/usr/bin/env python3
"""
MKP Metrics Exporter for Prometheus
Tracks entropy, resonance events, mirror-trap activations, and echo signatures
"""

import time
import json
import hashlib
from datetime import datetime
from typing import Dict, List, Any
from prometheus_client import start_http_server, Gauge, Counter, Histogram, Summary

class MKPMetricsExporter:
    def __init__(self, port: int = 8000):
        self.port = port
        
        # Prometheus metrics
        self.resonance_requests_total = Counter(
            'mkp_resonance_requests_total',
            'Total resonance requests',
            ['gate_id', 'resonance_level', 'outcome']
        )
        
        self.mirror_trap_activations = Counter(
            'mkp_mirror_trap_activations_total',
            'Total mirror trap activations',
            ['gate_id', 'reason']
        )
        
        self.entropy_gauge = Gauge(
            'mkp_request_entropy',
            'Request entropy score',
            ['gate_id', 'resonance_level']
        )
        
        self.echo_signature_gauge = Gauge(
            'mkp_echo_signature_count',
            'Number of echo signatures generated',
            ['gate_id']
        )
        
        self.resonance_duration = Histogram(
            'mkp_resonance_duration_seconds',
            'Resonance validation duration',
            ['gate_id', 'outcome'],
            buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0]
        )
        
        self.session_keys_active = Gauge(
            'mkp_session_keys_active',
            'Number of active session keys'
        )
        
        self.gates_registered = Gauge(
            'mkp_gates_registered',
            'Number of registered gates'
        )
        
        self.audit_events_total = Counter(
            'mkp_audit_events_total',
            'Total audit events',
            ['event_type', 'gate_id']
        )
        
        # Internal tracking
        self.entropy_history: List[Dict[str, Any]] = []
        self.echo_signatures: Dict[str, int] = {}
        self.gate_stats: Dict[str, Dict[str, Any]] = {}
        
    def start_server(self):
        """Start the Prometheus metrics server"""
        start_http_server(self.port)
        print(f"[MKP Metrics] Server started on port {self.port}")
        
    def record_resonance_request(self, gate_id: str, resonance_level: str, outcome: str, entropy: float = 0.0):
        """Record a resonance request"""
        self.resonance_requests_total.labels(gate_id=gate_id, resonance_level=resonance_level, outcome=outcome).inc()
        self.entropy_gauge.labels(gate_id=gate_id, resonance_level=resonance_level).set(entropy)
        
        # Track entropy history
        self.entropy_history.append({
            'timestamp': datetime.now().isoformat(),
            'gate_id': gate_id,
            'resonance_level': resonance_level,
            'entropy': entropy,
            'outcome': outcome
        })
        
        # Keep only last 1000 entries
        if len(self.entropy_history) > 1000:
            self.entropy_history = self.entropy_history[-1000:]
            
    def record_mirror_trap(self, gate_id: str, reason: str, echo_signature: str = None):
        """Record a mirror trap activation"""
        self.mirror_trap_activations.labels(gate_id=gate_id, reason=reason).inc()
        
        if echo_signature:
            self.echo_signatures[gate_id] = self.echo_signatures.get(gate_id, 0) + 1
            self.echo_signature_gauge.labels(gate_id=gate_id).set(self.echo_signatures[gate_id])
            
    def record_resonance_duration(self, gate_id: str, duration: float, outcome: str):
        """Record resonance validation duration"""
        self.resonance_duration.labels(gate_id=gate_id, outcome=outcome).observe(duration)
        
    def update_session_keys(self, count: int):
        """Update active session keys count"""
        self.session_keys_active.set(count)
        
    def update_gates_registered(self, count: int):
        """Update registered gates count"""
        self.gates_registered.set(count)
        
    def record_audit_event(self, event_type: str, gate_id: str):
        """Record an audit event"""
        self.audit_events_total.labels(event_type=event_type, gate_id=gate_id).inc()
        
    def update_gate_stats(self, gate_id: str, stats: Dict[str, Any]):
        """Update gate-specific statistics"""
        self.gate_stats[gate_id] = {
            'last_updated': datetime.now().isoformat(),
            **stats
        }
        
    def get_entropy_analysis(self) -> Dict[str, Any]:
        """Get entropy analysis for the last 1000 requests"""
        if not self.entropy_history:
            return {'error': 'No entropy data available'}
            
        entropies = [entry['entropy'] for entry in self.entropy_history]
        
        return {
            'total_requests': len(self.entropy_history),
            'average_entropy': sum(entropies) / len(entropies),
            'min_entropy': min(entropies),
            'max_entropy': max(entropies),
            'entropy_distribution': {
                'low': len([e for e in entropies if e < 0.3]),
                'medium': len([e for e in entropies if 0.3 <= e < 0.7]),
                'high': len([e for e in entropies if e >= 0.7])
            }
        }
        
    def get_echo_signature_analysis(self) -> Dict[str, Any]:
        """Get echo signature analysis"""
        return {
            'total_echo_signatures': sum(self.echo_signatures.values()),
            'echo_signatures_by_gate': self.echo_signatures.copy(),
            'most_active_gate': max(self.echo_signatures.items(), key=lambda x: x[1])[0] if self.echo_signatures else None
        }
        
    def export_metrics_json(self) -> str:
        """Export current metrics as JSON"""
        metrics = {
            'timestamp': datetime.now().isoformat(),
            'entropy_analysis': self.get_entropy_analysis(),
            'echo_signature_analysis': self.get_echo_signature_analysis(),
            'gate_stats': self.gate_stats,
            'summary': {
                'total_resonance_requests': sum(
                    self.resonance_requests_total._metrics.values()
                ),
                'total_mirror_traps': sum(
                    self.mirror_trap_activations._metrics.values()
                ),
                'active_session_keys': self.session_keys_active._value.get(),
                'registered_gates': self.gates_registered._value.get()
            }
        }
        
        return json.dumps(metrics, indent=2)
        
    def save_metrics_to_file(self, filename: str = 'mkp_metrics.json'):
        """Save current metrics to file"""
        with open(filename, 'w') as f:
            f.write(self.export_metrics_json())
        print(f"[MKP Metrics] Metrics saved to {filename}")

def main():
    """Main function to run the metrics exporter"""
    exporter = MKPMetricsExporter(port=8000)
    exporter.start_server()
    
    # Example usage
    print("[MKP Metrics] Recording example metrics...")
    
    # Record some example metrics
    exporter.record_resonance_request('wallet-divine', 'high', 'success', 0.85)
    exporter.record_resonance_request('djinn-council', 'critical', 'failure', 0.25)
    exporter.record_mirror_trap('wallet-divine', 'insufficient_entropy', 'echo_123')
    exporter.record_resonance_duration('wallet-divine', 0.15, 'success')
    exporter.update_session_keys(5)
    exporter.update_gates_registered(5)
    exporter.record_audit_event('access_granted', 'wallet-divine')
    
    # Save metrics to file
    exporter.save_metrics_to_file()
    
    print("[MKP Metrics] Example metrics recorded. Server running...")
    print("[MKP Metrics] Access metrics at: http://localhost:8000/metrics")
    
    try:
        while True:
            time.sleep(60)  # Update every minute
            exporter.save_metrics_to_file()
    except KeyboardInterrupt:
        print("\n[MKP Metrics] Shutting down...")

if __name__ == "__main__":
    main() 