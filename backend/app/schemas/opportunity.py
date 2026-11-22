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
    source_url: str = "https://opphub.kh/verified-post"
    source_name: str = "OppHub Verified Listing"
    is_verified: bool = False


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    category: Optional[OpportunityCategory] = None
    location_type: Optional[LocationType] = None
    country: Optional[str] = None
    province_city: Optional[str] = None
    work_format: Optional[WorkFormat] = None
    field_of_study: Optional[str] = None
    education_level: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    skills: Optional[str] = None
    salary_or_funding: Optional[str] = None
    local_benefits: Optional[str] = None
    visa_sponsorship: Optional[bool] = None
    language_requirements: Optional[str] = None
    deadline: Optional[datetime] = None
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    is_verified: Optional[bool] = None


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
