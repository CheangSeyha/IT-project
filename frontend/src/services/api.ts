import {
  Opportunity,
  ScraperSource,
  ScraperLog,
  FilterState,
  NotificationItem,
  CuratedCollection,
  User,
  AuthResponse,
  AlertSettings,
  StaffAnalyticsData,
  UserRole,
  ApplicationStatus,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Token and Session Management
export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('opphub_token');
  }
  return null;
}

export function getStoredUser(): User | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('opphub_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
  }
  return null;
}

export function saveAuthSession(token: string, user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('opphub_token', token);
    localStorage.setItem('opphub_user', JSON.stringify(user));
  }
}

export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('opphub_token');
    localStorage.removeItem('opphub_user');
  }
}

export function getStoredLanguage(): 'en' | 'km' {
  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('opphub_language');
    if (lang === 'km' || lang === 'en') return lang;
  }
  return 'en';
}

export function saveStoredLanguage(lang: 'en' | 'km') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('opphub_language', lang);
  }
}

function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...extraHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ----------------- Opportunities -----------------

export async function fetchOpportunities(filters?: FilterState): Promise<{ items: Opportunity[]; total: number }> {
  const params = new URLSearchParams();
  // Ensure we load all listings from backend
  params.append('page_size', '100');

  if (filters) {
    if (filters.searchQuery) params.append('q', filters.searchQuery);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.locationType && filters.locationType !== 'all') params.append('location_type', filters.locationType);
    if (filters.provinceCity) params.append('province_city', filters.provinceCity);
    if (filters.country) params.append('country', filters.country);
    if (filters.workFormat && filters.workFormat !== 'all') params.append('work_format', filters.workFormat);
    if (filters.visaSponsorshipOnly) params.append('visa_sponsorship', 'true');
    if (filters.verifiedOnly) params.append('is_verified', 'true');
    if (filters.closingSoonOnly) params.append('closing_soon', 'true');
  }

  const response = await fetch(`${API_BASE_URL}/opportunities?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch opportunities: ${response.statusText}`);
  }

  const data = await response.json();
  return { items: data.items || [], total: data.total || 0 };
}

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${API_BASE_URL}/opportunities/counts`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to load category counts', err);
  }
  return { all: 0, job: 0, internship: 0, scholarship: 0, upskilling: 0, school_work: 0 };
}

export async function fetchOpportunityById(id: number): Promise<Opportunity | null> {
  const res = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    return null;
  }
  return await res.json();
}

export async function createOpportunity(oppData: Partial<Opportunity>): Promise<Opportunity> {
  const res = await fetch(`${API_BASE_URL}/opportunities`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(oppData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create opportunity');
  }

  return await res.json();
}

export async function updateOpportunity(oppId: number, oppData: Partial<Opportunity>): Promise<Opportunity> {
  const res = await fetch(`${API_BASE_URL}/opportunities/${oppId}`, {
    method: 'PUT',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(oppData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update opportunity');
  }

  return await res.json();
}

export async function deleteOpportunity(oppId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/opportunities/${oppId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to delete opportunity');
  }
}

// ----------------- Authentication & User Management -----------------

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Invalid email or password');
  }

  const data: AuthResponse = await response.json();
  saveAuthSession(data.access_token, data.user);
  return data;
}

export async function registerUser(userData: {
  email: string;
  password: string;
  full_name: string;
  role: 'student' | 'teacher' | 'staff' | 'public';
  field_of_study?: string;
  education_level?: string;
  skills?: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Registration failed');
  }

  const user: User = await response.json();
  return user;
}

export async function updateUserProfile(profileData: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update profile');
  }

  const updated: User = await res.json();
  const token = getStoredToken();
  if (token) {
    saveAuthSession(token, updated);
  }
  return updated;
}

export async function fetchAlertSettings(): Promise<AlertSettings> {
  const res = await fetch(`${API_BASE_URL}/auth/alert-settings`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch alert settings');
  }

  return await res.json();
}

export async function updateAlertSettings(settings: AlertSettings): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/alert-settings`, {
    method: 'PUT',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    throw new Error('Failed to update alert settings');
  }
}

export async function fetchAdminUsers(role?: string, query?: string): Promise<User[]> {
  const params = new URLSearchParams();
  if (role && role !== 'all') params.append('role', role);
  if (query) params.append('q', query);

  const res = await fetch(`${API_BASE_URL}/auth/users?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return await res.json();
}

export async function updateUserRole(userId: number, newRole: UserRole): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/users/${userId}/role`, {
    method: 'PUT',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ role: newRole }),
  });

  if (!res.ok) {
    throw new Error('Failed to update user role');
  }

  return await res.json();
}

// ----------------- Tracking & Applications -----------------

export async function fetchApplications(): Promise<Record<number, ApplicationStatus>> {
  const res = await fetch(`${API_BASE_URL}/tracking/applications`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    return {};
  }

  const list = await res.json();
  const map: Record<number, ApplicationStatus> = {};
  for (const item of list) {
    map[item.opportunity_id] = item.status;
  }
  return map;
}

export async function applyToOpportunity(
  opportunityId: number,
  notes?: string
): Promise<{ success: boolean; data?: unknown }> {
  const res = await fetch(`${API_BASE_URL}/tracking/applications`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      opportunity_id: opportunityId,
      status: 'applied',
      notes: notes || 'Submitted directly via OpportunityHub Student Portal',
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to submit application');
  }

  const data = await res.json();
  return { success: true, data };
}

export async function updateApplicationTracker(
  opportunityId: number,
  status: ApplicationStatus,
  notes?: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/tracking/applications`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      opportunity_id: opportunityId,
      status: status,
      notes: notes,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to update application tracker');
  }
}

export async function toggleBookmarkApi(opportunityId: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/tracking/bookmarks/${opportunityId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to toggle bookmark');
  }

  const data = await res.json();
  return !!data.bookmarked;
}

export async function fetchCuratedCollections(): Promise<CuratedCollection[]> {
  const res = await fetch(`${API_BASE_URL}/tracking/curated`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    return [];
  }

  const list = await res.json();
  return list.map((c: { id: number; title: string; target_group?: string; description?: string; opportunity_ids?: string; created_at?: string }) => ({
    id: c.id,
    title: c.title,
    author: 'Faculty & Career Services',
    targetGroup: c.target_group || 'University Cohort',
    description: c.description || '',
    opportunityIds: c.opportunity_ids ? c.opportunity_ids.split(',').map((x: string) => parseInt(x, 10)).filter((n: number) => !isNaN(n)) : [],
    createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent',
    viewsCount: c.opportunity_ids ? c.opportunity_ids.split(',').length * 4 : 0,
  }));
}

export async function createCuratedCollection(data: {
  title: string;
  description?: string;
  opportunity_ids: number[];
  target_group?: string;
}): Promise<CuratedCollection> {
  const res = await fetch(`${API_BASE_URL}/tracking/curated`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create curated collection');
  }

  const c = await res.json();
  return {
    id: c.id,
    title: c.title,
    author: 'Teacher / Faculty',
    targetGroup: c.target_group || 'All Cohorts',
    description: c.description || '',
    opportunityIds: c.opportunity_ids ? c.opportunity_ids.split(',').map((x: string) => parseInt(x, 10)).filter((n: number) => !isNaN(n)) : [],
    createdAt: 'Just now',
    viewsCount: 0,
  };
}

export async function deleteCuratedCollection(collectionId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/tracking/curated/${collectionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to delete curated collection');
  }
}

export async function fetchStaffAnalytics(): Promise<StaffAnalyticsData> {
  const res = await fetch(`${API_BASE_URL}/tracking/analytics`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return await res.json();
}

// ----------------- Scrapers -----------------

export async function fetchScraperSources(): Promise<ScraperSource[]> {
  const res = await fetch(`${API_BASE_URL}/scrapers/sources`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    return [];
  }

  const list = await res.json();
  return list.map((s: { id: number; name: string; target_url: string; category: string; location_type: string; schedule_interval: string; last_run_at?: string; status: 'active' | 'paused' | 'error'; items_scraped_total: number }) => ({
    ...s,
    successRate: s.status === 'active' ? 100 : (s.status === 'error' ? 0 : 75),
  }));
}

export async function createScraperSource(data: {
  name: string;
  target_url: string;
  category: string;
  location_type?: string;
  schedule_interval?: string;
}): Promise<ScraperSource> {
  const res = await fetch(`${API_BASE_URL}/scrapers/sources`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create scraper source');
  }

  const s = await res.json();
  return { ...s, successRate: 100 };
}

export async function deleteScraperSource(sourceId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/scrapers/sources/${sourceId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to delete scraper source');
  }
}

export async function triggerScraperSource(sourceId: number): Promise<ScraperLog> {
  const res = await fetch(`${API_BASE_URL}/scrapers/sources/${sourceId}/run`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to trigger scraper run');
  }

  return await res.json();
}

export async function fetchScraperLogs(): Promise<ScraperLog[]> {
  const res = await fetch(`${API_BASE_URL}/scrapers/logs`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    return [];
  }

  return await res.json();
}

// ----------------- Notifications -----------------

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const res = await fetch(`${API_BASE_URL}/tracking/notifications`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    return [];
  }

  return await res.json();
}
