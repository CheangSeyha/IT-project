// End-to-end: real browser + real Next.js app + real FastAPI backend (fresh demo database).
import { test, expect, type Page } from '@playwright/test';

const API = 'http://127.0.0.1:8010/api/v1';

async function login(page: Page, email: string, password = 'password123') {
  await page.goto('/login');
  await page.getByPlaceholder('e.g. student@opphub.kh').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.locator('form').filter({ has: page.getByPlaceholder('e.g. student@opphub.kh') })
    .locator('button[type="submit"]').click();
}

const card = (page: Page, title: string) =>
  page.locator('#work-catalog').locator('div.group', { hasText: title }).first();

test.describe('visitor (not logged in)', () => {
  test('sees listings from the backend', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Chevening Master\'s Scholarship 2027').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i }).first()).toBeVisible();
  });

  test('Overseas filter shows only international listings', async ({ page }) => {
    await page.goto('/');
    await page.locator('#work-catalog').getByRole('button', { name: 'Overseas' }).click();
    await expect(page.locator('#work-catalog').getByText('Overseas', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Senior Full-Stack Developer (FastAPI & Next.js)')).toHaveCount(0);
    await expect(page.getByText('Chevening Master\'s Scholarship 2027').first()).toBeVisible();
  });

  test('bookmarking asks the visitor to sign in', async ({ page }) => {
    await page.goto('/');
    await page.getByTitle('Save Bookmark').first().click();
    await expect(page.getByText(/sign in|log in|register/i).first()).toBeVisible();
    // nothing saved, visitor still has no session
    expect(await page.evaluate(() => localStorage.getItem('opphub_token'))).toBeNull();
  });
});

test.describe('login', () => {
  test('wrong password shows an error and stays on /login', async ({ page }) => {
    await login(page, 'student@opphub.kh', 'wrong-password');
    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('student logs in, sees their name, then logs out', async ({ page }) => {
    await login(page, 'student@opphub.kh');
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Sokha Chan').first()).toBeVisible();
    await page.getByTitle('Sign Out').click();
    await expect(page.getByRole('link', { name: /sign in/i }).first()).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('opphub_token'))).toBeNull();
  });
});

test.describe('student journey', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'student@opphub.kh');
    await expect(page.getByText('Sokha Chan').first()).toBeVisible();
  });

  test('bookmark is saved on the server and survives a reload', async ({ page }) => {
    const target = card(page, 'Chevening Master\'s Scholarship 2027');
    await target.getByTitle('Save Bookmark').click();
    await expect(target.getByTitle('Remove Bookmark')).toBeVisible();
    await page.reload();
    await expect(card(page, 'Chevening Master\'s Scholarship 2027').getByTitle('Remove Bookmark')).toBeVisible();
    // clean up
    await card(page, 'Chevening Master\'s Scholarship 2027').getByTitle('Remove Bookmark').click();
  });

  test('track a listing and move it through the pipeline', async ({ page }) => {
    const title = 'MEXT Japanese Government Postgraduate Research Scholarship';
    await card(page, title).getByTitle('Track in Pipeline').click();
    await expect(page.getByText('Student Application Pipeline')).toBeVisible();
    const select = page.locator('select').filter({ has: page.locator('option[value="interviewing"]') }).first();
    await select.selectOption('interviewing');
    await expect(page.getByText('1 Interviewing')).toBeVisible();

    // the change reached the backend
    const token = await page.evaluate(() => localStorage.getItem('opphub_token'));
    const res = await page.request.get(`${API}/tracking/applications`, { headers: { Authorization: `Bearer ${token}` } });
    const apps = await res.json();
    expect(apps.some((a: { status: string; opportunity: { title: string } }) =>
      a.status === 'interviewing' && a.opportunity.title === title)).toBe(true);
  });
});

test.describe('role pages', () => {
  test('admin sees the user list on /admin', async ({ page }) => {
    await login(page, 'admin@opphub.kh');
    await expect(page.getByText('System Administrator').first()).toBeVisible();
    await page.goto('/admin');
    await expect(page.getByText('System Health & Crawl Metrics')).toBeVisible();
    await page.getByRole('button', { name: /user roles & rbac/i }).click();
    await expect(page.getByText('student@opphub.kh').first()).toBeVisible({ timeout: 15_000 });
  });

  test('staff can open the staff dashboard', async ({ page }) => {
    await login(page, 'staff@opphub.kh');
    await page.goto('/staff');
    await expect(page).toHaveURL(/\/staff/);
    await expect(page.locator('body')).not.toContainText('Application error');
  });
});

test.describe('known bugs (expected to fail until fixed)', () => {
  test('FE-01: the catalogue shows every listing, not only the first 10', async ({ page, request }) => {
    test.fail(true, 'FE-01: frontend never requests more than the first page of 10');
    const total = (await (await request.get(`${API}/opportunities`)).json()).total;
    await page.goto('/');
    await expect(page.getByText(/Showing/).first()).toContainText(String(total), { timeout: 10_000 });
  });

  test('FE-07: the sign-up form does not offer Teacher/Staff roles', async ({ page }) => {
    test.fail(true, 'FE-07: anyone can self-register as Teacher or Staff');
    await page.goto('/login?mode=register');
    await expect(page.locator('option[value="staff"]')).toHaveCount(0, { timeout: 5_000 });
  });
});
