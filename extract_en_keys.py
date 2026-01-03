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

# Read the JSON file
with open('frontend/src/data/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Extract keys
en_keys = extract_keys(en_data)

# Write the keys to a file
with open('frontend/src/en_translation_keys.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(en_keys))

print(f'EN keys: {len(en_keys)}')