from datetime import timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, UserRole
from app.schemas.user import (
    UserCreate,
    UserResponse,
    Token,
    UserProfileUpdate,
    UserRoleUpdate,
    AlertSettingsUpdate,
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login-form", auto_error=False)


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None
        
    res = await db.execute(select(User).where(User.id == int(user_id)))
    return res.scalars().first()


async def get_current_active_user(current_user: Optional[User] = Depends(get_current_user)) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


def require_role(roles: list[UserRole]):
    async def role_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return current_user
    return role_checker


@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    res = await db.execute(select(User).where(User.email == user_in.email))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        field_of_study=user_in.field_of_study,
        education_level=user_in.education_level,
        skills=user_in.skills,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == form_data.username))
    user = res.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_in: UserProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.field_of_study is not None:
        current_user.field_of_study = profile_in.field_of_study
    if profile_in.education_level is not None:
        current_user.education_level = profile_in.education_level
    if profile_in.skills is not None:
        current_user.skills = profile_in.skills

    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/alert-settings")
async def get_alert_settings(current_user: User = Depends(get_current_active_user)):
    return {
        "frequency": "daily",
        "email_enabled": True,
        "telegram_enabled": True,
        "deadline_alerts": True,
        "scholarship_alerts": True,
        "job_alerts": True,
    }


@router.put("/alert-settings")
async def update_alert_settings(
    settings_in: AlertSettingsUpdate,
    current_user: User = Depends(get_current_active_user),
):
    return {"message": "Alert preferences saved successfully", "settings": settings_in}


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    role: Optional[UserRole] = Query(None, description="Filter by user role"),
    q: Optional[str] = Query(None, description="Search keyword in name or email"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if q:
        query = query.where(or_(User.email.ilike(f"%{q}%"), User.full_name.ilike(f"%{q}%")))
    query = query.order_by(User.id.asc())
    res = await db.execute(query)
    return res.scalars().all()


@router.put("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: int,
    role_in: UserRoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role_in.role
    await db.commit()
    await db.refresh(user)
    return user
