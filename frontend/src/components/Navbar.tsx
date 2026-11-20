'use client';

import React, { useState } from 'react';
import { UserRole, LocationType, NotificationItem, Language } from '@/types';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Globe,
  User,
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  Database,
  Bell,
  Plus,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'opportunities' | 'tracker' | 'curation' | 'admin' | 'analytics';
  setCurrentView: (view: 'opportunities' | 'tracker' | 'curation' | 'admin' | 'analytics') => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  bookmarkCount: number;
  locationScope: LocationType | 'all';
  setLocationScope: (scope: LocationType | 'all') => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onOpenAlertSettings: () => void;
  onOpenStaffPost: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeRole,
  setActiveRole,
  bookmarkCount,
  locationScope,
  setLocationScope,
  notifications,
  onMarkAllNotificationsRead,
  onOpenAlertSettings,
  onOpenStaffPost,
  language,
  setLanguage,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer shrink-0"
            onClick={() => setCurrentView('opportunities')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-gray-900 tracking-tight">OpportunityHub</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Cambodia</span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                {language === 'km' ? 'ការងារ អាហារូបករណ៍ កម្មសិក្សា និងការអភិវឌ្ឍជំនាញ' : 'Jobs, Scholarships, Internships & Upskilling'}
              </p>
            </div>
          </div>

          {/* Center: Scope Toggle */}
          <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setLocationScope('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                locationScope === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'km' ? 'ទាំងអស់' : 'All Opportunities'}
            </button>
            <button
              onClick={() => setLocationScope('local')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1 ${
                locationScope === 'local'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🇰🇭 {language === 'km' ? 'ក្នុងស្រុក (កម្ពុជា)' : 'Local (Cambodia)'}</span>
            </button>
            <button
              onClick={() => setLocationScope('international')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1 ${
                locationScope === 'international'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🌏 {language === 'km' ? 'អន្តរជាតិ' : 'International'}</span>
            </button>
          </div>

          {/* Right Navigation & Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Links */}
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('opportunities')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors ${
                  currentView === 'opportunities'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Catalog</span>
              </button>

              <button
                onClick={() => setCurrentView('tracker')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors relative ${
                  currentView === 'tracker'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pipeline</span>
                {bookmarkCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('curation')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors ${
                  currentView === 'curation'
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Curated</span>
              </button>

              {/* Staff / Admin Analytics Tab */}
              {(activeRole === 'staff' || activeRole === 'admin') && (
                <button
                  onClick={() => setCurrentView('analytics')}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors ${
                    currentView === 'analytics'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Analytics</span>
                </button>
              )}

              {/* Admin Scrapers Tab */}
              {activeRole === 'admin' && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors ${
                    currentView === 'admin'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Spiders</span>
                </button>
              )}
            </nav>

            {/* Career Officer "Post Opportunity" Button */}
            {(activeRole === 'staff' || activeRole === 'admin') && (
              <button
                onClick={onOpenStaffPost}
                className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Verified</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors relative"
                title="Notifications & Match Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              <NotificationDropdown
                notifications={notifications}
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                onMarkAllAsRead={onMarkAllNotificationsRead}
                onSelectNotification={() => setCurrentView('opportunities')}
              />
            </div>

            {/* Alert Preferences Icon for Students */}
            {activeRole === 'student' && (
              <button
                onClick={onOpenAlertSettings}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Custom Match Alert Preferences"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* Bilingual Switcher (EN / ភាសាខ្មែរ) */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
              title="Switch Language / ប្តូរភាសា"
            >
              {language === 'en' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}
            </button>

            {/* Demo Role Switcher */}
            <div className="flex items-center pl-1 sm:pl-2 border-l border-gray-200">
              <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg text-xs">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as UserRole)}
                  className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer max-w-[100px] sm:max-w-none truncate"
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
