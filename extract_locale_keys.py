import json
import os
from pathlib import Path

def extract_all_locale_keys():
    frontend_path = Path("frontend")
    frontend_src_data_path = Path("frontend/src/data")
    
    # Define locale files
    locale_files = {
        'en': frontend_path / 'en.json',
        'fa': frontend_path / 'fa.json', 
        'ar': frontend_src_data_path / 'ar.json'  # Arabic file is in frontend/src/data directory
    }
    
    # Extract keys from each locale file
    for lang, file_path in locale_files.items():
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8-sig') as f:  # Use utf-8-sig to handle BOM
                try:
                    content = f.read()
                    data = json.loads(content)
                    # Flatten nested keys
                    keys = flatten_keys(data)
                    
                    # Write to file in the src directory
                    output_file = Path("frontend/src") / f"{lang}_translation_keys.txt"
                    with open(output_file, 'w', encoding='utf-8') as out_f:
                        for key in sorted(keys):
                            out_f.write(key + "\n")
                    
                    print(f"Extracted {len(keys)} keys from {lang}.json")
                except json.JSONDecodeError as e:
                    print(f"Error: Could not parse {file_path} - {e}")
        else:
            print(f"Warning: {file_path} does not exist")

def flatten_keys(data, parent_key=''):
    """
    Recursively flatten nested dictionary keys with dot notation
    """
    items = []
    if isinstance(data, dict):
        for key, value in data.items():
            new_key = f"{parent_key}.{key}" if parent_key else key
            if isinstance(value, dict):
                items.extend(flatten_keys(value, new_key))
            else:
                items.append(new_key)
    elif isinstance(data, list):
        for i, value in enumerate(data):
            new_key = f"{parent_key}.{i}"
            if isinstance(value, dict):
                items.extend(flatten_keys(value, new_key))
            else:
                items.append(new_key)
    return items

if __name__ == "__main__":
    extract_all_locale_keys()