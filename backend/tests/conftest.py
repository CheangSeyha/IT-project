import os
import tempfile

_TMP_DIR = tempfile.mkdtemp(prefix="opphub-tests-")
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{os.path.join(_TMP_DIR, 'test.db')}"
os.environ.setdefault("SECRET_KEY", "test-secret-key")

import pytest  # noqa: E402
from httpx import AsyncClient, ASGITransport  # noqa: E402

from app.main import app  # noqa: E402
from app.core.database import engine, init_db, async_session_maker  # noqa: E402
from app.models import Base  # noqa: E402

PASSWORD = "password123"
STUDENT = "student@opphub.kh"
TEACHER = "teacher@opphub.kh"
STAFF = "staff@opphub.kh"
ADMIN = "admin@opphub.kh"


@pytest.fixture
async def fresh_db():
    """Drop every table, then seed again (like a first server start)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await init_db()
    yield


@pytest.fixture
async def db_session(fresh_db):
    async with async_session_maker() as session:
        yield session


@pytest.fixture
async def client(fresh_db):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


async def auth_headers(client, email, password=PASSWORD):
    res = await client.post("/api/v1/auth/login", data={"username": email, "password": password})
    assert res.status_code == 200, res.text
    return {"Authorization": f"Bearer {res.json()['access_token']}"}


@pytest.fixture
async def student_headers(client):
    return await auth_headers(client, STUDENT)


@pytest.fixture
async def teacher_headers(client):
    return await auth_headers(client, TEACHER)


@pytest.fixture
async def staff_headers(client):
    return await auth_headers(client, STAFF)


@pytest.fixture
async def admin_headers(client):
    return await auth_headers(client, ADMIN)


def new_opportunity(**overrides):
    body = {
        "title": "Test Backend Intern",
        "organization": "Test Org",
        "category": "internship",
        "location_type": "local",
        "province_city": "Phnom Penh",
        "description": "A test listing",
        "skills": "Python, SQL",
    }
    body.update(overrides)
    return body
