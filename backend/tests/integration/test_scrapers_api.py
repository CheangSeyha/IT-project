import pytest

from tests.conftest import auth_headers, STAFF, TEACHER, STUDENT

API = "/api/v1/scrapers"
SOURCE = {"name": "Test Board", "target_url": "https://example.com/jobs", "category": "job"}


@pytest.mark.parametrize("method,path", [
    ("get", "/sources"), ("post", "/sources"), ("delete", "/sources/1"),
    ("post", "/sources/1/run"), ("get", "/logs"), ("get", "/health-metrics"),
])
@pytest.mark.parametrize("who", [STAFF, TEACHER, STUDENT])
async def test_non_admin_forbidden(client, method, path, who):
    kwargs = {"headers": await auth_headers(client, who)}
    if method == "post" and path == "/sources":
        kwargs["json"] = SOURCE
    assert (await getattr(client, method)(f"{API}{path}", **kwargs)).status_code == 403


async def test_anonymous_unauthorized(client):
    assert (await client.get(f"{API}/sources")).status_code == 401


async def test_list_sources(client, admin_headers):
    res = await client.get(f"{API}/sources", headers=admin_headers)
    assert res.status_code == 200
    ids = [s["id"] for s in res.json()]
    assert ids == sorted(ids) and len(ids) >= 1


async def test_create_run_and_delete_source(client, admin_headers):
    src = (await client.post(f"{API}/sources", json=SOURCE, headers=admin_headers)).json()
    assert src["status"] == "active" and src["items_scraped_total"] == 0
    assert src["location_type"] == "local" and src["schedule_interval"] == "Every 6 hours"

    log = await client.post(f"{API}/sources/{src['id']}/run", headers=admin_headers)
    assert log.status_code == 200
    assert log.json()["source_name"] == "Test Board" and log.json()["status"] == "SUCCESS"

    after = next(s for s in (await client.get(f"{API}/sources", headers=admin_headers)).json() if s["id"] == src["id"])
    assert after["items_scraped_total"] == log.json()["new_items"]
    assert after["last_run_at"] is not None

    logs = (await client.get(f"{API}/logs", headers=admin_headers)).json()
    assert logs[0]["id"] == log.json()["id"]  # newest first

    assert (await client.delete(f"{API}/sources/{src['id']}", headers=admin_headers)).status_code == 200
    assert (await client.delete(f"{API}/sources/{src['id']}", headers=admin_headers)).status_code == 404


async def test_run_missing_source(client, admin_headers):
    assert (await client.post(f"{API}/sources/99999/run", headers=admin_headers)).status_code == 404


async def test_create_source_invalid(client, admin_headers):
    assert (await client.post(f"{API}/sources", json={"name": "x"}, headers=admin_headers)).status_code == 422


async def test_logs_limited_to_20(client, admin_headers):
    for _ in range(22):
        await client.post(f"{API}/sources/1/run", headers=admin_headers)
    assert len((await client.get(f"{API}/logs", headers=admin_headers)).json()) == 20


async def test_health_metrics_match_sources(client, admin_headers):
    m = (await client.get(f"{API}/health-metrics", headers=admin_headers)).json()
    sources = (await client.get(f"{API}/sources", headers=admin_headers)).json()
    assert m["total_sources"] == len(sources)
    assert m["active_sources"] == sum(s["status"] == "active" for s in sources)
    assert m["total_items_scraped"] == sum(s["items_scraped_total"] for s in sources)
    assert len(m["recent_logs"]) <= 5
    assert m["last_crawl_time"] == m["recent_logs"][0]["started_at"]
