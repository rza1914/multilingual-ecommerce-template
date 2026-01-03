import os
from pathlib import Path

def compare_keys():
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
            print(f"Warning: {keys_file} does not exist")
    
    # Compare used keys with defined keys
    results = []
    
    for key in sorted(used_keys):
        en_exists = key in defined_keys.get('en', set())
        fa_exists = key in defined_keys.get('fa', set())
        ar_exists = key in defined_keys.get('ar', set())
        
        # Determine status
        if en_exists and fa_exists and ar_exists:
            status = "OK"
        elif en_exists and not fa_exists and not ar_exists:
            status = "PARTIAL (only in en)"
        elif en_exists and fa_exists and not ar_exists:
            status = "MISSING_AR"
        elif en_exists and not fa_exists and ar_exists:
            status = "MISSING_FA"
        elif not en_exists and fa_exists and ar_exists:
            status = "MISSING_EN"
        elif not en_exists and not fa_exists and not ar_exists:
            status = "CRITICAL (missing in all)"
        else:
            status = "PARTIAL"
        
        results.append({
            'key': key,
            'en': '✓' if en_exists else '✗',
            'fa': '✓' if fa_exists else '✗',
            'ar': '✓' if ar_exists else '✗',
            'status': status
        })
    
    # Write comparison report
    report_file = frontend_path / "translation_comparison_report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("Translation Key Comparison Report\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Total used keys: {len(used_keys)}\n")
        f.write(f"EN keys: {len(defined_keys.get('en', set()))}\n")
        f.write(f"FA keys: {len(defined_keys.get('fa', set()))}\n")
        f.write(f"AR keys: {len(defined_keys.get('ar', set()))}\n\n")
        
        f.write(f"{'Key':<50} {'EN':<3} {'FA':<3} {'AR':<3} {'Status':<20}\n")
        f.write("-" * 80 + "\n")
        
        for result in results:
            f.write(f"{result['key']:<50} {result['en']:<3} {result['fa']:<3} {result['ar']:<3} {result['status']:<20}\n")
    
    # Count statuses
    status_counts = {}
    for result in results:
        status = result['status']
        status_counts[status] = status_counts.get(status, 0) + 1
    
    print("\nStatus Summary:")
    for status, count in status_counts.items():
        print(f"  {status}: {count}")
    
    # Identify critical missing keys
    critical_missing = [r['key'] for r in results if r['status'] == 'CRITICAL (missing in all)']
    missing_ar = [r['key'] for r in results if r['status'] == 'MISSING_AR']
    missing_fa = [r['key'] for r in results if r['status'] == 'MISSING_FA']
    missing_en = [r['key'] for r in results if r['status'] == 'MISSING_EN']
    
    print(f"\nCritical missing keys (not in any language): {len(critical_missing)}")
    print(f"Keys missing in Arabic: {len(missing_ar)}")
    print(f"Keys missing in Farsi: {len(missing_fa)}")
    print(f"Keys missing in English: {len(missing_en)}")
    
    return results, critical_missing, missing_ar, missing_fa, missing_en

if __name__ == "__main__":
    results, critical_missing, missing_ar, missing_fa, missing_en = compare_keys()