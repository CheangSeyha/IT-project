'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Opportunity, ApplicationStatus, UserRole, FilterState, NotificationItem, Language } from '@/types';
import { fetchOpportunities, fallbackOpportunities, fallbackNotifications } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FilterSidebar } from '@/components/FilterSidebar';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityModal } from '@/components/OpportunityModal';
import { ApplicationTrackerView } from '@/components/ApplicationTrackerView';
import { TeacherCurationView } from '@/components/TeacherCurationView';
import { AlertSettingsModal } from '@/components/AlertSettingsModal';
import { Compass, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'opportunities' | 'tracker' | 'curation'>('opportunities');
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(fallbackNotifications);

  // Modals state
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

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

  // Load opportunities
  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOpportunities(filters);
      setOpportunities(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadOpportunities();
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
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
  };

  const bookmarkCount = useMemo(() => {
    return opportunities.filter(o => o.is_bookmarked).length;
  }, [opportunities]);

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
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenAlertSettings={() => setShowAlertSettings(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main View Switcher */}
      {currentView === 'tracker' ? (
        <ApplicationTrackerView
          opportunities={opportunities}
          trackers={trackers}
          onUpdateStatus={handleUpdateStatus}
          onSelect={setSelectedOpportunity}
        />
      ) : currentView === 'curation' ? (
        <TeacherCurationView
          opportunities={opportunities}
          onSelect={setSelectedOpportunity}
        />
      ) : (
        /* Default Opportunities Explore Catalog View */
        <main className="flex-1">
          <HeroSection
            searchQuery={filters.searchQuery}
            setSearchQuery={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
            selectedCategory={filters.category}
            setSelectedCategory={(cat) => setFilters(prev => ({ ...prev, category: cat }))}
            locationScope={filters.locationType}
            setLocationScope={(scope) => setFilters(prev => ({ ...prev, locationType: scope }))}
            totalCount={opportunities.length}
            language={language}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Faceted Filter Sidebar */}
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />

              {/* Opportunities Grid */}
              <div className="flex-1 w-full space-y-4">
                {/* Result Status Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center space-x-2 text-xs text-slate-600 font-semibold">
                    <span>
                      {language === 'km' ? 'បង្ហាញ' : 'Showing'}{' '}
                      <strong className="text-slate-900">{opportunities.length}</strong>{' '}
                      {language === 'km' ? 'ឱកាស' : 'listings'}
                    </span>
                    {filters.locationType !== 'all' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px]">
                        {filters.locationType === 'local' ? 'Cambodia Only' : 'Overseas Only'}
                      </span>
                    )}
                    {filters.category !== 'all' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[11px] capitalize">
                        {filters.category}
                      </span>
                    )}
                    {filters.highMatchOnly && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                        90%+ Match
                      </span>
                    )}
                  </div>

                  <button
                    onClick={loadOpportunities}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
                    title="Refresh Opportunities"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
                  </button>
                </div>

                {/* Grid of Opportunity Cards */}
                {opportunities.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                    <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-700">No matching opportunities found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try broadening your search keywords or resetting specific filters in the sidebar.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opportunities.map(opp => (
                      <OpportunityCard
                        key={opp.id}
                        opportunity={opp}
                        onSelect={setSelectedOpportunity}
                        onToggleBookmark={handleToggleBookmark}
                        onTrack={(opp) => {
                          handleUpdateStatus(opp.id, 'saved');
                          setCurrentView('tracker');
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Details & Tracker Modal */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onToggleBookmark={handleToggleBookmark}
        onUpdateStatus={handleUpdateStatus}
        currentStatus={selectedOpportunity ? trackers[selectedOpportunity.id] : 'saved'}
      />

      {/* Alert Settings Modal */}
      <AlertSettingsModal
        isOpen={showAlertSettings}
        onClose={() => setShowAlertSettings(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 OpportunityHub (OppHub) • Year 5 IT Project Management</p>
          <p>Automated Scrapers strictly adhere to robots.txt & ethical crawling guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
