import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum
from app.core.database import Base


class OpportunityCategory(str, enum.Enum):
    JOB = "job"
    INTERNSHIP = "internship"
    UPSKILLING = "upskilling"
    SCHOLARSHIP = "scholarship"
    SCHOOL_WORK = "school_work"


class LocationType(str, enum.Enum):
    LOCAL = "local"
    INTERNATIONAL = "international"


class WorkFormat(str, enum.Enum):
    ON_SITE = "on_site"
    REMOTE = "remote"
    HYBRID = "hybrid"


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    organization = Column(String, index=True, nullable=False)
    category = Column(Enum(OpportunityCategory), index=True, nullable=False)
    location_type = Column(Enum(LocationType), index=True, nullable=False)
    
    # Location details
    country = Column(String, default="Cambodia", index=True, nullable=False)
    province_city = Column(String, nullable=True, index=True)  # e.g., Phnom Penh, Siem Reap, Tokyo, London
    
    # Format and attributes
    work_format = Column(Enum(WorkFormat), default=WorkFormat.ON_SITE, nullable=False)
    field_of_study = Column(String, nullable=True, index=True)  # IT, Business, Engineering, Healthcare
    education_level = Column(String, nullable=True)  # High School, Bachelor, Master, Any
    
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    skills = Column(String, nullable=True)  # Comma-separated string of skills e.g., "Python, React, SQL"
    
    # Compensation / Funding
    salary_or_funding = Column(String, nullable=True)  # e.g. "$600 - $1000", "Fully Funded", "Tuition Waiver"
    local_benefits = Column(String, nullable=True)  # e.g. "NSSF, Health Insurance, Annual Trip, Lunch"
    visa_sponsorship = Column(Boolean, default=False)
    language_requirements = Column(String, nullable=True)  # e.g. "Khmer, English", "IELTS 6.5+"
    
    deadline = Column(DateTime, nullable=True, index=True)
    source_url = Column(String, nullable=False)
    source_name = Column(String, nullable=False)  # e.g., "CamHR", "BongThom", "MEXT", "Chevening"
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
