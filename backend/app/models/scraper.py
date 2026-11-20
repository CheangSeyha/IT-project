import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from app.core.database import Base


class ScraperStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    ERROR = "error"


class ScraperSource(Base):
    __tablename__ = "scraper_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    target_url = Column(String, nullable=False)
    category = Column(String, nullable=False)
    location_type = Column(String, default="local", nullable=False)
    schedule_interval = Column(String, default="Every 6 hours", nullable=False)
    last_run_at = Column(DateTime, nullable=True)
    status = Column(Enum(ScraperStatus), default=ScraperStatus.ACTIVE, nullable=False)
    items_scraped_total = Column(Integer, default=0)


class ScraperLog(Base):
    __tablename__ = "scraper_logs"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    status = Column(String, default="SUCCESS")
    items_found = Column(Integer, default=0)
    new_items = Column(Integer, default=0)
    duplicates = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
