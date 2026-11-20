from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.models.opportunity import OpportunityCategory, LocationType, WorkFormat


class OpportunityBase(BaseModel):
    title: str
    organization: str
    category: OpportunityCategory
    location_type: LocationType
    country: str = "Cambodia"
    province_city: Optional[str] = None
    work_format: WorkFormat = WorkFormat.ON_SITE
    field_of_study: Optional[str] = None
    education_level: Optional[str] = None
    description: str
    requirements: Optional[str] = None
    skills: Optional[str] = None
    salary_or_funding: Optional[str] = None
    local_benefits: Optional[str] = None
    visa_sponsorship: bool = False
    language_requirements: Optional[str] = None
    deadline: Optional[datetime] = None
    source_url: str
    source_name: str
    is_verified: bool = False


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityResponse(OpportunityBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_bookmarked: bool = False

    class Config:
        from_attributes = True


class OpportunityListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[OpportunityResponse]
