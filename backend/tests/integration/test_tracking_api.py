import asyncio

import pytest
from sqlalchemy import select, func

from app.core.database import async_session_maker
from app.models.tracking import Bookmark
from tests.conftest import auth_headers, STUDENT, TEACHER, STAFF, ADMIN

API = "/api/v1/tracking"


# --- bookmarks ---
async def test_bookmark_toggle_on_and_off(client, student_headers):
    on = await client.post(f"{API}/bookmarks/1", headers=student_headers)
    assert on.json()["bookmarked"] is True
    assert [o["id"] for o in (await client.get(f"{API}/bookmarks", headers=student_headers)).json()] == [1]
    off = await client.post(f"{API}/bookmarks/1", headers=student_headers)
    assert off.json()["bookmarked"] is False
    assert (await client.get(f"{API}/bookmarks", headers=student_headers)).json() == []


async def test_bookmarks_are_per_user(client, student_headers, teacher_headers):
    await client.post(f"{API}/bookmarks/1", headers=student_headers)
    assert (await client.get(f"{API}/bookmarks", headers=teacher_headers)).json() == []


async def test_bookmarks_list_newest_first_and_flagged(client, student_headers):
    for opp_id in (1, 2, 3):
        await client.post(f"{API}/bookmarks/{opp_id}", headers=student_headers)
    items = (await client.get(f"{API}/bookmarks", headers=student_headers)).json()
    assert [o["id"] for o in items] == [3, 2, 1]
    assert all(o["is_bookmarked"] for o in items)


async def test_bookmarks_require_login(client):
    assert (await client.get(f"{API}/bookmarks")).status_code == 401
    assert (await client.post(f"{API}/bookmarks/1")).status_code == 401


@pytest.mark.xfail(strict=True, reason="BUG-02: bookmark on non-existent opportunity accepted")
async def test_bookmark_missing_opportunity_404(client, student_headers):
    assert (await client.post(f"{API}/bookmarks/999999", headers=student_headers)).status_code == 404


@pytest.mark.xfail(strict=True, reason="BUG-09: concurrent toggles create duplicate bookmarks")
async def test_concurrent_bookmarks_no_duplicates(client, student_headers):
    await asyncio.gather(*[client.post(f"{API}/bookmarks/2", headers=student_headers) for _ in range(6)])
    async with async_session_maker() as s:
        n = (await s.execute(select(func.count()).select_from(Bookmark))).scalar_one()
    assert n <= 1


# --- applications ---
async def test_application_lifecycle(client, student_headers):
    created = await client.post(f"{API}/applications", json={"opportunity_id": 1, "notes": "CV ready"},
                                headers=student_headers)
    assert created.status_code == 200
    tr = created.json()
    assert tr["status"] == "saved" and tr["notes"] == "CV ready" and tr["applied_date"]

    board = (await client.get(f"{API}/applications", headers=student_headers)).json()
    assert len(board) == 1 and board[0]["opportunity"]["id"] == 1

    upd = await client.put(f"{API}/applications/{tr['id']}", json={"status": "interviewing"}, headers=student_headers)
    assert upd.json()["status"] == "interviewing"
    assert upd.json()["notes"] == "CV ready"  # notes kept when not sent

    assert (await client.delete(f"{API}/applications/{tr['id']}", headers=student_headers)).status_code == 200
    assert (await client.get(f"{API}/applications", headers=student_headers)).json() == []


async def test_create_application_twice_updates_existing(client, student_headers):
    a = (await client.post(f"{API}/applications", json={"opportunity_id": 1}, headers=student_headers)).json()
    b = (await client.post(f"{API}/applications", json={"opportunity_id": 1, "status": "applied"},
                           headers=student_headers)).json()
    assert a["id"] == b["id"] and b["status"] == "applied"
    assert len((await client.get(f"{API}/applications", headers=student_headers)).json()) == 1


async def test_cannot_touch_other_users_application(client, student_headers, teacher_headers):
    tr = (await client.post(f"{API}/applications", json={"opportunity_id": 1}, headers=student_headers)).json()
    assert (await client.put(f"{API}/applications/{tr['id']}", json={"status": "rejected"},
                             headers=teacher_headers)).status_code == 404
    assert (await client.delete(f"{API}/applications/{tr['id']}", headers=teacher_headers)).status_code == 404


async def test_application_errors(client, student_headers):
    assert (await client.put(f"{API}/applications/99999", json={"status": "applied"},
                             headers=student_headers)).status_code == 404
    assert (await client.delete(f"{API}/applications/99999", headers=student_headers)).status_code == 404
    assert (await client.post(f"{API}/applications", json={"opportunity_id": 1, "status": "hired"},
                              headers=student_headers)).status_code == 422
    assert (await client.get(f"{API}/applications")).status_code == 401


@pytest.mark.xfail(strict=True, reason="BUG-02: application on non-existent opportunity accepted")
async def test_application_missing_opportunity_404(client, student_headers):
    res = await client.post(f"{API}/applications", json={"opportunity_id": 999999}, headers=student_headers)
    assert res.status_code == 404


# --- curated collections ---
async def test_teacher_creates_and_deletes_collection(client, teacher_headers):
    res = await client.post(f"{API}/curated", json={"title": "AI picks", "opportunity_ids": [1, 2], "target_group": "Y4"},
                            headers=teacher_headers)
    assert res.status_code == 200
    col = res.json()
    assert col["opportunity_ids"] == "1,2"
    assert col["id"] in [c["id"] for c in (await client.get(f"{API}/curated")).json()]  # public list
    assert (await client.delete(f"{API}/curated/{col['id']}", headers=teacher_headers)).status_code == 200
    assert (await client.delete(f"{API}/curated/{col['id']}", headers=teacher_headers)).status_code == 404


async def test_student_cannot_curate(client, student_headers):
    res = await client.post(f"{API}/curated", json={"title": "x", "opportunity_ids": [1]}, headers=student_headers)
    assert res.status_code == 403


async def test_teacher_cannot_delete_other_teachers_collection(client, teacher_headers, admin_headers):
    # a second teacher
    await client.post("/api/v1/auth/register", json={"email": "t2@x.com", "password": "pw123456", "full_name": "T2"})
    users = (await client.get("/api/v1/auth/users?q=t2@x.com", headers=admin_headers)).json()
    await client.put(f"/api/v1/auth/users/{users[0]['id']}/role", json={"role": "teacher"}, headers=admin_headers)
    t2 = await auth_headers(client, "t2@x.com", "pw123456")

    col = (await client.post(f"{API}/curated", json={"title": "mine", "opportunity_ids": [1]},
                             headers=teacher_headers)).json()
    assert (await client.delete(f"{API}/curated/{col['id']}", headers=t2)).status_code == 403
    assert (await client.delete(f"{API}/curated/{col['id']}", headers=admin_headers)).status_code == 200


# --- analytics ---
@pytest.mark.parametrize("who,code", [(STAFF, 200), (ADMIN, 200), (TEACHER, 403), (STUDENT, 403)])
async def test_analytics_access(client, who, code):
    res = await client.get(f"{API}/analytics", headers=await auth_headers(client, who))
    assert res.status_code == code
    if code == 200:
        assert {"opportunity_views", "verified_postings", "top_keywords", "category_distribution"} <= set(res.json())


async def test_analytics_verified_count_is_real(client, staff_headers):
    data = (await client.get(f"{API}/analytics", headers=staff_headers)).json()
    verified = (await client.get("/api/v1/opportunities?is_verified=true")).json()["total"]
    assert data["verified_postings"] == verified


@pytest.mark.xfail(strict=True, reason="BUG-05: analytics uses invented minimum numbers")
async def test_analytics_bookmarks_reflect_db(client, staff_headers):
    assert (await client.get(f"{API}/analytics", headers=staff_headers)).json()["student_bookmarks"] == 0


# --- notifications ---
async def test_notifications_public_and_typed(client):
    res = await client.get(f"{API}/notifications")
    assert res.status_code == 200
    notes = res.json()
    assert notes
    assert {n["type"] for n in notes} <= {"deadline", "opportunity", "curation", "system"}
    assert len({n["id"] for n in notes}) == len(notes)  # unique ids
    assert "deadline" in {n["type"] for n in notes}  # seed has deadlines within 14 days
