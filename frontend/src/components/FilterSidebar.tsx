'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { FilterState, WorkFormat } from '@/types';
import {
  Filter,
  RotateCcw,
  MapPin,
  Globe,
  Clock,
  Plane,
  ShieldCheck,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onReset,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetWithToast = () => {
    onReset();
    toast.info('All filters have been reset to default');
  };

  // Count active non-default filters
  const activeFilterCount = [
    filters.locationType !== 'all',
    Boolean(filters.fieldOfStudy),
    Boolean(filters.educationLevel),
    Boolean(filters.provinceCity),
    Boolean(filters.country),
    filters.workFormat !== 'all',
    filters.visaSponsorshipOnly,
    filters.closingSoonOnly,
    filters.verifiedOnly,
    filters.highMatchOnly,
  ].filter(Boolean).length;

  return (
    <aside className="w-full lg:w-72 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-6 shrink-0">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Faceted Search</span>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={handleResetWithToast}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center space-x-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Scope: Local vs Overseas */}
      <div>
        <div
          onClick={() => toggleSection('scope')}
          className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 cursor-pointer select-none"
        >
          <span>Location Scope</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${collapsedSections['scope'] ? '-rotate-90' : ''}`}
          />
        </div>

        {!collapsedSections['scope'] && (
          <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-2xl text-xs font-semibold border border-slate-200/60">
            <button
              onClick={() => setFilters(prev => ({ ...prev, locationType: 'all' }))}
              className={`py-1.5 rounded-xl text-center transition-all ${
                filters.locationType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, locationType: 'local' }))}
              className={`py-1.5 rounded-xl text-center transition-all inline-flex items-center justify-center space-x-1 ${
                filters.locationType === 'local'
                  ? 'bg-white text-blue-700 shadow-xs border border-blue-200/60 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Local</span>
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, locationType: 'international' }))}
              className={`py-1.5 rounded-xl text-center transition-all inline-flex items-center justify-center space-x-1 ${
                filters.locationType === 'international'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200/60 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3 h-3 text-indigo-600" />
              <span>Overseas</span>
            </button>
          </div>
        )}
      </div>

      {/* High Profile Match Quick Toggle Card */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/90 p-3.5 rounded-2xl border border-blue-200/70 shadow-xs hover:border-blue-300 transition-all">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">High Profile Match</span>
              <span className="text-[10px] text-slate-500">90%+ match with your skills</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.highMatchOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, highMatchOnly: e.target.checked }))}
            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 cursor-pointer"
          />
        </label>
      </div>

      {/* Field of Study Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Field of Study / Domain
        </label>
        <select
          value={filters.fieldOfStudy}
          onChange={(e) => setFilters(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
          className="w-full bg-slate-50/80 hover:bg-white border border-slate-200 rounded-2xl text-xs py-2 px-3 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">All Fields & Disciplines</option>
          <option value="Information Technology">Information Technology & CS</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Data Science">Data Science & AI</option>
          <option value="Cybersecurity">Cybersecurity & Networking</option>
          <option value="Business">Business & Management</option>
          <option value="Communications">Media & Communications</option>
        </select>
      </div>

      {/* Education Level */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Target Education Level
        </label>
        <select
          value={filters.educationLevel}
          onChange={(e) => setFilters(prev => ({ ...prev, educationLevel: e.target.value }))}
          className="w-full bg-slate-50/80 hover:bg-white border border-slate-200 rounded-2xl text-xs py-2 px-3 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">Any Education Level</option>
          <option value="Undergraduate">Undergraduate Student</option>
          <option value="Bachelor's Degree">Bachelor&apos;s Degree Holder</option>
          <option value="Postgraduate">Postgraduate / Master&apos;s / PhD</option>
          <option value="High School">High School / Vocational</option>
        </select>
      </div>

      {/* Local Cambodia Filters (If local or all) */}
      {(filters.locationType === 'local' || filters.locationType === 'all') && (
        <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Cambodia Province / City</span>
          </div>

          <select
            value={filters.provinceCity}
            onChange={(e) => setFilters(prev => ({ ...prev, provinceCity: e.target.value }))}
            className="w-full bg-white border border-blue-200/80 rounded-xl text-xs py-1.5 px-2.5 text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Provinces / Nationwide</option>
            <option value="Phnom Penh">Phnom Penh</option>
            <option value="Siem Reap">Siem Reap</option>
            <option value="Battambang">Battambang</option>
            <option value="Sihanoukville">Preah Sihanouk</option>
            <option value="Kampot">Kampot</option>
          </select>
        </div>
      )}

      {/* International Filters (If international or all) */}
      {(filters.locationType === 'international' || filters.locationType === 'all') && (
        <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
            <Plane className="w-3.5 h-3.5 text-indigo-600" />
            <span>Overseas Host & Visa</span>
          </div>

          <select
            value={filters.country}
            onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
            className="w-full bg-white border border-indigo-200/80 rounded-xl text-xs py-1.5 px-2.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Any Country</option>
            <option value="United Kingdom">United Kingdom (Chevening)</option>
            <option value="Japan">Japan (MEXT)</option>
            <option value="Australia">Australia (Awards)</option>
            <option value="Singapore">Singapore (Grab / Tech)</option>
            <option value="Remote">Remote / Global Regional</option>
          </select>

          <label className="flex items-center space-x-2 cursor-pointer pt-1 select-none">
            <input
              type="checkbox"
              checked={filters.visaSponsorshipOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, visaSponsorshipOnly: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
            <span className="text-xs text-slate-700 font-semibold">Visa Sponsorship Included</span>
          </label>
        </div>
      )}

      {/* Work / Program Format */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Delivery Format
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Formats' },
            { id: 'on_site', label: 'On-Site / In-Person' },
            { id: 'hybrid', label: 'Hybrid' },
            { id: 'remote', label: '100% Remote' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center space-x-2.5 text-xs p-1.5 rounded-xl cursor-pointer transition-colors ${
                filters.workFormat === item.id ? 'bg-blue-50/70 text-blue-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="workFormat"
                checked={filters.workFormat === item.id}
                onChange={() => setFilters(prev => ({ ...prev, workFormat: item.id as WorkFormat | 'all' }))}
                className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Special Quick Toggles */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        <label className="flex items-center space-x-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.closingSoonOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, closingSoonOnly: e.target.checked }))}
            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
          />
          <div className="flex items-center space-x-1.5 text-xs text-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">Closing Soon (&lt; 14 days)</span>
          </div>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
          />
          <div className="flex items-center space-x-1.5 text-xs text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">Verified Listings Only</span>
          </div>
        </label>
      </div>
    </aside>
  );
};
