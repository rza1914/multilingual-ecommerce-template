import os
from pathlib import Path

def generate_priority_list():
    frontend_path = Path("frontend/src")
    
    # Read used keys
    with open(frontend_path / "used_translation_keys.txt", 'r', encoding='utf-8') as f:
        used_keys = set(line.strip() for line in f if line.strip())
    
    # Read defined keys for each language
    languages = ['en', 'fa', 'ar']
    defined_keys = {}
    
    for lang in languages:
        keys_file = frontend_path / f"{lang}_translation_keys.txt"
        if keys_file.exists():
            with open(keys_file, 'r', encoding='utf-8') as f:
                defined_keys[lang] = set(line.strip() for line in f if line.strip())
        else:
            defined_keys[lang] = set()
    
    # Identify missing keys
    missing_keys = []
    for key in sorted(used_keys):
        en_exists = key in defined_keys.get('en', set())
        fa_exists = key in defined_keys.get('fa', set())
        ar_exists = key in defined_keys.get('ar', set())
        
        if not (en_exists and fa_exists and ar_exists):
            missing_keys.append({
                'key': key,
                'en': en_exists,
                'fa': fa_exists,
                'ar': ar_exists
            })
    
    # Read hardcoded strings from existing report if available
    hardcoded_strings = []
    hardcoded_report_path = frontend_path / "hardcoded_strings_report.md"
    if hardcoded_report_path.exists():
        with open(hardcoded_report_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract hardcoded strings from the report
            lines = content.split('\n')
            for line in lines:
                if line.strip().startswith('|') and 'hardcoded' in line.lower():
                    hardcoded_strings.append(line.strip())
    
    # Categorize missing keys by priority
    priority_categories = {
        'High Priority (Buttons/CTAs/Nav)': [],
        'Medium Priority (Forms/Placeholders)': [],
        'Low Priority (Messages/Descriptions)': [],
        'Others': []
    }
    
    for item in missing_keys:
        key = item['key']
        
        # Classify by key pattern
        if any(pattern in key.lower() for pattern in ['button', 'btn', 'nav', 'cta', 'action', 'submit', 'cancel', 'save', 'delete', 'edit', 'add', 'remove']):
            priority_categories['High Priority (Buttons/CTAs/Nav)'].append(item)
        elif any(pattern in key.lower() for pattern in ['placeholder', 'form', 'input', 'field', 'label']):
            priority_categories['Medium Priority (Forms/Placeholders)'].append(item)
        elif any(pattern in key.lower() for pattern in ['message', 'error', 'success', 'warning', 'info', 'desc', 'description', 'title', 'subtitle']):
            priority_categories['Low Priority (Messages/Descriptions)'].append(item)
        else:
            priority_categories['Others'].append(item)
    
    # Write priority classification report
    report_file = frontend_path / "i18n_priority_classification.md"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("# i18n Priority Classification Report\n\n")
        f.write("## Summary\n")
        f.write(f"- Total used keys: {len(used_keys)}\n")
        f.write(f"- Keys with missing translations: {len(missing_keys)}\n")
        f.write(f"- Hardcoded strings found: {len(hardcoded_strings)} (see detailed list below)\n\n")
        
        f.write("## Priority Classification\n\n")
        
        for category, items in priority_categories.items():
            f.write(f"### {category} ({len(items)} items)\n\n")
            if items:
                f.write("| Key | EN | FA | AR |\n")
                f.write("| --- | -- | -- | -- |\n")
                for item in items:
                    en_status = "YES" if item['en'] else "NO"
                    fa_status = "YES" if item['fa'] else "NO"
                    ar_status = "YES" if item['ar'] else "NO"
                    f.write(f"| {item['key']} | {en_status} | {fa_status} | {ar_status} |\n")
            else:
                f.write("No items in this category.\n")
            f.write("\n")
        
        f.write("## Hardcoded Strings (Need to be internationalized)\n\n")
        if hardcoded_strings:
            for hc_string in hardcoded_strings:
                f.write(f"- {hc_string}\n")
        else:
            f.write("No hardcoded strings found in the existing report.\n")
        
        f.write("\n## Recommendations\n\n")
        f.write("1. **High Priority**: Start with buttons, CTAs, and navigation elements as these are most visible to users\n")
        f.write("2. **Medium Priority**: Address form placeholders and labels next\n")
        f.write("3. **Low Priority**: Handle messages and descriptions\n")
        f.write("4. **Fix Hardcoded Strings**: Replace all hardcoded strings with proper i18n keys\n")
        f.write("5. **Complete Missing Translations**: Add translations for all missing keys in all three languages\n")
    
    print(f"Generated priority classification report with {len(missing_keys)} missing keys")
    category_counts = {cat: len(items) for cat, items in priority_categories.items()}
    print(f"Categories: {category_counts}")
    
    return priority_categories, missing_keys

if __name__ == "__main__":
    categories, missing = generate_priority_list()