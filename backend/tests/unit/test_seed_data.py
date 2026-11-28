import pytest
from sqlalchemy import select, func

from app.core.database import engine, async_session_maker
from app.models import Base, User, Opportunity, ScraperSource, ScraperLog, CuratedCollection
from app.services.seed_data import seed_initial_data


@pytest.fixture
async def empty_session():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    async with async_session_maker() as s:
        yield s


async def count(s, model):
    return (await s.execute(select(func.count()).select_from(model))).scalar_one()


async def test_seed_creates_one_user_per_role(empty_session):
    await seed_initial_data(empty_session)
    roles = (await empty_session.execute(select(User.role))).scalars().all()
    assert {r.value for r in roles} == {"student", "teacher", "staff", "admin"}


async def test_seed_creates_opportunities_sources_logs(empty_session):
    await seed_initial_data(empty_session)
    assert await count(empty_session, Opportunity) >= 10
    assert await count(empty_session, ScraperSource) >= 1
    assert await count(empty_session, ScraperLog) >= 1


async def test_seed_is_idempotent(empty_session):
    await seed_initial_data(empty_session)
    users, opps = await count(empty_session, User), await count(empty_session, Opportunity)
    await seed_initial_data(empty_session)
    assert await count(empty_session, User) == users
    assert await count(empty_session, Opportunity) == opps


@pytest.mark.xfail(strict=True, reason="BUG-03: curated collections only seeded on 2nd start")
async def test_seed_creates_curated_on_first_run(empty_session):
    await seed_initial_data(empty_session)
    assert await count(empty_session, CuratedCollection) >= 1
