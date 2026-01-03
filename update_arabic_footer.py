import json
import os
from pathlib import Path

def update_arabic_locale():
    # Read the Arabic JSON file with proper encoding
    ar_file_path = Path("frontend/src/data/ar.json")
    
    with open(ar_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        data = json.loads(content)
    
    # Add the missing footer keys with Arabic translations
    if 'footer' in data:
        data['footer']['company'] = 'الشركة'
        data['footer']['faq'] = 'الأسئلة الشائعة'
        data['footer']['returns'] = 'المرتجعات'
        data['footer']['shippingInfo'] = 'معلومات الشحن'
        data['footer']['support'] = 'الدعم'
    
    # Write back to the file
    with open(ar_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("Updated Arabic locale file with new keys")

if __name__ == "__main__":
    update_arabic_locale()