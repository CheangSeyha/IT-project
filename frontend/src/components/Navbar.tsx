'use client';

import React from 'react';
import { UserRole, LocationType } from '@/types';
import { Globe, User, Briefcase, GraduationCap, LayoutDashboard, Database } from 'lucide-react';

interface NavbarProps {
  currentView: 'opportunities' | 'tracker' | 'curation' | 'admin';
  setCurrentView: (view: 'opportunities' | 'tracker' | 'curation' | 'admin') => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  bookmarkCount: number;
  locationScope: LocationType | 'all';
  setLocationScope: (scope: LocationType | 'all') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeRole,
  setActiveRole,
  bookmarkCount,
  locationScope,
  setLocationScope,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('opportunities')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-gray-900 tracking-tight">OpportunityHub</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Cambodia</span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">Jobs, Scholarships, Internships & Upskilling</p>
            </div>
          </div>

          {/* Center: Scope Toggle */}
          <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setLocationScope('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                locationScope === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Opportunities
            </button>
            <button
              onClick={() => setLocationScope('local')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1 ${
                locationScope === 'local'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🇰🇭 Local (Cambodia)</span>
            </button>
            <button
              onClick={() => setLocationScope('international')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1 ${
                locationScope === 'international'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🌏 International</span>
            </button>
          </div>

          {/* Right Navigation & Roles */}
          <div className="flex items-center space-x-3">
            {/* View Tabs */}
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('opportunities')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentView === 'opportunities'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Browse</span>
              </button>

              <button
                onClick={() => setCurrentView('tracker')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors relative ${
                  currentView === 'tracker'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Application Tracker Pipeline"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Tracker</span>
                {bookmarkCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('curation')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentView === 'curation'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Teacher Curated Collections"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Curated</span>
              </button>

              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentView === 'admin'
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Crawler Engine & Scraper Health"
              >
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">Scrapers</span>
              </button>
            </nav>

            {/* Role Demo Switcher */}
            <div className="flex items-center pl-2 border-l border-gray-200">
              <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg text-xs">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-500 hidden md:inline">Role:</span>
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as UserRole)}
                  className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
                >
                  <option value="student">Student (Sokha Chan)</option>
                  <option value="teacher">Teacher (Prof. Kim)</option>
                  <option value="staff">Staff (Career Officer)</option>
                  <option value="admin">Admin (System Admin)</option>
                  <option value="public">Public (Visitor)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
