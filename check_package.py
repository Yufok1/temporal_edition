#!/usr/bin/env python3
import zipfile
import os

def check_package():
    package_name = "DjinnCryptoSecurities.zip"
    
    if not os.path.exists(package_name):
        print(f"❌ Package {package_name} not found!")
        return
    
    print(f"📦 Checking package: {package_name}")
    print("=" * 50)
    
    with zipfile.ZipFile(package_name, 'r') as z:
        files = z.namelist()
        print(f"Total files: {len(files)}")
        print("\nFiles in package:")
        for file in files:
            print(f"  ✅ {file}")
    
    print("=" * 50)
    print("✅ Package exists and contains files!")

if __name__ == "__main__":
    check_package() 