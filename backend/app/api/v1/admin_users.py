"""
Admin Users API Endpoints
User management for administrators
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from ...database import get_db
from ...models import user as user_models
from ...core.auth import get_current_admin_user

router = APIRouter(prefix="/admin/users", tags=["admin-users"])


@router.get("", response_model=Dict[str, Any])
def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    is_active: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Get paginated list of users with optional filters
    """
    try:
        # Base query
        query = db.query(user_models.User)
        
        # Apply search filter
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    user_models.User.email.ilike(search_term),
                    user_models.User.username.ilike(search_term),
                    user_models.User.full_name.ilike(search_term)
                )
            )
        
        # Apply role filter
        if role and role != "all":
            query = query.filter(user_models.User.role == role)
        
        # Apply status filter
        if is_active and is_active != "all":
            is_active_bool = is_active.lower() == "true"
            query = query.filter(user_models.User.is_active == is_active_bool)
        
        # Get total count
        total = query.count()
        
        # Calculate pagination
        total_pages = (total + limit - 1) // limit
        offset = (page - 1) * limit
        
        # Get paginated users
        users = query.order_by(user_models.User.created_at.desc()).offset(offset).limit(limit).all()
        
        # Format response
        users_data = [
            {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "full_name": user.full_name,
                "is_active": user.is_active,
                "role": user.role,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
            for user in users
        ]
        
        return {
            "users": users_data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": total_pages
            }
        }
        
    except Exception as e:
        print(f"Error in get_users: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching users: {str(e)}"
        )


@router.get("/{user_id}", response_model=Dict[str, Any])
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Get single user by ID
    """
    user = db.query(user_models.User).filter(user_models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None
    }


@router.patch("/{user_id}/toggle-status", response_model=Dict[str, Any])
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Toggle user active/inactive status
    """
    # Prevent self-deactivation
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot deactivate your own account"
        )
    
    user = db.query(user_models.User).filter(user_models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Toggle status
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "is_active": user.is_active,
        "message": f"User {'activated' if user.is_active else 'deactivated'} successfully"
    }


@router.patch("/{user_id}/role", response_model=Dict[str, Any])
def update_user_role(
    user_id: int,
    role_data: Dict[str, str],
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Update user role (admin/user)
    """
    # Prevent self role change
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot change your own role"
        )
    
    new_role = role_data.get("role")
    if new_role not in ["admin", "user"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Must be 'admin' or 'user'"
        )
    
    user = db.query(user_models.User).filter(user_models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    user.role = new_role
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "role": user.role,
        "message": f"User role updated to '{new_role}' successfully"
    }


@router.delete("/{user_id}", response_model=Dict[str, Any])
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Delete a user
    """
    # Prevent self-deletion
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own account"
        )
    
    user = db.query(user_models.User).filter(user_models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Store info before deletion
    user_email = user.email
    
    # Delete user
    db.delete(user)
    db.commit()
    
    return {
        "message": f"User '{user_email}' deleted successfully"
    }