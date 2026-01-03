import re
import os
from pathlib import Path

def extract_translation_keys():
    frontend_path = Path("frontend/src")
    all_keys = set()
    
    # Find all TSX files
    for tsx_file in frontend_path.rglob("*.tsx"):
        with open(tsx_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find all t('key') patterns
        matches = re.findall(r"t\(\s*['\"`]([^'\"]+)['\"`]", content)
        all_keys.update(matches)
    
    # Write to file
    with open("frontend/src/used_translation_keys.txt", "w", encoding="utf-8") as f:
        for key in sorted(all_keys):
            f.write(key + "\n")
    
    print(f"Found {len(all_keys)} unique translation keys")
    return all_keys

if __name__ == "__main__":
    keys = extract_translation_keys()