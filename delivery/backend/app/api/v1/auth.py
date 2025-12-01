from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ...core.auth import authenticate_user, get_current_user
from ...core.security import create_access_token
from ...database import get_db
from ...schemas.user import User
from ...config import settings

router = APIRouter()

@router.post("/token", response_model=dict)
def login_for_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Alias for /token endpoint - more intuitive naming
@router.post("/login", response_model=dict)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """Login endpoint - alias for /token"""
    return login_for_access_token(db, form_data)

@router.post("/register", response_model=User)
def register(
    user_data: dict,
    db: Session = Depends(get_db)
) -> Any:
    from ...api.deps import get_user_by_email, get_user_by_username, create_user
    from ...schemas.user import UserCreate
    
    # Check if user already exists
    user = get_user_by_email(db, email=user_data["email"])
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    user = get_user_by_username(db, username=user_data["username"])
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    user_in = UserCreate(**user_data)
    user = create_user(db=db, user=user_in)
    return user

@router.get("/me", response_model=User)
def read_users_me(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> Any:
    return current_user