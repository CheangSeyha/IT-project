'use client';

import React from 'react';
import { FilterState, WorkFormat } from '@/types';
import { Filter, RotateCcw, MapPin, Clock, Plane, ShieldCheck, Sparkles } from 'lucide-react';

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
  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-6 shrink-0">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Faceted Search Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-blue-600 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Scope: Local vs Overseas */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Location Scope
        </label>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilters(prev => ({ ...prev, locationType: 'all' }))}
            className={`py-1.5 rounded-lg text-center transition-all ${
              filters.locationType === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, locationType: 'local' }))}
            className={`py-1.5 rounded-lg text-center transition-all ${
              filters.locationType === 'local'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🇰🇭 Local
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, locationType: 'international' }))}
            className={`py-1.5 rounded-lg text-center transition-all ${
              filters.locationType === 'international'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🌏 Overseas
          </button>
        </div>
      </div>

      {/* Profile Match Score Filter */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-xs font-bold text-gray-900 block">High Profile Match</span>
              <span className="text-[10px] text-gray-500">90%+ match to your skills</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.highMatchOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, highMatchOnly: e.target.checked }))}
            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
        </label>
      </div>

      {/* Field of Study Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Field of Study / Industry
        </label>
        <select
          value={filters.fieldOfStudy}
          onChange={(e) => setFilters(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
          className="w-full bg-white border border-gray-200 rounded-xl text-xs py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
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
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Target Education Level
        </label>
        <select
          value={filters.educationLevel}
          onChange={(e) => setFilters(prev => ({ ...prev, educationLevel: e.target.value }))}
          className="w-full bg-white border border-gray-200 rounded-xl text-xs py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
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
        <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/60 space-y-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Cambodia Province / City</span>
          </div>

          <select
            value={filters.provinceCity}
            onChange={(e) => setFilters(prev => ({ ...prev, provinceCity: e.target.value }))}
            className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-2.5 text-gray-800 focus:outline-none focus:border-blue-500"
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
        <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/60 space-y-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
            <Plane className="w-3.5 h-3.5 text-indigo-600" />
            <span>Host Destination & Visa</span>
          </div>

          <select
            value={filters.country}
            onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
            className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-2.5 text-gray-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Any Country</option>
            <option value="United Kingdom">United Kingdom (Chevening)</option>
            <option value="Japan">Japan (MEXT)</option>
            <option value="Australia">Australia (Awards)</option>
            <option value="Singapore">Singapore (Grab / Tech)</option>
            <option value="Remote">Remote / Global Regional</option>
          </select>

          <label className="flex items-center space-x-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={filters.visaSponsorshipOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, visaSponsorshipOnly: e.target.checked }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
            <span className="text-xs text-gray-700 font-medium">Visa Sponsorship Included</span>
          </label>
        </div>
      )}

      {/* Work / Program Format */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Delivery Format
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Formats' },
            { id: 'on_site', label: 'On-Site / In-Person' },
            { id: 'hybrid', label: 'Hybrid' },
            { id: 'remote', label: '100% Remote' },
          ].map((item) => (
            <label key={item.id} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
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
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.closingSoonOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, closingSoonOnly: e.target.checked }))}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
          />
          <div className="flex items-center space-x-1 text-xs text-gray-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">Closing Soon (&lt; 14 days)</span>
          </div>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
          />
          <div className="flex items-center space-x-1 text-xs text-gray-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">Verified Listings Only</span>
          </div>
        </label>
      </div>
    </aside>
  );
};
