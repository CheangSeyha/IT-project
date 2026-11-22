from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.auth import require_role
from app.models.user import User, UserRole
from app.models.scraper import ScraperSource, ScraperLog, ScraperStatus
from app.schemas.scraper import (
    ScraperSourceCreate,
    ScraperSourceResponse,
    ScraperLogResponse,
    ScraperHealthMetrics,
)

router = APIRouter()


@router.get("/sources", response_model=List[ScraperSourceResponse])
async def list_scraper_sources(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    res = await db.execute(select(ScraperSource).order_by(ScraperSource.id.asc()))
    return res.scalars().all()


@router.post("/sources", response_model=ScraperSourceResponse)
async def create_scraper_source(
    source_in: ScraperSourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    source = ScraperSource(
        name=source_in.name,
        target_url=source_in.target_url,
        category=source_in.category,
        location_type=source_in.location_type,
        schedule_interval=source_in.schedule_interval,
        status=ScraperStatus.ACTIVE,
        items_scraped_total=0,
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)
    return source


@router.delete("/sources/{source_id}")
async def delete_scraper_source(
    source_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    res = await db.execute(select(ScraperSource).where(ScraperSource.id == source_id))
    source = res.scalars().first()
    if not source:
        raise HTTPException(status_code=404, detail="Scraper source not found")
    await db.delete(source)
    await db.commit()
    return {"message": "Scraper source deleted"}


@router.post("/sources/{source_id}/run", response_model=ScraperLogResponse)
async def trigger_scraper(
    source_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    res = await db.execute(select(ScraperSource).where(ScraperSource.id == source_id))
    source = res.scalars().first()
    if not source:
        raise HTTPException(status_code=404, detail="Scraper source not found")

    now = datetime.utcnow()
    # Simulate a successful scrape execution run
    log = ScraperLog(
        source_name=source.name,
        started_at=now,
        finished_at=now,
        status="SUCCESS",
        items_found=12,
        new_items=2,
        duplicates=10,
    )
    db.add(log)
    source.last_run_at = now
    source.items_scraped_total += 2
    await db.commit()
    await db.refresh(log)
    return log


@router.get("/logs", response_model=List[ScraperLogResponse])
async def list_scraper_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    res = await db.execute(select(ScraperLog).order_by(ScraperLog.started_at.desc()).limit(20))
    return res.scalars().all()


@router.get("/health-metrics", response_model=ScraperHealthMetrics)
async def get_scraper_health(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    total_sources_res = await db.execute(select(func.count(ScraperSource.id)))
    total_sources = total_sources_res.scalar_one()

    active_sources_res = await db.execute(
        select(func.count(ScraperSource.id)).where(ScraperSource.status == ScraperStatus.ACTIVE)
    )
    active_sources = active_sources_res.scalar_one()

    total_scraped_res = await db.execute(select(func.sum(ScraperSource.items_scraped_total)))
    total_items = total_scraped_res.scalar_one() or 0

    logs_res = await db.execute(select(ScraperLog).order_by(ScraperLog.started_at.desc()).limit(5))
    recent_logs = logs_res.scalars().all()

    last_time = recent_logs[0].started_at if recent_logs else None

    return ScraperHealthMetrics(
        total_sources=total_sources,
        active_sources=active_sources,
        total_items_scraped=total_items,
        last_crawl_time=last_time,
        recent_logs=recent_logs,
    )
