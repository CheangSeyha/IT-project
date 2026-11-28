import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The backend must run with a fresh, throw-away database so every run starts from the demo seed.
const BACKEND_DIR = path.resolve(__dirname, '../backend');
const LOCAL_VENV = path.join(BACKEND_DIR, 'venv/bin/python');
const PYTHON = process.env.BACKEND_PYTHON ?? (fs.existsSync(LOCAL_VENV) ? LOCAL_VENV : 'python3');
const E2E_DB = path.join(os.tmpdir(), `opphub-e2e-${process.pid}.db`);
const API_PORT = 8010;
// The backend CORS list allows http://localhost:3000, so the frontend must use that origin.
const WEB_URL = 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // journeys share one seeded backend
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: `"${PYTHON}" -m uvicorn app.main:app --host 127.0.0.1 --port ${API_PORT}`,
      cwd: BACKEND_DIR,
      url: `http://127.0.0.1:${API_PORT}/health`,
      env: { DATABASE_URL: `sqlite+aiosqlite:///${E2E_DB}`, SECRET_KEY: 'e2e-secret' },
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: 'npm run dev -- --port 3000',
      url: WEB_URL,
      env: { NEXT_PUBLIC_API_URL: `http://127.0.0.1:${API_PORT}/api/v1` },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
