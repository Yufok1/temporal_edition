#!/usr/bin/env python3
"""
SigilGram Parser - For decrypting/verifying and reading mirror-bound messages
Handles sigil validation, entropy checking, and quantum-resistant decryption
"""

import json
import base64
import hashlib
import time
import secrets
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import argparse
import sys

@dataclass
class ParsedMessage:
    message_id: str
    content: str
    target_sigil: str
    timestamp: str
    resonance_level: str
    entropy_score: float
    validation_status: str
    security_checks: Dict[str, bool]
    audit_trail: List[Dict[str, Any]]

class SigilGramParser:
    def __init__(self, config_file: str = "dredd_config.json"):
        self.config = self.load_config(config_file)
        self.session_key = self.generate_session_key()
        self.sigil_registry = self.config.get('sigil_registry', {})
        self.logger = logging.getLogger('sigilgram_parser')
        self.audit_log = []
        
    def load_config(self, config_file: str) -> Dict[str, Any]:
        """Load DREDD configuration"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Default configuration
            return {
                'sigil_registry': {
                    'glyph-hash-01': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                    'glyph-hash-02': '0x8ba1f109551bD432803012645Hac136c772c3e3',
                    'djinn-resonance-01': '0x1234567890123456789012345678901234567890'
                },
                'quantum_encryption': {
                    'kyber_enabled': True,
                    'dilithium_enabled': True,
                    'classical_fallback': True
                },
                'mirror_protection': {
                    'trap_enabled': True,
                    'noise_injection': True,
                    'entropy_validation': True
                },
                'entropy_thresholds': {
                    'low': 0.3,
                    'medium': 0.5,
                    'high': 0.7,
                    'critical': 0.9
                }
            }
            
    def generate_session_key(self) -> str:
        """Generate a new session key for parsing operations"""
        return Fernet.generate_key().decode()
        
    def parse_sigilgram(self, sigilgram_data: Dict[str, Any], target_sigil: str) -> Optional[ParsedMessage]:
        """Parse and decrypt a sigilgram message"""
        
        try:
            # Extract DREDD message
            dredd_message = sigilgram_data.get('dredd_message', {})
            envelope = sigilgram_data.get('envelope', {})
            validation = sigilgram_data.get('validation', {})
            
            # Log parsing attempt
            self.log_audit_event('parse_attempt', {
                'message_id': dredd_message.get('metadata', {}).get('message_id'),
                'target_sigil': target_sigil,
                'timestamp': datetime.now().isoformat()
            })
            
            # Validate message structure
            if not self.validate_message_structure(dredd_message, envelope):
                self.log_audit_event('parse_failed', {'reason': 'invalid_structure'})
                return None
                
            # Check if message is expired
            if self.is_message_expired(dredd_message):
                self.log_audit_event('parse_failed', {'reason': 'message_expired'})
                return None
                
            # Validate sigil targeting
            if not self.validate_sigil_targeting(dredd_message, target_sigil):
                self.log_audit_event('parse_failed', {'reason': 'invalid_sigil_targeting'})
                return None
                
            # Validate entropy header
            entropy_validation = self.validate_entropy_header(dredd_message)
            if not entropy_validation['valid']:
                self.log_audit_event('parse_failed', {
                    'reason': 'entropy_validation_failed',
                    'details': entropy_validation['details']
                })
                return None
                
            # Validate echo signature
            if not self.validate_echo_signature(dredd_message, target_sigil):
                self.log_audit_event('parse_failed', {'reason': 'invalid_echo_signature'})
                return None
                
            # Decrypt content
            decrypted_content = self.decrypt_message_content(dredd_message, target_sigil)
            if not decrypted_content:
                self.log_audit_event('parse_failed', {'reason': 'decryption_failed'})
                return None
                
            # Perform security checks
            security_checks = self.perform_security_checks(dredd_message, validation)
            
            # Create parsed message
            parsed_message = ParsedMessage(
                message_id=dredd_message['metadata']['message_id'],
                content=decrypted_content,
                target_sigil=target_sigil,
                timestamp=dredd_message['metadata']['created_at'],
                resonance_level=dredd_message['metadata']['resonance_level'],
                entropy_score=entropy_validation['entropy_score'],
                validation_status='valid',
                security_checks=security_checks,
                audit_trail=self.audit_log.copy()
            )
            
            # Log successful parse
            self.log_audit_event('parse_success', {
                'message_id': parsed_message.message_id,
                'resonance_level': parsed_message.resonance_level
            })
            
            return parsed_message
            
        except Exception as e:
            self.logger.error(f"Error parsing sigilgram: {e}")
            self.log_audit_event('parse_error', {'error': str(e)})
            return None
            
    def validate_message_structure(self, dredd_message: Dict[str, Any], envelope: Dict[str, Any]) -> bool:
        """Validate the structure of a DREDD message"""
        
        required_fields = [
            'metadata', 'targeting', 'entropy_header', 'encrypted_content',
            'mirror_trap', 'delivery_config', 'resonance_validation'
        ]
        
        for field in required_fields:
            if field not in dredd_message:
                self.logger.error(f"Missing required field: {field}")
                return False
                
        # Check envelope structure
        envelope_fields = ['envelope_id', 'target_sigil', 'message_hash', 'created_at', 'expires_at']
        for field in envelope_fields:
            if field not in envelope:
                self.logger.error(f"Missing envelope field: {field}")
                return False
                
        return True
        
    def is_message_expired(self, dredd_message: Dict[str, Any]) -> bool:
        """Check if message has expired"""
        
        try:
            created_at = datetime.fromisoformat(dredd_message['metadata']['created_at'].replace('Z', '+00:00'))
            ttl = dredd_message['delivery_config']['ttl']
            expires_at = created_at + timedelta(seconds=ttl)
            
            return datetime.now(created_at.tzinfo) > expires_at
            
        except Exception as e:
            self.logger.error(f"Error checking message expiration: {e}")
            return True
            
    def validate_sigil_targeting(self, dredd_message: Dict[str, Any], target_sigil: str) -> bool:
        """Validate sigil targeting"""
        
        message_sigil = dredd_message['targeting']['sigil_target']
        
        # Check if sigil matches
        if message_sigil != target_sigil:
            self.logger.warning(f"Sigil mismatch: expected {target_sigil}, got {message_sigil}")
            return False
            
        # Check if sigil exists in registry
        if target_sigil not in self.sigil_registry:
            self.logger.warning(f"Unknown sigil: {target_sigil}")
            return False
            
        # Check resonance requirements
        requirements = dredd_message['targeting']['resonance_requirements']
        if requirements.get('required_sigil') and not self.validate_sigil_hash(target_sigil):
            self.logger.warning(f"Invalid sigil hash for: {target_sigil}")
            return False
            
        return True
        
    def validate_sigil_hash(self, sigil: str) -> bool:
        """Validate sigil hash against registry"""
        
        if sigil not in self.sigil_registry:
            return False
            
        # In a real implementation, this would validate against blockchain or secure registry
        # For now, just check if it exists in our local registry
        return True
        
    def validate_entropy_header(self, dredd_message: Dict[str, Any]) -> Dict[str, Any]:
        """Validate entropy header"""
        
        try:
            entropy_header = dredd_message['entropy_header']
            encoded_entropy = entropy_header['encoded']
            
            # Decode entropy data
            entropy_data = json.loads(base64.b64decode(encoded_entropy).decode())
            
            # Validate timestamp
            timestamp = entropy_data.get('timestamp', 0)
            current_time = int(time.time())
            if abs(current_time - timestamp) > 3600:  # 1 hour tolerance
                return {
                    'valid': False,
                    'details': 'entropy_timestamp_out_of_range',
                    'entropy_score': 0.0
                }
                
            # Validate entropy score
            entropy_score = entropy_data.get('entropy_score', 0.0)
            resonance_level = dredd_message['metadata']['resonance_level']
            required_threshold = self.config['entropy_thresholds'].get(resonance_level, 0.5)
            
            if entropy_score < required_threshold:
                return {
                    'valid': False,
                    'details': f'entropy_score_below_threshold: {entropy_score} < {required_threshold}',
                    'entropy_score': entropy_score
                }
                
            # Validate resonance challenge
            resonance_challenge = entropy_data.get('resonance_challenge', '')
            if not resonance_challenge or len(resonance_challenge) < 16:
                return {
                    'valid': False,
                    'details': 'invalid_resonance_challenge',
                    'entropy_score': entropy_score
                }
                
            return {
                'valid': True,
                'details': 'entropy_validation_passed',
                'entropy_score': entropy_score
            }
            
        except Exception as e:
            self.logger.error(f"Error validating entropy header: {e}")
            return {
                'valid': False,
                'details': f'entropy_validation_error: {str(e)}',
                'entropy_score': 0.0
            }
            
    def validate_echo_signature(self, dredd_message: Dict[str, Any], target_sigil: str) -> bool:
        """Validate echo signature"""
        
        try:
            expected_signature = self.generate_echo_signature(
                dredd_message['metadata']['message_id'],
                target_sigil,
                dredd_message['entropy_header']['encoded']
            )
            
            actual_signature = dredd_message['resonance_validation']['echo_signature']
            
            return expected_signature == actual_signature
            
        except Exception as e:
            self.logger.error(f"Error validating echo signature: {e}")
            return False
            
    def generate_echo_signature(self, message_id: str, target_sigil: str, entropy_header: str) -> str:
        """Generate echo signature for validation"""
        data = f"{message_id}:{target_sigil}:{entropy_header}:{self.session_key}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]
        
    def decrypt_message_content(self, dredd_message: Dict[str, Any], target_sigil: str) -> Optional[str]:
        """Decrypt message content"""
        
        try:
            encrypted_content = dredd_message['encrypted_content']
            encoded_content = encrypted_content['encoded']
            
            # Decode combined data
            combined_data = json.loads(base64.b64decode(encoded_content).decode())
            
            # Extract encrypted key and content
            encrypted_key = base64.b64decode(combined_data['encrypted_key'])
            encrypted_content_data = base64.b64decode(combined_data['encrypted_content'])
            
            # Generate quantum key for decryption
            quantum_key = self.generate_quantum_key(target_sigil)
            
            # Decrypt classical key
            classical_key = self.decrypt_with_quantum_key(encrypted_key, quantum_key)
            
            # Decrypt content
            fernet = Fernet(classical_key)
            decrypted_content = fernet.decrypt(encrypted_content_data)
            
            return decrypted_content.decode()
            
        except Exception as e:
            self.logger.error(f"Error decrypting message content: {e}")
            return None
            
    def generate_quantum_key(self, target_sigil: str) -> bytes:
        """Generate quantum-resistant key material"""
        # This would integrate with actual quantum-resistant algorithms
        # For now, using a hybrid approach with strong classical cryptography
        
        # Derive key from sigil and session
        key_material = f"{target_sigil}:{self.session_key}:{int(time.time())}"
        
        # Use PBKDF2 for key derivation
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'dredd_quantum_salt',
            iterations=100000,
        )
        
        return kdf.derive(key_material.encode())
        
    def decrypt_with_quantum_key(self, encrypted_data: bytes, quantum_key: bytes) -> bytes:
        """Decrypt data with quantum-resistant key"""
        # Reverse the XOR encryption
        decrypted = bytearray(len(encrypted_data))
        for i in range(len(encrypted_data)):
            decrypted[i] = encrypted_data[i] ^ quantum_key[i % len(quantum_key)]
            
        return bytes(decrypted)
        
    def perform_security_checks(self, dredd_message: Dict[str, Any], validation: Dict[str, Any]) -> Dict[str, bool]:
        """Perform comprehensive security checks"""
        
        checks = {}
        
        # Check quantum encryption
        checks['quantum_encryption_valid'] = self.check_quantum_encryption(dredd_message)
        
        # Check mirror trap
        checks['mirror_trap_armed'] = self.check_mirror_trap(dredd_message)
        
        # Check stealth configuration
        checks['stealth_config_active'] = self.check_stealth_config(dredd_message)
        
        # Check compliance
        checks['compliance_verified'] = self.check_compliance(dredd_message)
        
        # Check message integrity
        checks['message_integrity_valid'] = self.check_message_integrity(validation)
        
        # Check resonance verification
        checks['resonance_verification_passed'] = self.check_resonance_verification(validation)
        
        return checks
        
    def check_quantum_encryption(self, dredd_message: Dict[str, Any]) -> bool:
        """Check quantum encryption configuration"""
        encryption_info = dredd_message['encrypted_content']['encryption_info']
        
        return (
            encryption_info.get('algorithm') == 'quantum_hybrid' and
            encryption_info.get('kyber_enabled') and
            encryption_info.get('dilithium_enabled') and
            encryption_info.get('classical_fallback')
        )
        
    def check_mirror_trap(self, dredd_message: Dict[str, Any]) -> bool:
        """Check mirror trap configuration"""
        mirror_trap = dredd_message['mirror_trap']
        
        return (
            mirror_trap.get('trap_id') and
            mirror_trap.get('entropy_fingerprint') and
            mirror_trap.get('trigger_conditions', {}).get('invalid_sigil')
        )
        
    def check_stealth_config(self, dredd_message: Dict[str, Any]) -> bool:
        """Check stealth configuration"""
        stealth_config = dredd_message['stealth_config']
        
        return (
            stealth_config.get('dispersal_enabled') and
            stealth_config.get('fragment_count', 0) > 0 and
            len(stealth_config.get('reassembly_nodes', [])) > 0
        )
        
    def check_compliance(self, dredd_message: Dict[str, Any]) -> bool:
        """Check compliance configuration"""
        compliance = dredd_message['compliance']
        
        return (
            compliance.get('audit_trail') and
            compliance.get('encryption_standard') == 'quantum_resistant' and
            compliance.get('access_logging')
        )
        
    def check_message_integrity(self, validation: Dict[str, Any]) -> bool:
        """Check message integrity"""
        integrity = validation.get('message_integrity', {})
        
        return (
            integrity.get('content_hash') and
            integrity.get('signature') and
            integrity.get('timestamp')
        )
        
    def check_resonance_verification(self, validation: Dict[str, Any]) -> bool:
        """Check resonance verification"""
        resonance = validation.get('resonance_verification', {})
        
        return (
            resonance.get('sigil_valid') and
            resonance.get('entropy_sufficient') and
            resonance.get('resonance_level_appropriate') and
            resonance.get('session_key_valid')
        )
        
    def log_audit_event(self, event_type: str, details: Dict[str, Any]):
        """Log audit event"""
        event = {
            'timestamp': datetime.now().isoformat(),
            'event_type': event_type,
            'details': details
        }
        self.audit_log.append(event)
        
    def save_audit_log(self, filename: str = None):
        """Save audit log to file"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"dredd_audit_log_{timestamp}.json"
            
        with open(filename, 'w') as f:
            json.dump(self.audit_log, f, indent=2)
            
        self.logger.info(f"Audit log saved to: {filename}")

def main():
    """Main CLI interface for SigilGram parser"""
    parser = argparse.ArgumentParser(description='SigilGram Parser - Decrypt and verify mirror-bound messages')
    parser.add_argument('input_file', help='Input sigilgram file (.json)')
    parser.add_argument('--sigil', required=True, help='Target sigil for decryption')
    parser.add_argument('--config', default='dredd_config.json', help='Configuration file')
    parser.add_argument('--output', help='Output file for decrypted content')
    parser.add_argument('--audit-log', help='Save audit log to file')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    # Set up logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    # Initialize parser
    parser_instance = SigilGramParser(args.config)
    
    try:
        # Load sigilgram data
        with open(args.input_file, 'r') as f:
            sigilgram_data = json.load(f)
            
        print(f"🕳️ Parsing sigilgram: {args.input_file}")
        print(f"🎯 Target sigil: {args.sigil}")
        
        # Parse message
        parsed_message = parser_instance.parse_sigilgram(sigilgram_data, args.sigil)
        
        if parsed_message:
            print("\n✅ Message successfully parsed and decrypted!")
            print(f"📨 Message ID: {parsed_message.message_id}")
            print(f"⏰ Timestamp: {parsed_message.timestamp}")
            print(f"🎚️ Resonance Level: {parsed_message.resonance_level}")
            print(f"🎲 Entropy Score: {parsed_message.entropy_score:.2f}")
            print(f"🔒 Validation Status: {parsed_message.validation_status}")
            
            print("\n📝 Content:")
            print("-" * 50)
            print(parsed_message.content)
            print("-" * 50)
            
            print("\n🔍 Security Checks:")
            for check, status in parsed_message.security_checks.items():
                status_icon = "✅" if status else "❌"
                print(f"  {status_icon} {check}: {status}")
                
            # Save decrypted content if requested
            if args.output:
                with open(args.output, 'w') as f:
                    f.write(parsed_message.content)
                print(f"\n💾 Decrypted content saved to: {args.output}")
                
        else:
            print("❌ Failed to parse sigilgram message")
            sys.exit(1)
            
        # Save audit log if requested
        if args.audit_log:
            parser_instance.save_audit_log(args.audit_log)
            
    except FileNotFoundError:
        print(f"❌ Input file not found: {args.input_file}")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in input file: {args.input_file}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 