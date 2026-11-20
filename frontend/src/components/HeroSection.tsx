'use client';

import React from 'react';
import { OpportunityCategory, LocationType } from '@/types';
import { Search, MapPin, Briefcase, GraduationCap, Award, Compass, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: OpportunityCategory | 'all';
  setSelectedCategory: (cat: OpportunityCategory | 'all') => void;
  locationScope: LocationType | 'all';
  setLocationScope: (scope: LocationType | 'all') => void;
  totalCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  locationScope,
  setLocationScope,
  totalCount,
}) => {
  return (
    <div className="bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white py-10 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-5xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-100/80 border border-blue-200/60 px-3.5 py-1 rounded-full text-xs font-semibold text-blue-800 mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Automated Opportunity Aggregator & Faceted Retrieval</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Find Your Next <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Career, Internship or Scholarship</span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Normalized from leading Cambodian career portals, university boards, and global institutions. Zero duplicates, structured filters, and personalized tracking.
        </p>

        {/* Search Bar Input */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-200/80 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center flex-1 w-full px-3 py-1.5">
              <Search className="w-5 h-5 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search job title, skills (Python, React), organization, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

            {/* Quick Scope Select inside Search */}
            <div className="flex items-center w-full sm:w-auto px-3 py-1.5 justify-between">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <select
                value={locationScope}
                onChange={(e) => setLocationScope(e.target.value as LocationType | 'all')}
                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer pr-2"
              >
                <option value="all">Everywhere</option>
                <option value="local">🇰🇭 Cambodia Only</option>
                <option value="international">🌏 International Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>All Categories ({totalCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('job')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              selectedCategory === 'job'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            <span>Jobs</span>
          </button>

          <button
            onClick={() => setSelectedCategory('internship')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              selectedCategory === 'internship'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
            <span>Internships</span>
          </button>

          <button
            onClick={() => setSelectedCategory('scholarship')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              selectedCategory === 'scholarship'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Scholarships</span>
          </button>

          <button
            onClick={() => setSelectedCategory('upskilling')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              selectedCategory === 'upskilling'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Upskilling & Bootcamps</span>
          </button>
        </div>
      </div>
    </div>
  );
};
