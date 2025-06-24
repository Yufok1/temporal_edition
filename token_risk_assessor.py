#!/usr/bin/env python3
"""
Token Risk Assessor - Sovereign Risk Analysis Engine
"Let the Djinn see clearly through the veil of deception."
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any

class TokenRiskAssessor:
    def __init__(self):
        self.risk_weights = {
            "unverified_contract": 25,
            "no_audit_badge": 20,
            "low_holder_diversity": 15,
            "suspicious_name": 10,
            "suspicious_symbol": 10,
            "very_low_holders": 20,
            "high_concentration": 15,
            "recent_creation": 5,
            "no_liquidity": 10
        }
        
        self.suspicious_patterns = {
            "names": [
                r"moon", r"safe", r"inu", r"elon", r"doge", r"shib", r"pepe",
                r"rocket", r"lambo", r"moon", r"safe", r"inu", r"elon", r"doge",
                r"shib", r"pepe", r"rocket", r"lambo", r"moon", r"safe", r"inu",
                r"elon", r"doge", r"shib", r"pepe", r"rocket", r"lambo"
            ],
            "symbols": [
                r"MOON", r"SAFE", r"INU", r"ELON", r"DOGE", r"SHIB", r"PEPE",
                r"ROCKET", r"LAMBO", r"MOON", r"SAFE", r"INU", r"ELON", r"DOGE",
                r"SHIB", r"PEPE", r"ROCKET", r"LAMBO"
            ]
        }
        
        self.alignment_thresholds = {
            "aligned": 80,
            "warning": 60,
            "misaligned": 40
        }

    def assess_token_risk(self, explorer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assess the risk profile of a token based on explorer data.
        
        Args:
            explorer_data: JSON output from explorer_sync_bridge.py
            
        Returns:
            Dict containing risk assessment, resonance score, and sovereign alignment
        """
        assessment = {
            "timestamp": datetime.now().isoformat(),
            "contract_address": explorer_data.get("contract"),
            "token_info": {
                "name": explorer_data.get("name"),
                "symbol": explorer_data.get("symbol"),
                "verified": explorer_data.get("verified", False),
                "audit_badge": explorer_data.get("audit_badge", False),
                "holders": explorer_data.get("holders")
            },
            "risk_analysis": {
                "resonance_score": 0,
                "risk_flags": [],
                "risk_level": "unknown",
                "sovereign_alignment": "unknown",
                "anomaly_score": 0,
                "confidence": 0.0
            },
            "detailed_flags": {
                "contract_verification": {},
                "audit_status": {},
                "holder_analysis": {},
                "naming_analysis": {},
                "behavioral_analysis": {}
            },
            "recommendations": [],
            "watchguard_alerts": []
        }
        
        # Calculate base resonance score (starts at 100, deducts for risks)
        resonance_score = 100
        risk_flags = []
        anomaly_score = 0
        
        # 1. Contract Verification Analysis
        if not explorer_data.get("verified", False):
            resonance_score -= self.risk_weights["unverified_contract"]
            risk_flags.append("unverified_contract")
            anomaly_score += 25
            assessment["detailed_flags"]["contract_verification"] = {
                "status": "unverified",
                "risk_level": "high",
                "description": "Contract source code is not verified on Etherscan"
            }
            assessment["watchguard_alerts"].append({
                "type": "contract_verification",
                "severity": "high",
                "message": "Unverified contract detected - high risk of malicious code"
            })
        else:
            assessment["detailed_flags"]["contract_verification"] = {
                "status": "verified",
                "risk_level": "low",
                "description": "Contract source code is verified and transparent"
            }
        
        # 2. Audit Status Analysis
        if not explorer_data.get("audit_badge", False):
            resonance_score -= self.risk_weights["no_audit_badge"]
            risk_flags.append("no_audit_badge")
            anomaly_score += 20
            assessment["detailed_flags"]["audit_status"] = {
                "status": "unaudited",
                "risk_level": "medium",
                "description": "No audit badge found - contract has not been professionally audited"
            }
            assessment["watchguard_alerts"].append({
                "type": "audit_status",
                "severity": "medium",
                "message": "Unaudited contract - potential security vulnerabilities"
            })
        else:
            assessment["detailed_flags"]["audit_status"] = {
                "status": "audited",
                "risk_level": "low",
                "description": "Contract has been professionally audited"
            }
        
        # 3. Holder Analysis
        holders = explorer_data.get("holders")
        if holders:
            try:
                holder_count = int(holders)
                if holder_count < 10:
                    resonance_score -= self.risk_weights["very_low_holders"]
                    risk_flags.append("very_low_holders")
                    anomaly_score += 20
                    assessment["detailed_flags"]["holder_analysis"] = {
                        "holder_count": holder_count,
                        "risk_level": "high",
                        "description": f"Very low holder diversity ({holder_count} holders) - potential honeypot"
                    }
                    assessment["watchguard_alerts"].append({
                        "type": "holder_diversity",
                        "severity": "high",
                        "message": f"Very low holder count ({holder_count}) - high honeypot risk"
                    })
                elif holder_count < 50:
                    resonance_score -= self.risk_weights["low_holder_diversity"]
                    risk_flags.append("low_holder_diversity")
                    anomaly_score += 15
                    assessment["detailed_flags"]["holder_analysis"] = {
                        "holder_count": holder_count,
                        "risk_level": "medium",
                        "description": f"Low holder diversity ({holder_count} holders) - potential manipulation"
                    }
                else:
                    assessment["detailed_flags"]["holder_analysis"] = {
                        "holder_count": holder_count,
                        "risk_level": "low",
                        "description": f"Good holder diversity ({holder_count} holders)"
                    }
            except ValueError:
                assessment["detailed_flags"]["holder_analysis"] = {
                    "holder_count": "unknown",
                    "risk_level": "unknown",
                    "description": "Could not parse holder count"
                }
        
        # 4. Naming Analysis
        name = explorer_data.get("name", "").lower()
        symbol = explorer_data.get("symbol", "").upper()
        
        suspicious_name_score = 0
        suspicious_symbol_score = 0
        
        for pattern in self.suspicious_patterns["names"]:
            if re.search(pattern, name, re.IGNORECASE):
                suspicious_name_score += 1
        
        for pattern in self.suspicious_patterns["symbols"]:
            if re.search(pattern, symbol, re.IGNORECASE):
                suspicious_symbol_score += 1
        
        if suspicious_name_score > 0:
            resonance_score -= self.risk_weights["suspicious_name"]
            risk_flags.append("suspicious_name")
            anomaly_score += 10
            assessment["detailed_flags"]["naming_analysis"] = {
                "name_suspicious_score": suspicious_name_score,
                "symbol_suspicious_score": suspicious_symbol_score,
                "risk_level": "medium",
                "description": f"Suspicious naming patterns detected (score: {suspicious_name_score})"
            }
            assessment["watchguard_alerts"].append({
                "type": "naming_pattern",
                "severity": "medium",
                "message": "Suspicious naming patterns detected - potential meme/scam token"
            })
        else:
            assessment["detailed_flags"]["naming_analysis"] = {
                "name_suspicious_score": 0,
                "symbol_suspicious_score": suspicious_symbol_score,
                "risk_level": "low",
                "description": "No suspicious naming patterns detected"
            }
        
        # 5. Behavioral Analysis (placeholder for future expansion)
        assessment["detailed_flags"]["behavioral_analysis"] = {
            "status": "pending",
            "risk_level": "unknown",
            "description": "Behavioral analysis requires additional transaction data"
        }
        
        # Calculate final scores
        resonance_score = max(0, resonance_score)  # Ensure non-negative
        anomaly_score = min(100, anomaly_score)    # Cap at 100
        
        # Determine risk level
        if resonance_score >= 80:
            risk_level = "safe"
        elif resonance_score >= 60:
            risk_level = "warning"
        else:
            risk_level = "danger"
        
        # Determine sovereign alignment
        if resonance_score >= self.alignment_thresholds["aligned"]:
            sovereign_alignment = "aligned"
        elif resonance_score >= self.alignment_thresholds["warning"]:
            sovereign_alignment = "warning"
        else:
            sovereign_alignment = "misaligned"
        
        # Calculate confidence based on data completeness
        confidence_factors = [
            explorer_data.get("name") is not None,
            explorer_data.get("symbol") is not None,
            explorer_data.get("holders") is not None,
            "error" not in explorer_data
        ]
        confidence = sum(confidence_factors) / len(confidence_factors)
        
        # Generate recommendations
        recommendations = []
        if not explorer_data.get("verified", False):
            recommendations.append("Avoid unverified contracts - high risk of malicious code")
        if not explorer_data.get("audit_badge", False):
            recommendations.append("Unaudited contracts may contain security vulnerabilities")
        if holders and int(holders) < 50:
            recommendations.append("Low holder diversity suggests potential manipulation")
        if suspicious_name_score > 0:
            recommendations.append("Suspicious naming patterns indicate potential scam token")
        
        if not recommendations:
            recommendations.append("Token appears to meet basic security standards")
        
        # Update assessment with calculated values
        assessment["risk_analysis"].update({
            "resonance_score": resonance_score,
            "risk_flags": risk_flags,
            "risk_level": risk_level,
            "sovereign_alignment": sovereign_alignment,
            "anomaly_score": anomaly_score,
            "confidence": confidence
        })
        
        assessment["recommendations"] = recommendations
        
        return assessment

    def generate_summary(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a concise summary of the risk assessment.
        
        Args:
            assessment: Full risk assessment from assess_token_risk()
            
        Returns:
            Dict containing summary information
        """
        return {
            "contract": assessment["contract_address"],
            "name": assessment["token_info"]["name"],
            "symbol": assessment["token_info"]["symbol"],
            "resonance_score": assessment["risk_analysis"]["resonance_score"],
            "risk_level": assessment["risk_analysis"]["risk_level"],
            "sovereign_alignment": assessment["risk_analysis"]["sovereign_alignment"],
            "key_flags": assessment["risk_analysis"]["risk_flags"][:3],  # Top 3 flags
            "recommendation": assessment["recommendations"][0] if assessment["recommendations"] else "No recommendation",
            "timestamp": assessment["timestamp"]
        }

    def export_for_djinnsecurities(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format assessment for DjinnSecurities integration.
        
        Args:
            assessment: Full risk assessment from assess_token_risk()
            
        Returns:
            Dict formatted for DjinnSecurities asset profile
        """
        return {
            "address": assessment["contract_address"],
            "symbol": assessment["token_info"]["symbol"],
            "name": assessment["token_info"]["name"],
            "riskLevel": assessment["risk_analysis"]["risk_level"],
            "resonanceScore": assessment["risk_analysis"]["resonance_score"],
            "sovereignAlignment": assessment["risk_analysis"]["sovereign_alignment"],
            "marketCap": "$Unknown",  # Would need additional data source
            "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
            "explorerData": {
                "verified": assessment["token_info"]["verified"],
                "auditBadge": assessment["token_info"]["audit_badge"],
                "holders": assessment["token_info"]["holders"],
                "riskFlags": assessment["risk_analysis"]["risk_flags"],
                "anomalyScore": assessment["risk_analysis"]["anomaly_score"]
            },
            "watchguardAlerts": assessment["watchguard_alerts"]
        }

def main():
    """Test the TokenRiskAssessor with sample data."""
    assessor = TokenRiskAssessor()
    
    # Sample explorer data (simulating output from explorer_sync_bridge.py)
    sample_data = {
        "contract": "0x9876543210fedcba",
        "name": "Suspicious Moon Inu Token",
        "symbol": "SUSP",
        "verified": False,
        "audit_badge": False,
        "holders": "15",
        "risk_flags": ["Unverified contract", "Low holder diversity"]
    }
    
    print("🔍 Token Risk Assessment")
    print("=" * 50)
    
    # Perform assessment
    assessment = assessor.assess_token_risk(sample_data)
    
    # Display results
    print(f"Contract: {assessment['contract_address']}")
    print(f"Name: {assessment['token_info']['name']}")
    print(f"Symbol: {assessment['token_info']['symbol']}")
    print(f"Resonance Score: {assessment['risk_analysis']['resonance_score']}/100")
    print(f"Risk Level: {assessment['risk_analysis']['risk_level']}")
    print(f"Sovereign Alignment: {assessment['risk_analysis']['sovereign_alignment']}")
    print(f"Anomaly Score: {assessment['risk_analysis']['anomaly_score']}/100")
    print(f"Risk Flags: {', '.join(assessment['risk_analysis']['risk_flags'])}")
    print(f"Recommendation: {assessment['recommendations'][0]}")
    
    print("\n" + "=" * 50)
    print("WatchGuard Alerts:")
    for alert in assessment['watchguard_alerts']:
        print(f"  [{alert['severity'].upper()}] {alert['message']}")
    
    print("\n" + "=" * 50)
    print("DjinnSecurities Format:")
    djinn_format = assessor.export_for_djinnsecurities(assessment)
    print(json.dumps(djinn_format, indent=2))

if __name__ == "__main__":
    main() 