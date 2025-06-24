#!/usr/bin/env python3
"""
DjinnSecurities Package Creator
Creates a complete deployment package with all necessary files
"""

import zipfile
import os
from datetime import datetime

def create_djinnsecurities_package():
    """Create the DjinnSecurities deployment package."""
    print("🛡️ Creating DjinnSecurities Package...")
    print("=" * 50)
    
    # Package filename
    package_name = "DjinnCryptoSecurities.zip"
    
    # Files to include in the package
    files_to_include = [
        "DjinnSecurities.html",
        "explorer_sync_patch.js",
        "matrix_rain_engine.js", 
        "auricle_voice_engine.js",
        "create_djinnsecurities_shortcut.ps1",
        "DJINNSECURITIES_DEPLOYMENT_COMPLETE.md",
        "EXPLORER_SYNC_DEPLOYMENT_COMPLETE.md",
        "explorer_sync_bridge.py",
        "token_risk_assessor.py",
        "mirror_cert_generator.py",
        "integration_patch_djinnsecurities.py",
        "test_explorer_sync_system.py",
        "current_susp_scan_export.json"
    ]
    
    # Create the zip file
    with zipfile.ZipFile(package_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_include:
            if os.path.exists(file):
                zipf.write(file)
                print(f"✅ Added: {file}")
            else:
                print(f"⚠️  Missing: {file}")
    
    print("=" * 50)
    print("🎯 Package created successfully!")
    print(f"📦 Package: {package_name}")
    print("🚀 Ready for deployment")
    print("=" * 50)
    
    return package_name

if __name__ == "__main__":
    create_djinnsecurities_package() 