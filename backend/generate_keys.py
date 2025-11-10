# Save this as: backend/generate_keys.py

import secrets

print("=" * 60)
print("SECRET KEY GENERATOR")
print("=" * 60)
print()
print("Copy these to your .env file:")
print()
print(f'SECRET_KEY="{secrets.token_urlsafe(32)}"')
print(f'SESSION_SECRET_KEY="{secrets.token_urlsafe(32)}"')
print()
print("WARNING: NEVER commit these keys to git!")
print("WARNING: Generate NEW keys for each environment!")
print("=" * 60)