'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { FilterState, WorkFormat, Language } from '@/types';
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
  language?: Language;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onReset,
  language = 'en',
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
    toast.info(language === 'km' ? 'តម្រងទាំងអស់ត្រូវបានកំណត់ឡើងវិញ' : 'All filters have been reset to default');
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
          <span>{language === 'km' ? 'តម្រងស្វែងរក' : 'Faceted Search'}</span>
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
          <span>{language === 'km' ? 'កំណត់ឡើងវិញ' : 'Reset'}</span>
        </button>
      </div>

      {/* Scope: Local vs Overseas */}
      <div>
        <div
          onClick={() => toggleSection('scope')}
          className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 cursor-pointer select-none"
        >
          <span>{language === 'km' ? 'វិសាលភាពទីតាំង' : 'Location Scope'}</span>
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
              {language === 'km' ? 'ទាំងអស់' : 'All'}
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
              <span>{language === 'km' ? 'ក្នុងស្រុក' : 'Local'}</span>
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
              <span>{language === 'km' ? 'ក្រៅប្រទេស' : 'Overseas'}</span>
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
              <span className="text-xs font-bold text-slate-900 block">
                {language === 'km' ? 'ត្រូវគ្នានឹងជំនាញខ្ពស់' : 'High Profile Match'}
              </span>
              <span className="text-[10px] text-slate-500">
                {language === 'km' ? '៩០%+ ត្រូវនឹងជំនាញរបស់អ្នក' : '90%+ match with your skills'}
              </span>
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
          {language === 'km' ? 'ជំនាញសិក្សា / វិស័យ' : 'Field of Study / Domain'}
        </label>
        <select
          value={filters.fieldOfStudy}
          onChange={(e) => setFilters(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
          className="w-full bg-slate-50/80 hover:bg-white border border-slate-200 rounded-2xl text-xs py-2 px-3 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">{language === 'km' ? 'គ្រប់ជំនាញទាំងអស់' : 'All Fields & Disciplines'}</option>
          <option value="Information Technology">{language === 'km' ? 'បច្ចេកវិទ្យាព័ត៌មាន & CS' : 'Information Technology & CS'}</option>
          <option value="Software Engineering">{language === 'km' ? 'វិស្វកម្មសូហ្វវែរ' : 'Software Engineering'}</option>
          <option value="Data Science">{language === 'km' ? 'វិទ្យាសាស្ត្រទិន្នន័យ & AI' : 'Data Science & AI'}</option>
          <option value="Cybersecurity">{language === 'km' ? 'សន្តិសុខសាយប័រ & បណ្តាញ' : 'Cybersecurity & Networking'}</option>
          <option value="Business">{language === 'km' ? 'ពាណិជ្ជកម្ម & ការគ្រប់គ្រង' : 'Business & Management'}</option>
          <option value="Communications">{language === 'km' ? 'ប្រព័ន្ធផ្សព្វផ្សាយ & ទំនាក់ទំនង' : 'Media & Communications'}</option>
        </select>
      </div>

      {/* Education Level */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {language === 'km' ? 'កម្រិតសិក្សាគោលដៅ' : 'Target Education Level'}
        </label>
        <select
          value={filters.educationLevel}
          onChange={(e) => setFilters(prev => ({ ...prev, educationLevel: e.target.value }))}
          className="w-full bg-slate-50/80 hover:bg-white border border-slate-200 rounded-2xl text-xs py-2 px-3 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">{language === 'km' ? 'គ្រប់កម្រិតសិក្សា' : 'Any Education Level'}</option>
          <option value="Undergraduate">{language === 'km' ? 'និស្សិតថ្នាក់បរិញ្ញាបត្រ' : 'Undergraduate Student'}</option>
          <option value="Bachelor's Degree">{language === 'km' ? 'បញ្ចប់ថ្នាក់បរិញ្ញាបត្រ' : "Bachelor's Degree Holder"}</option>
          <option value="Postgraduate">{language === 'km' ? 'ថ្នាក់ក្រោយឧត្តម / អនុបណ្ឌិត / បណ្ឌិត' : "Postgraduate / Master's / PhD"}</option>
          <option value="High School">{language === 'km' ? 'មធ្យមសិក្សា / វិជ្ជាជីវៈ' : 'High School / Vocational'}</option>
        </select>
      </div>

      {/* Local Cambodia Filters (If local or all) */}
      {(filters.locationType === 'local' || filters.locationType === 'all') && (
        <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'km' ? 'ខេត្ត / រាជធានីនៅកម្ពុជា' : 'Cambodia Province / City'}</span>
          </div>

          <select
            value={filters.provinceCity}
            onChange={(e) => setFilters(prev => ({ ...prev, provinceCity: e.target.value }))}
            className="w-full bg-white border border-blue-200/80 rounded-xl text-xs py-1.5 px-2.5 text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">{language === 'km' ? 'គ្រប់ខេត្ត-រាជធានី / ទូទាំងប្រទេស' : 'All Provinces / Nationwide'}</option>
            <option value="Phnom Penh">{language === 'km' ? 'រាជធានីភ្នំពេញ' : 'Phnom Penh'}</option>
            <option value="Siem Reap">{language === 'km' ? 'ខេត្តសៀមរាប' : 'Siem Reap'}</option>
            <option value="Battambang">{language === 'km' ? 'ខេត្តបាត់ដំបង' : 'Battambang'}</option>
            <option value="Sihanoukville">{language === 'km' ? 'ខេត្តព្រះសីហនុ' : 'Preah Sihanouk'}</option>
            <option value="Kampot">{language === 'km' ? 'ខេត្តកំពត' : 'Kampot'}</option>
          </select>
        </div>
      )}

      {/* International Filters (If international or all) */}
      {(filters.locationType === 'international' || filters.locationType === 'all') && (
        <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
            <Plane className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'km' ? 'ប្រទេសម្ចាស់ផ្ទះ & ទិដ្ឋាការ' : 'Overseas Host & Visa'}</span>
          </div>

          <select
            value={filters.country}
            onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
            className="w-full bg-white border border-indigo-200/80 rounded-xl text-xs py-1.5 px-2.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">{language === 'km' ? 'គ្រប់ប្រទេសទាំងអស់' : 'Any Country'}</option>
            <option value="United Kingdom">{language === 'km' ? 'ចក្រភពអង់គ្លេស (Chevening)' : 'United Kingdom (Chevening)'}</option>
            <option value="Japan">{language === 'km' ? 'ប្រទេសជប៉ុន (MEXT)' : 'Japan (MEXT)'}</option>
            <option value="Australia">{language === 'km' ? 'ប្រទេសអូស្ត្រាលី (Awards)' : 'Australia (Awards)'}</option>
            <option value="Singapore">{language === 'km' ? 'ប្រទេសសិង្ហបុរី (Grab / Tech)' : 'Singapore (Grab / Tech)'}</option>
            <option value="Remote">{language === 'km' ? 'ពីចម្ងាយ / តំបន់អន្តរជាតិ' : 'Remote / Global Regional'}</option>
          </select>

          <label className="flex items-center space-x-2 cursor-pointer pt-1 select-none">
            <input
              type="checkbox"
              checked={filters.visaSponsorshipOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, visaSponsorshipOnly: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
            <span className="text-xs text-slate-700 font-semibold">
              {language === 'km' ? 'រាប់បញ្ចូលការធានាទិដ្ឋាការ (Visa)' : 'Visa Sponsorship Included'}
            </span>
          </label>
        </div>
      )}

      {/* Work / Program Format */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {language === 'km' ? 'ទម្រង់បំពេញការងារ' : 'Delivery Format'}
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: language === 'km' ? 'គ្រប់ទម្រង់' : 'All Formats' },
            { id: 'on_site', label: language === 'km' ? 'នៅកន្លែងផ្ទាល់ (On-Site)' : 'On-Site / In-Person' },
            { id: 'hybrid', label: language === 'km' ? 'ចម្រុះ (Hybrid)' : 'Hybrid' },
            { id: 'remote', label: language === 'km' ? 'ពីចម្ងាយ ១០០% (Remote)' : '100% Remote' },
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
            <span className="font-semibold">
              {language === 'km' ? 'ជិតផុតកំណត់ (< ១៤ ថ្ងៃ)' : 'Closing Soon (< 14 days)'}
            </span>
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
            <span className="font-semibold">
              {language === 'km' ? 'ឱកាសបានផ្ទៀងផ្ទាត់ផ្លូវការ' : 'Verified Listings Only'}
            </span>
          </div>
        </label>
      </div>
    </aside>
  );
};
