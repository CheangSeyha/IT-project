from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.auth import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.opportunity import Opportunity, OpportunityCategory, LocationType, WorkFormat
from app.models.tracking import Bookmark
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse,
    OpportunityListResponse,
)

router = APIRouter()


@router.get("", response_model=OpportunityListResponse)
async def list_opportunities(
    q: Optional[str] = Query(None, description="Search keyword in title, company, description, or skills"),
    category: Optional[OpportunityCategory] = Query(None, description="Category filter"),
    location_type: Optional[LocationType] = Query(None, description="Local (Cambodia) vs International"),
    province_city: Optional[str] = Query(None, description="Province/City (e.g. Phnom Penh, Siem Reap)"),
    country: Optional[str] = Query(None, description="Target Country"),
    work_format: Optional[WorkFormat] = Query(None, description="On-site, remote, or hybrid"),
    visa_sponsorship: Optional[bool] = Query(None, description="Requires visa sponsorship"),
    is_verified: Optional[bool] = Query(None, description="Verified institutional listing"),
    closing_soon: Optional[bool] = Query(None, description="Deadline within next 14 days"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    query = select(Opportunity)
    conditions = []

    if q:
        search_filter = or_(
            Opportunity.title.ilike(f"%{q}%"),
            Opportunity.organization.ilike(f"%{q}%"),
            Opportunity.description.ilike(f"%{q}%"),
            Opportunity.skills.ilike(f"%{q}%"),
        )
        conditions.append(search_filter)

    if category:
        conditions.append(Opportunity.category == category)
    if location_type:
        conditions.append(Opportunity.location_type == location_type)
    if province_city:
        conditions.append(Opportunity.province_city.ilike(f"%{province_city}%"))
    if country:
        conditions.append(Opportunity.country.ilike(f"%{country}%"))
    if work_format:
        conditions.append(Opportunity.work_format == work_format)
    if visa_sponsorship is not None:
        conditions.append(Opportunity.visa_sponsorship == visa_sponsorship)
    if is_verified is not None:
        conditions.append(Opportunity.is_verified == is_verified)
    if closing_soon:
        now = datetime.utcnow()
        conditions.append(
            and_(Opportunity.deadline.isnot(None), Opportunity.deadline >= now, Opportunity.deadline <= now + timedelta(days=14))
        )

    if conditions:
        query = query.where(and_(*conditions))

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_res = await db.execute(count_query)
    total = total_res.scalar_one()

    # Pagination & Ordering (latest first)
    query = query.order_by(Opportunity.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    res = await db.execute(query)
    opportunities = res.scalars().all()

    # Determine user bookmarks if logged in
    bookmarked_ids = set()
    if current_user:
        bm_res = await db.execute(select(Bookmark.opportunity_id).where(Bookmark.user_id == current_user.id))
        bookmarked_ids = set(bm_res.scalars().all())

    items = []
    for opp in opportunities:
        opp_dict = OpportunityResponse.from_orm(opp)
        opp_dict.is_bookmarked = opp.id in bookmarked_ids
        items.append(opp_dict)

    return OpportunityListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=items,
    )


@router.get("/{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(
    opportunity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    res = await db.execute(select(Opportunity).where(Opportunity.id == opportunity_id))
    opp = res.scalars().first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    opp_dict = OpportunityResponse.from_orm(opp)
    if current_user:
        bm_res = await db.execute(
            select(Bookmark).where(Bookmark.user_id == current_user.id, Bookmark.opportunity_id == opportunity_id)
        )
        opp_dict.is_bookmarked = bm_res.scalars().first() is not None

    return opp_dict


@router.post("", response_model=OpportunityResponse)
async def create_opportunity(
    opp_in: OpportunityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN])),
):
    new_opp = Opportunity(**opp_in.dict())
    if current_user.role in [UserRole.STAFF, UserRole.ADMIN]:
        new_opp.is_verified = True
    db.add(new_opp)
    await db.commit()
    await db.refresh(new_opp)
    return OpportunityResponse.from_orm(new_opp)


@router.delete("/{opportunity_id}")
async def delete_opportunity(
    opportunity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    res = await db.execute(select(Opportunity).where(Opportunity.id == opportunity_id))
    opp = res.scalars().first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    await db.delete(opp)
    await db.commit()
    return {"message": "Opportunity deleted successfully"}
