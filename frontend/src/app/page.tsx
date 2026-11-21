'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Opportunity, ApplicationStatus, UserRole, FilterState, Language, User } from '@/types';
import {
  fetchOpportunities,
  fallbackOpportunities,
  getStoredUser,
  fetchApplications,
  updateApplicationTracker,
} from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { RolePathwaysSection } from '@/components/RolePathwaysSection';
import { FilterSidebar } from '@/components/FilterSidebar';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityModal } from '@/components/OpportunityModal';
import { AuthPromptModal } from '@/components/AuthPromptModal';
import { StudentApplyModal } from '@/components/StudentApplyModal';
import { TeacherPostCardModal } from '@/components/TeacherPostCardModal';
import { StaffPostModal } from '@/components/StaffPostModal';
import { ApplicationTrackerView } from '@/components/ApplicationTrackerView';
import { TeacherCurationView } from '@/components/TeacherCurationView';
import {
  Compass,
  RefreshCw,
  X,
  GraduationCap,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'opportunities' | 'tracker' | 'curation'>('opportunities');
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals state
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [targetApplyOpportunity, setTargetApplyOpportunity] = useState<Opportunity | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showTeacherCardModal, setShowTeacherCardModal] = useState(false);
  const [showStaffPostModal, setShowStaffPostModal] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
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
  });

  // Opportunities state
  const [opportunities, setOpportunities] = useState<Opportunity[]>(fallbackOpportunities);

  // Application tracker map (opportunityId -> ApplicationStatus)
  const [trackers, setTrackers] = useState<Record<number, ApplicationStatus>>({
    1: 'preparing',
    3: 'applied',
    6: 'saved',
    7: 'interviewing',
  });

  // Check current session
  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);
    if (user) {
      setActiveRole(user.role);
    }
  }, []);

  // Fetch applications for current user if logged in
  useEffect(() => {
    if (currentUser) {
      fetchApplications().then(appMap => {
        if (appMap && Object.keys(appMap).length > 0) {
          setTrackers(prev => ({ ...prev, ...appMap }));
        }
      });
    }
  }, [currentUser]);

  // Load opportunities from backend
  const loadOpportunities = useCallback(async (showToast = false) => {
    setLoading(true);
    try {
      const data = await fetchOpportunities(filters);
      setOpportunities(data.items);
      if (showToast) {
        toast.success('Opportunity listings updated', {
          description: `Loaded ${data.items.length} opportunities.`,
        });
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        toast.error('Failed to sync listings from server');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadOpportunities(false);
  }, [loadOpportunities]);

  // Bookmarking handler
  const handleToggleBookmark = (id: number) => {
    setOpportunities(prev =>
      prev.map(item => (item.id === id ? { ...item, is_bookmarked: !item.is_bookmarked } : item))
    );
    if (selectedOpportunity && selectedOpportunity.id === id) {
      setSelectedOpportunity(prev => prev ? { ...prev, is_bookmarked: !prev.is_bookmarked } : null);
    }
  };

  // Application status update handler
  const handleUpdateStatus = (id: number, status: ApplicationStatus) => {
    setTrackers(prev => ({
      ...prev,
      [id]: status,
    }));
    updateApplicationTracker(id, status);
  };

  // Initiate Student Apply Flow
  const handleInitiateApply = (opp: Opportunity) => {
    const user = currentUser || getStoredUser();
    if (!user) {
      setTargetApplyOpportunity(opp);
      setShowAuthPrompt(true);
      return;
    }

    if (user.role === 'student' || user.role === 'public') {
      setTargetApplyOpportunity(opp);
      setShowApplyModal(true);
    } else {
      toast.info(`Signed in as ${user.role.toUpperCase()}`, {
        description: 'Applications are reserved for student accounts. You can create or manage cards in your Dashboard.',
      });
    }
  };

  // Handle successful application submit
  const handleApplicationSubmitted = (opportunityId: number) => {
    setTrackers(prev => ({
      ...prev,
      [opportunityId]: 'applied',
    }));
  };

  // Handle card created by teacher or staff
  const handleCardCreated = (newOpp: Opportunity) => {
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const handleResetFilters = () => {
    setFilters({
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
    });
    toast.info('All search filters reset');
  };

  const bookmarkCount = useMemo(() => {
    return opportunities.filter(o => o.is_bookmarked).length;
  }, [opportunities]);

  const categoryCounts = useMemo(() => {
    return {
      all: opportunities.length,
      job: opportunities.filter(o => o.category === 'job').length,
      internship: opportunities.filter(o => o.category === 'internship').length,
      scholarship: opportunities.filter(o => o.category === 'scholarship').length,
      upskilling: opportunities.filter(o => o.category === 'upskilling').length,
      school_work: opportunities.filter(o => o.category === 'school_work').length,
    };
  }, [opportunities]);

  const scrollToCatalog = () => {
    const el = document.getElementById('work-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        bookmarkCount={bookmarkCount}
        locationScope={filters.locationType}
        setLocationScope={(scope) => setFilters(prev => ({ ...prev, locationType: scope }))}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main View Switcher with Animated Transitions */}
      <AnimatePresence mode="wait">
        {currentView === 'tracker' ? (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <ApplicationTrackerView
              opportunities={opportunities}
              trackers={trackers}
              onUpdateStatus={handleUpdateStatus}
              onSelect={setSelectedOpportunity}
            />
          </motion.div>
        ) : currentView === 'curation' ? (
          <motion.div
            key="curation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <TeacherCurationView
              opportunities={opportunities}
              onSelect={setSelectedOpportunity}
            />
          </motion.div>
        ) : (
          /* Default Client Catalog View */
          <main key="opportunities" className="flex-1">
            {/* 1. Hero Section */}
            <HeroSection
              searchQuery={filters.searchQuery}
              setSearchQuery={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
              selectedCategory={filters.category}
              setSelectedCategory={(cat) => setFilters(prev => ({ ...prev, category: cat }))}
              locationScope={filters.locationType}
              setLocationScope={(scope) => setFilters(prev => ({ ...prev, locationType: scope }))}
              totalCount={opportunities.length}
              categoryCounts={categoryCounts}
              language={language}
              onSearchSubmit={() => loadOpportunities(true)}
            />

            {/* 2. Customized Role Ecosystem Section (Requested by User) */}
            <RolePathwaysSection
              currentUser={currentUser}
              language={language}
              onOpenTeacherPostModal={() => setShowTeacherCardModal(true)}
              onOpenStaffPostModal={() => setShowStaffPostModal(true)}
              onScrollToCatalog={scrollToCatalog}
            />

            {/* 3. Interactive Role Status & Action Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 border border-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                    {currentUser ? (
                      currentUser.role === 'teacher' ? (
                        <Users className="w-5 h-5" />
                      ) : currentUser.role === 'staff' ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <GraduationCap className="w-5 h-5" />
                      )
                    ) : (
                      <GraduationCap className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    {currentUser ? (
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">
                          {currentUser.role === 'student' && `Logged in as Student: ${currentUser.full_name}`}
                          {currentUser.role === 'teacher' && `Teacher Privileges: ${currentUser.full_name}`}
                          {currentUser.role === 'staff' && `Career Staff Privileges: ${currentUser.full_name}`}
                          {currentUser.role === 'admin' && `System Administrator: ${currentUser.full_name}`}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {currentUser.role === 'student' &&
                            'Browse below, select any card to apply directly, and monitor your milestones in My Applications.'}
                          {currentUser.role === 'teacher' &&
                            'You have access to create school work cards and manage class collections from your dashboard.'}
                          {currentUser.role === 'staff' &&
                            'You can publish verified institutional opportunities and monitor live student engagement metrics.'}
                          {currentUser.role === 'admin' &&
                            'Full administrative control over scrapers, sources, and user privileges.'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">
                          {language === 'km' ? 'សិស្សចង់ដាក់ពាក្យស្នើសុំ?' : 'Students: Looking to Apply for Work or Jobs?'}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {language === 'km'
                            ? 'សូមបង្កើតគណនីជាសិស្ស (Student) ដើម្បីជ្រើសរើសកាតការងារ ឬកិច្ចការសាលា ហើយដាក់ពាក្យស្នើសុំភ្លាមៗ។'
                            : 'Students must register to create an account and select a card to apply. Teachers and staff can create listings in their dashboards.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {currentUser ? (
                    currentUser.role === 'teacher' ? (
                      <>
                        <button
                          onClick={() => setShowTeacherCardModal(true)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create School Work Card</span>
                        </button>
                        <Link
                          href="/teacher"
                          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold transition-colors"
                        >
                          Teacher Dashboard
                        </Link>
                      </>
                    ) : currentUser.role === 'staff' ? (
                      <>
                        <button
                          onClick={() => setShowStaffPostModal(true)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Post Verified Opportunity</span>
                        </button>
                        <Link
                          href="/staff"
                          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold transition-colors"
                        >
                          Staff Dashboard
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={scrollToCatalog}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1"
                      >
                        <span>Select Cards Below</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )
                  ) : (
                    <>
                      <Link
                        href="/login?mode=register&role=student"
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-all"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Register as Student</span>
                      </Link>
                      <button
                        onClick={() => {
                          const opp = opportunities[0];
                          setTargetApplyOpportunity(opp);
                          setShowAuthPrompt(true);
                        }}
                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-colors"
                      >
                        1-Click Student Demo
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Opportunities Catalog & Work List Down */}
            <div id="work-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Faceted Filter Sidebar */}
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  onReset={handleResetFilters}
                />

                {/* Opportunities Grid & Results */}
                <div className="flex-1 w-full space-y-4">
                  {/* Result Status Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 font-semibold">
                      <span>
                        {language === 'km' ? 'បង្ហាញ' : 'Showing'}{' '}
                        <strong className="text-slate-900 font-extrabold">{opportunities.length}</strong>{' '}
                        {language === 'km' ? 'ឱកាស' : 'listings'}
                      </span>

                      {filters.locationType !== 'all' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 text-[11px] font-bold">
                          <span>{filters.locationType === 'local' ? 'Cambodia' : 'Overseas'}</span>
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, locationType: 'all' }))}
                            className="hover:text-blue-950"
                          >
                            <X className="w-3 h-3 ml-0.5" />
                          </button>
                        </span>
                      )}

                      {filters.category !== 'all' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800 text-[11px] font-bold capitalize">
                          <span>{filters.category.replace('_', ' ')}</span>
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                            className="hover:text-slate-950"
                          >
                            <X className="w-3 h-3 ml-0.5" />
                          </button>
                        </span>
                      )}

                      {filters.searchQuery && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-100/80 text-indigo-800 text-[11px] font-bold">
                          <span>&quot;{filters.searchQuery}&quot;</span>
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                            className="hover:text-indigo-950"
                          >
                            <X className="w-3 h-3 ml-0.5" />
                          </button>
                        </span>
                      )}

                      {filters.highMatchOnly && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          90%+ Match
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => loadOpportunities(true)}
                      className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-xs"
                      title="Sync listings"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
                    </button>
                  </div>

                  {/* Grid of Opportunity Cards */}
                  {opportunities.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                        <Compass className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-800">No matching opportunities found</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try broadening your search keywords or resetting specific filters in the sidebar.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-xs font-bold rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                      >
                        Reset All Filters
                      </button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {opportunities.map(opp => (
                        <OpportunityCard
                          key={opp.id}
                          opportunity={opp}
                          onSelect={setSelectedOpportunity}
                          onToggleBookmark={handleToggleBookmark}
                          onTrack={(o) => {
                            handleUpdateStatus(o.id, 'saved');
                            setCurrentView('tracker');
                          }}
                          onApply={handleInitiateApply}
                          isApplied={trackers[opp.id] === 'applied'}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        )}
      </AnimatePresence>

      {/* Details & Tracker Modal */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onToggleBookmark={handleToggleBookmark}
        onUpdateStatus={handleUpdateStatus}
        currentStatus={selectedOpportunity ? trackers[selectedOpportunity.id] : 'saved'}
        onApply={handleInitiateApply}
        isApplied={selectedOpportunity ? trackers[selectedOpportunity.id] === 'applied' : false}
      />

      {/* Auth Prompt Modal (For Unauthenticated Users) */}
      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        opportunity={targetApplyOpportunity}
        onLoggedIn={(user) => {
          setCurrentUser(user);
          setActiveRole(user.role);
          if (targetApplyOpportunity) {
            setShowApplyModal(true);
          }
        }}
      />

      {/* Student Direct Application Modal */}
      <StudentApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        opportunity={targetApplyOpportunity}
        currentUser={currentUser}
        onApplicationSubmitted={handleApplicationSubmitted}
      />

      {/* Teacher Opportunity / School Work Modal */}
      <TeacherPostCardModal
        isOpen={showTeacherCardModal}
        onClose={() => setShowTeacherCardModal(false)}
        onCardCreated={handleCardCreated}
      />

      {/* Staff Opportunity Modal */}
      <StaffPostModal
        isOpen={showStaffPostModal}
        onClose={() => setShowStaffPostModal(false)}
        onAddOpportunity={handleCardCreated}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-medium">
          <p>© 2026 OpportunityHub (OppHub) • Year 5 IT Project Management</p>
          <p>Automated Scrapers strictly adhere to robots.txt & ethical crawling guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
