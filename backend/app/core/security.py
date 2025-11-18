from datetime import datetime, timedelta
from typing import Optional
import logging

from fastapi import HTTPException, status  # <-- این import اضافه شد
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..config import settings

# Set up logging
logger = logging.getLogger(__name__)

def create_password_context():
    """
    Create a CryptContext with error handling for bcrypt compatibility issues.
    """
    try:
        # Try to create context with bcrypt
        return CryptContext(
            schemes=["bcrypt"],
            deprecated="auto",
            bcrypt__rounds=12
        )
    except AttributeError as e:
        if "__about__" in str(e):
            # This is the known bcrypt compatibility issue
            # We'll try to handle it by forcing the use of bcrypt backend
            import warnings
            warnings.filterwarnings("ignore", category=DeprecationWarning)
            
            # Attempt to create the context again, ignoring the __about__ attribute issue
            return CryptContext(
                schemes=["bcrypt"],
                deprecated="auto",
                bcrypt__rounds=12
            )
        else:
            raise

# Initialize password context with compatibility handling
pwd_context = create_password_context()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hashed version.
    
    Args:
        plain_password: The plain text password to verify
        hashed_password: The hashed password to compare against
        
    Returns:
        bool: True if passwords match, False otherwise
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        # Log the specific error for debugging
        if "__about__" in str(e):
            logger.error("This may be a bcrypt compatibility issue with Python 3.13")
        return False

def get_password_hash(password: str) -> str:
    """
    Hash a plain password using bcrypt.
    
    Args:
        password: The plain text password to hash
        
    Returns:
        str: The hashed password
    """
    try:
        return pwd_context.hash(password)
    except Exception as e:
        logger.error(f"Password hashing error: {e}")
        # Log the specific error for debugging
        if "__about__" in str(e):
            logger.error("This may be a bcrypt compatibility issue with Python 3.13")
        raise

def decode_websocket_token(token: str):
    """
    Decode and validate a JWT token for WebSocket connections.
    This is a simplified version that doesn't require database access.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception