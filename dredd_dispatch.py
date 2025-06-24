#!/usr/bin/env python3
"""
DREDD Dispatch - CLI tool for Discrete Resonant Echo-Derived Delivery
Send/receive sigil-bound messages with quantum-hybrid encryption and mirror-aware payloads
"""

import json
import time
import hashlib
import base64
import argparse
import asyncio
import websockets
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import secrets
import logging

@dataclass
class DREDDMessage:
    message_id: str
    sigil_target: str
    entropy_header: str
    encrypted_content: str
    mirror_trap: Dict[str, Any]
    timestamp: str
    ttl: int  # Time to live in seconds
    echo_signature: str
    resonance_level: str

@dataclass
class SigilEnvelope:
    envelope_id: str
    target_sigil: str
    message_hash: str
    mirror_protection: Dict[str, Any]
    delivery_nodes: List[str]
    created_at: str
    expires_at: str

class DREDDDispatcher:
    def __init__(self, config_file: str = "dredd_config.json"):
        self.config = self.load_config(config_file)
        self.session_key = self.generate_session_key()
        self.relay_nodes = self.config.get('relay_nodes', [])
        self.sigil_registry = self.config.get('sigil_registry', {})
        self.logger = logging.getLogger('dredd_dispatch')
        self.active_channels = {}
        
    def load_config(self, config_file: str) -> Dict[str, Any]:
        """Load DREDD configuration"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Default configuration
            return {
                'relay_nodes': [
                    'ws://localhost:8080/dredd',
                    'ws://localhost:8081/dredd',
                    'ws://localhost:8082/dredd'
                ],
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
                }
            }
            
    def generate_session_key(self) -> str:
        """Generate a new session key for DREDD operations"""
        return Fernet.generate_key().decode()
        
    def create_dredd_message(self, content: str, target_sigil: str, 
                           ttl: int = 3600, resonance_level: str = "medium") -> DREDDMessage:
        """Create a new DREDD message with quantum-hybrid encryption"""
        
        # Generate message ID
        message_id = f"dredd_{int(time.time())}_{secrets.token_hex(8)}"
        
        # Create entropy header
        entropy_header = self.generate_entropy_header()
        
        # Encrypt content with quantum-hybrid approach
        encrypted_content = self.quantum_hybrid_encrypt(content, target_sigil)
        
        # Create mirror trap
        mirror_trap = self.create_mirror_trap(target_sigil, message_id)
        
        # Generate echo signature
        echo_signature = self.generate_echo_signature(message_id, target_sigil, entropy_header)
        
        return DREDDMessage(
            message_id=message_id,
            sigil_target=target_sigil,
            entropy_header=entropy_header,
            encrypted_content=encrypted_content,
            mirror_trap=mirror_trap,
            timestamp=datetime.now().isoformat(),
            ttl=ttl,
            echo_signature=echo_signature,
            resonance_level=resonance_level
        )
        
    def generate_entropy_header(self) -> str:
        """Generate entropy header for message validation"""
        entropy_data = {
            'timestamp': int(time.time()),
            'random_seed': secrets.token_hex(32),
            'entropy_score': secrets.randbelow(100) / 100,
            'resonance_challenge': secrets.token_hex(16)
        }
        
        entropy_json = json.dumps(entropy_data, sort_keys=True)
        return base64.b64encode(entropy_json.encode()).decode()
        
    def quantum_hybrid_encrypt(self, content: str, target_sigil: str) -> str:
        """Encrypt content using quantum-hybrid approach"""
        
        # Generate quantum-resistant key material
        quantum_key = self.generate_quantum_key(target_sigil)
        
        # Create classical encryption key
        classical_key = Fernet.generate_key()
        fernet = Fernet(classical_key)
        
        # Encrypt content with classical encryption
        encrypted_content = fernet.encrypt(content.encode())
        
        # Encrypt classical key with quantum-resistant encryption
        encrypted_key = self.encrypt_with_quantum_key(classical_key, quantum_key)
        
        # Combine encrypted key and content
        combined = {
            'encrypted_key': base64.b64encode(encrypted_key).decode(),
            'encrypted_content': base64.b64encode(encrypted_content).decode(),
            'quantum_signature': self.generate_quantum_signature(encrypted_content, quantum_key)
        }
        
        return base64.b64encode(json.dumps(combined).encode()).decode()
        
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
        
    def encrypt_with_quantum_key(self, data: bytes, quantum_key: bytes) -> bytes:
        """Encrypt data with quantum-resistant key"""
        # This would use actual quantum-resistant encryption
        # For now, using AES-like approach with the quantum key
        
        # Simple XOR encryption for demonstration
        # In production, this would use Kyber or Dilithium
        encrypted = bytearray(len(data))
        for i in range(len(data)):
            encrypted[i] = data[i] ^ quantum_key[i % len(quantum_key)]
            
        return bytes(encrypted)
        
    def generate_quantum_signature(self, data: bytes, quantum_key: bytes) -> str:
        """Generate quantum-resistant signature"""
        # This would use actual quantum-resistant signatures
        # For now, using HMAC with quantum key material
        
        signature = hashlib.hmac.new(
            quantum_key,
            data,
            hashlib.sha256
        ).hexdigest()
        
        return signature
        
    def create_mirror_trap(self, target_sigil: str, message_id: str) -> Dict[str, Any]:
        """Create mirror trap for unauthorized access"""
        return {
            'trap_id': f"trap_{message_id}",
            'target_sigil': target_sigil,
            'fake_content': self.generate_fake_content(),
            'entropy_fingerprint': secrets.token_hex(32),
            'noise_injection': self.generate_noise_pattern(),
            'trigger_conditions': {
                'invalid_sigil': True,
                'expired_message': True,
                'insufficient_entropy': True
            }
        }
        
    def generate_fake_content(self) -> str:
        """Generate fake content for mirror traps"""
        fake_messages = [
            "System maintenance scheduled for tomorrow.",
            "Weather forecast: Clear skies expected.",
            "Meeting rescheduled to 3 PM.",
            "Package delivery confirmed.",
            "Backup completed successfully."
        ]
        return secrets.choice(fake_messages)
        
    def generate_noise_pattern(self) -> List[int]:
        """Generate noise pattern for injection"""
        return [secrets.randbelow(256) for _ in range(64)]
        
    def generate_echo_signature(self, message_id: str, target_sigil: str, entropy_header: str) -> str:
        """Generate echo signature for message validation"""
        data = f"{message_id}:{target_sigil}:{entropy_header}:{self.session_key}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]
        
    def create_sigil_envelope(self, dredd_message: DREDDMessage) -> SigilEnvelope:
        """Create sigil envelope for message delivery"""
        envelope_id = f"envelope_{dredd_message.message_id}"
        message_hash = hashlib.sha256(dredd_message.encrypted_content.encode()).hexdigest()
        
        # Select delivery nodes
        delivery_nodes = self.select_delivery_nodes(dredd_message.sigil_target)
        
        # Calculate expiration
        expires_at = (datetime.now() + timedelta(seconds=dredd_message.ttl)).isoformat()
        
        return SigilEnvelope(
            envelope_id=envelope_id,
            target_sigil=dredd_message.sigil_target,
            message_hash=message_hash,
            mirror_protection=dredd_message.mirror_trap,
            delivery_nodes=delivery_nodes,
            created_at=datetime.now().isoformat(),
            expires_at=expires_at
        )
        
    def select_delivery_nodes(self, target_sigil: str) -> List[str]:
        """Select relay nodes for message delivery"""
        # Select nodes based on sigil hash for consistent routing
        sigil_hash = hash(target_sigil)
        selected_nodes = []
        
        for i, node in enumerate(self.relay_nodes):
            if (sigil_hash + i) % len(self.relay_nodes) < 2:  # Select 2 nodes
                selected_nodes.append(node)
                
        return selected_nodes
        
    async def send_message(self, content: str, target_sigil: str, 
                          ttl: int = 3600, resonance_level: str = "medium") -> bool:
        """Send a DREDD message to target sigil"""
        
        try:
            # Create DREDD message
            dredd_message = self.create_dredd_message(content, target_sigil, ttl, resonance_level)
            
            # Create sigil envelope
            envelope = self.create_sigil_envelope(dredd_message)
            
            # Send to relay nodes
            success = await self.dispatch_to_nodes(dredd_message, envelope)
            
            if success:
                self.logger.info(f"DREDD message sent: {dredd_message.message_id} to {target_sigil}")
                return True
            else:
                self.logger.error(f"Failed to send DREDD message: {dredd_message.message_id}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error sending DREDD message: {e}")
            return False
            
    async def dispatch_to_nodes(self, message: DREDDMessage, envelope: SigilEnvelope) -> bool:
        """Dispatch message to relay nodes"""
        
        async def send_to_node(node_url: str) -> bool:
            try:
                async with websockets.connect(node_url) as websocket:
                    payload = {
                        'type': 'dredd_message',
                        'message': asdict(message),
                        'envelope': asdict(envelope)
                    }
                    
                    await websocket.send(json.dumps(payload))
                    response = await websocket.recv()
                    
                    response_data = json.loads(response)
                    return response_data.get('status') == 'accepted'
                    
            except Exception as e:
                self.logger.error(f"Failed to send to node {node_url}: {e}")
                return False
                
        # Send to all delivery nodes
        tasks = [send_to_node(node) for node in envelope.delivery_nodes]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Return True if at least one node accepted
        return any(result for result in results if isinstance(result, bool) and result)
        
    async def receive_messages(self, target_sigil: str, timeout: int = 30) -> List[DREDDMessage]:
        """Receive messages for target sigil"""
        
        received_messages = []
        
        async def listen_to_node(node_url: str):
            try:
                async with websockets.connect(node_url) as websocket:
                    # Subscribe to messages for target sigil
                    subscribe_msg = {
                        'type': 'subscribe',
                        'target_sigil': target_sigil,
                        'session_key': self.session_key
                    }
                    
                    await websocket.send(json.dumps(subscribe_msg))
                    
                    # Listen for messages
                    start_time = time.time()
                    while time.time() - start_time < timeout:
                        try:
                            message = await asyncio.wait_for(websocket.recv(), timeout=1)
                            data = json.loads(message)
                            
                            if data.get('type') == 'dredd_message':
                                dredd_msg = DREDDMessage(**data['message'])
                                
                                # Validate message
                                if self.validate_message(dredd_msg, target_sigil):
                                    received_messages.append(dredd_msg)
                                else:
                                    self.logger.warning(f"Invalid message received: {dredd_msg.message_id}")
                                    
                        except asyncio.TimeoutError:
                            continue
                            
            except Exception as e:
                self.logger.error(f"Error listening to node {node_url}: {e}")
                
        # Listen to all relay nodes
        tasks = [listen_to_node(node) for node in self.relay_nodes]
        await asyncio.gather(*tasks, return_exceptions=True)
        
        return received_messages
        
    def validate_message(self, message: DREDDMessage, target_sigil: str) -> bool:
        """Validate received DREDD message"""
        
        # Check if message is expired
        message_time = datetime.fromisoformat(message.timestamp.replace('Z', '+00:00'))
        if datetime.now(message_time.tzinfo) - message_time > timedelta(seconds=message.ttl):
            return False
            
        # Validate echo signature
        expected_signature = self.generate_echo_signature(
            message.message_id, message.sigil_target, message.entropy_header
        )
        if message.echo_signature != expected_signature:
            return False
            
        # Validate entropy header
        try:
            entropy_data = json.loads(base64.b64decode(message.entropy_header).decode())
            if entropy_data.get('entropy_score', 0) < 0.3:
                return False
        except:
            return False
            
        return True
        
    def decrypt_message(self, message: DREDDMessage, target_sigil: str) -> Optional[str]:
        """Decrypt DREDD message content"""
        
        try:
            # Decode encrypted content
            combined_data = json.loads(base64.b64decode(message.encrypted_content).decode())
            
            # Extract encrypted key and content
            encrypted_key = base64.b64decode(combined_data['encrypted_key'])
            encrypted_content = base64.b64decode(combined_data['encrypted_content'])
            
            # Generate quantum key for decryption
            quantum_key = self.generate_quantum_key(target_sigil)
            
            # Decrypt classical key
            classical_key = self.decrypt_with_quantum_key(encrypted_key, quantum_key)
            
            # Decrypt content
            fernet = Fernet(classical_key)
            decrypted_content = fernet.decrypt(encrypted_content)
            
            return decrypted_content.decode()
            
        except Exception as e:
            self.logger.error(f"Failed to decrypt message: {e}")
            return None
            
    def decrypt_with_quantum_key(self, encrypted_data: bytes, quantum_key: bytes) -> bytes:
        """Decrypt data with quantum-resistant key"""
        # Reverse the XOR encryption
        decrypted = bytearray(len(encrypted_data))
        for i in range(len(encrypted_data)):
            decrypted[i] = encrypted_data[i] ^ quantum_key[i % len(quantum_key)]
            
        return bytes(decrypted)

async def main():
    """Main CLI interface for DREDD dispatch"""
    parser = argparse.ArgumentParser(description='DREDD Dispatch - Discrete Resonant Echo-Derived Delivery')
    parser.add_argument('action', choices=['send', 'receive'], help='Action to perform')
    parser.add_argument('--sigil', required=True, help='Target sigil for message')
    parser.add_argument('--message', help='Message content (for send)')
    parser.add_argument('--ttl', type=int, default=3600, help='Time to live in seconds')
    parser.add_argument('--resonance', default='medium', choices=['low', 'medium', 'high', 'critical'], 
                       help='Resonance level')
    parser.add_argument('--timeout', type=int, default=30, help='Receive timeout in seconds')
    parser.add_argument('--config', default='dredd_config.json', help='Configuration file')
    
    args = parser.parse_args()
    
    # Initialize DREDD dispatcher
    dispatcher = DREDDDispatcher(args.config)
    
    if args.action == 'send':
        if not args.message:
            print("Error: Message content required for send action")
            return
            
        print(f"🕳️ Sending DREDD message to sigil: {args.sigil}")
        success = await dispatcher.send_message(
            args.message, args.sigil, args.ttl, args.resonance
        )
        
        if success:
            print("✅ DREDD message sent successfully")
        else:
            print("❌ Failed to send DREDD message")
            
    elif args.action == 'receive':
        print(f"🕳️ Receiving DREDD messages for sigil: {args.sigil}")
        messages = await dispatcher.receive_messages(args.sigil, args.timeout)
        
        if messages:
            print(f"📨 Received {len(messages)} messages:")
            for i, msg in enumerate(messages, 1):
                print(f"\n--- Message {i} ---")
                print(f"ID: {msg.message_id}")
                print(f"Timestamp: {msg.timestamp}")
                print(f"Resonance: {msg.resonance_level}")
                
                # Decrypt and display content
                content = dispatcher.decrypt_message(msg, args.sigil)
                if content:
                    print(f"Content: {content}")
                else:
                    print("Content: [Decryption failed]")
        else:
            print("📭 No messages received")

if __name__ == "__main__":
    asyncio.run(main()) 