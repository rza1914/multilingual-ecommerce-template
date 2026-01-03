import json
import os
from pathlib import Path

def update_arabic_locale():
    # Read the Arabic JSON file with proper encoding
    ar_file_path = Path("frontend/src/data/ar.json")
    
    with open(ar_file_path, 'r', encoding='utf-8-sig') as f:
        content = f.read()
        # Try to fix encoding issues by replacing problematic characters
        # This is a workaround for the encoding issues in the file
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            # If there's an issue, try to fix common encoding problems
            content = content.replace('\\', '\\\\')  # Fix backslashes
            data = json.loads(content)
    
    # Add the new footer keys with Arabic translations
    if 'footer' not in data:
        data['footer'] = {}
    
    data['footer']['careers'] = 'الوظائف'
    data['footer']['blog'] = 'المدونة'
    data['footer']['cookiePolicy'] = 'سياسة ملفات تعريف الارتباط'
    
    # Write back to the file
    with open(ar_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("Updated Arabic locale file with new keys")

if __name__ == "__main__":
    update_arabic_locale()