'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Opportunity, ApplicationStatus, UserRole, FilterState } from '@/types';
import { fetchOpportunities, fallbackOpportunities } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FilterSidebar } from '@/components/FilterSidebar';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityModal } from '@/components/OpportunityModal';
import { ApplicationTrackerView } from '@/components/ApplicationTrackerView';
import { TeacherCurationView } from '@/components/TeacherCurationView';
import { AdminScraperView } from '@/components/AdminScraperView';
import { Compass, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'opportunities' | 'tracker' | 'curation' | 'admin'>('opportunities');
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    locationType: 'all',
    provinceCity: '',
    country: '',
    workFormat: 'all',
    visaSponsorshipOnly: false,
    closingSoonOnly: false,
    verifiedOnly: false,
  });

  // Data & Modal state
  const [opportunities, setOpportunities] = useState<Opportunity[]>(fallbackOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

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

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      locationType: 'all',
      provinceCity: '',
      country: '',
      workFormat: 'all',
      visaSponsorshipOnly: false,
      closingSoonOnly: false,
      verifiedOnly: false,
    });
  };

  const bookmarkCount = useMemo(() => {
    return opportunities.filter(o => o.is_bookmarked).length;
  }, [opportunities]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        bookmarkCount={bookmarkCount}
        locationScope={filters.locationType}
        setLocationScope={(scope) => setFilters(prev => ({ ...prev, locationType: scope }))}
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
      ) : currentView === 'admin' ? (
        <AdminScraperView />
      ) : (
        /* Default Opportunities Catalog View */
        <main className="flex-1">
          <HeroSection
            searchQuery={filters.searchQuery}
            setSearchQuery={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
            selectedCategory={filters.category}
            setSelectedCategory={(cat) => setFilters(prev => ({ ...prev, category: cat }))}
            locationScope={filters.locationType}
            setLocationScope={(scope) => setFilters(prev => ({ ...prev, locationType: scope }))}
            totalCount={opportunities.length}
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
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2 text-xs text-gray-600 font-semibold">
                    <span>Showing <strong className="text-gray-900">{opportunities.length}</strong> listings</span>
                    {filters.locationType !== 'all' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px]">
                        {filters.locationType === 'local' ? 'Cambodia Only' : 'Overseas Only'}
                      </span>
                    )}
                    {filters.category !== 'all' && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] capitalize">
                        {filters.category}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={loadOpportunities}
                    className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
                    title="Refresh Opportunities"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
                  </button>
                </div>

                {/* Grid of Opportunity Cards */}
                {opportunities.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-3">
                    <Compass className="w-10 h-10 text-gray-300 mx-auto" />
                    <h3 className="text-base font-bold text-gray-700">No matching opportunities found</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Try broadening your search keywords or resetting specific filters in the sidebar.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© 2026 OpportunityHub (OppHub) • Year 5 IT Project Management</p>
          <p>Automated Scrapers strictly adhere to robots.txt & ethical crawling guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
