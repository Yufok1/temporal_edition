#!/usr/bin/env python3
"""
Auto-Provisioning Routine for MKP Guardian Lattice
Assigns protections based on wallet class, risk level, and portfolio characteristics
"""

import json
import time
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import logging

class WalletClass(Enum):
    WHALE = "whale"
    INSTITUTIONAL = "institutional"
    RETAIL = "retail"
    DEFI_PROTOCOL = "defi_protocol"
    EXCHANGE = "exchange"
    CUSTODIAL = "custodial"

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ProtectionTier(Enum):
    BASIC = "basic"
    ENHANCED = "enhanced"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

@dataclass
class ProtectionConfig:
    tier: ProtectionTier
    watch_guard_enabled: bool
    scan_frequency: str
    alert_thresholds: Dict[str, Any]
    security_features: List[str]
    intervention_hooks: Dict[str, bool]
    notification_channels: Dict[str, Any]
    compliance_requirements: List[str]
    audit_frequency: str
    insurance_coverage: Optional[float]

@dataclass
class AutoProvisioningResult:
    wallet_address: str
    wallet_class: WalletClass
    risk_level: RiskLevel
    assigned_tier: ProtectionTier
    protection_config: ProtectionConfig
    rationale: List[str]
    estimated_cost: float
    provisioning_timestamp: str
    echo_signature: str

class AutoProvisioningEngine:
    def __init__(self):
        self.logger = logging.getLogger('auto_provisioning')
        self.protection_templates = self._initialize_protection_templates()
        self.wallet_classifiers = self._initialize_wallet_classifiers()
        self.risk_assessors = self._initialize_risk_assessors()
        
    def _initialize_protection_templates(self) -> Dict[ProtectionTier, ProtectionConfig]:
        """Initialize protection tier templates"""
        return {
            ProtectionTier.BASIC: ProtectionConfig(
                tier=ProtectionTier.BASIC,
                watch_guard_enabled=True,
                scan_frequency="weekly",
                alert_thresholds={
                    "balance_change_percent": 50,
                    "inactivity_days": 30,
                    "entropy_threshold": 0.3,
                    "suspicious_transaction_amount": 10000
                },
                security_features=["basic_monitoring", "email_alerts"],
                intervention_hooks={
                    "auto_lock": False,
                    "notify_custodian": True,
                    "trigger_audit": False
                },
                notification_channels={
                    "email": True,
                    "webhook": False,
                    "slack": False,
                    "sms": False
                },
                compliance_requirements=["basic_kyc"],
                audit_frequency="quarterly",
                insurance_coverage=None
            ),
            
            ProtectionTier.ENHANCED: ProtectionConfig(
                tier=ProtectionTier.ENHANCED,
                watch_guard_enabled=True,
                scan_frequency="daily",
                alert_thresholds={
                    "balance_change_percent": 25,
                    "inactivity_days": 14,
                    "entropy_threshold": 0.5,
                    "suspicious_transaction_amount": 50000
                },
                security_features=[
                    "enhanced_monitoring", "email_alerts", "webhook_integration",
                    "transaction_analysis", "risk_scoring"
                ],
                intervention_hooks={
                    "auto_lock": False,
                    "notify_custodian": True,
                    "trigger_audit": True
                },
                notification_channels={
                    "email": True,
                    "webhook": True,
                    "slack": False,
                    "sms": False
                },
                compliance_requirements=["kyc", "aml_screening"],
                audit_frequency="monthly",
                insurance_coverage=100000
            ),
            
            ProtectionTier.PREMIUM: ProtectionConfig(
                tier=ProtectionTier.PREMIUM,
                watch_guard_enabled=True,
                scan_frequency="hourly",
                alert_thresholds={
                    "balance_change_percent": 10,
                    "inactivity_days": 7,
                    "entropy_threshold": 0.7,
                    "suspicious_transaction_amount": 100000
                },
                security_features=[
                    "premium_monitoring", "email_alerts", "webhook_integration",
                    "slack_notifications", "transaction_analysis", "risk_scoring",
                    "anomaly_detection", "behavioral_analysis", "multi_chain_monitoring"
                ],
                intervention_hooks={
                    "auto_lock": True,
                    "notify_custodian": True,
                    "trigger_audit": True,
                    "escalate_to_admin": True
                },
                notification_channels={
                    "email": True,
                    "webhook": True,
                    "slack": True,
                    "sms": True
                },
                compliance_requirements=["kyc", "aml_screening", "regulatory_reporting"],
                audit_frequency="weekly",
                insurance_coverage=1000000
            ),
            
            ProtectionTier.ENTERPRISE: ProtectionConfig(
                tier=ProtectionTier.ENTERPRISE,
                watch_guard_enabled=True,
                scan_frequency="real_time",
                alert_thresholds={
                    "balance_change_percent": 5,
                    "inactivity_days": 3,
                    "entropy_threshold": 0.8,
                    "suspicious_transaction_amount": 500000
                },
                security_features=[
                    "enterprise_monitoring", "email_alerts", "webhook_integration",
                    "slack_notifications", "sms_alerts", "transaction_analysis",
                    "risk_scoring", "anomaly_detection", "behavioral_analysis",
                    "multi_chain_monitoring", "ai_threat_detection", "custom_integrations",
                    "dedicated_support", "compliance_dashboard"
                ],
                intervention_hooks={
                    "auto_lock": True,
                    "notify_custodian": True,
                    "trigger_audit": True,
                    "escalate_to_admin": True,
                    "freeze_transactions": True,
                    "notify_regulatory": True
                },
                notification_channels={
                    "email": True,
                    "webhook": True,
                    "slack": True,
                    "sms": True,
                    "phone_call": True
                },
                compliance_requirements=["kyc", "aml_screening", "regulatory_reporting", "sox_compliance"],
                audit_frequency="daily",
                insurance_coverage=10000000
            )
        }
        
    def _initialize_wallet_classifiers(self) -> Dict[str, Any]:
        """Initialize wallet classification rules"""
        return {
            "balance_thresholds": {
                WalletClass.WHALE: 1000000,  # 1M+ USD
                WalletClass.INSTITUTIONAL: 100000,  # 100K+ USD
                WalletClass.RETAIL: 10000,  # 10K+ USD
                WalletClass.DEFI_PROTOCOL: 500000,  # 500K+ USD
                WalletClass.EXCHANGE: 1000000,  # 1M+ USD
                WalletClass.CUSTODIAL: 500000  # 500K+ USD
            },
            "activity_patterns": {
                WalletClass.WHALE: ["large_transactions", "infrequent_activity", "multi_chain"],
                WalletClass.INSTITUTIONAL: ["regular_activity", "compliance_focused", "multi_wallet"],
                WalletClass.RETAIL: ["frequent_small_transactions", "defi_usage", "single_chain"],
                WalletClass.DEFI_PROTOCOL: ["high_frequency", "contract_interactions", "liquidity_provision"],
                WalletClass.EXCHANGE: ["high_volume", "multi_asset", "hot_wallet_activity"],
                WalletClass.CUSTODIAL: ["low_activity", "large_balances", "professional_management"]
            },
            "security_requirements": {
                WalletClass.WHALE: ["hardware_wallet", "multisig", "cold_storage"],
                WalletClass.INSTITUTIONAL: ["multisig", "compliance_tools", "audit_trail"],
                WalletClass.RETAIL: ["basic_security", "2fa", "backup_procedures"],
                WalletClass.DEFI_PROTOCOL: ["smart_contract_security", "access_control", "upgrade_mechanisms"],
                WalletClass.EXCHANGE: ["hot_cold_separation", "multi_sig", "real_time_monitoring"],
                WalletClass.CUSTODIAL: ["professional_custody", "insurance", "regulatory_compliance"]
            }
        }
        
    def _initialize_risk_assessors(self) -> Dict[str, Any]:
        """Initialize risk assessment rules"""
        return {
            "risk_factors": {
                "high_balance": {"weight": 0.3, "threshold": 1000000},
                "low_entropy": {"weight": 0.25, "threshold": 0.3},
                "suspicious_activity": {"weight": 0.2, "threshold": 1},
                "dormant_wallet": {"weight": 0.15, "threshold": 180},
                "new_wallet": {"weight": 0.1, "threshold": 30}
            },
            "risk_levels": {
                RiskLevel.LOW: {"score_range": (0, 0.25), "tier": ProtectionTier.BASIC},
                RiskLevel.MEDIUM: {"score_range": (0.25, 0.5), "tier": ProtectionTier.ENHANCED},
                RiskLevel.HIGH: {"score_range": (0.5, 0.75), "tier": ProtectionTier.PREMIUM},
                RiskLevel.CRITICAL: {"score_range": (0.75, 1.0), "tier": ProtectionTier.ENTERPRISE}
            }
        }
        
    def classify_wallet(self, wallet_data: Dict[str, Any]) -> WalletClass:
        """Classify wallet based on characteristics"""
        balance = wallet_data.get('balance', 0)
        wallet_type = wallet_data.get('type', 'eoa')
        activity_pattern = wallet_data.get('activity_pattern', {})
        
        # Balance-based classification
        if balance >= self.wallet_classifiers["balance_thresholds"][WalletClass.WHALE]:
            if wallet_type == 'exchange':
                return WalletClass.EXCHANGE
            elif wallet_type == 'custodial':
                return WalletClass.CUSTODIAL
            else:
                return WalletClass.WHALE
        elif balance >= self.wallet_classifiers["balance_thresholds"][WalletClass.INSTITUTIONAL]:
            return WalletClass.INSTITUTIONAL
        elif balance >= self.wallet_classifiers["balance_thresholds"][WalletClass.RETAIL]:
            return WalletClass.RETAIL
            
        # Activity-based classification
        if 'defi_usage' in activity_pattern.get('tags', []):
            return WalletClass.DEFI_PROTOCOL
        elif wallet_type == 'custodial':
            return WalletClass.CUSTODIAL
        else:
            return WalletClass.RETAIL
            
    def assess_risk_level(self, wallet_data: Dict[str, Any], wallet_class: WalletClass) -> RiskLevel:
        """Assess risk level based on wallet characteristics"""
        risk_score = 0
        
        # Balance risk
        balance = wallet_data.get('balance', 0)
        if balance >= self.risk_assessors["risk_factors"]["high_balance"]["threshold"]:
            risk_score += self.risk_assessors["risk_factors"]["high_balance"]["weight"]
            
        # Entropy risk
        entropy_score = wallet_data.get('entropy_score', 0.5)
        if entropy_score <= self.risk_assessors["risk_factors"]["low_entropy"]["threshold"]:
            risk_score += self.risk_assessors["risk_factors"]["low_entropy"]["weight"]
            
        # Suspicious activity risk
        suspicious_patterns = wallet_data.get('suspicious_patterns', [])
        if len(suspicious_patterns) >= self.risk_assessors["risk_factors"]["suspicious_activity"]["threshold"]:
            risk_score += self.risk_assessors["risk_factors"]["suspicious_activity"]["weight"]
            
        # Dormant wallet risk
        last_activity_days = wallet_data.get('last_activity_days', 0)
        if last_activity_days >= self.risk_assessors["risk_factors"]["dormant_wallet"]["threshold"]:
            risk_score += self.risk_assessors["risk_factors"]["dormant_wallet"]["weight"]
            
        # New wallet risk
        wallet_age_days = wallet_data.get('wallet_age_days', 365)
        if wallet_age_days <= self.risk_assessors["risk_factors"]["new_wallet"]["threshold"]:
            risk_score += self.risk_assessors["risk_factors"]["new_wallet"]["weight"]
            
        # Determine risk level
        for risk_level, config in self.risk_assessors["risk_levels"].items():
            if config["score_range"][0] <= risk_score < config["score_range"][1]:
                return risk_level
                
        return RiskLevel.CRITICAL  # Default to critical if score is 1.0
        
    def assign_protection_tier(self, wallet_class: WalletClass, risk_level: RiskLevel) -> ProtectionTier:
        """Assign protection tier based on wallet class and risk level"""
        # Base tier from risk level
        base_tier = self.risk_assessors["risk_levels"][risk_level]["tier"]
        
        # Upgrade tier based on wallet class
        if wallet_class == WalletClass.WHALE:
            if base_tier == ProtectionTier.BASIC:
                return ProtectionTier.PREMIUM
            elif base_tier == ProtectionTier.ENHANCED:
                return ProtectionTier.PREMIUM
            else:
                return ProtectionTier.ENTERPRISE
        elif wallet_class == WalletClass.INSTITUTIONAL:
            if base_tier == ProtectionTier.BASIC:
                return ProtectionTier.ENHANCED
            else:
                return base_tier
        elif wallet_class == WalletClass.EXCHANGE:
            return ProtectionTier.ENTERPRISE
        elif wallet_class == WalletClass.CUSTODIAL:
            return ProtectionTier.PREMIUM
        else:
            return base_tier
            
    def customize_protection_config(self, base_config: ProtectionConfig, 
                                  wallet_class: WalletClass, 
                                  wallet_data: Dict[str, Any]) -> ProtectionConfig:
        """Customize protection configuration based on wallet characteristics"""
        # Create a copy of the base config
        config_dict = asdict(base_config)
        
        # Customize based on wallet class
        if wallet_class == WalletClass.WHALE:
            config_dict["alert_thresholds"]["balance_change_percent"] = 5
            config_dict["alert_thresholds"]["inactivity_days"] = 3
            config_dict["security_features"].extend(["whale_specific_monitoring", "dedicated_support"])
            
        elif wallet_class == WalletClass.INSTITUTIONAL:
            config_dict["compliance_requirements"].extend(["institutional_kyc", "regulatory_reporting"])
            config_dict["security_features"].extend(["compliance_dashboard", "audit_trail"])
            
        elif wallet_class == WalletClass.DEFI_PROTOCOL:
            config_dict["scan_frequency"] = "real_time"
            config_dict["alert_thresholds"]["suspicious_transaction_amount"] = 250000
            config_dict["security_features"].extend(["smart_contract_monitoring", "liquidity_analysis"])
            
        elif wallet_class == WalletClass.EXCHANGE:
            config_dict["scan_frequency"] = "real_time"
            config_dict["alert_thresholds"]["balance_change_percent"] = 2
            config_dict["security_features"].extend(["exchange_specific_monitoring", "hot_cold_separation"])
            
        # Customize based on wallet type
        wallet_type = wallet_data.get('type', 'eoa')
        if wallet_type == 'multisig':
            config_dict["security_features"].extend(["multisig_monitoring", "signature_analysis"])
        elif wallet_type == 'smart-wallet':
            config_dict["security_features"].extend(["smart_wallet_monitoring", "upgrade_tracking"])
            
        # Customize based on balance
        balance = wallet_data.get('balance', 0)
        if balance > 10000000:  # 10M+ USD
            config_dict["insurance_coverage"] = 50000000
            config_dict["intervention_hooks"]["freeze_transactions"] = True
            
        return ProtectionConfig(**config_dict)
        
    def generate_rationale(self, wallet_class: WalletClass, risk_level: RiskLevel, 
                          wallet_data: Dict[str, Any], assigned_tier: ProtectionTier) -> List[str]:
        """Generate rationale for protection tier assignment"""
        rationale = []
        
        # Wallet class rationale
        rationale.append(f"Wallet classified as {wallet_class.value} based on balance and activity patterns")
        
        # Risk level rationale
        risk_factors = []
        if wallet_data.get('balance', 0) > 1000000:
            risk_factors.append("high balance")
        if wallet_data.get('entropy_score', 0.5) < 0.3:
            risk_factors.append("low entropy")
        if wallet_data.get('suspicious_patterns'):
            risk_factors.append("suspicious activity")
            
        if risk_factors:
            rationale.append(f"Risk level {risk_level.value} due to: {', '.join(risk_factors)}")
            
        # Tier assignment rationale
        rationale.append(f"Assigned {assigned_tier.value} protection tier for optimal security coverage")
        
        # Specific features rationale
        if assigned_tier in [ProtectionTier.PREMIUM, ProtectionTier.ENTERPRISE]:
            rationale.append("Enhanced monitoring and real-time alerts enabled")
        if assigned_tier == ProtectionTier.ENTERPRISE:
            rationale.append("Enterprise-grade security with dedicated support")
            
        return rationale
        
    def estimate_cost(self, protection_tier: ProtectionTier, wallet_data: Dict[str, Any]) -> float:
        """Estimate monthly cost for protection tier"""
        base_costs = {
            ProtectionTier.BASIC: 50,
            ProtectionTier.ENHANCED: 200,
            ProtectionTier.PREMIUM: 500,
            ProtectionTier.ENTERPRISE: 2000
        }
        
        base_cost = base_costs[protection_tier]
        
        # Adjust based on balance
        balance = wallet_data.get('balance', 0)
        if balance > 10000000:  # 10M+ USD
            base_cost *= 2
        elif balance > 1000000:  # 1M+ USD
            base_cost *= 1.5
            
        # Adjust based on wallet type
        wallet_type = wallet_data.get('type', 'eoa')
        if wallet_type == 'multisig':
            base_cost *= 1.2
        elif wallet_type == 'smart-wallet':
            base_cost *= 1.1
            
        return base_cost
        
    def auto_provision_wallet(self, wallet_data: Dict[str, Any]) -> AutoProvisioningResult:
        """Auto-provision protection for a single wallet"""
        wallet_address = wallet_data['address']
        
        self.logger.info(f"Auto-provisioning wallet: {wallet_address}")
        
        # Classify wallet
        wallet_class = self.classify_wallet(wallet_data)
        
        # Assess risk level
        risk_level = self.assess_risk_level(wallet_data, wallet_class)
        
        # Assign protection tier
        assigned_tier = self.assign_protection_tier(wallet_class, risk_level)
        
        # Get base protection config
        base_config = self.protection_templates[assigned_tier]
        
        # Customize protection config
        protection_config = self.customize_protection_config(base_config, wallet_class, wallet_data)
        
        # Generate rationale
        rationale = self.generate_rationale(wallet_class, risk_level, wallet_data, assigned_tier)
        
        # Estimate cost
        estimated_cost = self.estimate_cost(assigned_tier, wallet_data)
        
        # Generate echo signature
        echo_signature = self.generate_echo_signature(wallet_address, wallet_class.value, risk_level.value, assigned_tier.value)
        
        result = AutoProvisioningResult(
            wallet_address=wallet_address,
            wallet_class=wallet_class,
            risk_level=risk_level,
            assigned_tier=assigned_tier,
            protection_config=protection_config,
            rationale=rationale,
            estimated_cost=estimated_cost,
            provisioning_timestamp=datetime.now().isoformat(),
            echo_signature=echo_signature
        )
        
        self.logger.info(f"Auto-provisioned {wallet_address} with {assigned_tier.value} protection")
        
        return result
        
    def auto_provision_portfolio(self, portfolio_data: Dict[str, Any]) -> List[AutoProvisioningResult]:
        """Auto-provision protection for entire portfolio"""
        portfolio_id = portfolio_data['id']
        wallets = portfolio_data['wallets']
        
        self.logger.info(f"Auto-provisioning portfolio: {portfolio_id} with {len(wallets)} wallets")
        
        results = []
        
        for wallet in wallets:
            try:
                result = self.auto_provision_wallet(wallet)
                results.append(result)
            except Exception as e:
                self.logger.error(f"Failed to auto-provision wallet {wallet.get('address', 'unknown')}: {e}")
                
        # Generate portfolio summary
        tier_distribution = {}
        total_cost = 0
        
        for result in results:
            tier = result.assigned_tier.value
            tier_distribution[tier] = tier_distribution.get(tier, 0) + 1
            total_cost += result.estimated_cost
            
        portfolio_summary = {
            'portfolio_id': portfolio_id,
            'total_wallets': len(results),
            'tier_distribution': tier_distribution,
            'total_monthly_cost': total_cost,
            'provisioning_timestamp': datetime.now().isoformat()
        }
        
        self.logger.info(f"Portfolio {portfolio_id} auto-provisioned: {tier_distribution}, Total cost: ${total_cost:.2f}/month")
        
        return results
        
    def generate_echo_signature(self, wallet_address: str, wallet_class: str, 
                              risk_level: str, protection_tier: str) -> str:
        """Generate echo signature for provisioning result"""
        data = f"{wallet_address}:{wallet_class}:{risk_level}:{protection_tier}:{datetime.now().isoformat()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]

def main():
    """Example usage of the auto-provisioning engine"""
    # Example wallet data
    wallet_data = {
        'address': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        'type': 'eoa',
        'chain': 'ethereum',
        'balance': 2500000,  # 2.5M USD
        'entropy_score': 0.4,
        'last_activity_days': 5,
        'wallet_age_days': 180,
        'suspicious_patterns': ['large_withdrawal'],
        'activity_pattern': {
            'tags': ['trading', 'defi'],
            'frequency': 'daily'
        }
    }
    
    # Example portfolio data
    portfolio_data = {
        'id': 'portfolio_whale_alpha_001',
        'wallets': [
            {
                'address': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                'type': 'eoa',
                'chain': 'ethereum',
                'balance': 2500000,
                'entropy_score': 0.4,
                'last_activity_days': 5,
                'wallet_age_days': 180,
                'suspicious_patterns': ['large_withdrawal'],
                'activity_pattern': {'tags': ['trading', 'defi']}
            },
            {
                'address': '0x8ba1f109551bD432803012645Hac136c772c3e3',
                'type': 'smart-wallet',
                'chain': 'ethereum',
                'balance': 5000000,
                'entropy_score': 0.8,
                'last_activity_days': 1,
                'wallet_age_days': 365,
                'suspicious_patterns': [],
                'activity_pattern': {'tags': ['treasury', 'multisig']}
            },
            {
                'address': '0x1234567890123456789012345678901234567890',
                'type': 'eoa',
                'chain': 'polygon',
                'balance': 50000,
                'entropy_score': 0.6,
                'last_activity_days': 30,
                'wallet_age_days': 90,
                'suspicious_patterns': [],
                'activity_pattern': {'tags': ['retail', 'defi']}
            }
        ]
    }
    
    engine = AutoProvisioningEngine()
    
    print("=== Auto-Provisioning Engine Demo ===")
    
    # Auto-provision single wallet
    print("\n--- Auto-Provisioning Single Wallet ---")
    result = engine.auto_provision_wallet(wallet_data)
    print(f"Wallet: {result.wallet_address}")
    print(f"Class: {result.wallet_class.value}")
    print(f"Risk Level: {result.risk_level.value}")
    print(f"Protection Tier: {result.assigned_tier.value}")
    print(f"Monthly Cost: ${result.estimated_cost:.2f}")
    print(f"Rationale: {result.rationale}")
    print(f"Echo Signature: {result.echo_signature}")
    
    # Auto-provision portfolio
    print(f"\n--- Auto-Provisioning Portfolio: {portfolio_data['id']} ---")
    portfolio_results = engine.auto_provision_portfolio(portfolio_data)
    
    tier_distribution = {}
    total_cost = 0
    
    for result in portfolio_results:
        tier = result.assigned_tier.value
        tier_distribution[tier] = tier_distribution.get(tier, 0) + 1
        total_cost += result.estimated_cost
        
    print(f"Tier Distribution: {tier_distribution}")
    print(f"Total Monthly Cost: ${total_cost:.2f}")
    
    # Save results
    with open('auto_provisioning_results.json', 'w') as f:
        json.dump({
            'single_wallet_result': asdict(result),
            'portfolio_results': [asdict(r) for r in portfolio_results],
            'portfolio_summary': {
                'tier_distribution': tier_distribution,
                'total_monthly_cost': total_cost,
                'total_wallets': len(portfolio_results)
            },
            'provisioning_metadata': {
                'engine_version': '2.0.0',
                'provisioning_timestamp': datetime.now().isoformat(),
                'total_wallets_processed': len(portfolio_results) + 1
            }
        }, f, indent=2)
        
    print(f"\nResults saved to auto_provisioning_results.json")

if __name__ == "__main__":
    main() 