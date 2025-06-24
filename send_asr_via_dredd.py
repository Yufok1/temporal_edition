#!/usr/bin/env python3
"""
Send ASR via DREDD - Wrapper for encrypting and sending Acclimation Sequencing Reports
Provides quantum-secure encryption and sigil-bound delivery for ASR reports
"""

import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import hashlib
import base64

# Import DREDD components
from dredd_dispatch import DREDDDispatcher
from asr_generator import AcclimationSequencingReport

class ASRDREDDSender:
    def __init__(self, config_file: str = "asr_dredd_config.json"):
        self.config = self.load_config(config_file)
        self.dredd_dispatcher = DREDDDispatcher()
        self.logger = logging.getLogger('asr_dredd_sender')
        
    def load_config(self, config_file: str) -> Dict[str, Any]:
        """Load ASR-DREDD configuration"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                'dredd_settings': {
                    'default_ttl': 7200,  # 2 hours
                    'encryption_level': 'high',
                    'mirror_protection': True,
                    'quantum_encryption': True
                },
                'recipients': {
                    'djinn_council': {
                        'sigil': 'glyph-hash-djinn-council',
                        'encryption_level': 'critical',
                        'auto_acknowledge': True
                    },
                    'sovereign_archive': {
                        'sigil': 'glyph-hash-sovereign-archive',
                        'encryption_level': 'high',
                        'auto_acknowledge': False
                    },
                    'watch_guard': {
                        'sigil': 'glyph-hash-watch-guard',
                        'encryption_level': 'high',
                        'auto_acknowledge': True
                    },
                    'lattice_core': {
                        'sigil': 'glyph-hash-lattice-core',
                        'encryption_level': 'critical',
                        'auto_acknowledge': True
                    }
                },
                'asr_template': {
                    'include_attachments': True,
                    'compress_payload': True,
                    'add_metadata': True,
                    'signature_required': True
                }
            }
            
    async def send_asr_via_dredd(self, asr: AcclimationSequencingReport, 
                               recipients: List[str] = None) -> Dict[str, bool]:
        """Send ASR via DREDD infrastructure"""
        
        try:
            results = {}
            
            # Use default recipients if none specified
            if recipients is None:
                recipients = list(self.config['recipients'].keys())
                
            # Prepare ASR payload
            asr_payload = self.prepare_asr_payload(asr)
            
            # Send to each recipient
            for recipient_name in recipients:
                if recipient_name in self.config['recipients']:
                    recipient_config = self.config['recipients'][recipient_name]
                    
                    success = await self.send_to_recipient(
                        asr_payload, 
                        recipient_name, 
                        recipient_config
                    )
                    
                    results[recipient_name] = success
                    
                    if success:
                        self.logger.info(f"ASR sent to {recipient_name} via {recipient_config['sigil']}")
                    else:
                        self.logger.error(f"Failed to send ASR to {recipient_name}")
                        
                else:
                    self.logger.warning(f"Unknown recipient: {recipient_name}")
                    results[recipient_name] = False
                    
            return results
            
        except Exception as e:
            self.logger.error(f"Error sending ASR via DREDD: {e}")
            return {recipient: False for recipient in recipients or []}
            
    def prepare_asr_payload(self, asr: AcclimationSequencingReport) -> Dict[str, Any]:
        """Prepare ASR payload for DREDD transmission"""
        
        try:
            # Convert ASR to dict
            asr_dict = asr.to_dict()
            
            # Add metadata
            payload = {
                'message_type': 'ASR',
                'asr_version': '2.0.0',
                'generated_at': datetime.now().isoformat(),
                'payload_hash': self.generate_payload_hash(asr_dict),
                'asr_data': asr_dict
            }
            
            # Add attachments if configured
            if self.config['asr_template']['include_attachments']:
                payload['attachments'] = self.prepare_attachments(asr)
                
            # Add signature if required
            if self.config['asr_template']['signature_required']:
                payload['signature'] = self.generate_asr_signature(payload)
                
            return payload
            
        except Exception as e:
            self.logger.error(f"Error preparing ASR payload: {e}")
            return {}
            
    def generate_payload_hash(self, asr_data: Dict[str, Any]) -> str:
        """Generate hash of ASR payload"""
        
        data_str = json.dumps(asr_data, sort_keys=True)
        return hashlib.sha256(data_str.encode()).hexdigest()[:16]
        
    def prepare_attachments(self, asr: AcclimationSequencingReport) -> Dict[str, Any]:
        """Prepare attachments for ASR"""
        
        attachments = {}
        
        # Add glyphs as attachments
        if asr.attached_glyphs:
            attachments['glyphs'] = {
                'count': len(asr.attached_glyphs),
                'data': asr.attached_glyphs
            }
            
        # Add entropy graphs
        if asr.entropy_stability_index:
            attachments['entropy_graphs'] = {
                'stability_index': asr.entropy_stability_index,
                'generated_at': datetime.now().isoformat()
            }
            
        # Add resonance maps
        if asr.resonance_performance:
            attachments['resonance_maps'] = {
                'performance_data': asr.resonance_performance,
                'generated_at': datetime.now().isoformat()
            }
            
        return attachments
        
    def generate_asr_signature(self, payload: Dict[str, Any]) -> str:
        """Generate signature for ASR payload"""
        
        # Remove signature field for signing
        payload_copy = payload.copy()
        if 'signature' in payload_copy:
            del payload_copy['signature']
            
        # Create signature data
        signature_data = {
            'payload_hash': payload_copy['payload_hash'],
            'message_type': payload_copy['message_type'],
            'generated_at': payload_copy['generated_at'],
            'timestamp': int(datetime.now().timestamp())
        }
        
        signature_str = json.dumps(signature_data, sort_keys=True)
        return hashlib.sha256(signature_str.encode()).hexdigest()[:24]
        
    async def send_to_recipient(self, payload: Dict[str, Any], 
                              recipient_name: str, 
                              recipient_config: Dict[str, Any]) -> bool:
        """Send ASR to specific recipient"""
        
        try:
            # Convert payload to JSON
            payload_json = json.dumps(payload, default=str)
            
            # Get recipient configuration
            sigil_target = recipient_config['sigil']
            encryption_level = recipient_config['encryption_level']
            ttl = self.config['dredd_settings']['default_ttl']
            
            # Send via DREDD
            success = await self.dredd_dispatcher.send_message(
                payload_json,
                sigil_target,
                ttl=ttl,
                resonance_level=encryption_level
            )
            
            # Handle auto-acknowledgment
            if success and recipient_config.get('auto_acknowledge', False):
                await self.send_acknowledgment(recipient_name, payload['payload_hash'])
                
            return success
            
        except Exception as e:
            self.logger.error(f"Error sending to recipient {recipient_name}: {e}")
            return False
            
    async def send_acknowledgment(self, recipient_name: str, payload_hash: str):
        """Send acknowledgment for received ASR"""
        
        try:
            ack_payload = {
                'message_type': 'ASR_ACKNOWLEDGMENT',
                'recipient': recipient_name,
                'payload_hash': payload_hash,
                'acknowledged_at': datetime.now().isoformat(),
                'status': 'received'
            }
            
            # Send acknowledgment back to sender
            ack_json = json.dumps(ack_payload)
            
            # Use sovereign sigil for acknowledgment
            success = await self.dredd_dispatcher.send_message(
                ack_json,
                'glyph-hash-sovereign-archive',  # Acknowledgment target
                ttl=3600,  # 1 hour
                resonance_level='medium'
            )
            
            if success:
                self.logger.info(f"Acknowledgment sent for {recipient_name}")
            else:
                self.logger.warning(f"Failed to send acknowledgment for {recipient_name}")
                
        except Exception as e:
            self.logger.error(f"Error sending acknowledgment: {e}")
            
    async def send_asr_broadcast(self, asr: AcclimationSequencingReport) -> Dict[str, bool]:
        """Broadcast ASR to all configured recipients"""
        
        return await self.send_asr_via_dredd(asr, list(self.config['recipients'].keys()))
        
    async def send_asr_to_council(self, asr: AcclimationSequencingReport) -> bool:
        """Send ASR specifically to Djinn Council"""
        
        results = await self.send_asr_via_dredd(asr, ['djinn_council'])
        return results.get('djinn_council', False)
        
    async def send_asr_to_archive(self, asr: AcclimationSequencingReport) -> bool:
        """Send ASR specifically to Sovereign Archive"""
        
        results = await self.send_asr_via_dredd(asr, ['sovereign_archive'])
        return results.get('sovereign_archive', False)
        
    async def send_asr_to_watchguard(self, asr: AcclimationSequencingReport) -> bool:
        """Send ASR specifically to Watch Guard"""
        
        results = await self.send_asr_via_dredd(asr, ['watch_guard'])
        return results.get('watch_guard', False)
        
    def create_dreddmsg_template(self, asr: AcclimationSequencingReport) -> Dict[str, Any]:
        """Create DREDD message template for ASR"""
        
        return {
            "dredd_message": {
                "metadata": {
                    "version": "2.0.0",
                    "protocol": "DREDD",
                    "message_type": "ASR",
                    "created_at": datetime.now().isoformat(),
                    "message_id": f"dredd_asr_{asr.report_id}",
                    "resonance_level": "high",
                    "quantum_ready": True,
                    "mirror_protected": True
                },
                "targeting": {
                    "sigil_target": "glyph-hash-djinn-council",
                    "sigil_hash": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
                    "resonance_requirements": {
                        "minimum_entropy": 0.8,
                        "required_sigil": True,
                        "session_key_required": True,
                        "mirror_depth_limit": 3
                    }
                },
                "encrypted_content": {
                    "encoded": "<Kyber-Dilithium encrypted ASR content>",
                    "encryption_info": {
                        "algorithm": "quantum_hybrid",
                        "kyber_enabled": True,
                        "dilithium_enabled": True,
                        "classical_fallback": True,
                        "key_size": 256
                    }
                },
                "asr_specific": {
                    "report_id": asr.report_id,
                    "session_id": asr.session_id,
                    "trigger_type": asr.trigger_type,
                    "summary_statistics": asr.summary_statistics,
                    "drd_signature": asr.drd_signature
                },
                "delivery_config": {
                    "ttl": 7200,
                    "expires_at": (datetime.now().timestamp() + 7200).isoformat(),
                    "max_retries": 3,
                    "retry_interval": 30,
                    "one_time_read": False,
                    "self_destruct": False
                }
            },
            "envelope": {
                "envelope_id": f"envelope_asr_{asr.report_id}",
                "target_sigil": "glyph-hash-djinn-council",
                "message_hash": self.generate_payload_hash(asr.to_dict()),
                "created_at": datetime.now().isoformat(),
                "expires_at": (datetime.now().timestamp() + 7200).isoformat(),
                "delivery_status": "pending"
            }
        }
        
    def get_recipient_status(self) -> Dict[str, Any]:
        """Get status of all configured recipients"""
        
        status = {
            'total_recipients': len(self.config['recipients']),
            'recipients': {}
        }
        
        for recipient_name, config in self.config['recipients'].items():
            status['recipients'][recipient_name] = {
                'sigil': config['sigil'],
                'encryption_level': config['encryption_level'],
                'auto_acknowledge': config.get('auto_acknowledge', False),
                'configured': True
            }
            
        return status

# Global instance
asr_sender = None

def initialize_asr_sender():
    """Initialize the global ASR sender"""
    global asr_sender
    asr_sender = ASRDREDDSender()
    return asr_sender

async def send_asr(asr: AcclimationSequencingReport, recipients: List[str] = None) -> Dict[str, bool]:
    """Send ASR via DREDD"""
    if asr_sender is None:
        initialize_asr_sender()
    return await asr_sender.send_asr_via_dredd(asr, recipients)

async def broadcast_asr(asr: AcclimationSequencingReport) -> Dict[str, bool]:
    """Broadcast ASR to all recipients"""
    if asr_sender is None:
        initialize_asr_sender()
    return await asr_sender.send_asr_broadcast(asr)

async def send_to_council(asr: AcclimationSequencingReport) -> bool:
    """Send ASR to Djinn Council"""
    if asr_sender is None:
        initialize_asr_sender()
    return await asr_sender.send_asr_to_council(asr)

# Example usage
async def main():
    # Initialize sender
    sender = initialize_asr_sender()
    
    # Create sample ASR
    asr = AcclimationSequencingReport(
        report_id="ASR-TEST-001",
        session_id="SESSION-001",
        trigger_type="manual_trigger",
        generated_at=datetime.now().isoformat(),
        sovereign_actions=[],
        security_evolution=[],
        resonance_performance=[],
        observational_matches=[],
        entropy_stability_index={},
        ticket_chronicle=[],
        attached_glyphs=[],
        summary_statistics={},
        drd_signature="0x1234567890abcdef"
    )
    
    # Send ASR
    results = await send_asr(asr, ['djinn_council', 'sovereign_archive'])
    print(f"ASR delivery results: {results}")
    
    # Get recipient status
    status = sender.get_recipient_status()
    print(f"Recipient status: {json.dumps(status, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main()) 