import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum
from app.core.database import Base


class UserRole(str, enum.Enum):
    PUBLIC = "public"
    STUDENT = "student"
    TEACHER = "teacher"
    STAFF = "staff"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    field_of_study = Column(String, nullable=True)
    education_level = Column(String, nullable=True)
    skills = Column(String, nullable=True)  # Comma-separated or JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
