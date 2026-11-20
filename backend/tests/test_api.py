import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


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
