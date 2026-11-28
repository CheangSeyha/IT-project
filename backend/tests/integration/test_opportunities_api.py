from datetime import datetime, timedelta

import pytest

from tests.conftest import new_opportunity, auth_headers, TEACHER, STAFF, ADMIN

API = "/api/v1/opportunities"


async def all_items(client, query=""):
    return (await client.get(f"{API}?page_size=100{query}")).json()["items"]


async def test_list_shape(client):
    body = (await client.get(API)).json()
    assert set(body) == {"total", "page", "page_size", "items"}
    assert body["page"] == 1 and body["page_size"] == 10
    assert body["total"] >= len(body["items"]) > 0


@pytest.mark.parametrize("param,field,value", [
    ("location_type=local", "location_type", "local"),
    ("location_type=international", "location_type", "international"),
    ("category=scholarship", "category", "scholarship"),
    ("category=job", "category", "job"),
    ("work_format=hybrid", "work_format", "hybrid"),
    ("is_verified=true", "is_verified", True),
    ("visa_sponsorship=false", "visa_sponsorship", False),
])
async def test_exact_filters(client, param, field, value):
    items = await all_items(client, f"&{param}")
    assert items, f"seed data should have a match for {param}"
    assert all(i[field] == value for i in items)


async def test_keyword_search_is_case_insensitive(client):
    items = await all_items(client, "&q=fastapi")
    assert items
    for i in items:
        text = " ".join(str(i[k] or "") for k in ("title", "organization", "description", "skills")).lower()
        assert "fastapi" in text


async def test_province_and_country_filters(client):
    assert all("phnom penh" in (i["province_city"] or "").lower() for i in await all_items(client, "&province_city=phnom"))
    assert all("japan" in i["country"].lower() for i in await all_items(client, "&country=japan"))


async def test_closing_soon_within_14_days(client):
    items = await all_items(client, "&closing_soon=true")
    assert items
    now = datetime.utcnow()
    for i in items:
        d = datetime.fromisoformat(i["deadline"])
        assert now <= d <= now + timedelta(days=14)


async def test_combined_filters(client):
    items = await all_items(client, "&location_type=local&category=internship")
    assert items and all(i["location_type"] == "local" and i["category"] == "internship" for i in items)


async def test_no_match_returns_empty(client):
    body = (await client.get(f"{API}?q=zzzznotfound")).json()
    assert body["total"] == 0 and body["items"] == []


async def test_pagination_pages_do_not_overlap(client):
    total = (await client.get(API)).json()["total"]
    p1 = (await client.get(f"{API}?page=1&page_size=5")).json()["items"]
    p2 = (await client.get(f"{API}?page=2&page_size=5")).json()["items"]
    assert len(p1) == 5 and len(p2) == min(5, total - 5)
    assert not {i["id"] for i in p1} & {i["id"] for i in p2}


@pytest.mark.parametrize("query", ["page=0", "page_size=0", "page_size=101", "category=party", "location_type=mars"])
async def test_invalid_query_params(client, query):
    assert (await client.get(f"{API}?{query}")).status_code == 422


async def test_get_one_and_404(client):
    first = (await all_items(client))[0]
    res = await client.get(f"{API}/{first['id']}")
    assert res.status_code == 200 and res.json()["title"] == first["title"]
    assert (await client.get(f"{API}/999999")).status_code == 404


async def test_is_bookmarked_flag_for_logged_in_user(client, student_headers):
    opp_id = (await all_items(client))[0]["id"]
    await client.post(f"/api/v1/tracking/bookmarks/{opp_id}", headers=student_headers)
    assert (await client.get(f"{API}/{opp_id}", headers=student_headers)).json()["is_bookmarked"] is True
    listed = {i["id"]: i for i in (await client.get(f"{API}?page_size=100", headers=student_headers)).json()["items"]}
    assert listed[opp_id]["is_bookmarked"] is True
    assert (await client.get(f"{API}/{opp_id}")).json()["is_bookmarked"] is False  # anonymous


# --- CRUD + RBAC ---
@pytest.mark.parametrize("who", [TEACHER, STAFF, ADMIN])
async def test_staff_roles_can_create_and_it_is_verified(client, who):
    headers = await auth_headers(client, who)
    res = await client.post(API, json=new_opportunity(), headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert body["id"] and body["is_verified"] is True
    assert (await client.get(f"{API}/{body['id']}")).status_code == 200


async def test_student_cannot_create(client, student_headers):
    assert (await client.post(API, json=new_opportunity(), headers=student_headers)).status_code == 403


async def test_anonymous_cannot_create(client):
    assert (await client.post(API, json=new_opportunity())).status_code == 401


async def test_create_invalid_body(client, admin_headers):
    assert (await client.post(API, json={"title": "only title"}, headers=admin_headers)).status_code == 422


async def test_update_partial(client, admin_headers):
    opp = (await client.post(API, json=new_opportunity(), headers=admin_headers)).json()
    res = await client.put(f"{API}/{opp['id']}", json={"title": "Renamed"}, headers=admin_headers)
    assert res.status_code == 200
    body = res.json()
    assert body["title"] == "Renamed" and body["organization"] == "Test Org"
    assert body["updated_at"] >= opp["updated_at"]


async def test_update_404_and_forbidden(client, admin_headers, student_headers):
    assert (await client.put(f"{API}/999999", json={"title": "x"}, headers=admin_headers)).status_code == 404
    assert (await client.put(f"{API}/1", json={"title": "x"}, headers=student_headers)).status_code == 403


async def test_delete(client, admin_headers, student_headers):
    opp = (await client.post(API, json=new_opportunity(), headers=admin_headers)).json()
    assert (await client.delete(f"{API}/{opp['id']}", headers=student_headers)).status_code == 403
    assert (await client.delete(f"{API}/{opp['id']}", headers=admin_headers)).status_code == 200
    assert (await client.get(f"{API}/{opp['id']}")).status_code == 404
    assert (await client.delete(f"{API}/{opp['id']}", headers=admin_headers)).status_code == 404


@pytest.mark.xfail(strict=True, reason="BUG-07: teacher can delete any listing (no ownership)")
async def test_teacher_cannot_delete_crawled_listing(client, teacher_headers):
    crawled = next(i for i in await all_items(client) if i["source_name"] != "OppHub Verified Listing")
    assert (await client.delete(f"{API}/{crawled['id']}", headers=teacher_headers)).status_code == 403
