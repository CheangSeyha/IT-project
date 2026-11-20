from fastapi import APIRouter
from app.api.v1 import auth, opportunities, tracking, scrapers

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & RBAC"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Opportunities & Faceted Search"])
api_router.include_router(tracking.router, prefix="/tracking", tags=["Tracking & Curation"])
api_router.include_router(scrapers.router, prefix="/scrapers", tags=["Scraper Management"])
