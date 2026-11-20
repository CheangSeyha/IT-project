from app.core.database import Base
from app.models.user import User, UserRole
from app.models.opportunity import Opportunity, OpportunityCategory, LocationType, WorkFormat
from app.models.tracking import Bookmark, ApplicationTracker, ApplicationStatus, CuratedCollection
from app.models.scraper import ScraperSource, ScraperLog, ScraperStatus

__all__ = [
    "Base",
    "User",
    "UserRole",
    "Opportunity",
    "OpportunityCategory",
    "LocationType",
    "WorkFormat",
    "Bookmark",
    "ApplicationTracker",
    "ApplicationStatus",
    "CuratedCollection",
    "ScraperSource",
    "ScraperLog",
    "ScraperStatus",
]
