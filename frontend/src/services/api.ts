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
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const fallbackUsers: User[] = [
  {
    id: 1,
    email: 'student@opphub.kh',
    full_name: 'Sokha Chan',
    role: 'student',
    field_of_study: 'Computer Science & Engineering',
    education_level: 'Bachelor Year 4',
    skills: 'Python, React, TypeScript, SQL',
  },
  {
    id: 2,
    email: 'teacher@opphub.kh',
    full_name: 'Prof. David Kim',
    role: 'teacher',
    field_of_study: 'Information Technology',
    education_level: 'Doctorate',
  },
  {
    id: 3,
    email: 'staff@opphub.kh',
    full_name: 'Bopha Chea',
    role: 'staff',
    field_of_study: 'University Career Center',
  },
  {
    id: 4,
    email: 'admin@opphub.kh',
    full_name: 'System Administrator',
    role: 'admin',
  },
];

export const fallbackOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "Senior Full-Stack Developer (FastAPI & Next.js)",
    organization: "Wing Bank (Cambodia) Plc",
    category: "job",
    location_type: "local",
    country: "Cambodia",
    province_city: "Phnom Penh",
    work_format: "hybrid",
    field_of_study: "Information Technology",
    education_level: "Bachelor's Degree",
    description: "Leading development of fintech payment APIs and modern responsive portals for nationwide banking operations.",
    requirements: "3+ years of experience with Python/FastAPI and modern React/Next.js frameworks. Knowledge of PostgreSQL and microservices.",
    skills: "Python, FastAPI, Next.js, PostgreSQL, Docker",
    salary_or_funding: "$1,200 - $2,000 / month",
    local_benefits: "NSSF Health Coverage, 13th Month Salary, Performance Bonus, Annual Retreat",
    visa_sponsorship: false,
    language_requirements: "Khmer and Professional English",
    deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    source_url: "https://www.camhr.com/jobs/wing-fullstack",
    source_name: "CamHR",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 96,
  },
  {
    id: 2,
    title: "Mobile Application Engineer (Flutter)",
    organization: "ABA Bank",
    category: "job",
    location_type: "local",
    country: "Cambodia",
    province_city: "Phnom Penh",
    work_format: "on_site",
    field_of_study: "Software Engineering",
    education_level: "Bachelor's Degree",
    description: "Work with Cambodia's leading mobile banking team to design high-throughput, secure financial transactions.",
    requirements: "Solid knowledge of Flutter/Dart, state management (Bloc/Provider), and mobile security protocols.",
    skills: "Flutter, Dart, REST API, Git, Mobile Security",
    salary_or_funding: "$900 - $1,600 / month",
    local_benefits: "NSSF, Staff Loan Program, Health & Accident Insurance",
    visa_sponsorship: false,
    language_requirements: "Khmer, English",
    deadline: new Date(Date.now() + 18 * 86400000).toISOString(),
    source_url: "https://www.ababank.com/careers/mobile-dev",
    source_name: "BongThom Careers",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 84,
  },
  {
    id: 3,
    title: "Software Engineering Intern (Summer 2027)",
    organization: "Morodok Tech Solutions",
    category: "internship",
    location_type: "local",
    country: "Cambodia",
    province_city: "Phnom Penh",
    work_format: "hybrid",
    field_of_study: "Computer Science",
    education_level: "Undergraduate (Year 3 or 4)",
    description: "Hands-on internship building cloud web applications, unit testing, and contributing to live client projects.",
    requirements: "Familiarity with JavaScript/TypeScript, HTML/CSS, and basic database principles.",
    skills: "JavaScript, React, Git, Team Collaboration",
    salary_or_funding: "$300 - $450 / month stipend",
    local_benefits: "Mentorship program, free lunch, certificate of completion",
    visa_sponsorship: false,
    language_requirements: "Khmer & conversational English",
    deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
    source_url: "https://morodok.tech/internships",
    source_name: "University Career Board",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 92,
  },
  {
    id: 4,
    title: "Digital Marketing & Content Intern",
    organization: "Siem Reap Tourism Innovation Hub",
    category: "internship",
    location_type: "local",
    country: "Cambodia",
    province_city: "Siem Reap",
    work_format: "on_site",
    field_of_study: "Media & Communications",
    education_level: "High School or University Student",
    description: "Create engaging digital storytelling campaigns promoting cultural heritage and sustainable tourism.",
    requirements: "Creativity, familiarity with Canva or Adobe Suite, social media savvy.",
    skills: "Canva, Copywriting, Social Media, Photography",
    salary_or_funding: "$250 / month + transportation allowance",
    local_benefits: "NSSF, flexible exam schedule",
    visa_sponsorship: false,
    language_requirements: "Khmer, English",
    deadline: new Date(Date.now() + 8 * 86400000).toISOString(),
    source_url: "https://angkorhub.kh/internships",
    source_name: "BongThom Careers",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 68,
  },
  {
    id: 5,
    title: "Cambodia AI & Cloud Fundamentals Bootcamp",
    organization: "CADT (Cambodia Academy of Digital Technology)",
    category: "upskilling",
    location_type: "local",
    country: "Cambodia",
    province_city: "Phnom Penh",
    work_format: "hybrid",
    field_of_study: "Data Science & Artificial Intelligence",
    education_level: "Open to All Students & Professionals",
    description: "Intensive 12-week program covering machine learning algorithms, cloud pipelines, and generative AI application design.",
    requirements: "Basic programming proficiency in Python.",
    skills: "Python, Machine Learning, AWS, Prompt Engineering",
    salary_or_funding: "100% Fully Sponsored by MoEYS & MPTC Grant",
    local_benefits: "Official Government Certification, Job Placement Assistance",
    visa_sponsorship: false,
    language_requirements: "Khmer & English",
    deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
    source_url: "https://cadt.edu.kh/programs/ai-bootcamp",
    source_name: "CADT Official",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 95,
  },
  {
    id: 6,
    title: "Chevening Master's Scholarship 2027",
    organization: "UK Foreign, Commonwealth and Development Office",
    category: "scholarship",
    location_type: "international",
    country: "United Kingdom",
    province_city: "London / Multiple Cities",
    work_format: "on_site",
    field_of_study: "All Fields (STEM, Policy, Economics, Tech)",
    education_level: "Postgraduate / Master's Degree",
    description: "The UK government's flagship global scholarship program for emerging leaders to pursue a one-year Master's degree at any UK university.",
    requirements: "Bachelor's degree with strong academic record, 2+ years of professional work experience, leadership potential.",
    skills: "Academic Writing, Research, Leadership, Critical Thinking",
    salary_or_funding: "Fully Funded (Full tuition, £1,400 monthly living allowance, return airfare, arrival allowance)",
    local_benefits: undefined,
    visa_sponsorship: true,
    language_requirements: "IELTS Academic 6.5+ or equivalent",
    deadline: new Date(Date.now() + 45 * 86400000).toISOString(),
    source_url: "https://www.chevening.org/scholarship/cambodia/",
    source_name: "British Embassy Phnom Penh",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 89,
  },
  {
    id: 7,
    title: "MEXT Japanese Government Postgraduate Research Scholarship",
    organization: "Ministry of Education, Culture, Sports, Science and Technology (Japan)",
    category: "scholarship",
    location_type: "international",
    country: "Japan",
    province_city: "Tokyo / Kyoto / Osaka",
    work_format: "on_site",
    field_of_study: "Science, Technology, Engineering, Agriculture",
    education_level: "Master's / PhD",
    description: "Prestigious full government fellowship to conduct graduate research and earn Master's or Doctoral degrees at top national universities in Japan.",
    requirements: "Cambodian citizen, under 35 years of age, holding a recognized Bachelor's degree with strong GPA.",
    skills: "Research Methodology, Japanese or English Language, STEM Foundations",
    salary_or_funding: "Fully Funded (Full tuition waiver, ¥144,000/month stipend, round-trip flight ticket)",
    local_benefits: undefined,
    visa_sponsorship: true,
    language_requirements: "English (TOEFL/IELTS) or Japanese (JLPT N2+)",
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    source_url: "https://www.kh.emb-japan.go.jp/itpr_en/mext_postgrad.html",
    source_name: "Embassy of Japan in Cambodia",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 91,
  },
  {
    id: 8,
    title: "Australia Awards Scholarships (Intake 2027)",
    organization: "Australian Department of Foreign Affairs and Trade (DFAT)",
    category: "scholarship",
    location_type: "international",
    country: "Australia",
    province_city: "Melbourne / Sydney / Canberra",
    work_format: "on_site",
    field_of_study: "Digital Economy, Public Health, Environmental Science, Education",
    education_level: "Master's Degree",
    description: "Long-term development awards that provide opportunities for Cambodian professionals to study at top Australian universities.",
    requirements: "Minimum 2 years relevant work experience in Cambodia, commitment to return and contribute to national development.",
    skills: "Policy Analysis, Sustainability, Leadership, Cross-cultural Communications",
    salary_or_funding: "Fully Funded (100% Tuition fees, return air travel, establishment allowance, living expenses AUD 30,000/yr)",
    local_benefits: undefined,
    visa_sponsorship: true,
    language_requirements: "IELTS 6.5 (no band below 6.0)",
    deadline: new Date(Date.now() + 60 * 86400000).toISOString(),
    source_url: "https://www.australiaawardscambodia.org/",
    source_name: "Australian Embassy Cambodia",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 86,
  },
  {
    id: 9,
    title: "Global Software Engineering Internship (Summer Cohort)",
    organization: "Grab Regional Tech HQ",
    category: "internship",
    location_type: "international",
    country: "Singapore",
    province_city: "Singapore",
    work_format: "hybrid",
    field_of_study: "Computer Science or Software Engineering",
    education_level: "Bachelor's Student",
    description: "Join Grab's core engineering teams working on distributed payment pipelines and hyper-local mapping services across Southeast Asia.",
    requirements: "Strong foundations in data structures, algorithms, and one systems language (Go, Java, Python).",
    skills: "Go, Python, Distributed Systems, Algorithms, Git",
    salary_or_funding: "SGD $2,500 / month + Flight subsidy",
    local_benefits: undefined,
    visa_sponsorship: true,
    language_requirements: "Fluent English",
    deadline: new Date(Date.now() + 35 * 86400000).toISOString(),
    source_url: "https://grab.careers/internships-tech",
    source_name: "Grab Careers",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 94,
  },
  {
    id: 10,
    title: "Remote Junior Data Engineer",
    organization: "ASEAN Insights Analytics Ltd",
    category: "job",
    location_type: "international",
    country: "Remote (ASEAN)",
    province_city: "Remote",
    work_format: "remote",
    field_of_study: "Data Engineering or Computer Science",
    education_level: "Bachelor or equivalent",
    description: "Build scalable ETL data pipelines, manage Postgres/BigQuery tables, and clean data for enterprise intelligence reports.",
    requirements: "Proficiency in SQL, Python, and automated data ingestion scripts.",
    skills: "SQL, Python, ETL, Airflow, BigQuery",
    salary_or_funding: "$900 - $1,500 / month",
    local_benefits: "Flexible hours, equipment allowance, remote stipend",
    visa_sponsorship: false,
    language_requirements: "English",
    deadline: new Date(Date.now() + 22 * 86400000).toISOString(),
    source_url: "https://aseaninsights.io/jobs/data-eng",
    source_name: "RemoteAsia Board",
    is_verified: true,
    is_bookmarked: false,
    created_at: new Date().toISOString(),
    matchScore: 88,
  }
];

export const fallbackNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New High-Match Opportunity!",
    message: "Senior Full-Stack Developer at Wing Bank matches 96% of your profile skills (Python, FastAPI, Next.js).",
    timestamp: "10 minutes ago",
    read: false,
    type: "opportunity",
    opportunityId: 1,
  },
  {
    id: 2,
    title: "Application Deadline Closing Soon",
    message: "Digital Marketing & Content Intern at Siem Reap Tourism closes in 8 days.",
    timestamp: "2 hours ago",
    read: false,
    type: "deadline",
    opportunityId: 4,
  },
  {
    id: 3,
    title: "Teacher Collection Shared",
    message: "Prof. David Kim shared 'Top 2027 International Scholarships for IT Graduates' with your class.",
    timestamp: "Yesterday",
    read: true,
    type: "curation",
  },
  {
    id: 4,
    title: "Crawler Health Notice",
    message: "CamHR Spider completed crawl: 24 found, 5 new normalized, 19 duplicates deduplicated.",
    timestamp: "Yesterday",
    read: true,
    type: "system",
  }
];

export const fallbackCuratedCollections: CuratedCollection[] = [
  {
    id: 1,
    title: "Top 2027 International Scholarships for IT Graduates",
    author: "Prof. David Kim (Faculty of CS & IT)",
    targetGroup: "Year 4 Undergraduate Students",
    description: "Curated list of fully funded Master's fellowships (Chevening, MEXT, Australia Awards) with visa sponsorship and English proficiency criteria.",
    opportunityIds: [6, 7, 8],
    createdAt: "Nov 15, 2026",
    viewsCount: 142,
  },
  {
    id: 2,
    title: "High-Priority Software & AI Summer Internships (Cambodia)",
    author: "Career Development Office",
    targetGroup: "Year 2 & 3 Computer Science Cohort",
    description: "Verified tech internships in Phnom Penh with established engineering mentors and competitive stipends.",
    opportunityIds: [1, 3, 5],
    createdAt: "Nov 18, 2026",
    viewsCount: 230,
  },
];

export const fallbackScraperSources: ScraperSource[] = [
  {
    id: 1,
    name: "CamHR Career Portal",
    target_url: "https://www.camhr.com/jobs",
    category: "job",
    location_type: "local",
    schedule_interval: "Every 6 hours",
    last_run_at: "2 hours ago",
    status: "active",
    items_scraped_total: 142,
    successRate: 98.4,
  },
  {
    id: 2,
    name: "BongThom Careers & Classifieds",
    target_url: "https://www.bongthom.com/jobs",
    category: "job",
    location_type: "local",
    schedule_interval: "Every 6 hours",
    last_run_at: "3 hours ago",
    status: "active",
    items_scraped_total: 98,
    successRate: 99.1,
  },
  {
    id: 3,
    name: "CADT Announcements & Bootcamps",
    target_url: "https://cadt.edu.kh/announcements",
    category: "upskilling",
    location_type: "local",
    schedule_interval: "Daily",
    last_run_at: "14 hours ago",
    status: "active",
    items_scraped_total: 35,
    successRate: 100.0,
  },
  {
    id: 4,
    name: "UK Chevening Cambodia Board",
    target_url: "https://www.chevening.org/scholarship/cambodia/",
    category: "scholarship",
    location_type: "international",
    schedule_interval: "Weekly",
    last_run_at: "2 days ago",
    status: "active",
    items_scraped_total: 12,
    successRate: 97.2,
  },
  {
    id: 5,
    name: "Embassy of Japan MEXT Gateway",
    target_url: "https://www.kh.emb-japan.go.jp/itpr_en/mext_postgrad.html",
    category: "scholarship",
    location_type: "international",
    schedule_interval: "Weekly",
    last_run_at: "3 days ago",
    status: "active",
    items_scraped_total: 18,
    successRate: 96.5,
  }
];

export const fallbackScraperLogs: ScraperLog[] = [
  {
    id: 1,
    source_name: "CamHR Career Portal",
    started_at: "Today, 14:10",
    finished_at: "Today, 14:15",
    status: "SUCCESS",
    items_found: 24,
    new_items: 5,
    duplicates: 19
  },
  {
    id: 2,
    source_name: "BongThom Classifieds",
    started_at: "Today, 13:00",
    finished_at: "Today, 13:04",
    status: "SUCCESS",
    items_found: 18,
    new_items: 4,
    duplicates: 14
  },
  {
    id: 3,
    source_name: "CADT Tech Notices",
    started_at: "Yesterday, 20:00",
    finished_at: "Yesterday, 20:02",
    status: "SUCCESS",
    items_found: 6,
    new_items: 1,
    duplicates: 5
  }
];

export async function fetchOpportunities(filters?: FilterState): Promise<{ items: Opportunity[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.searchQuery) params.append('q', filters.searchQuery);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.locationType !== 'all') params.append('location_type', filters.locationType);
      if (filters.provinceCity) params.append('province_city', filters.provinceCity);
      if (filters.country) params.append('country', filters.country);
      if (filters.workFormat !== 'all') params.append('work_format', filters.workFormat);
      if (filters.visaSponsorshipOnly) params.append('visa_sponsorship', 'true');
      if (filters.verifiedOnly) params.append('is_verified', 'true');
      if (filters.closingSoonOnly) params.append('closing_soon', 'true');
    }

    const response = await fetch(`${API_BASE_URL}/opportunities?${params.toString()}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      return { items: data.items, total: data.total };
    }
  } catch (err) {
    console.warn("Backend not reachable, falling back to local mock data", err);
  }

  // Fallback filtering if backend is not started
  let filtered = [...fallbackOpportunities];
  if (filters) {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.organization.toLowerCase().includes(q) ||
        (item.skills && item.skills.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q)
      );
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    if (filters.locationType !== 'all') {
      filtered = filtered.filter(item => item.location_type === filters.locationType);
    }
    if (filters.provinceCity) {
      filtered = filtered.filter(item => item.province_city?.toLowerCase().includes(filters.provinceCity.toLowerCase()));
    }
    if (filters.country) {
      filtered = filtered.filter(item => item.country.toLowerCase().includes(filters.country.toLowerCase()));
    }
    if (filters.fieldOfStudy) {
      filtered = filtered.filter(item => item.field_of_study?.toLowerCase().includes(filters.fieldOfStudy.toLowerCase()));
    }
    if (filters.educationLevel) {
      filtered = filtered.filter(item => item.education_level?.toLowerCase().includes(filters.educationLevel.toLowerCase()));
    }
    if (filters.workFormat !== 'all') {
      filtered = filtered.filter(item => item.work_format === filters.workFormat);
    }
    if (filters.visaSponsorshipOnly) {
      filtered = filtered.filter(item => item.visa_sponsorship);
    }
    if (filters.verifiedOnly) {
      filtered = filtered.filter(item => item.is_verified);
    }
    if (filters.highMatchOnly) {
      filtered = filtered.filter(item => (item.matchScore || 0) >= 90);
    }
    if (filters.closingSoonOnly) {
      const now = Date.now();
      const in14Days = now + 14 * 86400000;
      filtered = filtered.filter(item => {
        if (!item.deadline) return false;
        const d = new Date(item.deadline).getTime();
        return d >= now && d <= in14Days;
      });
    }
  }

  return { items: filtered, total: filtered.length };
}

export async function loginUser(email: string, password: string):Promise<AuthResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    if (response.ok) {
      const data: AuthResponse = await response.json();
      saveAuthSession(data.access_token, data.user);
      return data;
    }
  } catch (err) {
    console.warn("Backend login failed or unreachable, checking fallback accounts", err);
  }

  // Fallback local authentication
  const matched = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (matched && password === 'password123') {
    const mockAuth: AuthResponse = {
      access_token: `mock_jwt_token_${matched.role}_${Date.now()}`,
      token_type: 'bearer',
      user: matched,
    };
    saveAuthSession(mockAuth.access_token, mockAuth.user);
    return mockAuth;
  }

  // If user entered any other email with matching demo format
  if (email && password) {
    const guestUser: User = {
      id: Math.floor(Math.random() * 9000) + 1000,
      email: email,
      full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: email.includes('admin') ? 'admin' : email.includes('teacher') ? 'teacher' : email.includes('staff') ? 'staff' : 'student',
    };
    const mockAuth: AuthResponse = {
      access_token: `mock_jwt_token_${guestUser.role}_${Date.now()}`,
      token_type: 'bearer',
      user: guestUser,
    };
    saveAuthSession(mockAuth.access_token, mockAuth.user);
    return mockAuth;
  }

  throw new Error('Invalid email or password');
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
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const user: User = await response.json();
      return user;
    }
  } catch (err) {
    console.warn("Backend register failed or unreachable, saving mock registration", err);
  }

  const newUser: User = {
    id: Math.floor(Math.random() * 9000) + 1000,
    email: userData.email,
    full_name: userData.full_name,
    role: userData.role,
    field_of_study: userData.field_of_study,
    education_level: userData.education_level,
    skills: userData.skills,
    created_at: new Date().toISOString(),
  };

  saveAuthSession(`mock_jwt_token_${newUser.role}_${Date.now()}`, newUser);
  return newUser;
}

export function saveAuthSession(token: string, user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('opphub_token', token);
    localStorage.setItem('opphub_user', JSON.stringify(user));
  }
}

export function getStoredUser(): User | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('opphub_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }
  return null;
}

export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('opphub_token');
    localStorage.removeItem('opphub_user');
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('opphub_token');
  }
  return null;
}

export async function updateUserProfile(profileData: Partial<User>): Promise<User> {
  const token = getStoredToken();
  if (token) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        const updated: User = await res.json();
        saveAuthSession(token, updated);
        return updated;
      }
    } catch (e) {
      console.warn("Backend updateUserProfile error, using fallback update", e);
    }
  }
  const current = getStoredUser() || fallbackUsers[0];
  const merged: User = { ...current, ...profileData };
  saveAuthSession(token || 'mock_token', merged);
  return merged;
}

export async function fetchAlertSettings(): Promise<AlertSettings> {
  const token = getStoredToken();
  if (token) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/alert-settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  return {
    frequency: 'daily',
    email_enabled: true,
    telegram_enabled: true,
    deadline_alerts: true,
    scholarship_alerts: true,
    job_alerts: true,
  };
}

export async function updateAlertSettings(settings: AlertSettings): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/alert-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings),
      });
    } catch {}
  }
}

export async function fetchAdminUsers(role?: string, query?: string): Promise<User[]> {
  const token = getStoredToken();
  if (token) {
    try {
      const params = new URLSearchParams();
      if (role && role !== 'all') params.append('role', role);
      if (query) params.append('q', query);
      const res = await fetch(`${API_BASE_URL}/auth/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  // Fallback
  let users = [...fallbackUsers];
  if (role && role !== 'all') users = users.filter(u => u.role === role);
  if (query) {
    users = users.filter(
      u =>
        u.full_name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
  }
  return users;
}

export async function updateUserRole(userId: number, newRole: UserRole): Promise<User> {
  const token = getStoredToken();
  if (token) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  const user = fallbackUsers.find(u => u.id === userId);
  if (user) user.role = newRole;
  return user || { id: userId, email: '', full_name: '', role: newRole };
}

export async function fetchStaffAnalytics(): Promise<StaffAnalyticsData> {
  const token = getStoredToken();
  if (token) {
    try {
      const res = await fetch(`${API_BASE_URL}/tracking/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  return {
    opportunity_views: 14890,
    student_bookmarks: 2410,
    applications_started: 1120,
    verified_postings: 38,
    top_keywords: [
      { keyword: 'Python / FastAPI', count: 482, growth: '+28%' },
      { keyword: 'Flutter Mobile', count: 351, growth: '+15%' },
      { keyword: 'Fully Funded Scholarship', count: 520, growth: '+34%' },
      { keyword: 'Phnom Penh Internship', count: 390, growth: '+19%' },
      { keyword: 'CADT AI Bootcamp', count: 284, growth: '+42%' },
    ],
    category_distribution: {
      scholarship: 41,
      job: 32,
      internship: 18,
      upskilling: 9,
    }
  };
}

export async function createOpportunity(oppData: Partial<Opportunity>): Promise<Opportunity> {
  const token = getStoredToken();
  if (token) {
    try {
      const res = await fetch(`${API_BASE_URL}/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(oppData),
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  const newOpp: Opportunity = {
    id: Date.now(),
    title: oppData.title || 'Untitled Opportunity',
    organization: oppData.organization || 'Organization',
    category: oppData.category || 'job',
    location_type: oppData.location_type || 'local',
    country: oppData.country || 'Cambodia',
    province_city: oppData.province_city,
    work_format: oppData.work_format || 'on_site',
    description: oppData.description || '',
    requirements: oppData.requirements,
    skills: oppData.skills,
    salary_or_funding: oppData.salary_or_funding,
    local_benefits: oppData.local_benefits,
    visa_sponsorship: oppData.visa_sponsorship || false,
    deadline: oppData.deadline,
    source_url: oppData.source_url || 'https://opphub.kh/post',
    source_name: oppData.source_name || 'Verified Hub Posting',
    is_verified: true,
    created_at: new Date().toISOString(),
  };
  return newOpp;
}

export async function deleteOpportunity(oppId: number): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/opportunities/${oppId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch {}
  }
}

export async function deleteCuratedCollection(collectionId: number): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/tracking/curated/${collectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch {}
  }
}

export async function fetchOpportunityById(id: number): Promise<Opportunity | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/opportunities/${id}`);
    if (res.ok) return await res.json();
  } catch {}
  return fallbackOpportunities.find(o => o.id === id) || null;
}
