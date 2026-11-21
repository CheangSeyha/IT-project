import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import init_db


@pytest.fixture(autouse=True)
async def initialize_database():
    await init_db()


@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_get_opportunities():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/opportunities")
        assert res.status_code == 200
        data = res.json()
        assert "total" in data
        assert "items" in data
        assert len(data["items"]) > 0


@pytest.mark.asyncio
async def test_filter_local_opportunities():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/opportunities?location_type=local")
        assert res.status_code == 200
        data = res.json()
        for item in data["items"]:
            assert item["location_type"] == "local"


@pytest.mark.asyncio
async def test_filter_international_opportunities():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/opportunities?location_type=international")
        assert res.status_code == 200
        data = res.json()
        for item in data["items"]:
            assert item["location_type"] == "international"


@pytest.mark.asyncio
async def test_auth_login():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post(
            "/api/v1/auth/login",
            data={"username": "student@opphub.kh", "password": "password123"}
        )
        assert res.status_code == 200
        body = res.json()
        assert "access_token" in body
        assert body["user"]["email"] == "student@opphub.kh"


@pytest.mark.asyncio
async def test_student_profile_and_alerts():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login_res = await client.post(
            "/api/v1/auth/login",
            data={"username": "student@opphub.kh", "password": "password123"}
        )
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Update profile
        prof_res = await client.put(
            "/api/v1/auth/profile",
            json={"skills": "Python, FastAPI, Next.js, AI", "field_of_study": "Software Engineering"},
            headers=headers
        )
        assert prof_res.status_code == 200
        assert "Python, FastAPI, Next.js, AI" in prof_res.json()["skills"]

        # Alert settings
        alerts_res = await client.get("/api/v1/auth/alert-settings", headers=headers)
        assert alerts_res.status_code == 200
        assert alerts_res.json()["frequency"] == "daily"


@pytest.mark.asyncio
async def test_staff_analytics():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login_res = await client.post(
            "/api/v1/auth/login",
            data={"username": "staff@opphub.kh", "password": "password123"}
        )
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        res = await client.get("/api/v1/tracking/analytics", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert "opportunity_views" in data
        assert "top_keywords" in data
        assert len(data["top_keywords"]) > 0


@pytest.mark.asyncio
async def test_admin_user_management():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login_res = await client.post(
            "/api/v1/auth/login",
            data={"username": "admin@opphub.kh", "password": "password123"}
        )
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # List all users
        users_res = await client.get("/api/v1/auth/users", headers=headers)
        assert users_res.status_code == 200
        users = users_res.json()
        assert len(users) >= 4
