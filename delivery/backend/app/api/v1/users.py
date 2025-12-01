from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...core.auth import get_current_active_user, get_current_admin_user
from ...database import get_db
from ...models.user import User
from ...schemas.user import User, UserUpdate
from ...api.deps import get_user_by_email, get_user_by_username

router = APIRouter()

@router.get("/", response_model=List[User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/me", response_model=User)
def read_user_me(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return current_user

@router.put("/me", response_model=User)
def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    from ...core.security import get_password_hash
    
    # Check if email is already taken
    if user_update.email and user_update.email != current_user.email:
        user = get_user_by_email(db, email=user_update.email)
        if user:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
    
    # Check if username is already taken
    if user_update.username and user_update.username != current_user.username:
        user = get_user_by_username(db, username=user_update.username)
        if user:
            raise HTTPException(
                status_code=400,
                detail="The user with this username already exists in the system.",
            )
    
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/{user_id}", response_model=User)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    from ...core.security import get_password_hash
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Check if email is already taken
    if user_update.email and user_update.email != user.email:
        existing_user = get_user_by_email(db, email=user_update.email)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
    
    # Check if username is already taken
    if user_update.username and user_update.username != user.username:
        existing_user = get_user_by_username(db, username=user_update.username)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="The user with this username already exists in the system.",
            )
    
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", response_model=User)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return user