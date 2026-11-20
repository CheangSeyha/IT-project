from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.models.tracking import ApplicationStatus
from app.schemas.opportunity import OpportunityResponse


class ApplicationTrackerCreate(BaseModel):
    opportunity_id: int
    status: ApplicationStatus = ApplicationStatus.SAVED
    notes: Optional[str] = None


class ApplicationTrackerUpdate(BaseModel):
    status: ApplicationStatus
    notes: Optional[str] = None


class ApplicationTrackerResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    status: ApplicationStatus
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None
    updated_at: datetime
    opportunity: Optional[OpportunityResponse] = None

    class Config:
        from_attributes = True


class CuratedCollectionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    opportunity_ids: List[int]
    target_group: Optional[str] = None


class CuratedCollectionResponse(BaseModel):
    id: int
    teacher_id: int
    title: str
    description: Optional[str] = None
    opportunity_ids: str
    target_group: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
