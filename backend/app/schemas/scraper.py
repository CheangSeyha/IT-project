from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.models.scraper import ScraperStatus


class ScraperSourceCreate(BaseModel):
    name: str
    target_url: str
    category: str
    location_type: str = "local"
    schedule_interval: str = "Every 6 hours"


class ScraperSourceResponse(BaseModel):
    id: int
    name: str
    target_url: str
    category: str
    location_type: str
    schedule_interval: str
    last_run_at: Optional[datetime] = None
    status: ScraperStatus
    items_scraped_total: int

    class Config:
        from_attributes = True


class ScraperLogResponse(BaseModel):
    id: int
    source_name: str
    started_at: datetime
    finished_at: Optional[datetime] = None
    status: str
    items_found: int
    new_items: int
    duplicates: int
    error_message: Optional[str] = None

    class Config:
        from_attributes = True


class ScraperHealthMetrics(BaseModel):
    total_sources: int
    active_sources: int
    total_items_scraped: int
    last_crawl_time: Optional[datetime] = None
    recent_logs: List[ScraperLogResponse]
