# OpportunityHub — Backend

- [1. Requirements](#1-requirements)
- [2. Set up](#2-set-up)
- [3. Run the server](#3-run-the-server)
- [4. Run the tests](#4-run-the-tests)

---

## 1. Requirements

| Tool | Version | Check |
|---|---|---|
| Python | 3.11 or newer (CI uses 3.12) | `python3 --version` |
| pip | any recent | `pip --version` |
| Docker *(optional)* | for PostgreSQL / Meilisearch | `docker --version` |

---

## 2. Set up

Run all commands from the `backend/` folder.

```bash
cd backend

# 1. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# 2. Install the dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 3. Create your local config
cp .env.example .env
```

### Configuration (`.env`)

| Variable | Default | Meaning |
|---|---|---|
| `DATABASE_URL` | `sqlite+aiosqlite:///./opphub.db` | Database connection. For PostgreSQL use `postgresql+asyncpg://postgres:postgres@localhost:5432/opportunity_hub` |
| `SECRET_KEY` | dev value | Key used to sign login tokens (JWT). **Use a long random value in production.** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` (7 days) | How long a login token is valid |

> To make a strong key: `python3 -c "import secrets; print(secrets.token_urlsafe(48))"`

---

## 3. Run the server

```bash
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

| URL | What |
|---|---|
| http://localhost:8000/health | Health check, returns `{"status": "healthy"}` |
| http://localhost:8000/docs | Swagger UI (try every endpoint) |
| http://localhost:8000/redoc | ReDoc API docs |

On the first start the database tables are created and **demo data is added automatically**
(users, opportunities, scraper sources and logs).

### Demo accounts

All passwords are `password123`.

| Email | Role |
|---|---|
| `student@opphub.kh` | student |
| `teacher@opphub.kh` | teacher |
| `staff@opphub.kh` | staff |
| `admin@opphub.kh` | admin |

To log in from the command line:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -d "username=student@opphub.kh&password=password123"
```

Then send the token as `Authorization: Bearer <access_token>`.

### Reset the demo data (SQLite)

Stop the server, delete `opphub.db`, and start it again.

### Run with Docker (PostgreSQL)

From the project root (`IT-project/`):

```bash
docker compose up --build
```

This starts PostgreSQL, Meilisearch and the backend on port 8000.

### API overview

All routes start with `/api/v1`.

| Area | Routes | Who can use them |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/profile`, `GET/PUT /auth/alert-settings` | everyone / logged-in users |
| User admin | `GET /auth/users`, `PUT /auth/users/{id}/role` | admin |
| Opportunities | `GET /opportunities` (search, filters, pages), `GET /opportunities/{id}` | everyone |
| | `POST`, `PUT /{id}`, `DELETE /{id}` | teacher, staff, admin |
| Tracking | `/tracking/bookmarks`, `/tracking/applications` | logged-in users |
| Curation | `GET /tracking/curated` (everyone), `POST` / `DELETE` | teacher, staff, admin |
| Analytics | `GET /tracking/analytics` | staff, admin |
| Notifications | `GET /tracking/notifications` | everyone |
| Scrapers | `/scrapers/sources`, `/scrapers/sources/{id}/run`, `/scrapers/logs`, `/scrapers/health-metrics` | admin |

---

## 4. Run the tests

The tests use **pytest**. Each test gets its own new temporary database, so tests
**never touch your real `opphub.db`** and the order of the tests does not matter.

```bash
cd backend
source venv/bin/activate
pytest
```


| Kind | What it checks | Example |
|---|---|---|
| **Unit** | One small function works by itself | A wrong password does not verify |
| **Integration** | Route + auth + database work together | A student calling an admin route gets `403` |
| **End-to-end** | A whole user story over real HTTP | Register → log in → bookmark → track application → offer |

### Useful commands

| Goal | Command |
|---|---|
| Run everything | `pytest` |
| Show each test name and result | `pytest -v` |
| Unit tests only | `pytest tests/unit` |
| Integration tests only | `pytest tests/integration` |
| End-to-end tests only | `pytest -m e2e` |
| Everything except end-to-end | `pytest -m "not e2e"` |
| One file | `pytest tests/unit/test_security.py` |
| One test | `pytest tests/unit/test_security.py::test_verify_wrong_password` |
| Tests whose name contains a word | `pytest -k bookmark` |
| Stop at the first failure | `pytest -x` |
| Re-run only the tests that failed last time | `pytest --lf` |
| List failures and xfails at the end | `pytest -ra` |
| Show `print()` output | `pytest -s` |

