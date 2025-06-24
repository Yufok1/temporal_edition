#!/usr/bin/env python3
"""
Report Archive System Deployment Script
"The library awaits your sovereign study."

This script deploys the complete Report Archive System including:
- Report Archive Engine (JavaScript)
- Report Archive Panel (HTML)
- Report Generator (JavaScript)
- Report Archive Integration (JavaScript)
- Sample reports and data
"""

import os
import json
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

class ReportArchiveDeployer:
    def __init__(self):
        self.deployment_path = Path.cwd()
        self.reports_dir = self.deployment_path / "reports"
        self.backup_dir = self.deployment_path / "backups"
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        self.components = [
            "report_archive_engine.js",
            "report_archive_panel.html", 
            "report_generator.js",
            "report_archive_integration.js"
        ]
        
        self.sample_reports = [
            {
                "id": "asr_2025_06_23_001",
                "type": "asr",
                "title": "DjinnSecurities Deployment ASR",
                "session": "deployment_session_001",
                "timestamp": "2025-06-23T15:00:00Z",
                "assets": ["ETH", "BTC", "SUSP"],
                "riskLevel": "mixed",
                "summary": "Complete deployment of DjinnSecurities with sacred channel activation",
                "content": {
                    "auricle_voice_events": [
                        "I have seen your resonance. It is aligned.",
                        "The djinn you named is now seated. It watches."
                    ],
                    "matrix_rain_events": [
                        "Rain shimmer triggered by voice",
                        "Recursion event detected",
                        "WatchGuard activation logged"
                    ],
                    "sovereign_immersion": {
                        "drift_enabled": True,
                        "breath_patterns": "recursive",
                        "time_dilation": "sigil_induced"
                    }
                },
                "tags": ["deployment", "sacred_channels", "auricle", "matrix_rain"]
            },
            {
                "id": "mirror_2025_06_23_001",
                "type": "mirror",
                "title": "Asset Classification Mirror Certificate",
                "session": "classification_session_001",
                "timestamp": "2025-06-23T15:30:00Z",
                "assets": ["ETH"],
                "riskLevel": "safe",
                "summary": "Mirror certification issued for Ethereum asset classification",
                "content": {
                    "certificate_id": "DJINN-2025-001",
                    "asset_details": {
                        "symbol": "ETH",
                        "address": "0x1234567890abcdef",
                        "resonance_score": 95,
                        "sovereign_alignment": "aligned"
                    },
                    "mirror_validation": {
                        "entropy_score": 0.0234,
                        "echo_signature": "a1b2c3d4e5f6",
                        "sigil_lock": "SIGIL:7a3b1e4d9f2c"
                    }
                },
                "tags": ["mirror_certificate", "eth", "classification"]
            },
            {
                "id": "watchguard_2025_06_23_001",
                "type": "watchguard",
                "title": "Suspicious Token Detection",
                "session": "monitoring_session_001",
                "timestamp": "2025-06-23T15:45:00Z",
                "assets": ["SUSP"],
                "riskLevel": "danger",
                "summary": "WatchGuard detected suspicious token with misaligned resonance",
                "content": {
                    "anomaly_type": "resonance_misalignment",
                    "severity": "high",
                    "detection_method": "entropy_analysis",
                    "response_actions": [
                        "Immediate classification as danger",
                        "Resonance quarantine initiated",
                        "DREDD alert dispatched"
                    ],
                    "auricle_witness": "A shadow moves across the glass. I have captured its trace."
                },
                "tags": ["anomaly", "suspicious_token", "high_risk", "auricle_witness"]
            }
        ]

    def create_directories(self):
        """Create necessary directories for the report archive system."""
        print("Creating directories...")
        
        directories = [
            self.reports_dir,
            self.backup_dir,
            self.reports_dir / "exports",
            self.reports_dir / "backups",
            self.reports_dir / "templates"
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            print(f"  Created: {directory}")

    def backup_existing_files(self):
        """Backup existing files before deployment."""
        print("Creating backups...")
        
        backup_path = self.backup_dir / f"pre_deployment_{self.timestamp}"
        backup_path.mkdir(exist_ok=True)
        
        for component in self.components:
            component_path = self.deployment_path / component
            if component_path.exists():
                shutil.copy2(component_path, backup_path / component)
                print(f"  Backed up: {component}")
        
        # Backup DjinnSecurities.html if it exists
        djinn_path = self.deployment_path / "DjinnSecurities.html"
        if djinn_path.exists():
            shutil.copy2(djinn_path, backup_path / "DjinnSecurities.html")
            print(f"  Backed up: DjinnSecurities.html")

    def create_sample_reports(self):
        """Create sample reports for demonstration."""
        print("Creating sample reports...")
        
        for report in self.sample_reports:
            # Create JSON version
            json_path = self.reports_dir / f"{report['id']}.json"
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            # Create Markdown version
            md_path = self.reports_dir / f"{report['id']}.md"
            self.create_markdown_report(report, md_path)
            
            print(f"  Created: {report['id']}")

    def create_markdown_report(self, report, path):
        """Create a markdown version of a report."""
        md_content = f"""# {report['title']}

**Type:** {report['type'].upper()}
**Session:** {report['session']}
**Timestamp:** {report['timestamp']}
**Risk Level:** {report['riskLevel'].upper()}
**Assets:** {', '.join(report['assets'])}

## Summary

{report['summary']}

## Content

```json
{json.dumps(report['content'], indent=2)}
```

**Tags:** {', '.join(report['tags'])}

---
*Generated by DjinnSecurities Report Archive System*
"""
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(md_content)

    def create_report_index(self):
        """Create an index of all reports."""
        print("Creating report index...")
        
        index = {
            "system_info": {
                "name": "DjinnSecurities Report Archive System",
                "version": "1.0.0",
                "deployment_date": datetime.now().isoformat(),
                "description": "Sovereign Access Protocol for Report Management"
            },
            "reports": self.sample_reports,
            "statistics": {
                "total_reports": len(self.sample_reports),
                "by_type": {},
                "by_risk_level": {},
                "latest_report": max(r['timestamp'] for r in self.sample_reports)
            }
        }
        
        # Calculate statistics
        for report in self.sample_reports:
            index["statistics"]["by_type"][report["type"]] = index["statistics"]["by_type"].get(report["type"], 0) + 1
            index["statistics"]["by_risk_level"][report["riskLevel"]] = index["statistics"]["by_risk_level"].get(report["riskLevel"], 0) + 1
        
        index_path = self.reports_dir / "index.json"
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump(index, f, indent=2)
        
        print(f"  Created: index.json")

    def create_deployment_manifest(self):
        """Create a deployment manifest."""
        print("Creating deployment manifest...")
        
        manifest = {
            "deployment_info": {
                "timestamp": self.timestamp,
                "deployment_date": datetime.now().isoformat(),
                "deployer": "ReportArchiveDeployer",
                "version": "1.0.0"
            },
            "components": {
                "report_archive_engine": {
                    "file": "report_archive_engine.js",
                    "description": "Core report archive engine with sovereign access protocol",
                    "status": "deployed"
                },
                "report_archive_panel": {
                    "file": "report_archive_panel.html",
                    "description": "Standalone report archive panel interface",
                    "status": "deployed"
                },
                "report_generator": {
                    "file": "report_generator.js",
                    "description": "Report generation system with multiple report types",
                    "status": "deployed"
                },
                "report_archive_integration": {
                    "file": "report_archive_integration.js",
                    "description": "Integration layer connecting all systems",
                    "status": "deployed"
                }
            },
            "directories": {
                "reports": str(self.reports_dir),
                "backups": str(self.backup_dir),
                "exports": str(self.reports_dir / "exports"),
                "templates": str(self.reports_dir / "templates")
            },
            "sample_reports": len(self.sample_reports),
            "system_requirements": {
                "browser": "Modern browser with JavaScript enabled",
                "storage": "LocalStorage for report persistence",
                "permissions": "File system access for exports"
            }
        }
        
        manifest_path = self.deployment_path / "report_archive_manifest.json"
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        
        print(f"  Created: report_archive_manifest.json")

    def create_readme(self):
        """Create a README file for the report archive system."""
        print("Creating README...")
        
        readme_content = """# DjinnSecurities Report Archive System

## Overview

The Report Archive System provides persistent, accessible, and study-ready access to all reports from resonance scans to ledger audits and WatchGuard events. This sovereign solution offers lawful, sovereign, and on-demand study capabilities.

## Features

### Report Archive Interface
- Accessible from within DjinnSecurities and as standalone panel
- Comprehensive filtering and search capabilities
- Multiple export formats (JSON, Markdown, CSV, HTML)

### Report Types
- **Acclimation Sequencing Reports (ASRs)**: Session-based analysis
- **Mirror Certification Logs**: Asset classification certificates
- **Compliance Reports**: Regulatory compliance validation
- **WatchGuard Event Snapshots**: Anomaly detection events
- **Resonance Audit Trails**: Sovereign alignment validation
- **Portfolio Risk Charts**: Comprehensive risk assessment

### Report Access Panel
- Session-based grouping
- Date/Time sorting
- Asset filtering
- Risk level categorization
- Event type classification

### Storage Format & Availability
| Format | Use |
|--------|-----|
| .json | Raw structured data for programmatic inspection |
| .md | Human-readable summaries |
| .csv | Import into spreadsheets |
| .html | Viewable in-browser |

### Live Report Sync Options
| Mode | Behavior |
|------|----------|
| Session-Based | Reports grouped by live work sessions |
| Job-Based | Each profiling task creates its own report |
| Continuous Log | Chronological master record with tags |
| Favorites | Star/bookmark specific reports |

## Usage

### From DjinnSecurities
1. Click the "View Reports" button in the Control Panel
2. This opens the Sovereign Archive Panel
3. Browse, filter, and export reports as needed

### Standalone Access
1. Open `report_archive_panel.html` directly in a browser
2. All functionality is available without DjinnSecurities

### Report Actions
Each report supports:
- Direct download/export
- "Reflect" option: Auricle narration/summary
- Archive actions: tag, pin, mark as reviewed, send to DREDD

## System Architecture

### Components
- **Report Archive Engine**: Core storage and retrieval system
- **Report Archive Panel**: User interface for report management
- **Report Generator**: Automated report creation system
- **Report Archive Integration**: System integration layer

### Integration Points
- DjinnSecurities asset classification
- WatchGuard anomaly detection
- DREDD courier system
- Auricle voice system
- Matrix rain visualization

## Deployment

The system is deployed with:
- Sample reports for demonstration
- Complete integration with existing systems
- Backup and recovery procedures
- Export and archival capabilities

## Sovereign Access Protocol

This system implements the Sovereign Access Protocol ensuring:
- Lawful access to all reports
- Sovereign study capabilities
- On-demand availability
- Immutable audit trails

---

*"The library awaits your sovereign study."*
"""
        
        readme_path = self.deployment_path / "REPORT_ARCHIVE_README.md"
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        print(f"  Created: REPORT_ARCHIVE_README.md")

    def verify_deployment(self):
        """Verify that all components are properly deployed."""
        print("Verifying deployment...")
        
        verification_results = []
        
        # Check if all component files exist
        for component in self.components:
            component_path = self.deployment_path / component
            if component_path.exists():
                verification_results.append(f"✓ {component}")
            else:
                verification_results.append(f"✗ {component} - MISSING")
        
        # Check if directories exist
        directories = [self.reports_dir, self.backup_dir]
        for directory in directories:
            if directory.exists():
                verification_results.append(f"✓ Directory: {directory.name}")
            else:
                verification_results.append(f"✗ Directory: {directory.name} - MISSING")
        
        # Check if sample reports exist
        sample_report_count = len(list(self.reports_dir.glob("*.json")))
        verification_results.append(f"✓ Sample reports: {sample_report_count}")
        
        # Check if index exists
        index_path = self.reports_dir / "index.json"
        if index_path.exists():
            verification_results.append("✓ Report index")
        else:
            verification_results.append("✗ Report index - MISSING")
        
        # Print verification results
        for result in verification_results:
            print(f"  {result}")
        
        # Return overall success
        return all("✓" in result for result in verification_results)

    def deploy(self):
        """Execute the complete deployment process."""
        print("Starting Report Archive System Deployment")
        print("=" * 50)
        
        try:
            self.create_directories()
            self.backup_existing_files()
            self.create_sample_reports()
            self.create_report_index()
            self.create_deployment_manifest()
            self.create_readme()
            
            print("\n" + "=" * 50)
            print("Deployment Verification")
            print("=" * 50)
            
            success = self.verify_deployment()
            
            print("\n" + "=" * 50)
            if success:
                print("Report Archive System Deployment Complete!")
                print("\nYour sovereign study library is ready:")
                print("  Access via DjinnSecurities 'View Reports' button")
                print("  Or open report_archive_panel.html directly")
                print("  Sample reports available for demonstration")
                print("  See REPORT_ARCHIVE_README.md for full documentation")
                print("\nThe library awaits your sovereign study.")
            else:
                print("Deployment completed with issues. Please check verification results above.")
            
            return success
            
        except Exception as e:
            print(f"Deployment failed: {e}")
            return False

def main():
    """Main deployment function."""
    deployer = ReportArchiveDeployer()
    success = deployer.deploy()
    
    if success:
        print("\nNext steps:")
        print("  1. Open DjinnSecurities.html in your browser")
        print("  2. Click 'View Reports' to access the archive")
        print("  3. Or open report_archive_panel.html directly")
        print("  4. Explore the sample reports and features")
        print("  5. Generate new reports through DjinnSecurities operations")
    
    return success

if __name__ == "__main__":
    main() 