"""
Add DeepSeek settings to config.py
"""
import os

config_path = "app/config.py"

# Read the current config
with open(config_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if DEEPSEEK settings already exist
if 'DEEPSEEK_API_KEY' not in content:
    # Find the line after ACCESS_TOKEN_EXPIRE_MINUTES
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        new_lines.append(line)
        
        # Add DeepSeek settings after ACCESS_TOKEN_EXPIRE_MINUTES
        if 'ACCESS_TOKEN_EXPIRE_MINUTES' in line and ')' in line:
            # Add the DeepSeek configuration
            new_lines.extend([
                '',
                '    # ========================================',
                '    # AI Service Configuration - DeepSeek',
                '    # ========================================',
                '    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")',
                '    DEEPSEEK_BASE_URL: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")',
                '    DEEPSEEK_MODEL: str = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")',
                '    DEEPSEEK_RATE_LIMIT_PER_MINUTE: int = int(os.getenv("DEEPSEEK_RATE_LIMIT_PER_MINUTE", "30"))',
                '    DEEPSEEK_DAILY_LIMIT: int = int(os.getenv("DEEPSEEK_DAILY_LIMIT", "1000"))',
                '',
                '    # Session Configuration',
                '    SESSION_MAX_AGE: int = int(os.getenv("SESSION_MAX_AGE", "86400"))',
                '    SESSION_COOKIE_NAME: str = os.getenv("SESSION_COOKIE_NAME", "ecommerce_session")',
                '    SESSION_COOKIE_SECURE: bool = os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"',
                '    SESSION_COOKIE_HTTPONLY: bool = os.getenv("SESSION_COOKIE_HTTPONLY", "true").lower() == "true"',
                '    SESSION_COOKIE_SAMESITE: str = os.getenv("SESSION_COOKIE_SAMESITE", "lax")',
                '    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))',
                '    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))',
            ])
    
    # Write back
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    
    print("✅ DeepSeek settings added to config.py")
else:
    print("✅ DeepSeek settings already exist in config.py")
