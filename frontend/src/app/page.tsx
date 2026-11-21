'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Opportunity, ApplicationStatus, UserRole, FilterState, Language } from '@/types';
import { fetchOpportunities, fallbackOpportunities } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FilterSidebar } from '@/components/FilterSidebar';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityModal } from '@/components/OpportunityModal';
import { ApplicationTrackerView } from '@/components/ApplicationTrackerView';
import { TeacherCurationView } from '@/components/TeacherCurationView';
import { Compass, RefreshCw, X } from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'opportunities' | 'tracker' | 'curation'>('opportunities');
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(false);

  // Modals state
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
      all: fallbackOpportunities.length,
      job: fallbackOpportunities.filter(o => o.category === 'job').length,
      internship: fallbackOpportunities.filter(o => o.category === 'internship').length,
      scholarship: fallbackOpportunities.filter(o => o.category === 'scholarship').length,
      upskilling: fallbackOpportunities.filter(o => o.category === 'upskilling').length,
    };
  }, []);

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
          /* Default Opportunities Explore Catalog View */
          <main key="opportunities" className="flex-1">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                          <span>{filters.category}</span>
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
      </AnimatePresence>

      {/* Details & Tracker Modal */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onToggleBookmark={handleToggleBookmark}
        onUpdateStatus={handleUpdateStatus}
        currentStatus={selectedOpportunity ? trackers[selectedOpportunity.id] : 'saved'}
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
