// Unit tests for src/services/api.ts — `fetch` is mocked, no backend needed.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from '@/services/api';
import { emptyFilters, jsonResponse, makeOpportunity, student } from '../fixtures';

const BASE = 'http://localhost:8000/api/v1';
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () => jsonResponse({ items: [], total: 0 }));
  vi.stubGlobal('fetch', fetchMock);
});

const lastCall = () => {
  const [url, init = {}] = fetchMock.mock.calls.at(-1) as [string, RequestInit?];
  return { url: new URL(url), init, headers: (init.headers || {}) as Record<string, string> };
};

// ---------- session helpers ----------
describe('session storage', () => {
  it('saves, reads and clears the session', () => {
    expect(api.getStoredToken()).toBeNull();
    expect(api.getStoredUser()).toBeNull();
    api.saveAuthSession('tok', student);
    expect(api.getStoredToken()).toBe('tok');
    expect(api.getStoredUser()).toEqual(student);
    api.logoutUser();
    expect(api.getStoredToken()).toBeNull();
    expect(api.getStoredUser()).toBeNull();
  });

  it('returns null for a corrupted stored user', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('opphub_user', '{not json');
    expect(api.getStoredUser()).toBeNull();
  });
});

// ---------- auth header ----------
describe('Authorization header', () => {
  it('is sent when logged in', async () => {
    api.saveAuthSession('abc', student);
    await api.fetchOpportunities();
    expect(lastCall().headers.Authorization).toBe('Bearer abc');
  });

  it('is not sent when logged out', async () => {
    await api.fetchOpportunities();
    expect(lastCall().headers.Authorization).toBeUndefined();
  });
});

// ---------- opportunities ----------
describe('fetchOpportunities', () => {
  it('sends no filter params for the default filters', async () => {
    await api.fetchOpportunities(emptyFilters());
    expect(lastCall().url.search).toBe('');
  });

  it('maps every supported filter to the right query param', async () => {
    await api.fetchOpportunities(emptyFilters({
      searchQuery: 'python', category: 'job', locationType: 'local', provinceCity: 'Phnom Penh',
      country: 'Japan', workFormat: 'remote', visaSponsorshipOnly: true, verifiedOnly: true, closingSoonOnly: true,
    }));
    expect(Object.fromEntries(lastCall().url.searchParams)).toEqual({
      q: 'python', category: 'job', location_type: 'local', province_city: 'Phnom Penh', country: 'Japan',
      work_format: 'remote', visa_sponsorship: 'true', is_verified: 'true', closing_soon: 'true',
    });
  });

  it('returns items and total', async () => {
    const opp = makeOpportunity();
    fetchMock.mockResolvedValueOnce(jsonResponse({ items: [opp], total: 13 }));
    expect(await api.fetchOpportunities()).toEqual({ items: [opp], total: 13 });
  });

  it('throws when the server fails', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 500, statusText: 'Server Error' }));
    await expect(api.fetchOpportunities()).rejects.toThrow('Failed to fetch opportunities');
  });

  it.fails('KNOWN BUG FE-01: requests a page size / page so more than 10 listings can be shown', async () => {
    await api.fetchOpportunities(emptyFilters());
    const p = lastCall().url.searchParams;
    expect(p.has('page') || p.has('page_size')).toBe(true);
  });

  it.fails('KNOWN BUG FE-02: field of study filter is sent', async () => {
    await api.fetchOpportunities(emptyFilters({ fieldOfStudy: 'Information Technology' }));
    expect(lastCall().url.search).not.toBe('');
  });

  it('fetchOpportunityById returns null on 404', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 404 }));
    expect(await api.fetchOpportunityById(999)).toBeNull();
    expect(lastCall().url.pathname).toBe('/api/v1/opportunities/999');
  });

  it('createOpportunity POSTs JSON and surfaces the server error message', async () => {
    api.saveAuthSession('t', student);
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'You do not have permission' }, 403));
    await expect(api.createOpportunity({ title: 'X' })).rejects.toThrow('You do not have permission');
    const { init, headers } = lastCall();
    expect(init.method).toBe('POST');
    expect(headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body as string)).toEqual({ title: 'X' });
  });

  it('updateOpportunity / deleteOpportunity use PUT / DELETE on the item URL', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeOpportunity()));
    await api.updateOpportunity(4, { title: 'New' });
    expect([lastCall().init.method, lastCall().url.pathname]).toEqual(['PUT', '/api/v1/opportunities/4']);
    await api.deleteOpportunity(4);
    expect([lastCall().init.method, lastCall().url.pathname]).toEqual(['DELETE', '/api/v1/opportunities/4']);
  });
});

// ---------- auth ----------
describe('auth', () => {
  it('loginUser sends form data and stores the session', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: 'tok', token_type: 'bearer', user: student }));
    const res = await api.loginUser('student@opphub.kh', 'password123');
    const { url, init, headers } = lastCall();
    expect(url.toString()).toBe(`${BASE}/auth/login`);
    expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    expect(init.body).toBe('username=student%40opphub.kh&password=password123');
    expect(res.user).toEqual(student);
    expect(api.getStoredToken()).toBe('tok');
  });

  it('loginUser throws the server message and stores nothing on 401', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'Incorrect email or password' }, 401));
    await expect(api.loginUser('a@b.c', 'bad')).rejects.toThrow('Incorrect email or password');
    expect(api.getStoredToken()).toBeNull();
  });

  it('registerUser throws "Email already registered"', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'Email already registered' }, 400));
    await expect(api.registerUser({ email: 'a@b.c', password: 'x', full_name: 'A', role: 'student' }))
      .rejects.toThrow('Email already registered');
  });

  it('updateUserProfile refreshes the stored user', async () => {
    api.saveAuthSession('tok', student);
    fetchMock.mockResolvedValueOnce(jsonResponse({ ...student, skills: 'Go' }));
    await api.updateUserProfile({ skills: 'Go' });
    expect(api.getStoredUser()?.skills).toBe('Go');
    expect(api.getStoredToken()).toBe('tok');
  });

  it('fetchAdminUsers skips role=all and sends the search query', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    await api.fetchAdminUsers('all', 'sokha');
    expect(lastCall().url.search).toBe('?q=sokha');
  });

  it('updateUserRole PUTs the new role', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ...student, role: 'teacher' }));
    await api.updateUserRole(1, 'teacher');
    expect(lastCall().url.pathname).toBe('/api/v1/auth/users/1/role');
    expect(JSON.parse(lastCall().init.body as string)).toEqual({ role: 'teacher' });
  });
});

// ---------- tracking ----------
describe('tracking', () => {
  it('fetchApplications turns the list into an {opportunityId: status} map', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      { id: 9, opportunity_id: 3, status: 'applied' }, { id: 10, opportunity_id: 5, status: 'saved' },
    ]));
    expect(await api.fetchApplications()).toEqual({ 3: 'applied', 5: 'saved' });
  });

  it('applyToOpportunity posts status "applied" with a default note', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }));
    await api.applyToOpportunity(3);
    expect(JSON.parse(lastCall().init.body as string)).toEqual({
      opportunity_id: 3, status: 'applied', notes: 'Submitted directly via OpportunityHub Student Portal',
    });
  });

  it.fails('KNOWN BUG FE-03: a stage change must not erase notes (sends no notes to the upsert)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}));
    await api.updateApplicationTracker(3, 'interviewing');
    const body = JSON.parse(lastCall().init.body as string);
    expect(lastCall().init.method === 'PUT' || 'notes' in body).toBe(true);
  });

  it('toggleBookmarkApi returns the new bookmarked state', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ bookmarked: true }));
    expect(await api.toggleBookmarkApi(2)).toBe(true);
    fetchMock.mockResolvedValueOnce(jsonResponse({ bookmarked: false }));
    expect(await api.toggleBookmarkApi(2)).toBe(false);
  });

  it('fetchCuratedCollections parses the comma-separated ids', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      { id: 1, title: 'T', opportunity_ids: '6, 7,x,8', created_at: '2026-11-01T00:00:00' },
    ]));
    const [col] = await api.fetchCuratedCollections();
    expect(col.opportunityIds).toEqual([6, 7, 8]);
    expect(col.targetGroup).toBe('University Cohort');
  });

  it('list endpoints return [] when the server fails', async () => {
    fetchMock.mockResolvedValue(new Response('', { status: 500 }));
    expect(await api.fetchCuratedCollections()).toEqual([]);
    expect(await api.fetchNotifications()).toEqual([]);
    expect(await api.fetchScraperSources()).toEqual([]);
    expect(await api.fetchScraperLogs()).toEqual([]);
  });

  it.fails('KNOWN BUG FE-04: an expired session (401) is reported, not shown as an empty board', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 401 }));
    await expect(api.fetchApplications()).rejects.toThrow();
  });
});

// ---------- scrapers ----------
describe('scrapers', () => {
  it('triggerScraperSource POSTs to /run and returns the log', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 5, source_name: 'CamHR', new_items: 2 }));
    const log = await api.triggerScraperSource(1);
    expect(lastCall().url.pathname).toBe('/api/v1/scrapers/sources/1/run');
    expect(log.new_items).toBe(2);
  });

  it('createScraperSource throws on 403', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 403 }));
    await expect(api.createScraperSource({ name: 'n', target_url: 'u', category: 'job' })).rejects.toThrow();
  });
});
