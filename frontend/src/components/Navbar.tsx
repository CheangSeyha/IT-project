'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserRole, LocationType, NotificationItem, Language } from '@/types';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Globe,
  MapPin,
  Languages,
  Compass,
  LayoutDashboard,
  GraduationCap,
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

  const navItems = [
    {
      id: 'opportunities' as const,
      label: language === 'km' ? 'ស្វែងរកឱកាស' : 'Explore Catalog',
      icon: Compass,
      color: 'text-blue-600',
    },
    {
      id: 'tracker' as const,
      label: language === 'km' ? 'កម្មវិធីតាមដាន' : 'My Applications',
      icon: LayoutDashboard,
      color: 'text-purple-600',
      badge: bookmarkCount > 0 ? bookmarkCount : null,
    },
    {
      id: 'curation' as const,
      label: language === 'km' ? 'ការណែនាំពីសាស្ត្រាចារ្យ' : 'Curated Lists',
      icon: GraduationCap,
      color: 'text-emerald-600',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer shrink-0 group select-none"
            onClick={() => setCurrentView('opportunities')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/35 transition-all duration-200">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  OpportunityHub
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                  KH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {language === 'km' ? 'ការងារ កម្មសិក្សា & អាហារូបករណ៍' : 'Cambodia & Overseas Pipeline'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs with Animated Layout Indicator */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-2xl text-xs font-semibold border border-slate-200/60 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                    isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-tab-indicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-200/80 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold ml-0.5 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Tools & Admin Link */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Scope Filter Pill */}
            <div className="hidden lg:flex items-center bg-slate-100/90 p-0.5 rounded-xl text-[11px] font-semibold text-slate-600 border border-slate-200/60">
              <button
                onClick={() => setLocationScope('all')}
                className={`relative px-2.5 py-1 rounded-lg transition-all ${
                  locationScope === 'all' ? 'text-slate-900' : 'hover:text-slate-900'
                }`}
              >
                {locationScope === 'all' && (
                  <motion.div
                    layoutId="scope-pill-indicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/80 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                All
              </button>
              <button
                onClick={() => setLocationScope('local')}
                className={`relative px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  locationScope === 'local' ? 'text-blue-700' : 'hover:text-slate-900'
                }`}
              >
                {locationScope === 'local' && (
                  <motion.div
                    layoutId="scope-pill-indicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/80 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <MapPin className="w-3 h-3 text-blue-600" />
                <span>Local</span>
              </button>
              <button
                onClick={() => setLocationScope('international')}
                className={`relative px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  locationScope === 'international' ? 'text-indigo-700' : 'hover:text-slate-900'
                }`}
              >
                {locationScope === 'international' && (
                  <motion.div
                    layoutId="scope-pill-indicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/80 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Globe className="w-3 h-3 text-indigo-600" />
                <span>Overseas</span>
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
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1 border border-slate-200/60"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'ខ្មែរ' : 'EN'}</span>
            </button>

            {/* Direct Link to Dedicated Admin Portal */}
            <Link
              href="/admin"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all group"
            >
              <span>Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
