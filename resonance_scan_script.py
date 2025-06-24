#!/usr/bin/env python3
"""
Resonance Scan Script for MKP Guardian Lattice
Consumes multiple wallets and emits security grading with comprehensive risk assessment
"""

import json
import time
import hashlib
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import aiohttp
import logging

@dataclass
class WalletScanResult:
    address: str
    chain: str
    wallet_type: str
    security_grade: str
    risk_score: float
    entropy_score: float
    activity_score: float
    balance_score: float
    risk_factors: List[str]
    recommendations: List[str]
    last_activity: str
    transaction_count: int
    suspicious_patterns: List[str]
    security_features: List[str]
    scan_timestamp: str

@dataclass
class PortfolioScanResult:
    portfolio_id: str
    scan_timestamp: str
    total_wallets: int
    overall_grade: str
    average_risk_score: float
    high_risk_wallets: List[str]
    dormant_wallets: List[str]
    suspicious_activity: List[str]
    security_recommendations: List[str]
    watch_guard_alerts: List[Dict[str, Any]]
    echo_signature: str

class ResonanceScanner:
    def __init__(self, rpc_urls: Dict[str, str] = None):
        self.rpc_urls = rpc_urls or {
            'ethereum': 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
            'polygon': 'https://polygon-rpc.com',
            'arbitrum': 'https://arb1.arbitrum.io/rpc',
            'optimism': 'https://mainnet.optimism.io'
        }
        self.session = None
        self.logger = logging.getLogger('resonance_scanner')
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
            
    async def scan_wallet(self, wallet_data: Dict[str, Any]) -> WalletScanResult:
        """Scan a single wallet for security assessment"""
        address = wallet_data['address']
        chain = wallet_data['chain']
        wallet_type = wallet_data['type']
        
        self.logger.info(f"Scanning wallet: {address} on {chain}")
        
        # Gather wallet data
        balance = await self.get_wallet_balance(address, chain)
        transactions = await self.get_recent_transactions(address, chain)
        activity_pattern = await self.analyze_activity_pattern(transactions)
        entropy_score = self.calculate_entropy_score(transactions, wallet_data)
        security_features = await self.detect_security_features(address, chain, wallet_type)
        suspicious_patterns = self.detect_suspicious_patterns(transactions, wallet_data)
        
        # Calculate risk factors
        risk_factors = []
        if entropy_score < 0.3:
            risk_factors.append('low_entropy')
        if activity_pattern['last_activity_days'] > 180:
            risk_factors.append('dormant_wallet')
        if len(suspicious_patterns) > 0:
            risk_factors.append('suspicious_activity')
        if balance > 1000000:  # High value wallet
            risk_factors.append('high_value_target')
        if wallet_type == 'eoa' and balance > 100000:
            risk_factors.append('large_eoa_balance')
            
        # Calculate scores
        activity_score = max(0, 1 - (activity_pattern['last_activity_days'] / 365))
        balance_score = min(1, balance / 1000000)  # Normalize to 1M USD
        security_score = len(security_features) / 10  # Normalize to 10 features
        
        # Overall risk score (0-1, higher = more risky)
        risk_score = (
            (1 - entropy_score) * 0.4 +
            (1 - activity_score) * 0.2 +
            (1 - security_score) * 0.2 +
            balance_score * 0.2
        )
        
        # Determine security grade
        if risk_score < 0.2:
            grade = 'A'
        elif risk_score < 0.4:
            grade = 'B'
        elif risk_score < 0.6:
            grade = 'C'
        elif risk_score < 0.8:
            grade = 'D'
        else:
            grade = 'F'
            
        # Generate recommendations
        recommendations = self.generate_wallet_recommendations(
            grade, risk_factors, wallet_type, balance, security_features
        )
        
        return WalletScanResult(
            address=address,
            chain=chain,
            wallet_type=wallet_type,
            security_grade=grade,
            risk_score=risk_score,
            entropy_score=entropy_score,
            activity_score=activity_score,
            balance_score=balance_score,
            risk_factors=risk_factors,
            recommendations=recommendations,
            last_activity=activity_pattern['last_activity'],
            transaction_count=len(transactions),
            suspicious_patterns=suspicious_patterns,
            security_features=security_features,
            scan_timestamp=datetime.now().isoformat()
        )
        
    async def scan_portfolio(self, portfolio_data: Dict[str, Any]) -> PortfolioScanResult:
        """Scan entire portfolio for comprehensive security assessment"""
        portfolio_id = portfolio_data['id']
        wallets = portfolio_data['wallets']
        
        self.logger.info(f"Scanning portfolio: {portfolio_id} with {len(wallets)} wallets")
        
        # Scan all wallets concurrently
        scan_tasks = [self.scan_wallet(wallet) for wallet in wallets]
        wallet_results = await asyncio.gather(*scan_tasks, return_exceptions=True)
        
        # Filter out failed scans
        valid_results = [r for r in wallet_results if isinstance(r, WalletScanResult)]
        failed_scans = len(wallet_results) - len(valid_results)
        
        if failed_scans > 0:
            self.logger.warning(f"Failed to scan {failed_scans} wallets in portfolio {portfolio_id}")
            
        # Analyze portfolio-level patterns
        high_risk_wallets = [r.address for r in valid_results if r.security_grade in ['D', 'F']]
        dormant_wallets = [r.address for r in valid_results if 'dormant_wallet' in r.risk_factors]
        suspicious_activity = []
        
        for result in valid_results:
            if result.suspicious_patterns:
                suspicious_activity.append(f"{result.address}: {', '.join(result.suspicious_patterns)}")
                
        # Calculate portfolio metrics
        average_risk_score = sum(r.risk_score for r in valid_results) / len(valid_results) if valid_results else 0
        grade_distribution = {}
        for result in valid_results:
            grade_distribution[result.security_grade] = grade_distribution.get(result.security_grade, 0) + 1
            
        # Determine overall portfolio grade
        if len(high_risk_wallets) == 0:
            overall_grade = 'A'
        elif len(high_risk_wallets) <= len(valid_results) * 0.1:  # Less than 10% high risk
            overall_grade = 'B'
        elif len(high_risk_wallets) <= len(valid_results) * 0.25:  # Less than 25% high risk
            overall_grade = 'C'
        elif len(high_risk_wallets) <= len(valid_results) * 0.5:  # Less than 50% high risk
            overall_grade = 'D'
        else:
            overall_grade = 'F'
            
        # Generate portfolio recommendations
        security_recommendations = self.generate_portfolio_recommendations(
            portfolio_data, valid_results, high_risk_wallets, dormant_wallets
        )
        
        # Generate Watch Guard alerts
        watch_guard_alerts = self.generate_watch_guard_alerts(
            portfolio_data, valid_results, high_risk_wallets, dormant_wallets, suspicious_activity
        )
        
        # Generate echo signature
        echo_signature = self.generate_echo_signature(portfolio_id, len(valid_results), overall_grade)
        
        return PortfolioScanResult(
            portfolio_id=portfolio_id,
            scan_timestamp=datetime.now().isoformat(),
            total_wallets=len(valid_results),
            overall_grade=overall_grade,
            average_risk_score=average_risk_score,
            high_risk_wallets=high_risk_wallets,
            dormant_wallets=dormant_wallets,
            suspicious_activity=suspicious_activity,
            security_recommendations=security_recommendations,
            watch_guard_alerts=watch_guard_alerts,
            echo_signature=echo_signature
        )
        
    async def get_wallet_balance(self, address: str, chain: str) -> float:
        """Get wallet balance in USD equivalent"""
        try:
            # This would integrate with actual blockchain APIs
            # For now, return mock data
            return 50000 + (hash(address) % 1000000)  # Mock balance between 50K and 1M
        except Exception as e:
            self.logger.error(f"Failed to get balance for {address}: {e}")
            return 0
            
    async def get_recent_transactions(self, address: str, chain: str) -> List[Dict[str, Any]]:
        """Get recent transactions for the wallet"""
        try:
            # This would integrate with actual blockchain APIs
            # For now, return mock transaction data
            tx_count = hash(address) % 100 + 10  # Mock transaction count
            transactions = []
            
            for i in range(tx_count):
                transactions.append({
                    'hash': f"0x{hash(f'{address}_{i}') % 1000000000000000000000000000000000000000000000000000000000000000:064x}",
                    'timestamp': (datetime.now() - timedelta(days=i*3)).isoformat(),
                    'value': 1000 + (hash(f'{address}_{i}') % 10000),
                    'type': 'transfer' if i % 2 == 0 else 'contract_interaction'
                })
                
            return transactions
        except Exception as e:
            self.logger.error(f"Failed to get transactions for {address}: {e}")
            return []
            
    async def analyze_activity_pattern(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze wallet activity patterns"""
        if not transactions:
            return {
                'last_activity_days': 365,
                'last_activity': (datetime.now() - timedelta(days=365)).isoformat(),
                'activity_frequency': 'none',
                'transaction_types': []
            }
            
        # Sort by timestamp
        sorted_txs = sorted(transactions, key=lambda x: x['timestamp'], reverse=True)
        last_activity = datetime.fromisoformat(sorted_txs[0]['timestamp'].replace('Z', '+00:00'))
        last_activity_days = (datetime.now(last_activity.tzinfo) - last_activity).days
        
        # Analyze frequency
        if last_activity_days <= 1:
            activity_frequency = 'daily'
        elif last_activity_days <= 7:
            activity_frequency = 'weekly'
        elif last_activity_days <= 30:
            activity_frequency = 'monthly'
        else:
            activity_frequency = 'rare'
            
        # Transaction types
        transaction_types = list(set(tx['type'] for tx in transactions))
        
        return {
            'last_activity_days': last_activity_days,
            'last_activity': sorted_txs[0]['timestamp'],
            'activity_frequency': activity_frequency,
            'transaction_types': transaction_types
        }
        
    def calculate_entropy_score(self, transactions: List[Dict[str, Any]], wallet_data: Dict[str, Any]) -> float:
        """Calculate entropy score based on transaction patterns and wallet metadata"""
        if not transactions:
            return 0.1  # Very low entropy for inactive wallets
            
        # Analyze transaction patterns
        values = [tx['value'] for tx in transactions]
        unique_values = len(set(values))
        total_transactions = len(transactions)
        
        # Value diversity score
        value_diversity = unique_values / total_transactions if total_transactions > 0 else 0
        
        # Time pattern analysis
        timestamps = [datetime.fromisoformat(tx['timestamp'].replace('Z', '+00:00')) for tx in transactions]
        time_intervals = []
        for i in range(1, len(timestamps)):
            interval = (timestamps[i-1] - timestamps[i]).total_seconds()
            time_intervals.append(interval)
            
        # Time pattern entropy
        if time_intervals:
            avg_interval = sum(time_intervals) / len(time_intervals)
            interval_variance = sum((i - avg_interval) ** 2 for i in time_intervals) / len(time_intervals)
            time_entropy = min(1, interval_variance / (avg_interval ** 2)) if avg_interval > 0 else 0
        else:
            time_entropy = 0
            
        # Wallet type entropy
        wallet_type_entropy = {
            'eoa': 0.8,
            'smart-wallet': 0.6,
            'multisig': 0.4,
            'custodial': 0.2
        }.get(wallet_data['type'], 0.5)
        
        # Combine entropy factors
        entropy_score = (
            value_diversity * 0.3 +
            time_entropy * 0.3 +
            wallet_type_entropy * 0.4
        )
        
        return min(1, max(0, entropy_score))
        
    async def detect_security_features(self, address: str, chain: str, wallet_type: str) -> List[str]:
        """Detect security features for the wallet"""
        features = []
        
        # Basic features based on wallet type
        if wallet_type == 'smart-wallet':
            features.extend(['smart_contract', 'upgradeable', 'access_control'])
        elif wallet_type == 'multisig':
            features.extend(['multi_signature', 'threshold_approval'])
        elif wallet_type == 'custodial':
            features.extend(['custodial_protection', 'insurance_coverage'])
            
        # Mock additional features based on address hash
        address_hash = hash(address)
        if address_hash % 3 == 0:
            features.append('hardware_wallet')
        if address_hash % 5 == 0:
            features.append('2fa_enabled')
        if address_hash % 7 == 0:
            features.append('whitelist_enabled')
        if address_hash % 11 == 0:
            features.append('rate_limiting')
            
        return features
        
    def detect_suspicious_patterns(self, transactions: List[Dict[str, Any]], wallet_data: Dict[str, Any]) -> List[str]:
        """Detect suspicious activity patterns"""
        patterns = []
        
        if not transactions:
            return patterns
            
        # Large transaction patterns
        large_txs = [tx for tx in transactions if tx['value'] > 100000]
        if len(large_txs) > len(transactions) * 0.5:
            patterns.append('frequent_large_transactions')
            
        # Unusual activity timing
        if len(transactions) > 50:  # High activity
            patterns.append('high_frequency_trading')
            
        # Contract interaction patterns
        contract_txs = [tx for tx in transactions if tx['type'] == 'contract_interaction']
        if len(contract_txs) > len(transactions) * 0.8:
            patterns.append('heavy_contract_usage')
            
        # New wallet with high activity
        if len(transactions) > 20 and wallet_data.get('metadata', {}).get('risk_level') == 'high':
            patterns.append('new_high_risk_wallet')
            
        return patterns
        
    def generate_wallet_recommendations(self, grade: str, risk_factors: List[str], 
                                      wallet_type: str, balance: float, 
                                      security_features: List[str]) -> List[str]:
        """Generate security recommendations for a wallet"""
        recommendations = []
        
        if grade in ['D', 'F']:
            recommendations.append('Immediate security review required')
            recommendations.append('Consider upgrading to hardware wallet')
            
        if 'low_entropy' in risk_factors:
            recommendations.append('Implement entropy enhancement measures')
            recommendations.append('Use hardware random number generators')
            
        if 'dormant_wallet' in risk_factors:
            recommendations.append('Review dormant wallet security')
            recommendations.append('Consider consolidation or reactivation')
            
        if 'suspicious_activity' in risk_factors:
            recommendations.append('Investigate suspicious activity patterns')
            recommendations.append('Implement transaction monitoring')
            
        if balance > 100000 and wallet_type == 'eoa':
            recommendations.append('Consider upgrading to smart wallet or multisig')
            recommendations.append('Implement additional security layers')
            
        if 'hardware_wallet' not in security_features and balance > 50000:
            recommendations.append('Upgrade to hardware wallet for enhanced security')
            
        if len(security_features) < 3:
            recommendations.append('Implement additional security features')
            
        return recommendations
        
    def generate_portfolio_recommendations(self, portfolio_data: Dict[str, Any], 
                                         wallet_results: List[WalletScanResult],
                                         high_risk_wallets: List[str],
                                         dormant_wallets: List[str]) -> List[str]:
        """Generate portfolio-level security recommendations"""
        recommendations = []
        
        if high_risk_wallets:
            recommendations.append(f'Review {len(high_risk_wallets)} high-risk wallets')
            recommendations.append('Implement enhanced monitoring for high-risk addresses')
            
        if dormant_wallets:
            recommendations.append(f'Monitor {len(dormant_wallets)} dormant wallets')
            recommendations.append('Consider reactivation or consolidation of dormant assets')
            
        # Portfolio diversification
        total_wallets = len(wallet_results)
        if total_wallets < 3:
            recommendations.append('Consider portfolio diversification across multiple wallets')
            
        # Risk management
        risk_profile = portfolio_data.get('risk_profile', {})
        if risk_profile.get('overall_risk') == 'critical':
            recommendations.append('Implement critical risk management procedures')
            recommendations.append('Consider portfolio restructuring')
            
        # Custody recommendations
        if portfolio_data.get('custodian', {}).get('type') == 'self_custody':
            recommendations.append('Consider professional custody services for large portfolios')
            
        return recommendations
        
    def generate_watch_guard_alerts(self, portfolio_data: Dict[str, Any],
                                  wallet_results: List[WalletScanResult],
                                  high_risk_wallets: List[str],
                                  dormant_wallets: List[str],
                                  suspicious_activity: List[str]) -> List[Dict[str, Any]]:
        """Generate Watch Guard alerts based on scan results"""
        alerts = []
        
        # High risk wallet alerts
        for wallet in high_risk_wallets:
            alerts.append({
                'alert_id': f"high_risk_{wallet[:8]}",
                'type': 'high_risk_wallet',
                'severity': 'high',
                'wallet_address': wallet,
                'description': f'High-risk wallet detected: {wallet}',
                'recommended_action': 'immediate_review',
                'timestamp': datetime.now().isoformat()
            })
            
        # Dormant wallet alerts
        for wallet in dormant_wallets:
            alerts.append({
                'alert_id': f"dormant_{wallet[:8]}",
                'type': 'dormant_wallet',
                'severity': 'medium',
                'wallet_address': wallet,
                'description': f'Dormant wallet detected: {wallet}',
                'recommended_action': 'monitor_activity',
                'timestamp': datetime.now().isoformat()
            })
            
        # Suspicious activity alerts
        for activity in suspicious_activity:
            alerts.append({
                'alert_id': f"suspicious_{hash(activity) % 1000000}",
                'type': 'suspicious_activity',
                'severity': 'high',
                'description': f'Suspicious activity detected: {activity}',
                'recommended_action': 'investigate',
                'timestamp': datetime.now().isoformat()
            })
            
        return alerts
        
    def generate_echo_signature(self, portfolio_id: str, wallet_count: int, overall_grade: str) -> str:
        """Generate echo signature for the scan result"""
        data = f"{portfolio_id}:{wallet_count}:{overall_grade}:{datetime.now().isoformat()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]

async def main():
    """Example usage of the resonance scanner"""
    # Example portfolio data
    portfolio_data = {
        'id': 'portfolio_whale_alpha_001',
        'name': 'Whale Alpha Portfolio',
        'wallets': [
            {
                'address': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                'type': 'eoa',
                'chain': 'ethereum',
                'metadata': {'risk_level': 'high'}
            },
            {
                'address': '0x8ba1f109551bD432803012645Hac136c772c3e3',
                'type': 'smart-wallet',
                'chain': 'ethereum',
                'metadata': {'risk_level': 'critical'}
            },
            {
                'address': '0x1234567890123456789012345678901234567890',
                'type': 'eoa',
                'chain': 'polygon',
                'metadata': {'risk_level': 'medium'}
            }
        ]
    }
    
    async with ResonanceScanner() as scanner:
        print("=== Resonance Scanner Demo ===")
        
        # Scan individual wallet
        print("\n--- Scanning Individual Wallet ---")
        wallet_result = await scanner.scan_wallet(portfolio_data['wallets'][0])
        print(f"Wallet: {wallet_result.address}")
        print(f"Grade: {wallet_result.security_grade}")
        print(f"Risk Score: {wallet_result.risk_score:.3f}")
        print(f"Risk Factors: {wallet_result.risk_factors}")
        print(f"Recommendations: {wallet_result.recommendations[:2]}")  # Show first 2
        
        # Scan entire portfolio
        print(f"\n--- Scanning Portfolio: {portfolio_data['id']} ---")
        portfolio_result = await scanner.scan_portfolio(portfolio_data)
        print(f"Overall Grade: {portfolio_result.overall_grade}")
        print(f"Total Wallets: {portfolio_result.total_wallets}")
        print(f"High Risk Wallets: {len(portfolio_result.high_risk_wallets)}")
        print(f"Dormant Wallets: {len(portfolio_result.dormant_wallets)}")
        print(f"Watch Guard Alerts: {len(portfolio_result.watch_guard_alerts)}")
        print(f"Echo Signature: {portfolio_result.echo_signature}")
        
        # Save results
        with open('resonance_scan_results.json', 'w') as f:
            json.dump({
                'portfolio_scan': asdict(portfolio_result),
                'individual_wallet': asdict(wallet_result),
                'scan_metadata': {
                    'scanner_version': '2.0.0',
                    'scan_timestamp': datetime.now().isoformat(),
                    'total_wallets_scanned': portfolio_result.total_wallets
                }
            }, f, indent=2)
            
        print(f"\nResults saved to resonance_scan_results.json")

if __name__ == "__main__":
    asyncio.run(main()) 