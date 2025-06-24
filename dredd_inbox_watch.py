#!/usr/bin/env python3
"""
DREDD Inbox Watch - Listener service for receiving ASRs and maintaining sovereign reply-feedback loop
Allows internal actors to receive ASRs in-session and respond with acknowledgments or requests
"""

import asyncio
import json
import logging
import time
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
import websockets
import threading
import queue
import os
import base64

# Import DREDD components
from dredd_dispatch import DREDDDispatcher
from asr_generator import ASRGenerator, AcclimationSequencingReport

class DREDDInboxWatcher:
    def __init__(self, config_file: str = "dredd_inbox_config.json"):
        self.config = self.load_config(config_file)
        self.dredd_dispatcher = DREDDDispatcher()
        self.asr_generator = ASRGenerator()
        self.logger = logging.getLogger('dredd_inbox_watcher')
        
        # Inbox state
        self.inbox_messages = []
        self.asr_responses = []
        self.active_listeners = {}
        self.response_handlers = {}
        
        # Processing queues
        self.inbox_queue = queue.Queue()
        self.response_queue = queue.Queue()
        
        # Running state
        self.running = False
        self.listeners = []
        
    def load_config(self, config_file: str) -> Dict[str, Any]:
        """Load inbox watcher configuration"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                'inbox_settings': {
                    'poll_interval': 30,  # seconds
                    'max_messages': 100,
                    'auto_acknowledge': True,
                    'response_timeout': 3600,  # 1 hour
                    'archive_responses': True
                },
                'listener_endpoints': [
                    'ws://localhost:8080/dredd/inbox',
                    'ws://localhost:8081/dredd/inbox'
                ],
                'asr_handlers': {
                    'djinn_council': {
                        'enabled': True,
                        'auto_respond': True,
                        'response_template': 'council_acknowledgment',
                        'escalation_threshold': 0.8
                    },
                    'sovereign_archive': {
                        'enabled': True,
                        'auto_respond': False,
                        'response_template': 'archive_receipt',
                        'escalation_threshold': 0.9
                    },
                    'watch_guard': {
                        'enabled': True,
                        'auto_respond': True,
                        'response_template': 'guard_acknowledgment',
                        'escalation_threshold': 0.7
                    }
                },
                'response_templates': {
                    'council_acknowledgment': {
                        'subject': 'ASR Acknowledged by Djinn Council',
                        'content': 'The Djinn Council has received and acknowledged ASR {report_id}. Review in progress.',
                        'priority': 'high',
                        'response_time': 300  # 5 minutes
                    },
                    'archive_receipt': {
                        'subject': 'ASR Archived Successfully',
                        'content': 'ASR {report_id} has been archived in the Sovereign Archive for future reference.',
                        'priority': 'medium',
                        'response_time': 600  # 10 minutes
                    },
                    'guard_acknowledgment': {
                        'subject': 'Watch Guard ASR Response',
                        'content': 'Watch Guard has processed ASR {report_id}. Security posture updated accordingly.',
                        'priority': 'high',
                        'response_time': 180  # 3 minutes
                    },
                    'escalation_request': {
                        'subject': 'ASR Escalation Required',
                        'content': 'ASR {report_id} requires escalation due to {reason}. Immediate attention needed.',
                        'priority': 'critical',
                        'response_time': 60  # 1 minute
                    }
                },
                'notification_settings': {
                    'enable_notifications': True,
                    'notification_channels': [
                        'console_log',
                        'file_log',
                        'sovereign_alert'
                    ],
                    'notification_levels': {
                        'info': True,
                        'warning': True,
                        'error': True,
                        'critical': True
                    }
                }
            }
            
    def start_watching(self):
        """Start the inbox watcher"""
        self.running = True
        
        # Start processing threads
        self.inbox_processor = threading.Thread(target=self._process_inbox_queue, daemon=True)
        self.inbox_processor.start()
        
        self.response_processor = threading.Thread(target=self._process_response_queue, daemon=True)
        self.response_processor.start()
        
        # Start listeners
        for endpoint in self.config['listener_endpoints']:
            listener = threading.Thread(
                target=self._start_listener,
                args=(endpoint,),
                daemon=True
            )
            listener.start()
            self.listeners.append(listener)
            
        self.logger.info("DREDD Inbox Watcher started")
        
    def stop_watching(self):
        """Stop the inbox watcher"""
        self.running = False
        
        # Wait for threads to finish
        if hasattr(self, 'inbox_processor'):
            self.inbox_processor.join(timeout=5)
        if hasattr(self, 'response_processor'):
            self.response_processor.join(timeout=5)
            
        self.logger.info("DREDD Inbox Watcher stopped")
        
    async def _start_listener(self, endpoint: str):
        """Start listening on a specific endpoint"""
        try:
            async with websockets.connect(endpoint) as websocket:
                self.logger.info(f"Connected to DREDD inbox: {endpoint}")
                
                async for message in websocket:
                    if not self.running:
                        break
                        
                    try:
                        # Parse message
                        message_data = json.loads(message)
                        
                        # Check if it's an ASR message
                        if self._is_asr_message(message_data):
                            await self._handle_asr_message(message_data)
                        else:
                            # Handle other message types
                            await self._handle_generic_message(message_data)
                            
                    except json.JSONDecodeError:
                        self.logger.error(f"Invalid JSON message from {endpoint}")
                    except Exception as e:
                        self.logger.error(f"Error processing message from {endpoint}: {e}")
                        
        except Exception as e:
            self.logger.error(f"Error connecting to {endpoint}: {e}")
            
    def _is_asr_message(self, message_data: Dict[str, Any]) -> bool:
        """Check if message is an ASR"""
        return (
            message_data.get('dredd_message', {}).get('metadata', {}).get('message_type') == 'ASR' or
            message_data.get('message_type') == 'ASR'
        )
        
    async def _handle_asr_message(self, message_data: Dict[str, Any]):
        """Handle incoming ASR message"""
        try:
            # Extract ASR data
            asr_data = self._extract_asr_data(message_data)
            
            if asr_data:
                # Add to inbox
                inbox_entry = {
                    'message_id': message_data.get('dredd_message', {}).get('metadata', {}).get('message_id'),
                    'received_at': datetime.now().isoformat(),
                    'asr_data': asr_data,
                    'source_sigil': message_data.get('dredd_message', {}).get('targeting', {}).get('sigil_target'),
                    'status': 'received'
                }
                
                self.inbox_messages.append(inbox_entry)
                
                # Add to processing queue
                self.inbox_queue.put(inbox_entry)
                
                self.logger.info(f"ASR received: {asr_data.get('report_id', 'unknown')}")
                
        except Exception as e:
            self.logger.error(f"Error handling ASR message: {e}")
            
    def _extract_asr_data(self, message_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Extract ASR data from DREDD message"""
        try:
            # Try to extract from encrypted content
            encrypted_content = message_data.get('dredd_message', {}).get('encrypted_content', {})
            if encrypted_content.get('encoded'):
                # This would normally decrypt the content
                # For now, return sample data
                return {
                    'report_id': 'ASR-EXTRACTED-001',
                    'session_id': 'SESSION-EXTRACTED',
                    'trigger_type': 'extracted',
                    'generated_at': datetime.now().isoformat(),
                    'summary_statistics': {
                        'total_sovereign_actions': 1,
                        'session_effectiveness_score': 0.85
                    }
                }
                
            # Try to extract from ASR payload
            asr_payload = message_data.get('dredd_message', {}).get('asr_payload')
            if asr_payload:
                return asr_payload
                
            return None
            
        except Exception as e:
            self.logger.error(f"Error extracting ASR data: {e}")
            return None
            
    async def _handle_generic_message(self, message_data: Dict[str, Any]):
        """Handle non-ASR messages"""
        try:
            message_type = message_data.get('dredd_message', {}).get('metadata', {}).get('message_type', 'unknown')
            self.logger.info(f"Generic message received: {message_type}")
            
            # Handle different message types
            if message_type == 'ASR_ACKNOWLEDGMENT':
                await self._handle_asr_acknowledgment(message_data)
            elif message_type == 'ASR_RESPONSE':
                await self._handle_asr_response(message_data)
            elif message_type == 'ASR_ESCALATION':
                await self._handle_asr_escalation(message_data)
            else:
                self.logger.info(f"Unhandled message type: {message_type}")
                
        except Exception as e:
            self.logger.error(f"Error handling generic message: {e}")
            
    async def _handle_asr_acknowledgment(self, message_data: Dict[str, Any]):
        """Handle ASR acknowledgment"""
        try:
            ack_data = {
                'acknowledgment_id': f"ACK-{int(time.time())}",
                'received_at': datetime.now().isoformat(),
                'original_asr_id': message_data.get('payload', {}).get('payload_hash'),
                'acknowledging_recipient': message_data.get('payload', {}).get('recipient'),
                'response_time': message_data.get('payload', {}).get('response_time', 0),
                'status': 'acknowledged'
            }
            
            self.asr_responses.append(ack_data)
            self.logger.info(f"ASR acknowledged by {ack_data['acknowledging_recipient']}")
            
        except Exception as e:
            self.logger.error(f"Error handling ASR acknowledgment: {e}")
            
    async def _handle_asr_response(self, message_data: Dict[str, Any]):
        """Handle ASR response"""
        try:
            response_data = {
                'response_id': f"RESP-{int(time.time())}",
                'received_at': datetime.now().isoformat(),
                'original_asr_id': message_data.get('payload', {}).get('payload_hash'),
                'responding_recipient': message_data.get('payload', {}).get('recipient'),
                'response_content': message_data.get('payload', {}).get('response_content'),
                'response_type': message_data.get('payload', {}).get('response_type'),
                'priority': message_data.get('payload', {}).get('priority', 'medium'),
                'status': 'received'
            }
            
            self.asr_responses.append(response_data)
            self.response_queue.put(response_data)
            
            self.logger.info(f"ASR response received from {response_data['responding_recipient']}")
            
        except Exception as e:
            self.logger.error(f"Error handling ASR response: {e}")
            
    async def _handle_asr_escalation(self, message_data: Dict[str, Any]):
        """Handle ASR escalation request"""
        try:
            escalation_data = {
                'escalation_id': f"ESC-{int(time.time())}",
                'received_at': datetime.now().isoformat(),
                'original_asr_id': message_data.get('payload', {}).get('payload_hash'),
                'escalating_recipient': message_data.get('payload', {}).get('recipient'),
                'escalation_reason': message_data.get('payload', {}).get('reason'),
                'priority': 'critical',
                'status': 'escalated'
            }
            
            self.asr_responses.append(escalation_data)
            self.response_queue.put(escalation_data)
            
            self.logger.warning(f"ASR escalation requested by {escalation_data['escalating_recipient']}: {escalation_data['escalation_reason']}")
            
        except Exception as e:
            self.logger.error(f"Error handling ASR escalation: {e}")
            
    def _process_inbox_queue(self):
        """Process messages from inbox queue"""
        while self.running:
            try:
                # Get message from queue
                inbox_entry = self.inbox_queue.get(timeout=1)
                
                # Process ASR
                self._process_asr(inbox_entry)
                
            except queue.Empty:
                continue
            except Exception as e:
                self.logger.error(f"Error processing inbox queue: {e}")
                
    def _process_response_queue(self):
        """Process responses from response queue"""
        while self.running:
            try:
                # Get response from queue
                response_data = self.response_queue.get(timeout=1)
                
                # Process response
                self._process_response(response_data)
                
            except queue.Empty:
                continue
            except Exception as e:
                self.logger.error(f"Error processing response queue: {e}")
                
    def _process_asr(self, inbox_entry: Dict[str, Any]):
        """Process received ASR"""
        try:
            asr_data = inbox_entry['asr_data']
            source_sigil = inbox_entry['source_sigil']
            
            # Determine recipient type from sigil
            recipient_type = self._get_recipient_type(source_sigil)
            
            if recipient_type and recipient_type in self.config['asr_handlers']:
                handler_config = self.config['asr_handlers'][recipient_type]
                
                if handler_config['enabled']:
                    # Auto-respond if configured
                    if handler_config['auto_respond']:
                        self._generate_auto_response(asr_data, recipient_type, handler_config)
                        
                    # Check for escalation
                    if self._should_escalate(asr_data, handler_config):
                        self._trigger_escalation(asr_data, recipient_type)
                        
            # Update status
            inbox_entry['status'] = 'processed'
            
        except Exception as e:
            self.logger.error(f"Error processing ASR: {e}")
            
    def _get_recipient_type(self, sigil: str) -> Optional[str]:
        """Get recipient type from sigil"""
        sigil_mapping = {
            'glyph-hash-djinn-council': 'djinn_council',
            'glyph-hash-sovereign-archive': 'sovereign_archive',
            'glyph-hash-watch-guard': 'watch_guard',
            'glyph-hash-lattice-core': 'lattice_core',
            'glyph-hash-mkp': 'mirror_keyring_protocol',
            'glyph-hash-resonance-scanner': 'resonance_scanner',
            'glyph-hash-entropy-monitor': 'entropy_monitor',
            'glyph-hash-chronicle-linker': 'chronicle_linker'
        }
        
        return sigil_mapping.get(sigil)
        
    def _should_escalate(self, asr_data: Dict[str, Any], handler_config: Dict[str, Any]) -> bool:
        """Check if ASR should be escalated"""
        try:
            # Check effectiveness score
            effectiveness_score = asr_data.get('summary_statistics', {}).get('session_effectiveness_score', 0)
            escalation_threshold = handler_config.get('escalation_threshold', 0.8)
            
            return effectiveness_score < escalation_threshold
            
        except Exception as e:
            self.logger.error(f"Error checking escalation: {e}")
            return False
            
    def _generate_auto_response(self, asr_data: Dict[str, Any], recipient_type: str, handler_config: Dict[str, Any]):
        """Generate automatic response to ASR"""
        try:
            response_template = handler_config.get('response_template')
            if response_template in self.config['response_templates']:
                template = self.config['response_templates'][response_template]
                
                response_data = {
                    'response_id': f"AUTO-RESP-{int(time.time())}",
                    'generated_at': datetime.now().isoformat(),
                    'original_asr_id': asr_data.get('report_id'),
                    'responding_recipient': recipient_type,
                    'response_content': template['content'].format(
                        report_id=asr_data.get('report_id', 'unknown')
                    ),
                    'response_type': 'auto_acknowledgment',
                    'priority': template['priority'],
                    'template_used': response_template,
                    'status': 'generated'
                }
                
                # Add to responses
                self.asr_responses.append(response_data)
                
                # Send response via DREDD
                asyncio.create_task(self._send_response_via_dredd(response_data))
                
                self.logger.info(f"Auto-response generated for {recipient_type}")
                
        except Exception as e:
            self.logger.error(f"Error generating auto-response: {e}")
            
    def _trigger_escalation(self, asr_data: Dict[str, Any], recipient_type: str):
        """Trigger escalation for ASR"""
        try:
            escalation_data = {
                'escalation_id': f"ESC-{int(time.time())}",
                'triggered_at': datetime.now().isoformat(),
                'original_asr_id': asr_data.get('report_id'),
                'triggering_recipient': recipient_type,
                'escalation_reason': 'low_effectiveness_score',
                'effectiveness_score': asr_data.get('summary_statistics', {}).get('session_effectiveness_score', 0),
                'priority': 'critical',
                'status': 'triggered'
            }
            
            # Add to responses
            self.asr_responses.append(escalation_data)
            
            # Send escalation via DREDD
            asyncio.create_task(self._send_escalation_via_dredd(escalation_data))
            
            self.logger.warning(f"Escalation triggered for ASR {asr_data.get('report_id')}")
            
        except Exception as e:
            self.logger.error(f"Error triggering escalation: {e}")
            
    async def _send_response_via_dredd(self, response_data: Dict[str, Any]):
        """Send response via DREDD"""
        try:
            # Create DREDD message
            dredd_message = {
                'dredd_message': {
                    'metadata': {
                        'version': '2.0.0',
                        'protocol': 'DREDD',
                        'message_type': 'ASR_RESPONSE',
                        'created_at': datetime.now().isoformat(),
                        'message_id': f"dredd_response_{response_data['response_id']}",
                        'resonance_level': 'medium'
                    },
                    'targeting': {
                        'sigil_target': 'glyph-hash-sovereign-archive',
                        'resonance_requirements': {
                            'minimum_entropy': 0.6,
                            'required_sigil': True
                        }
                    },
                    'payload': response_data
                }
            }
            
            # Send via DREDD
            success = await self.dredd_dispatcher.send_message(
                json.dumps(dredd_message),
                'glyph-hash-sovereign-archive',
                ttl=3600,
                resonance_level='medium'
            )
            
            if success:
                response_data['status'] = 'sent'
                self.logger.info(f"Response sent via DREDD: {response_data['response_id']}")
            else:
                response_data['status'] = 'failed'
                self.logger.error(f"Failed to send response via DREDD: {response_data['response_id']}")
                
        except Exception as e:
            self.logger.error(f"Error sending response via DREDD: {e}")
            
    async def _send_escalation_via_dredd(self, escalation_data: Dict[str, Any]):
        """Send escalation via DREDD"""
        try:
            # Create DREDD message
            dredd_message = {
                'dredd_message': {
                    'metadata': {
                        'version': '2.0.0',
                        'protocol': 'DREDD',
                        'message_type': 'ASR_ESCALATION',
                        'created_at': datetime.now().isoformat(),
                        'message_id': f"dredd_escalation_{escalation_data['escalation_id']}",
                        'resonance_level': 'critical'
                    },
                    'targeting': {
                        'sigil_target': 'glyph-hash-djinn-council',
                        'resonance_requirements': {
                            'minimum_entropy': 0.9,
                            'required_sigil': True
                        }
                    },
                    'payload': escalation_data
                }
            }
            
            # Send via DREDD
            success = await self.dredd_dispatcher.send_message(
                json.dumps(dredd_message),
                'glyph-hash-djinn-council',
                ttl=1800,
                resonance_level='critical'
            )
            
            if success:
                escalation_data['status'] = 'sent'
                self.logger.info(f"Escalation sent via DREDD: {escalation_data['escalation_id']}")
            else:
                escalation_data['status'] = 'failed'
                self.logger.error(f"Failed to send escalation via DREDD: {escalation_data['escalation_id']}")
                
        except Exception as e:
            self.logger.error(f"Error sending escalation via DREDD: {e}")
            
    def _process_response(self, response_data: Dict[str, Any]):
        """Process received response"""
        try:
            # Update response status
            response_data['processed_at'] = datetime.now().isoformat()
            response_data['status'] = 'processed'
            
            # Log response
            self.logger.info(f"Response processed: {response_data['response_id']} from {response_data.get('responding_recipient', 'unknown')}")
            
            # Archive if configured
            if self.config['inbox_settings']['archive_responses']:
                self._archive_response(response_data)
                
        except Exception as e:
            self.logger.error(f"Error processing response: {e}")
            
    def _archive_response(self, response_data: Dict[str, Any]):
        """Archive response data"""
        try:
            archive_entry = {
                'response': response_data,
                'archived_at': datetime.now().isoformat(),
                'archive_id': f"ARCHIVE-RESP-{response_data['response_id']}"
            }
            
            # Write to archive file
            with open('asr_response_archive.jsonl', 'a') as f:
                f.write(json.dumps(archive_entry) + '\n')
                
            self.logger.info(f"Response archived: {response_data['response_id']}")
            
        except Exception as e:
            self.logger.error(f"Error archiving response: {e}")
            
    def get_inbox_status(self) -> Dict[str, Any]:
        """Get status of inbox"""
        return {
            'total_messages': len(self.inbox_messages),
            'total_responses': len(self.asr_responses),
            'unprocessed_messages': len([m for m in self.inbox_messages if m['status'] == 'received']),
            'unprocessed_responses': len([r for r in self.asr_responses if r['status'] == 'received']),
            'running': self.running
        }
        
    def get_recent_messages(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent messages from inbox"""
        return sorted(
            self.inbox_messages,
            key=lambda x: x['received_at'],
            reverse=True
        )[:limit]
        
    def get_recent_responses(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent responses"""
        return sorted(
            self.asr_responses,
            key=lambda x: x.get('received_at', x.get('generated_at', '')),
            reverse=True
        )[:limit]

# Global instance
inbox_watcher = None

def initialize_inbox_watcher():
    """Initialize the global inbox watcher"""
    global inbox_watcher
    inbox_watcher = DREDDInboxWatcher()
    return inbox_watcher

def start_inbox_watching():
    """Start watching the inbox"""
    if inbox_watcher is None:
        initialize_inbox_watcher()
    inbox_watcher.start_watching()

def stop_inbox_watching():
    """Stop watching the inbox"""
    if inbox_watcher is not None:
        inbox_watcher.stop_watching()

def get_inbox_status():
    """Get inbox status"""
    if inbox_watcher is None:
        return {'error': 'Inbox watcher not initialized'}
    return inbox_watcher.get_inbox_status()

# Example usage
if __name__ == "__main__":
    # Initialize and start inbox watcher
    watcher = initialize_inbox_watcher()
    watcher.start_watching()
    
    try:
        # Keep running
        while True:
            time.sleep(60)
            
            # Print status every minute
            status = watcher.get_inbox_status()
            print(f"Inbox Status: {status}")
            
    except KeyboardInterrupt:
        print("Stopping inbox watcher...")
        watcher.stop_watching() 