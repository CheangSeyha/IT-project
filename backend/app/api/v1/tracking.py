from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.auth import get_current_active_user, require_role
from app.models.user import User, UserRole
from app.models.opportunity import Opportunity
from app.models.tracking import Bookmark, ApplicationTracker, CuratedCollection
from app.schemas.opportunity import OpportunityResponse
from app.schemas.tracking import (
    ApplicationTrackerCreate,
    ApplicationTrackerUpdate,
    ApplicationTrackerResponse,
    CuratedCollectionCreate,
    CuratedCollectionResponse,
)

router = APIRouter()


# --- Bookmarks ---
@router.get("/bookmarks", response_model=List[OpportunityResponse])
async def list_bookmarks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = (
        select(Opportunity)
        .join(Bookmark, Bookmark.opportunity_id == Opportunity.id)
        .where(Bookmark.user_id == current_user.id)
        .order_by(Bookmark.created_at.desc())
    )
    res = await db.execute(query)
    opps = res.scalars().all()
    results = []
    for opp in opps:
        resp = OpportunityResponse.from_orm(opp)
        resp.is_bookmarked = True
        results.append(resp)
    return results


@router.post("/bookmarks/{opportunity_id}")
async def toggle_bookmark(
    opportunity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    res = await db.execute(
        select(Bookmark).where(Bookmark.user_id == current_user.id, Bookmark.opportunity_id == opportunity_id)
    )
    bookmark = res.scalars().first()
    if bookmark:
        await db.delete(bookmark)
        await db.commit()
        return {"bookmarked": False, "message": "Bookmark removed"}
    else:
        new_bm = Bookmark(user_id=current_user.id, opportunity_id=opportunity_id)
        db.add(new_bm)
        await db.commit()
        return {"bookmarked": True, "message": "Bookmark added"}


# --- Application Tracker ---
@router.get("/applications", response_model=List[ApplicationTrackerResponse])
async def list_applications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = (
        select(ApplicationTracker)
        .where(ApplicationTracker.user_id == current_user.id)
        .order_by(ApplicationTracker.updated_at.desc())
    )
    res = await db.execute(query)
    trackers = res.scalars().all()

    items = []
    for tr in trackers:
        opp_res = await db.execute(select(Opportunity).where(Opportunity.id == tr.opportunity_id))
        opp = opp_res.scalars().first()
        tr_resp = ApplicationTrackerResponse.from_orm(tr)
        if opp:
            tr_resp.opportunity = OpportunityResponse.from_orm(opp)
        items.append(tr_resp)
    return items


@router.post("/applications", response_model=ApplicationTrackerResponse)
async def create_application_tracker(
    tracker_in: ApplicationTrackerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    res = await db.execute(
        select(ApplicationTracker).where(
            ApplicationTracker.user_id == current_user.id,
            ApplicationTracker.opportunity_id == tracker_in.opportunity_id,
        )
    )
    existing = res.scalars().first()
    if existing:
        existing.status = tracker_in.status
        existing.notes = tracker_in.notes
        existing.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(existing)
        return ApplicationTrackerResponse.from_orm(existing)

    new_tracker = ApplicationTracker(
        user_id=current_user.id,
        opportunity_id=tracker_in.opportunity_id,
        status=tracker_in.status,
        notes=tracker_in.notes,
        applied_date=datetime.utcnow(),
    )
    db.add(new_tracker)
    await db.commit()
    await db.refresh(new_tracker)
    return ApplicationTrackerResponse.from_orm(new_tracker)


@router.put("/applications/{tracker_id}", response_model=ApplicationTrackerResponse)
async def update_application_tracker(
    tracker_id: int,
    tracker_update: ApplicationTrackerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    res = await db.execute(
        select(ApplicationTracker).where(
            ApplicationTracker.id == tracker_id, ApplicationTracker.user_id == current_user.id
        )
    )
    tracker = res.scalars().first()
    if not tracker:
        raise HTTPException(status_code=404, detail="Application tracker record not found")

    tracker.status = tracker_update.status
    if tracker_update.notes is not None:
        tracker.notes = tracker_update.notes
    tracker.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(tracker)
    return ApplicationTrackerResponse.from_orm(tracker)


@router.delete("/applications/{tracker_id}")
async def delete_application_tracker(
    tracker_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    res = await db.execute(
        select(ApplicationTracker).where(
            ApplicationTracker.id == tracker_id, ApplicationTracker.user_id == current_user.id
        )
    )
    tracker = res.scalars().first()
    if not tracker:
        raise HTTPException(status_code=404, detail="Application tracker record not found")

    await db.delete(tracker)
    await db.commit()
    return {"message": "Application removed from tracker"}


# --- Teacher Curation ---
@router.get("/curated", response_model=List[CuratedCollectionResponse])
async def list_curated_collections(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(CuratedCollection).order_by(CuratedCollection.created_at.desc()))
    return res.scalars().all()


@router.post("/curated", response_model=CuratedCollectionResponse)
async def create_curated_collection(
    collection_in: CuratedCollectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.TEACHER, UserRole.STAFF, UserRole.ADMIN])),
):
    new_collection = CuratedCollection(
        teacher_id=current_user.id,
        title=collection_in.title,
        description=collection_in.description,
        opportunity_ids=",".join(map(str, collection_in.opportunity_ids)),
        target_group=collection_in.target_group,
    )
    db.add(new_collection)
    await db.commit()
    await db.refresh(new_collection)
    return CuratedCollectionResponse.from_orm(new_collection)
