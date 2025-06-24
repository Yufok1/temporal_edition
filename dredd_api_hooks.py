#!/usr/bin/env python3
"""
DREDD API Hooks - Extension hooks for embedding DREDD into existing services
Provides encrypted coordination for WalletDivinationService, DjinnCouncilService, and GovernanceAPI
"""

import json
import asyncio
import logging
from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import functools
import inspect

# Import DREDD components
from dredd_dispatch import DREDDDispatcher
from sigilgram_parser import SigilGramParser

@dataclass
class DREDDHook:
    service_name: str
    hook_type: str
    sigil_target: str
    message_template: Dict[str, Any]
    encryption_level: str
    auto_retry: bool
    callback_function: Optional[Callable] = None

class DREDDServiceIntegrator:
    def __init__(self, config_file: str = "dredd_config.json"):
        self.config = self.load_config(config_file)
        self.dispatcher = DREDDDispatcher(config_file)
        self.parser = SigilGramParser(config_file)
        self.hooks = {}
        self.service_registry = {}
        self.logger = logging.getLogger('dredd_integrator')
        
    def load_config(self, config_file: str) -> Dict[str, Any]:
        """Load DREDD integration configuration"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                'service_hooks': {
                    'WalletDivinationService': {
                        'sigil': 'wallet-divination-01',
                        'encryption_level': 'high',
                        'auto_retry': True,
                        'message_types': ['balance_alert', 'anomaly_detected', 'validation_complete']
                    },
                    'DjinnCouncilService': {
                        'sigil': 'djinn-council-01',
                        'encryption_level': 'critical',
                        'auto_retry': True,
                        'message_types': ['governance_ruling', 'consensus_reached', 'emergency_alert']
                    },
                    'GovernanceAPI': {
                        'sigil': 'governance-api-01',
                        'encryption_level': 'high',
                        'auto_retry': True,
                        'message_types': ['steward_coordination', 'policy_update', 'access_granted']
                    },
                    'SigilDistortionEngine': {
                        'sigil': 'sigil-distortion-01',
                        'encryption_level': 'medium',
                        'auto_retry': False,
                        'message_types': ['glyph_update', 'resonance_shift', 'anchor_creation']
                    }
                },
                'integration_settings': {
                    'default_ttl': 3600,
                    'max_retries': 3,
                    'retry_interval': 30,
                    'audit_enabled': True,
                    'mirror_protection': True
                }
            }
            
    def register_service(self, service_name: str, service_instance: Any, 
                        sigil_target: str = None, encryption_level: str = "medium") -> bool:
        """Register a service for DREDD integration"""
        
        try:
            # Get service configuration
            service_config = self.config['service_hooks'].get(service_name, {})
            
            if sigil_target:
                service_config['sigil'] = sigil_target
            elif 'sigil' not in service_config:
                self.logger.error(f"No sigil target configured for service: {service_name}")
                return False
                
            # Create service hook
            hook = DREDDHook(
                service_name=service_name,
                hook_type='service_integration',
                sigil_target=service_config['sigil'],
                message_template=self.create_message_template(service_name),
                encryption_level=encryption_level or service_config.get('encryption_level', 'medium'),
                auto_retry=service_config.get('auto_retry', True)
            )
            
            # Store service instance and hook
            self.service_registry[service_name] = service_instance
            self.hooks[service_name] = hook
            
            self.logger.info(f"Service registered: {service_name} with sigil: {hook.sigil_target}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error registering service {service_name}: {e}")
            return False
            
    def create_message_template(self, service_name: str) -> Dict[str, Any]:
        """Create message template for service"""
        
        templates = {
            'WalletDivinationService': {
                'balance_alert': {
                    'type': 'balance_alert',
                    'wallet_address': '',
                    'balance_change': '',
                    'threshold_exceeded': False,
                    'anomaly_score': 0.0
                },
                'anomaly_detected': {
                    'type': 'anomaly_detected',
                    'wallet_address': '',
                    'anomaly_type': '',
                    'confidence_score': 0.0,
                    'recommended_action': ''
                },
                'validation_complete': {
                    'type': 'validation_complete',
                    'wallet_address': '',
                    'validation_status': '',
                    'timestamp': '',
                    'details': {}
                }
            },
            'DjinnCouncilService': {
                'governance_ruling': {
                    'type': 'governance_ruling',
                    'ruling_id': '',
                    'ruling_type': '',
                    'affected_entities': [],
                    'ruling_content': '',
                    'consensus_level': 0.0
                },
                'consensus_reached': {
                    'type': 'consensus_reached',
                    'proposal_id': '',
                    'consensus_percentage': 0.0,
                    'voting_entities': [],
                    'decision': ''
                },
                'emergency_alert': {
                    'type': 'emergency_alert',
                    'alert_level': '',
                    'affected_systems': [],
                    'immediate_actions': [],
                    'coordination_required': True
                }
            },
            'GovernanceAPI': {
                'steward_coordination': {
                    'type': 'steward_coordination',
                    'steward_id': '',
                    'coordination_type': '',
                    'target_entities': [],
                    'permissions_granted': [],
                    'expires_at': ''
                },
                'policy_update': {
                    'type': 'policy_update',
                    'policy_id': '',
                    'update_type': '',
                    'affected_services': [],
                    'new_policy_content': '',
                    'effective_date': ''
                },
                'access_granted': {
                    'type': 'access_granted',
                    'entity_id': '',
                    'access_level': '',
                    'granted_permissions': [],
                    'expires_at': '',
                    'granted_by': ''
                }
            },
            'SigilDistortionEngine': {
                'glyph_update': {
                    'type': 'glyph_update',
                    'glyph_id': '',
                    'update_type': '',
                    'resonance_changes': {},
                    'affected_sigils': []
                },
                'resonance_shift': {
                    'type': 'resonance_shift',
                    'shift_id': '',
                    'shift_magnitude': 0.0,
                    'affected_frequencies': [],
                    'temporal_impact': ''
                },
                'anchor_creation': {
                    'type': 'anchor_creation',
                    'anchor_id': '',
                    'anchor_type': '',
                    'resonance_signature': '',
                    'stability_score': 0.0
                }
            }
        }
        
        return templates.get(service_name, {})
        
    def hook_method(self, service_name: str, method_name: str, 
                   message_type: str, target_sigil: str = None):
        """Decorator to hook a service method for DREDD messaging"""
        
        def decorator(func):
            @functools.wraps(func)
            async def wrapper(*args, **kwargs):
                # Execute original method
                result = await func(*args, **kwargs)
                
                # Create and send DREDD message
                try:
                    hook = self.hooks.get(service_name)
                    if hook:
                        sigil = target_sigil or hook.sigil_target
                        
                        # Create message content
                        message_content = self.create_hook_message(
                            service_name, method_name, message_type, result, args, kwargs
                        )
                        
                        # Send message
                        await self.send_service_message(
                            service_name, message_content, sigil, hook.encryption_level
                        )
                        
                except Exception as e:
                    self.logger.error(f"Error in DREDD hook for {service_name}.{method_name}: {e}")
                    
                return result
                
            return wrapper
        return decorator
        
    def create_hook_message(self, service_name: str, method_name: str, 
                           message_type: str, result: Any, args: tuple, kwargs: dict) -> Dict[str, Any]:
        """Create message content for service hook"""
        
        # Get message template
        template = self.hooks[service_name].message_template.get(message_type, {})
        
        # Create message content
        message_content = {
            'service': service_name,
            'method': method_name,
            'message_type': message_type,
            'timestamp': datetime.now().isoformat(),
            'result': result,
            'parameters': {
                'args': [str(arg) for arg in args[1:]],  # Skip self
                'kwargs': kwargs
            }
        }
        
        # Merge with template
        message_content.update(template)
        
        return message_content
        
    async def send_service_message(self, service_name: str, content: Dict[str, Any], 
                                  target_sigil: str, encryption_level: str) -> bool:
        """Send message from service via DREDD"""
        
        try:
            # Convert content to JSON string
            content_str = json.dumps(content, default=str)
            
            # Determine TTL based on encryption level
            ttl_map = {
                'low': 1800,      # 30 minutes
                'medium': 3600,   # 1 hour
                'high': 7200,     # 2 hours
                'critical': 14400 # 4 hours
            }
            ttl = ttl_map.get(encryption_level, 3600)
            
            # Send message
            success = await self.dispatcher.send_message(
                content_str, target_sigil, ttl, encryption_level
            )
            
            if success:
                self.logger.info(f"DREDD message sent from {service_name} to {target_sigil}")
            else:
                self.logger.error(f"Failed to send DREDD message from {service_name}")
                
            return success
            
        except Exception as e:
            self.logger.error(f"Error sending service message: {e}")
            return False
            
    async def receive_service_messages(self, service_name: str, timeout: int = 30) -> List[Dict[str, Any]]:
        """Receive messages for a service"""
        
        try:
            hook = self.hooks.get(service_name)
            if not hook:
                self.logger.error(f"No hook found for service: {service_name}")
                return []
                
            # Receive messages
            messages = await self.dispatcher.receive_messages(hook.sigil_target, timeout)
            
            # Parse messages
            parsed_messages = []
            for message in messages:
                content = self.dispatcher.decrypt_message(message, hook.sigil_target)
                if content:
                    try:
                        parsed_content = json.loads(content)
                        parsed_messages.append(parsed_content)
                    except json.JSONDecodeError:
                        self.logger.warning(f"Invalid JSON in message: {message.message_id}")
                        
            return parsed_messages
            
        except Exception as e:
            self.logger.error(f"Error receiving service messages: {e}")
            return []
            
    def create_wallet_divination_hooks(self):
        """Create hooks for WalletDivinationService"""
        
        class WalletDivinationHooks:
            def __init__(self, integrator: DREDDServiceIntegrator):
                self.integrator = integrator
                
            @property
            def balance_alert_hook(self):
                return self.integrator.hook_method(
                    'WalletDivinationService', 'check_balance', 'balance_alert'
                )
                
            @property
            def anomaly_detection_hook(self):
                return self.integrator.hook_method(
                    'WalletDivinationService', 'detect_anomaly', 'anomaly_detected'
                )
                
            @property
            def validation_complete_hook(self):
                return self.integrator.hook_method(
                    'WalletDivinationService', 'validate_wallet', 'validation_complete'
                )
                
        return WalletDivinationHooks(self)
        
    def create_djinn_council_hooks(self):
        """Create hooks for DjinnCouncilService"""
        
        class DjinnCouncilHooks:
            def __init__(self, integrator: DREDDServiceIntegrator):
                self.integrator = integrator
                
            @property
            def governance_ruling_hook(self):
                return self.integrator.hook_method(
                    'DjinnCouncilService', 'make_ruling', 'governance_ruling'
                )
                
            @property
            def consensus_reached_hook(self):
                return self.integrator.hook_method(
                    'DjinnCouncilService', 'reach_consensus', 'consensus_reached'
                )
                
            @property
            def emergency_alert_hook(self):
                return self.integrator.hook_method(
                    'DjinnCouncilService', 'issue_emergency_alert', 'emergency_alert'
                )
                
        return DjinnCouncilHooks(self)
        
    def create_governance_api_hooks(self):
        """Create hooks for GovernanceAPI"""
        
        class GovernanceAPIHooks:
            def __init__(self, integrator: DREDDServiceIntegrator):
                self.integrator = integrator
                
            @property
            def steward_coordination_hook(self):
                return self.integrator.hook_method(
                    'GovernanceAPI', 'coordinate_stewards', 'steward_coordination'
                )
                
            @property
            def policy_update_hook(self):
                return self.integrator.hook_method(
                    'GovernanceAPI', 'update_policy', 'policy_update'
                )
                
            @property
            def access_granted_hook(self):
                return self.integrator.hook_method(
                    'GovernanceAPI', 'grant_access', 'access_granted'
                )
                
        return GovernanceAPIHooks(self)
        
    def create_sigil_distortion_hooks(self):
        """Create hooks for SigilDistortionEngine"""
        
        class SigilDistortionHooks:
            def __init__(self, integrator: DREDDServiceIntegrator):
                self.integrator = integrator
                
            @property
            def glyph_update_hook(self):
                return self.integrator.hook_method(
                    'SigilDistortionEngine', 'update_glyph', 'glyph_update'
                )
                
            @property
            def resonance_shift_hook(self):
                return self.integrator.hook_method(
                    'SigilDistortionEngine', 'shift_resonance', 'resonance_shift'
                )
                
            @property
            def anchor_creation_hook(self):
                return self.integrator.hook_method(
                    'SigilDistortionEngine', 'create_anchor', 'anchor_creation'
                )
                
        return SigilDistortionHooks(self)
        
    async def broadcast_service_event(self, event_type: str, event_data: Dict[str, Any], 
                                    target_services: List[str] = None) -> Dict[str, bool]:
        """Broadcast event to multiple services"""
        
        results = {}
        
        if target_services is None:
            target_services = list(self.hooks.keys())
            
        for service_name in target_services:
            if service_name in self.hooks:
                hook = self.hooks[service_name]
                
                # Create broadcast message
                broadcast_content = {
                    'type': 'service_broadcast',
                    'event_type': event_type,
                    'event_data': event_data,
                    'source_service': 'DREDD_Integrator',
                    'timestamp': datetime.now().isoformat(),
                    'target_services': target_services
                }
                
                # Send message
                success = await self.send_service_message(
                    service_name, broadcast_content, hook.sigil_target, hook.encryption_level
                )
                
                results[service_name] = success
                
        return results
        
    def get_service_status(self) -> Dict[str, Any]:
        """Get status of all registered services"""
        
        status = {
            'total_services': len(self.service_registry),
            'services': {}
        }
        
        for service_name, hook in self.hooks.items():
            status['services'][service_name] = {
                'sigil_target': hook.sigil_target,
                'encryption_level': hook.encryption_level,
                'auto_retry': hook.auto_retry,
                'message_types': list(hook.message_template.keys()),
                'registered': service_name in self.service_registry
            }
            
        return status

# Example usage and integration patterns
class DREDDIntegrationExample:
    """Example showing how to integrate DREDD with existing services"""
    
    def __init__(self):
        self.integrator = DREDDServiceIntegrator()
        
    async def setup_wallet_divination_integration(self):
        """Example: Integrate DREDD with WalletDivinationService"""
        
        # Mock WalletDivinationService
        class WalletDivinationService:
            def __init__(self, dredd_hooks):
                self.dredd_hooks = dredd_hooks
                
            @property
            def check_balance(self):
                return self.dredd_hooks.balance_alert_hook(self._check_balance)
                
            async def _check_balance(self, wallet_address: str):
                # Mock balance check
                return {
                    'wallet_address': wallet_address,
                    'balance': '1.5 ETH',
                    'change': '+0.1 ETH',
                    'threshold_exceeded': True
                }
                
        # Register service
        hooks = self.integrator.create_wallet_divination_hooks()
        service = WalletDivinationService(hooks)
        
        self.integrator.register_service(
            'WalletDivinationService', service, 
            sigil_target='wallet-divination-01', 
            encryption_level='high'
        )
        
        return service
        
    async def setup_djinn_council_integration(self):
        """Example: Integrate DREDD with DjinnCouncilService"""
        
        # Mock DjinnCouncilService
        class DjinnCouncilService:
            def __init__(self, dredd_hooks):
                self.dredd_hooks = dredd_hooks
                
            @property
            def make_ruling(self):
                return self.dredd_hooks.governance_ruling_hook(self._make_ruling)
                
            async def _make_ruling(self, ruling_type: str, affected_entities: List[str]):
                # Mock governance ruling
                return {
                    'ruling_id': f'ruling_{int(time.time())}',
                    'ruling_type': ruling_type,
                    'affected_entities': affected_entities,
                    'consensus_level': 0.85
                }
                
        # Register service
        hooks = self.integrator.create_djinn_council_hooks()
        service = DjinnCouncilService(hooks)
        
        self.integrator.register_service(
            'DjinnCouncilService', service,
            sigil_target='djinn-council-01',
            encryption_level='critical'
        )
        
        return service

# Main execution for testing
async def main():
    """Test DREDD API hooks integration"""
    
    example = DREDDIntegrationExample()
    
    # Setup integrations
    wallet_service = await example.setup_wallet_divination_integration()
    council_service = await example.setup_djinn_council_integration()
    
    # Test wallet balance check
    print("🕳️ Testing WalletDivinationService integration...")
    result = await wallet_service.check_balance("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6")
    print(f"✅ Balance check result: {result}")
    
    # Test governance ruling
    print("\n🕳️ Testing DjinnCouncilService integration...")
    ruling = await council_service.make_ruling(
        "access_restriction", 
        ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"]
    )
    print(f"✅ Governance ruling: {ruling}")
    
    # Get service status
    status = example.integrator.get_service_status()
    print(f"\n📊 Service Status: {json.dumps(status, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main()) 