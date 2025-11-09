#!/usr/bin/env python3
"""
Script to fix bcrypt compatibility issue
This script ensures the correct versions of bcrypt and passlib are installed
"""
import subprocess
import sys
import os

def install_requirements():
    """Install the correct versions of bcrypt and passlib"""
    print("Installing correct versions of bcrypt and passlib...")
    
    # Uninstall current versions
    subprocess.run([sys.executable, "-m", "pip", "uninstall", "bcrypt", "passlib", "-y"], 
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Install compatible versions
    result = subprocess.run([
        sys.executable, "-m", "pip", "install", 
        "bcrypt==3.2.2", 
        "passlib[bcrypt]==1.7.4"
    ])
    
    if result.returncode == 0:
        print("Successfully installed compatible versions of bcrypt and passlib")
    else:
        print("Failed to install compatible versions")
        return False
    
    return True

if __name__ == "__main__":
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    print("Fixing bcrypt compatibility issue...")
    success = install_requirements()
    
    if success:
        print("\nbcrypt compatibility fix completed!")
        print("Please restart your server for changes to take effect.")
    else:
        print("\nFailed to fix bcrypt compatibility issue!")