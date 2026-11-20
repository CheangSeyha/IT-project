'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole, LocationType, NotificationItem, Language } from '@/types';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Globe,
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  Bell,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'opportunities' | 'tracker' | 'curation';
  setCurrentView: (view: 'opportunities' | 'tracker' | 'curation') => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  bookmarkCount: number;
  locationScope: LocationType | 'all';
  setLocationScope: (scope: LocationType | 'all') => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onOpenAlertSettings: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  bookmarkCount,
  locationScope,
  setLocationScope,
  notifications,
  onMarkAllNotificationsRead,
  onOpenAlertSettings,
  language,
  setLanguage,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer shrink-0"
            onClick={() => setCurrentView('opportunities')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base text-slate-900 tracking-tight">OpportunityHub</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  KH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {language === 'km' ? 'ការងារ កម្មសិក្សា & អាហារូបករណ៍' : 'Cambodia & Overseas Opportunities'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCurrentView('opportunities')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                currentView === 'opportunities'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'km' ? 'ស្វែងរកឱកាស' : 'Explore Catalog'}</span>
            </button>

            <button
              onClick={() => setCurrentView('tracker')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 relative ${
                currentView === 'tracker'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-purple-600" />
              <span>{language === 'km' ? 'កម្មវិធីតាមដាន' : 'My Applications'}</span>
              {bookmarkCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold ml-1">
                  {bookmarkCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('curation')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                currentView === 'curation'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'km' ? 'ការណែនាំពីសាស្ត្រាចារ្យ' : 'Curated Lists'}</span>
            </button>
          </nav>

          {/* Right Tools & Admin Link */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Scope Filter Pill */}
            <div className="hidden xl:flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
              <button
                onClick={() => setLocationScope('all')}
                className={`px-2 py-1 rounded-md transition-all ${locationScope === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              >
                All
              </button>
              <button
                onClick={() => setLocationScope('local')}
                className={`px-2 py-1 rounded-md transition-all ${locationScope === 'local' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'}`}
              >
                🇰🇭 Local
              </button>
              <button
                onClick={() => setLocationScope('international')}
                className={`px-2 py-1 rounded-md transition-all ${locationScope === 'international' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'}`}
              >
                🌏 Overseas
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
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

            {/* Alert Preferences Trigger */}
            <button
              onClick={onOpenAlertSettings}
              className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition-colors hidden sm:block"
              title="Alert Preferences"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              {language === 'en' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}
            </button>

            {/* DIRECT LINK TO DEDICATED ADMIN PORTAL */}
            <Link
              href="/admin"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
