from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse,
    OpportunityListResponse,
)
from app.schemas.tracking import (
    ApplicationTrackerCreate,
    ApplicationTrackerUpdate,
    ApplicationTrackerResponse,
    CuratedCollectionCreate,
    CuratedCollectionResponse,
)
from app.schemas.scraper import (
    ScraperSourceResponse,
    ScraperLogResponse,
    ScraperHealthMetrics,
)

__all__ = [
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "Token",
    "OpportunityCreate",
    "OpportunityResponse",
    "OpportunityListResponse",
    "ApplicationTrackerCreate",
    "ApplicationTrackerUpdate",
    "ApplicationTrackerResponse",
    "CuratedCollectionCreate",
    "CuratedCollectionResponse",
    "ScraperSourceResponse",
    "ScraperLogResponse",
    "ScraperHealthMetrics",
]
