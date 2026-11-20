# Web Information Retrieval Dashboard
 
> A centralized platform that automatically crawls, normalizes, and aggregates **Job Opportunities, Upskilling Programs, Internships, and Scholarships** for Cambodia and beyond, with faceted search and personalized tracking.
 
---
 
## Table of Contents
 
1. [Project Overview](#1-project-overview)
2. [Goals & Non-Goals](#2-goals--non-goals)
3. [Core Features](#3-core-features)
4. [User Roles & Permissions (RBAC)](#4-user-roles--permissions-rbac)
5. [System Architecture](#5-system-architecture)
6. [Data Retrieval Pipeline](#6-data-retrieval-pipeline)
7. [Search & Filter Engine](#7-search--filter-engine)
8. [Notifications & Alerts](#8-notifications--alerts)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Legal, Ethical & Data Quality Considerations](#10-legal-ethical--data-quality-considerations)
11. [Getting Started](#11-getting-started)
12. [Roadmap](#12-roadmap)
13. [Contributing & License](#13-contributing--license)
---
 
## 1. Project Overview
 
Opportunities for students and job seekers in Cambodia are scattered across career portals, university websites, NGO pages, embassy and scholarship boards, and social media. This project brings them into **one searchable dashboard**.
 
The system:
 
- **Crawls** target web sources on a schedule.
- **Normalizes** unstructured listings into a single consistent schema.
- **Detects duplicates** across sources.
- **Separates Local (Cambodia) and International** opportunities with purpose-built filters for each.
- Provides an **advanced faceted search engine**.
- Offers **personalized tracking** (bookmarks, application status, alerts) for registered users.
### Opportunity Types
 
| Type | Examples |
|---|---|
| Job | Full-time, part-time, contract, remote |
| Internship | Paid / unpaid, summer, semester-long |
| Upskilling Program | Bootcamps, short courses, certifications, MOOCs |
| Scholarship | Fully funded, partially funded, exchange, research grants |
 
---
 
## 2. Goals & Non-Goals
 
### Goals
- Reduce the time students need to discover relevant, legitimate opportunities.
- Give institutions (schools, career offices) a verified channel to publish opportunities.
- Provide transparent scraper health monitoring and content moderation.
- Support **Khmer and English** content and interface.
### Non-Goals (initial release)
- Hosting application submission (users are redirected to the original source).
- Acting as a recruiter or employer-of-record.
- Resume building or interview coaching (possible future extension).
---
 
## 3. Core Features
 
### 3.1 Automated Data Retrieval
- Scheduled scraping of career portals, university sites, and scholarship boards.
- Configurable per-source scrapers (HTML, RSS, sitemap, JSON API, or PDF/Telegram where permitted).
- **Duplicate detection** (exact and fuzzy) across sources and across runs.
- Automatic **expiry handling**: listings past deadline are archived, not deleted.
- Retry, back-off, and error logging per source.
### 3.2 Local vs. International Segregation
| | Local (Cambodia) | International |
|---|---|---|
| Location filter | Province / city (e.g., Phnom Penh, Siem Reap, Battambang) | Country / region |
| Funding | Salary range, local benefits (NSSF, transport, meals, housing allowance) | Fully funded / partially funded / self-funded |
| Extras | Language requirement (Khmer/English), work arrangement | Visa sponsorship, relocation support, language test (IELTS/TOEFL), citizenship eligibility |
| Currency | KHR / USD | Original currency + USD conversion |
 
### 3.3 Multi-Criteria Filter Engine
Search and filter by:
- Job title / keywords
- Required skills and years of experience
- Field of study / industry
- Education level (high school, bachelor, master, PhD, vocational)
- Program format (online / in-person / hybrid)
- Application deadline (closing soon, date range)
- Opportunity type, organization, funding, location, language
### 3.4 User Portals & Tracking
- **Bookmarking** of listings.
- **Application status tracking**: `Saved → Preparing → Applied → Interview → Offer / Accepted / Rejected / Withdrawn`.
- **Deadline reminders** and **alerts for newly matched listings**.
- **Profile-to-requirement matching** (match score based on skills, education, field of study).
---
 
## 4. User Roles & Permissions (RBAC)
 
| Capability | Public | Student | Teacher | Staff / Career Officer | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Search, filter, view open listings | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create account / login | – | ✅ | ✅ | ✅ | ✅ |
| Bookmark listings | ❌ | ✅ | ✅ | ✅ | ✅ |
| Track application status | ❌ | ✅ | ❌ | ❌ | ❌ |
| Set custom alert preferences | ❌ | ✅ | ✅ | ✅ | ✅ |
| Profile-to-listing matching | ❌ | ✅ | ❌ | ❌ | ❌ |
| Curate and share opportunity lists with students | ❌ | ❌ | ✅ | ✅ | ✅ |
| Post academic events | ❌ | ❌ | ✅ | ✅ | ✅ |
| Post verified institutional opportunities | ❌ | ❌ | ❌ | ✅ | ✅ |
| View student engagement analytics | ❌ | ❌ | ❌ (own class only, optional) | ✅ | ✅ |
| Manage scraper target URLs | ❌ | ❌ | ❌ | ❌ | ✅ |
| Monitor scraper health | ❌ | ❌ | ❌ | ❌ | ✅ |
| Moderate content (approve / reject / flag) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage users and roles | ❌ | ❌ | ❌ | ❌ | ✅ |
 
### Role Details
- **Public Users** – Anonymous browsing and search only.
- **Students** – Personal dashboard with saved items, application pipeline, alert rules, and match scores.
- **Teachers** – Create *collections* (e.g., "Scholarships for Engineering Seniors"), share them with specific students or classes, and post academic events.
- **Staff / Career Officers** – Publish institution-verified listings (displayed with a **Verified** badge) and view aggregate engagement analytics (views, saves, applications, click-throughs).
- **Admin** – Full system control, including scraper configuration, moderation queue, audit logs, and user/role management.
---
 
## 5. System Architecture
 
```
┌────────────────────────────────────────────────────────────────────┐
│                           Web Sources                              │
│  Career portals · University sites · Scholarship boards · RSS/API  │
└───────────────┬────────────────────────────────────────────────────┘
                │ scheduled crawl
┌───────────────▼────────────────┐
│  Scraper Workers (queue-based) │  → raw HTML/JSON stored (raw store)
└───────────────┬────────────────┘
                │
┌───────────────▼────────────────┐
│  Parsing & Normalization       │  extract → clean → classify → geocode
│  (rules + optional NLP/LLM)    │
└───────────────┬────────────────┘
                │
┌───────────────▼────────────────┐
│  Deduplication & Enrichment    │  hashing · fuzzy match · skill tagging
└───────────────┬────────────────┘
                │
     ┌──────────▼──────────┐        ┌──────────────────────┐
     │  Primary Database   │◄──────►│  Search Index        │
     │  (relational)       │        │  (full-text/faceted) │
     └──────────┬──────────┘        └──────────┬───────────┘
                │                              │
        ┌───────▼──────────────────────────────▼───────┐
        │                 Backend API                  │
        │   Auth · RBAC · Search · Tracking · Admin    │
        └───────┬──────────────────────┬───────────────┘
                │                      │
        ┌───────▼───────┐      ┌───────▼────────┐
        │ Web Frontend  │      │ Notification   │
        │ (Dashboard)   │      │ Service        │
        └───────────────┘      │ Email/Push/etc │
                               └────────────────┘
```
 
---
 
## 6. Data Retrieval Pipeline
 
1. **Source Registry** – Admin registers a source (URL, type, schedule, parser config, category, local/international flag).
2. **Scheduler** – Triggers jobs (e.g., every 6h for job boards, daily for scholarships).
3. **Fetch** – Respects `robots.txt`, rate limits, custom headers, and retry/back-off.
4. **Parse** – Extracts raw fields using CSS/XPath selectors, JSON mapping, or text extraction.
5. **Normalize** – Maps to the unified schema:
   - Standardize dates, currencies, location names (including Khmer ↔ English province names).
   - Classify opportunity type, education level, field of study.
   - Extract skills from free text (taxonomy + NLP).
6. **Deduplicate**
   - *Exact*: hash of `(normalized title + organization + deadline + source URL)`.
   - *Fuzzy*: similarity on title/organization/description (e.g., MinHash or trigram similarity) with a configurable threshold.
   - Merge duplicates into one canonical listing, keeping all source links.
7. **Validate & Flag** – Detect missing fields, suspicious/scam patterns, dead links; send low-confidence items to the moderation queue.
8. **Index & Publish** – Save to DB, update search index, trigger alert matching.
9. **Monitor** – Record run stats: duration, items found, new/updated/duplicate, errors, and last success time.
### Scraper Health Metrics (Admin Dashboard)
- Last run status and timestamp
- Success rate (7/30 days)
- New listings per run
- Parse error rate / schema drift detection (alert when selectors stop matching)
- Average response time and HTTP error breakdown
---
 
## 7. Search & Filter Engine
 
### Capabilities
- Full-text search with typo tolerance and synonym handling (e.g., "dev" ↔ "developer").
- **Bilingual search** (Khmer and English).
- Faceted navigation with live result counts.
- Sorting: relevance, newest, closing soon, salary, best match (logged-in students).
- Saved searches that can be converted into alerts.
### Facets
 
| Facet | Local | International |
|---|:---:|:---:|
| Opportunity type | ✅ | ✅ |
| Job title / keyword | ✅ | ✅ |
| Skills & experience level | ✅ | ✅ |
| Field of study | ✅ | ✅ |
| Education level | ✅ | ✅ |
| Format (online / in-person / hybrid) | ✅ | ✅ |
| Deadline | ✅ | ✅ |
| Province / city | ✅ | – |
| Salary range & local benefits | ✅ | – |
| Country / region | – | ✅ |
| Funding (full / partial) | – | ✅ |
| Visa sponsorship | – | ✅ |
| Language / test requirement | ✅ | ✅ |
| Verified only | ✅ | ✅ |
 
---
 
## 8. Notifications & Alerts
 
- **Triggers**: new listing matches an alert rule, approaching deadline (e.g., 7 / 3 / 1 days), application status reminder, teacher-shared collection updates.
- **Channels**: in-app, email (MVP); Telegram bot and web push (recommended for Cambodia, where Telegram is widely used); SMS optional.
- **Controls**: frequency (instant / daily digest / weekly), quiet hours, per-channel opt-out.
---
 
## 9. Non-Functional Requirements
 
| Area | Requirement |
|---|---|
| **Performance** | Search results < 500 ms (p95) for typical queries |
| **Scalability** | Horizontally scalable scraper workers and API |
| **Availability** | Target 99.5% uptime; graceful degradation if a scraper fails |
| **Security** | Hashed passwords (Argon2/bcrypt), JWT/session security, RBAC enforcement on every endpoint, CSRF/XSS/SQLi protection, rate limiting |
| **Privacy** | Minimal PII collection, consent for notifications, user data export/deletion |
| **Localization** | Khmer + English UI, Khmer Unicode fonts, date/number/currency formatting |
| **Accessibility** | WCAG 2.1 AA |
| **Mobile** | Mobile-first responsive design (most users in Cambodia browse on mobile) |
| **Low bandwidth** | Lightweight pages, lazy loading, optional PWA |
| **Observability** | Structured logs, metrics, alerting, audit trail |
| **Backups** | Daily DB backups and tested restore procedure |
 
---
 
## 10. Legal, Ethical & Data Quality Considerations
 
- **Respect `robots.txt`** and each site's Terms of Service; prefer official APIs, RSS feeds, or partnerships where available.
- **Throttle requests** and identify the crawler with a clear User-Agent and contact email.
- **Attribution**: always link back to the original source; do not copy full content where unnecessary.
- **Scam protection**: flag listings that ask for fees, use suspicious domains, or lack organization details. Show a **Verified** badge only for staff-posted or admin-verified items.
- **Data freshness**: display "last checked" timestamps and auto-hide expired/dead listings.
- **Takedown process**: provide a way for organizations to request removal or correction.
- **Personal data**: comply with applicable data protection practices; store only what is needed.
---
 
## 11. Getting Started
 
> Placeholder instructions; update once the stack is finalized.
 
### Prerequisites
- Docker & Docker Compose
- Node.js ≥ 20 and/or Python ≥ 3.11
- PostgreSQL and Redis (provided via Docker Compose)
### Setup
 
```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/<repo-name>.git
cd <repo-name>
 
# 2. Configure environment variables
cp .env.example .env
 
# 3. Start services
docker compose up -d
 
# 4. Run database migrations and seed data
make migrate
make seed        # includes default admin + sample sources
 
# 5. Open the app
# Frontend: http://localhost:3000
# API docs: http://localhost:8000/docs
```
 
---
 
## 12. Roadmap
 
### Phase 1 – MVP
- [ ] Source registry + 5–10 initial scrapers
- [ ] Normalization schema + basic deduplication
- [ ] Public search with core filters (local/international)
- [ ] Auth + RBAC (Public, Student, Admin)
- [ ] Bookmarks + application tracking
- [ ] Admin: manage sources, view scraper health
### Phase 2 – Engagement
- [ ] Email alerts and saved searches
- [ ] Teacher collections and event posting
- [ ] Staff verified postings + moderation workflow
- [ ] Khmer/English bilingual UI and search
- [ ] Deadline reminders
### Phase 3 – Intelligence
- [ ] Profile-to-requirement match scoring and recommendations
- [ ] Engagement analytics for staff
- [ ] Telegram bot + web push
- [ ] Fuzzy/semantic dedup and scam detection
- [ ] Auto-detection of scraper breakage (schema drift)
### Phase 4 – Growth
- [ ] Mobile app / PWA enhancements
- [ ] Employer/organization self-service portal
- [ ] Public API & partner integrations
- [ ] Calendar sync (Google/Outlook .ics)
- [ ] Resume/CV and document checklist helpers
---
 
## 13. Contributing & License
 
### Contributing
1. Fork the repository and create a feature branch (`feature/<name>`).
2. Follow the code style and commit message conventions (e.g., Conventional Commits).
3. Add tests for new scrapers and features (use saved HTML fixtures for scraper tests).
4. Open a pull request with a clear description.
### Adding a New Scraper
1. Add the source in the Admin panel (or `sources.yaml` for seeding).
2. Create a parser config/module under `services/scraper/sources/`.
3. Add a fixture and test under `tests/scraper/`.
4. Verify normalization and dedup output before enabling the schedule.
### License
Choose a license (e.g., MIT, Apache-2.0) and add it as `LICENSE`.
 
---
 
*Maintainers: TopSquad
 
