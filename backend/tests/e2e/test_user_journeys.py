import os
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import httpx
import pytest

pytestmark = pytest.mark.e2e
BACKEND_DIR = Path(__file__).resolve().parents[2]


def _free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


@pytest.fixture(scope="module")
def server():
    port = _free_port()
    db = os.path.join(tempfile.mkdtemp(prefix="opphub-e2e-"), "e2e.db")
    env = {**os.environ, "DATABASE_URL": f"sqlite+aiosqlite:///{db}", "SECRET_KEY": "e2e-secret"}
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", str(port)],
        cwd=BACKEND_DIR, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
    )
    base = f"http://127.0.0.1:{port}"
    for _ in range(100):  # wait up to ~20 s for startup + seeding
        try:
            if httpx.get(f"{base}/health", timeout=1).status_code == 200:
                break
        except httpx.HTTPError:
            pass
        if proc.poll() is not None:
            pytest.fail("server exited early:\n" + proc.stdout.read().decode())
        time.sleep(0.2)
    else:
        proc.kill()
        pytest.fail("server did not start")
    yield base
    proc.terminate()
    proc.wait(timeout=10)


@pytest.fixture
def http(server):
    with httpx.Client(base_url=f"{server}/api/v1", timeout=10) as c:
        yield c


def login(http, email, password="password123"):
    r = http.post("/auth/login", data={"username": email, "password": password})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_server_is_up_and_docs_served(server):
    assert httpx.get(f"{server}/health").json()["status"] == "healthy"
    assert httpx.get(f"{server}/openapi.json").status_code == 200


def test_public_visitor_searches_without_account(http):
    res = http.get("/opportunities", params={"location_type": "international", "category": "scholarship"})
    assert res.status_code == 200
    items = res.json()["items"]
    assert items
    detail = http.get(f"/opportunities/{items[0]['id']}").json()
    assert detail["title"] == items[0]["title"] and detail["is_bookmarked"] is False
    # but cannot use personal features
    assert http.get("/tracking/bookmarks").status_code == 401


def test_new_student_journey(http):
    """register -> login -> profile -> search -> bookmark -> track application -> move through pipeline."""
    email = f"e2e-{time.time_ns()}@student.kh"
    reg = http.post("/auth/register", json={"email": email, "password": "Str0ngPass!", "full_name": "E2E Student"})
    assert reg.status_code == 200 and reg.json()["role"] == "student"
    h = login(http, email, "Str0ngPass!")

    assert http.get("/auth/me", headers=h).json()["email"] == email
    prof = http.put("/auth/profile", json={"skills": "Python, FastAPI", "field_of_study": "CS"}, headers=h)
    assert prof.json()["skills"] == "Python, FastAPI"

    found = http.get("/opportunities", params={"q": "python"}, headers=h).json()["items"]
    assert found
    opp_id = found[0]["id"]

    assert http.post(f"/tracking/bookmarks/{opp_id}", headers=h).json()["bookmarked"] is True
    assert http.get(f"/opportunities/{opp_id}", headers=h).json()["is_bookmarked"] is True
    assert [o["id"] for o in http.get("/tracking/bookmarks", headers=h).json()] == [opp_id]

    tr = http.post("/tracking/applications", json={"opportunity_id": opp_id}, headers=h).json()
    for status in ("preparing", "applied", "interviewing", "offered"):
        r = http.put(f"/tracking/applications/{tr['id']}", json={"status": status}, headers=h)
        assert r.status_code == 200 and r.json()["status"] == status
    board = http.get("/tracking/applications", headers=h).json()
    assert board[0]["status"] == "offered" and board[0]["opportunity"]["id"] == opp_id

    assert http.post(f"/tracking/bookmarks/{opp_id}", headers=h).json()["bookmarked"] is False
    assert http.delete(f"/tracking/applications/{tr['id']}", headers=h).status_code == 200
    assert http.get("/tracking/applications", headers=h).json() == []


def test_teacher_posts_and_curates_student_sees_it(http):
    t = login(http, "teacher@opphub.kh")
    opp = http.post("/opportunities", headers=t, json={
        "title": "E2E Capstone Lab Assistant", "organization": "Faculty", "category": "school_work",
        "location_type": "local", "description": "Help in the lab"}).json()
    assert opp["is_verified"] is True

    col = http.post("/tracking/curated", headers=t,
                    json={"title": "E2E picks", "opportunity_ids": [opp["id"]], "target_group": "Year 5"}).json()

    s = login(http, "student@opphub.kh")
    assert any(o["id"] == opp["id"] for o in
               http.get("/opportunities", params={"q": "E2E Capstone"}, headers=s).json()["items"])
    assert any(c["id"] == col["id"] for c in http.get("/tracking/curated").json())
    assert any(n["type"] == "curation" for n in http.get("/tracking/notifications").json())
    # student may not delete it
    assert http.delete(f"/opportunities/{opp['id']}", headers=s).status_code == 403

    assert http.delete(f"/tracking/curated/{col['id']}", headers=t).status_code == 200
    assert http.delete(f"/opportunities/{opp['id']}", headers=t).status_code == 200
    assert http.get(f"/opportunities/{opp['id']}").status_code == 404


def test_staff_views_analytics(http):
    h = login(http, "staff@opphub.kh")
    data = http.get("/tracking/analytics", headers=h).json()
    assert data["verified_postings"] >= 1 and data["top_keywords"]
    assert http.get("/scrapers/sources", headers=h).status_code == 403  # admin only


def test_admin_manages_users_and_crawlers(http):
    a = login(http, "admin@opphub.kh")
    email = f"e2e-promote-{time.time_ns()}@x.kh"
    uid = http.post("/auth/register", json={"email": email, "password": "Pass12345", "full_name": "P"}).json()["id"]

    assert http.put(f"/auth/users/{uid}/role", json={"role": "staff"}, headers=a).json()["role"] == "staff"
    promoted = login(http, email, "Pass12345")
    assert http.get("/tracking/analytics", headers=promoted).status_code == 200  # new role works immediately

    src = http.post("/scrapers/sources", headers=a,
                    json={"name": "E2E Board", "target_url": "https://example.com", "category": "job"}).json()
    run = http.post(f"/scrapers/sources/{src['id']}/run", headers=a).json()
    assert run["source_name"] == "E2E Board"
    metrics = http.get("/scrapers/health-metrics", headers=a).json()
    assert metrics["recent_logs"][0]["id"] == run["id"]
    assert http.delete(f"/scrapers/sources/{src['id']}", headers=a).status_code == 200


def test_visitor_cannot_become_admin(http):
    email = f"e2e-eve-{time.time_ns()}@x.kh"
    http.post("/auth/register", json={"email": email, "password": "x", "full_name": "Eve", "role": "admin"})
    assert http.get("/auth/users", headers=login(http, email, "x")).status_code == 403
