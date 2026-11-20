'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OpportunityCategory, LocationType, Language } from '@/types';
import { Search, MapPin, Briefcase, GraduationCap, Award, Compass, Sparkles, Tag, X } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: OpportunityCategory | 'all';
  setSelectedCategory: (cat: OpportunityCategory | 'all') => void;
  locationScope: LocationType | 'all';
  setLocationScope: (scope: LocationType | 'all') => void;
  totalCount: number;
  language: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  locationScope,
  setLocationScope,
  totalCount,
  language,
}) => {
  const popularKeywords = ['Python', 'FastAPI', 'Flutter', 'IELTS', 'Full Scholarship', 'Phnom Penh', 'CADT'];

  const categories = [
    { id: 'all' as const, label: language === 'km' ? 'ទាំងអស់' : 'All Categories', icon: Compass, color: 'text-slate-600', count: totalCount },
    { id: 'job' as const, label: language === 'km' ? 'ការងារ' : 'Jobs', icon: Briefcase, color: 'text-blue-600' },
    { id: 'internship' as const, label: language === 'km' ? 'កម្មសិក្សា' : 'Internships', icon: GraduationCap, color: 'text-purple-600' },
    { id: 'scholarship' as const, label: language === 'km' ? 'អាហារូបករណ៍' : 'Scholarships', icon: Award, color: 'text-amber-600' },
    { id: 'upskilling' as const, label: language === 'km' ? 'វគ្គបណ្តុះបណ្តាល' : 'Upskilling & Bootcamps', icon: Sparkles, color: 'text-emerald-600' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70">
      {/* Background Decorative Mesh Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-800 mb-5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse shrink-0" />
          <span>
            {language === 'km'
              ? 'វេទិកាប្រមូលផ្តុំទិន្នន័យស្វ័យប្រវត្ត & ស្វែងរកតាមលក្ខខណ្ឌច្រើន'
              : 'Automated Opportunity Aggregator & Faceted Retrieval Engine'}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none"
        >
          {language === 'km' ? (
            <>ស្វែងរកឱកាស <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">ការងារ កម្មសិក្សា និងអាហារូបករណ៍</span></>
          ) : (
            <>Find Your Next <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Career, Internship or Scholarship</span></>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          {language === 'km'
            ? 'ប្រមូលទិន្នន័យដោយផ្ទាល់ពីគេហទំព័រការងារក្នុងស្រុក និងស្ថាប័នអន្តរជាតិ។ គ្មានទិន្នន័យស្ទួន និងមានប្រព័ន្ធតាមដានផ្ទាល់ខ្លួន។'
            : 'Aggregated, normalized, and deduplicated from leading Cambodian portals and global university boards with instant tracking.'}
        </motion.p>

        {/* Search Bar Input */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 max-w-3xl mx-auto"
        >
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-lg shadow-blue-900/5 border border-slate-200/90 hover:border-blue-400/80 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center flex-1 w-full px-3 py-1.5">
              <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder={language === 'km' ? "ស្វែងរកចំណងជើង ជំនាញ (Python, React) ឬស្ថាប័ន..." : "Search job title, skills (Python, React), organization, or keyword..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0 mr-1"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

            {/* Quick Scope Select inside Search */}
            <div className="flex items-center w-full sm:w-auto px-3 py-1.5 justify-between">
              <MapPin className="w-4 h-4 text-blue-500 mr-2 shrink-0" />
              <select
                value={locationScope}
                onChange={(e) => setLocationScope(e.target.value as LocationType | 'all')}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer pr-2"
              >
                <option value="all">{language === 'km' ? 'គ្រប់ទីកន្លែង' : 'All Regions'}</option>
                <option value="local">{language === 'km' ? 'កម្ពុជា (ក្នុងស្រុក)' : 'Cambodia (Local)'}</option>
                <option value="international">{language === 'km' ? 'អន្តរជាតិ (ក្រៅប្រទេស)' : 'International (Overseas)'}</option>
              </select>
            </div>
          </div>

          {/* Popular Tag Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
            <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <span className="font-medium mr-1">{language === 'km' ? 'ពាក្យស្វែងរកញឹកញាប់:' : 'Popular:'}</span>
            {popularKeywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(kw)}
                className="px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all font-medium text-[11px] shadow-xs active:scale-95"
              >
                #{kw}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter Pills with Animated Pill Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="category-active-tab-pill"
                    className="absolute inset-0 bg-slate-900 rounded-2xl -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : cat.color}`} />
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
