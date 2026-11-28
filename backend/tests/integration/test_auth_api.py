import pytest

from tests.conftest import auth_headers, STUDENT, ADMIN

API = "/api/v1/auth"


async def test_health_and_root(client):
    assert (await client.get("/health")).json()["status"] == "healthy"
    assert "docs" in (await client.get("/")).json()


# --- register ---
async def test_register_new_user(client):
    res = await client.post(f"{API}/register", json={"email": "new@x.com", "password": "pw123456", "full_name": "New"})
    assert res.status_code == 200
    body = res.json()
    assert body["email"] == "new@x.com" and body["role"] == "student"
    assert "hashed_password" not in body and "password" not in body


async def test_register_duplicate_email(client):
    res = await client.post(f"{API}/register", json={"email": STUDENT, "password": "pw", "full_name": "Dup"})
    assert res.status_code == 400


async def test_register_invalid_email(client):
    res = await client.post(f"{API}/register", json={"email": "bad", "password": "pw", "full_name": "X"})
    assert res.status_code == 422


@pytest.mark.xfail(strict=True, reason="BUG-01: public register can create an admin")
async def test_register_cannot_create_admin(client):
    res = await client.post(f"{API}/register",
                            json={"email": "eve@x.com", "password": "pw", "full_name": "Eve", "role": "admin"})
    assert res.status_code != 200 or res.json()["role"] != "admin"


# --- login ---
async def test_login_success_returns_token_and_user(client):
    res = await client.post(f"{API}/login", data={"username": STUDENT, "password": "password123"})
    assert res.status_code == 200
    body = res.json()
    assert body["token_type"] == "bearer" and body["access_token"]
    assert body["user"]["email"] == STUDENT


@pytest.mark.parametrize("username,password", [(STUDENT, "wrong"), ("nobody@x.com", "password123")])
async def test_login_bad_credentials(client, username, password):
    res = await client.post(f"{API}/login", data={"username": username, "password": password})
    assert res.status_code == 401


async def test_login_missing_fields(client):
    assert (await client.post(f"{API}/login", data={})).status_code == 422


@pytest.mark.xfail(strict=True, reason="BUG-06: OAuth2 tokenUrl points at missing /auth/login-form")
async def test_oauth2_token_url_route_exists(client):
    res = await client.post(f"{API}/login-form", data={"username": STUDENT, "password": "password123"})
    assert res.status_code == 200


# --- me / profile ---
async def test_me_requires_token(client):
    assert (await client.get(f"{API}/me")).status_code == 401


async def test_me_with_invalid_token(client):
    res = await client.get(f"{API}/me", headers={"Authorization": "Bearer abc.def.ghi"})
    assert res.status_code == 401


async def test_me_returns_current_user(client, student_headers):
    res = await client.get(f"{API}/me", headers=student_headers)
    assert res.status_code == 200 and res.json()["email"] == STUDENT


async def test_update_profile_partial(client, student_headers):
    res = await client.put(f"{API}/profile", json={"skills": "Go, Rust"}, headers=student_headers)
    assert res.status_code == 200
    body = res.json()
    assert body["skills"] == "Go, Rust"
    assert body["full_name"] == "Sokha Chan"  # untouched fields keep their value
    me = (await client.get(f"{API}/me", headers=student_headers)).json()
    assert me["skills"] == "Go, Rust"  # persisted


async def test_update_profile_requires_auth(client):
    assert (await client.put(f"{API}/profile", json={"skills": "x"})).status_code == 401


# --- alert settings ---
async def test_alert_settings_get_and_put(client, student_headers):
    assert (await client.get(f"{API}/alert-settings", headers=student_headers)).status_code == 200
    res = await client.put(f"{API}/alert-settings", json={"frequency": "weekly"}, headers=student_headers)
    assert res.status_code == 200 and res.json()["settings"]["frequency"] == "weekly"


@pytest.mark.xfail(strict=True, reason="BUG-04: alert settings are not persisted")
async def test_alert_settings_persist(client, student_headers):
    await client.put(f"{API}/alert-settings", json={"frequency": "weekly"}, headers=student_headers)
    got = (await client.get(f"{API}/alert-settings", headers=student_headers)).json()
    assert got["frequency"] == "weekly"


# --- admin user management ---
async def test_admin_lists_users(client, admin_headers):
    res = await client.get(f"{API}/users", headers=admin_headers)
    assert res.status_code == 200 and len(res.json()) == 4


async def test_admin_filters_users_by_role_and_query(client, admin_headers):
    res = await client.get(f"{API}/users?role=teacher", headers=admin_headers)
    assert [u["role"] for u in res.json()] == ["teacher"]
    res = await client.get(f"{API}/users?q=sokha", headers=admin_headers)
    assert [u["email"] for u in res.json()] == [STUDENT]


async def test_admin_changes_role(client, admin_headers):
    users = (await client.get(f"{API}/users?role=student", headers=admin_headers)).json()
    res = await client.put(f"{API}/users/{users[0]['id']}/role", json={"role": "teacher"}, headers=admin_headers)
    assert res.status_code == 200 and res.json()["role"] == "teacher"


async def test_change_role_unknown_user(client, admin_headers):
    res = await client.put(f"{API}/users/99999/role", json={"role": "teacher"}, headers=admin_headers)
    assert res.status_code == 404


async def test_change_role_invalid_role(client, admin_headers):
    res = await client.put(f"{API}/users/1/role", json={"role": "king"}, headers=admin_headers)
    assert res.status_code == 422


@pytest.mark.xfail(strict=True, reason="BUG-11: last admin can demote themselves")
async def test_last_admin_cannot_demote_self(client, admin_headers):
    me = (await client.get(f"{API}/me", headers=admin_headers)).json()
    res = await client.put(f"{API}/users/{me['id']}/role", json={"role": "student"}, headers=admin_headers)
    assert res.status_code in (400, 409)
