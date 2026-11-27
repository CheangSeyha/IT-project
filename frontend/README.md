# OpportunityHub — Frontend

The web app for OpportunityHub, built with **Next.js 14 (App Router)**, **React 18**, **TypeScript** and **Tailwind CSS**.
It talks to the FastAPI backend in [`../backend`](../backend/README.md).

- [1. Requirements](#1-requirements)
- [2. Set up and run](#2-set-up-and-run)
- [3. Run the tests](#3-run-the-tests)
- [4. Read the test results](#4-read-the-test-results)
- [5. Write a new test](#5-write-a-new-test)
- [6. Troubleshooting](#6-troubleshooting)

---

## 1. Requirements

| Tool | Version | Check |
|---|---|---|
| Node.js | 20 or newer | `node --version` |
| npm | comes with Node | `npm --version` |
| The backend | running on port 8000 (see [backend README](../backend/README.md)) | `curl localhost:8000/health` |

---

## 2. Set up and run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

| Variable | Default | Meaning |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Where the backend API is. Put it in `.env.local` to change it. |

> The backend only accepts browser requests from `http://localhost:3000` (CORS), so keep the frontend on port 3000.

Demo accounts (password `password123`): `student@opphub.kh`, `teacher@opphub.kh`, `staff@opphub.kh`, `admin@opphub.kh`.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

---

## 3. Run the tests

There are three kinds of test:

```
frontend/
├── vitest.config.mts        # unit + component test settings
├── playwright.config.ts     # end-to-end settings (starts backend + frontend for you)
└── tests/
    ├── setup.ts             # runs before every unit/component test
    ├── fixtures.ts          # sample opportunity, user, filters
    ├── unit/                # functions alone, fetch is mocked (no backend)
    │   ├── api.test.ts          every function in src/services/api.ts
    │   └── utils.test.ts        cn() class-name helper
    ├── components/          # one React component rendered in a fake browser (jsdom)
    │   ├── OpportunityCard.test.tsx
    │   ├── FilterSidebar.test.tsx
    │   ├── ApplicationTrackerView.test.tsx
    │   └── NotificationDropdown.test.tsx
    └── e2e/                 # real Chromium + real frontend + real backend
        └── journeys.spec.ts
```

| Kind | Tool | Needs the backend? | Example |
|---|---|---|---|
| **Unit** | Vitest | No (fetch is mocked) | `loginUser` sends form data and saves the token |
| **Component** | Vitest + React Testing Library | No | Clicking "Save Bookmark" on a card calls `onToggleBookmark(1)` |
| **End-to-end** | Playwright | Yes, **started automatically** | Student logs in → bookmarks → reloads → bookmark is still there |

### Unit + component tests (fast, ~3 s)

```bash
npm test
```

Expected: `Tests 55 passed (55)`.

### End-to-end tests

First time only, download the browser:

```bash
npx playwright install chromium
```

The backend's Python packages must be installed (see the [backend README](../backend/README.md)).
Playwright finds Python in `../backend/venv` automatically. To use another one, set `BACKEND_PYTHON`:

```bash
npm run test:e2e
# or with a different Python:
BACKEND_PYTHON=/path/to/python npm run test:e2e
```

Playwright starts **its own backend on port 8010 with a fresh demo database**, plus `next dev` on port 3000,
then runs the journeys and stops everything. Your own database is never touched.
Stop your own `npm run dev` first, or it will be reused.

Expected: `11 passed`.

### All commands

| Goal | Command |
|---|---|
| Unit + component tests | `npm test` |
| Re-run on every file save | `npm run test:watch` |
| Unit tests only | `npm run test:unit` |
| Component tests only | `npm run test:components` |
| One file | `npx vitest run tests/components/OpportunityCard.test.tsx` |
| Tests whose name matches | `npx vitest run -t "bookmark"` |
| Coverage report | `npm run test:coverage` (needs `npm i -D @vitest/coverage-v8` once) |
| End-to-end | `npm run test:e2e` |
| End-to-end with a visual UI | `npm run test:e2e:ui` |
| Watch the browser while it runs | `npx playwright test --headed` |
| One end-to-end test | `npx playwright test -g "wrong password"` |
| Everything | `npm run test:all` |

### In CI

`.github/workflows/frontend-ci.yml` runs **lint → unit & component tests → build**, then a separate
**Playwright** job. If Playwright fails, its HTML report is uploaded as the `playwright-report` artifact.

---

## 4. Read the test results

**Vitest:**

```
 ✓ tests/unit/api.test.ts (28 tests)
 × tests/components/OpportunityCard.test.tsx > calls onApply and onTrack
   AssertionError: expected "spy" to be called 1 times, but got 0 times
   ❯ tests/components/OpportunityCard.test.tsx:44:21
```

`×` marks a failed test. The line under it says what was expected and what happened, and `❯ file:line`
shows where (Cmd/Ctrl+click it in the VS Code terminal).

**Playwright:**

```
  ✓  5 journeys.spec.ts:48 › login › student logs in, sees their name, then logs out
  ✘  8 journeys.spec.ts:92 › role pages › admin sees the user list on /admin
```

For each failure Playwright saves a **screenshot** and a **trace** in `test-results/`.
Open the trace to replay every step, click and network call:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
npx playwright show-report        # HTML report of the last run
```

### Known bugs

Some tests describe the **correct** behaviour for bugs that are not fixed yet. They are marked
`it.fails(...)` (Vitest) or `test.fail(...)` (Playwright) with the bug ID in the name, so they count as
passing **while the bug exists**. When someone fixes the bug, that test turns red ("expected to fail but
passed"); then remove the `.fails` / `test.fail` line.

In Playwright output these show as `✘` but are counted under **passed**.

| ID | Bug | Test |
|---|---|---|
| FE-01 | Catalogue only shows the first 10 listings | `api.test.ts`, `journeys.spec.ts` |
| FE-02 | Field of study / education / 90% match filters do nothing | `api.test.ts` |
| FE-03 | Moving a tracker card erases the application notes | `api.test.ts` |
| FE-04 | Expired login shows an empty board instead of "please sign in" | `api.test.ts` |
| FE-05 | Tracker hides rejected applications and those outside the current filter | `ApplicationTrackerView.test.tsx` |
| FE-07 | Sign-up form lets anyone choose Teacher / Staff | `journeys.spec.ts` |

---

## 5. Write a new test

**Unit test** (`tests/unit/`): mock `fetch`, call the function, check the request and the result.

```ts
import { it, expect, vi } from 'vitest';
import { toggleBookmarkApi } from '@/services/api';
import { jsonResponse } from '../fixtures';

it('returns the new bookmark state', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ bookmarked: true })));
  expect(await toggleBookmarkApi(2)).toBe(true);
});
```

**Component test** (`tests/components/`): render, act like a user, check what is on screen.

```tsx
import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OpportunityCard } from '@/components/OpportunityCard';
import { makeOpportunity } from '../fixtures';

it('opens details', async () => {
  const onSelect = vi.fn();
  render(<OpportunityCard opportunity={makeOpportunity()} onSelect={onSelect} onToggleBookmark={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /details/i }));
  expect(onSelect).toHaveBeenCalled();
});
```

**End-to-end test** (`tests/e2e/`): use the page like a person would.

```ts
import { test, expect } from '@playwright/test';

test('visitor sees listings', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText("Chevening Master's Scholarship 2027").first()).toBeVisible();
});
```

Tips:

- Find elements the way a user does: `getByRole`, `getByText`, `getByLabelText`, `getByTitle`. Avoid CSS classes.
- Test what the user sees and what is sent to the API, not internal state.
- Name files `*.test.ts(x)` (Vitest) or `*.spec.ts` (Playwright).

---

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module 'vitest'` | Run `npm install` |
| Playwright: `Executable doesn't exist` | `npx playwright install chromium` |
| Playwright: backend server did not start | Install the backend (`cd ../backend && python3 -m venv venv && venv/bin/pip install -r requirements.txt`) or set `BACKEND_PYTHON` |
| Playwright: `port 3000 is already used` | Stop your own `npm run dev` |
| Page shows no listings in the browser | Start the backend on port 8000, and keep the frontend on port 3000 (CORS) |
| A test that was "expected to fail" now fails | The bug was fixed: remove its `it.fails` / `test.fail` |
