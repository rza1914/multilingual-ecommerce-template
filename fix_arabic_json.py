import json
import os
from pathlib import Path

def fix_arabic_json_structure():
    # Read the Arabic JSON file
    ar_file_path = Path("frontend/src/data/ar.json")
    
    with open(ar_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        original_data = json.loads(content)
    
    # Check if it already has the translation wrapper
    if "translation" in original_data:
        print("Arabic file already has translation wrapper")
        return
    
    # Create new structure with translation wrapper
    new_data = {
        "translation": original_data
    }
    
    # Write back to the file
    with open(ar_file_path, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
    
    print("Fixed Arabic JSON structure - wrapped content under 'translation' namespace")

if __name__ == "__main__":
    fix_arabic_json_structure()