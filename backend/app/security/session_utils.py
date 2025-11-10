"""
Session Utilities for iShop E-commerce Platform
Provides secure session management functions
"""
import secrets
import hashlib
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import json


def generate_secure_session_id() -> str:
    """
    Generate a cryptographically secure session ID
    """
    return secrets.token_urlsafe(32)


def generate_csrf_token(session_id: str, user_id: Optional[str] = None, secret: str = None) -> str:
    """
    Generate a CSRF token based on session and user info
    """
    if secret is None:
        secret = secrets.token_urlsafe(32)
    
    token_data = f"{session_id}:{user_id or 'anonymous'}:{secret}:{secrets.token_hex(16)}"
    return hashlib.sha256(token_data.encode()).hexdigest()


def validate_csrf_token(token: str, session_id: str, user_id: Optional[str] = None, secret: str = None) -> bool:
    """
    Validate a CSRF token
    """
    if not token or not session_id:
        return False
    
    expected_token = generate_csrf_token(session_id, user_id, secret)
    return secrets.compare_digest(token, expected_token)


def create_secure_session_data(user_id: Optional[str] = None, additional_data: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Create a secure session data structure
    """
    session_data = {
        "session_id": generate_secure_session_id(),
        "created_at": datetime.utcnow().isoformat(),
        "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
        "user_id": user_id,
        "csrf_token": generate_csrf_token(generate_secure_session_id(), user_id)
    }
    
    if additional_data:
        session_data.update(additional_data)
    
    return session_data


def is_session_expired(session_data: Dict[str, Any]) -> bool:
    """
    Check if a session has expired
    """
    if "expires_at" not in session_data:
        return True
    
    try:
        expires_at = datetime.fromisoformat(session_data["expires_at"])
        return datetime.utcnow() > expires_at
    except:
        return True


def refresh_session_expiration(session_data: Dict[str, Any], hours: int = 24) -> Dict[str, Any]:
    """
    Refresh session expiration time
    """
    session_data["expires_at"] = (datetime.utcnow() + timedelta(hours=hours)).isoformat()
    return session_data


# ========================================
# Secret Key Management
# ========================================

def generate_secure_secret_key() -> str:
    """
    Generate a secure secret key for session encryption

    PRODUCTION USAGE:
        1. Run: python -c "from app.security.session_utils import generate_secure_secret_key; print(generate_secure_secret_key())"
        2. Copy the generated key
        3. Add to .env file: SECRET_KEY=<generated_key>
        4. NEVER commit the .env file to version control

    Returns:
        str: A 32-character URL-safe cryptographically random string
    """
    return secrets.token_urlsafe(32)


def validate_secret_key(secret_key: str) -> tuple[bool, str]:
    """
    Validate if a secret key meets security requirements

    Args:
        secret_key: The secret key to validate

    Returns:
        tuple: (is_valid, error_message)
    """
    if not secret_key:
        return False, "Secret key is empty"

    if len(secret_key) < 32:
        return False, f"Secret key is too short (current: {len(secret_key)}, minimum: 32 characters)"

    # Check if it's using a known insecure default
    insecure_defaults = [
        "your-secret-key",
        "secret",
        "changeme",
        "default",
        "test",
        "dev-secret-key"
    ]

    if secret_key.lower() in insecure_defaults:
        return False, "Secret key is using an insecure default value"

    return True, "Secret key is valid"


# ========================================
# Session Management
# ========================================

def clear_expired_sessions(sessions: Dict[str, Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Remove expired sessions from a session dictionary

    Args:
        sessions: Dictionary of session_id -> session_data

    Returns:
        Dict: Cleaned sessions dictionary with expired sessions removed
    """
    active_sessions = {}
    expired_count = 0

    for session_id, session_data in sessions.items():
        if not is_session_expired(session_data):
            active_sessions[session_id] = session_data
        else:
            expired_count += 1

    if expired_count > 0:
        print(f"Cleared {expired_count} expired session(s)")

    return active_sessions


def get_session_info(session_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Get human-readable session information

    Args:
        session_data: Session data dictionary

    Returns:
        Dict: Session information with formatted dates and status
    """
    try:
        created_at = datetime.fromisoformat(session_data.get("created_at", ""))
        expires_at = datetime.fromisoformat(session_data.get("expires_at", ""))
        now = datetime.utcnow()

        time_remaining = expires_at - now
        hours_remaining = time_remaining.total_seconds() / 3600

        return {
            "session_id": session_data.get("session_id", "unknown")[:16] + "...",
            "user_id": session_data.get("user_id", "anonymous"),
            "created_at": created_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "expires_at": expires_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "hours_remaining": round(hours_remaining, 2),
            "is_expired": is_session_expired(session_data),
            "has_csrf_token": "csrf_token" in session_data
        }
    except Exception as e:
        return {"error": f"Could not parse session data: {str(e)}"}


# ========================================
# CLI Tools
# ========================================

if __name__ == "__main__":
    """
    Command-line tools for session management

    Usage:
        # Generate a new secret key
        python -m app.security.session_utils generate-key

        # Validate a secret key
        python -m app.security.session_utils validate-key <your-key>

        # Create sample session
        python -m app.security.session_utils create-session
    """
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  python -m app.security.session_utils generate-key")
        print("  python -m app.security.session_utils validate-key <key>")
        print("  python -m app.security.session_utils create-session")
        sys.exit(1)

    command = sys.argv[1]

    if command == "generate-key":
        key = generate_secure_secret_key()
        print("\n" + "=" * 70)
        print("Generated Secure Secret Key:")
        print("=" * 70)
        print(key)
        print("=" * 70)
        print("\nAdd this to your .env file:")
        print(f"SECRET_KEY={key}")
        print("\n⚠️  IMPORTANT: Never commit this key to version control!")
        print("=" * 70)

    elif command == "validate-key":
        if len(sys.argv) < 3:
            print("Error: Please provide a key to validate")
            print("Usage: python -m app.security.session_utils validate-key <key>")
            sys.exit(1)

        key = sys.argv[2]
        is_valid, message = validate_secret_key(key)

        if is_valid:
            print(f"✅ {message}")
        else:
            print(f"❌ {message}")
            sys.exit(1)

    elif command == "create-session":
        session = create_secure_session_data(user_id="demo-user-123")
        print("\n" + "=" * 70)
        print("Sample Session Data:")
        print("=" * 70)
        print(json.dumps(session, indent=2))
        print("=" * 70)
        print("\nSession Info:")
        info = get_session_info(session)
        for key, value in info.items():
            print(f"  {key}: {value}")
        print("=" * 70)

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)