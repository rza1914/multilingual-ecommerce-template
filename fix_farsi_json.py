import json
import os
from pathlib import Path

def fix_farsi_json_structure():
    # Read the Farsi JSON file
    fa_file_path = Path("frontend/fa.json")
    
    with open(fa_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        data = json.loads(content)
    
    # Get the existing footer data from the translation object
    if 'translation' in data and 'footer' in data['translation']:
        first_footer = data['translation']['footer'].copy()
    else:
        first_footer = {}
    
    # Get the second footer data (the one at the end that was added later)
    # This would be at the root level if it exists there
    if 'footer' in data:
        second_footer = data['footer'].copy()
        # Remove the duplicate footer from root
        del data['footer']
    else:
        second_footer = {}
    
    # Merge both footers, with second_footer taking precedence for conflicts
    merged_footer = {**first_footer, **second_footer}
    
    # Update the footer in the translation object
    if 'translation' in data:
        data['translation']['footer'] = merged_footer
    else:
        # If there's no translation object, create it
        data = {
            "translation": {
                **data,
                "footer": merged_footer
            }
        }
    
    # Write back to the file
    with open(fa_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("Fixed Farsi JSON structure - consolidated duplicate footer objects")
    print(f"Consolidated footer now has {len(merged_footer)} keys")

if __name__ == "__main__":
    fix_farsi_json_structure()