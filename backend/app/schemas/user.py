from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.STUDENT
    field_of_study: Optional[str] = None
    education_level: Optional[str] = None
    skills: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=1)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    field_of_study: Optional[str] = None
    education_level: Optional[str] = None
    skills: Optional[str] = None


class UserRoleUpdate(BaseModel):
    role: UserRole


class AlertSettingsUpdate(BaseModel):
    frequency: str = "daily"
    email_enabled: bool = True
    telegram_enabled: bool = True
    deadline_alerts: bool = True
    scholarship_alerts: bool = True
    job_alerts: bool = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
