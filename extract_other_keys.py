import json

def extract_keys(obj, prefix=''):
    keys = []
    if isinstance(obj, dict):
        for key, value in obj.items():
            if isinstance(value, dict):
                keys.extend(extract_keys(value, f'{prefix}.{key}' if prefix else key))
            else:
                keys.append(f'{prefix}.{key}' if prefix else key)
    return keys

# Read the JSON files
with open('frontend/src/data/fa.json', 'r', encoding='utf-8') as f:
    fa_data = json.load(f)

with open('frontend/src/data/ar.json', 'r', encoding='utf-8') as f:
    ar_data = json.load(f)

# Extract keys
fa_keys = extract_keys(fa_data)
ar_keys = extract_keys(ar_data)

# Write the keys to files
with open('frontend/src/fa_translation_keys.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(fa_keys))

with open('frontend/src/ar_translation_keys.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ar_keys))

print(f'FA keys: {len(fa_keys)}')
print(f'AR keys: {len(ar_keys)}')