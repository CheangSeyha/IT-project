import type { Opportunity, FilterState, User } from '@/types';

export const makeOpportunity = (overrides: Partial<Opportunity> = {}): Opportunity => ({
  id: 1,
  title: 'Backend Intern',
  organization: 'Wing Bank',
  category: 'internship',
  location_type: 'local',
  country: 'Cambodia',
  province_city: 'Phnom Penh',
  work_format: 'hybrid',
  description: 'Build APIs',
  visa_sponsorship: false,
  source_url: 'https://example.com/job',
  source_name: 'CamHR',
  is_verified: true,
  is_bookmarked: false,
  created_at: '2026-11-01T00:00:00',
  ...overrides,
});

export const emptyFilters = (overrides: Partial<FilterState> = {}): FilterState => ({
  searchQuery: '',
  category: 'all',
  locationType: 'all',
  provinceCity: '',
  country: '',
  fieldOfStudy: '',
  educationLevel: '',
  workFormat: 'all',
  visaSponsorshipOnly: false,
  closingSoonOnly: false,
  verifiedOnly: false,
  highMatchOnly: false,
  ...overrides,
});

export const student: User = { id: 1, email: 'student@opphub.kh', full_name: 'Sokha Chan', role: 'student' };

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
