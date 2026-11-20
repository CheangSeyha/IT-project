export type OpportunityCategory = 'job' | 'internship' | 'upskilling' | 'scholarship';
export type LocationType = 'local' | 'international';
export type WorkFormat = 'on_site' | 'remote' | 'hybrid';
export type ApplicationStatus = 'saved' | 'preparing' | 'applied' | 'interviewing' | 'offered' | 'rejected';
export type UserRole = 'public' | 'student' | 'teacher' | 'staff' | 'admin';
export type Language = 'en' | 'km';

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  category: OpportunityCategory;
  location_type: LocationType;
  country: string;
  province_city?: string;
  work_format: WorkFormat;
  field_of_study?: string;
  education_level?: string;
  description: string;
  requirements?: string;
  skills?: string;
  salary_or_funding?: string;
  local_benefits?: string;
  visa_sponsorship: boolean;
  language_requirements?: string;
  deadline?: string;
  source_url: string;
  source_name: string;
  is_verified: boolean;
  is_bookmarked?: boolean;
  created_at: string;
  updated_at?: string;
  matchScore?: number; // Calculated match percentage for students (e.g. 92%)
}

export interface ApplicationTrackerItem {
  id: number;
  user_id: number;
  opportunity_id: number;
  status: ApplicationStatus;
  notes?: string;
  applied_date?: string;
  interview_date?: string;
  updated_at: string;
  opportunity?: Opportunity;
}

export interface ScraperSource {
  id: number;
  name: string;
  target_url: string;
  category: string;
  location_type: string;
  schedule_interval: string;
  last_run_at?: string;
  status: 'active' | 'paused' | 'error';
  items_scraped_total: number;
  successRate: number; // e.g. 98%
}

export interface ScraperLog {
  id: number;
  source_name: string;
  started_at: string;
  finished_at?: string;
  status: string;
  items_found: number;
  new_items: number;
  duplicates: number;
  error_message?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'opportunity' | 'deadline' | 'curation' | 'system';
  opportunityId?: number;
}

export interface CuratedCollection {
  id: number;
  title: string;
  author: string;
  targetGroup: string;
  description: string;
  opportunityIds: number[];
  createdAt: string;
  viewsCount: number;
}

export interface FilterState {
  searchQuery: string;
  category: OpportunityCategory | 'all';
  locationType: LocationType | 'all';
  provinceCity: string;
  country: string;
  fieldOfStudy: string;
  educationLevel: string;
  workFormat: WorkFormat | 'all';
  visaSponsorshipOnly: boolean;
  closingSoonOnly: boolean;
  verifiedOnly: boolean;
  highMatchOnly: boolean;
}
