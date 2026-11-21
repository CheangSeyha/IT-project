'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserRole, LocationType, Language, User } from '@/types';
import { getStoredUser, logoutUser } from '@/services/api';
import {
  Globe,
  Languages,
  Compass,
  LayoutDashboard,
  GraduationCap,
  ArrowRight,
  LogIn,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentView?: 'opportunities' | 'tracker' | 'curation';
  setCurrentView?: (view: 'opportunities' | 'tracker' | 'curation') => void;
  activeRole?: UserRole;
  setActiveRole?: (role: UserRole) => void;
  bookmarkCount?: number;
  locationScope?: LocationType | 'all';
  setLocationScope?: (scope: LocationType | 'all') => void;
  language?: Language;
  setLanguage?: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'opportunities',
  setCurrentView,
  bookmarkCount = 0,
  language = 'en',
  setLanguage,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const navItems = [
    {
      id: 'opportunities' as const,
      label: language === 'km' ? 'ស្វែងរកឱកាស' : 'Explore Catalog',
      icon: Compass,
      color: 'text-blue-600',
      href: '/',
    },
    {
      id: 'tracker' as const,
      label: language === 'km' ? 'កម្មវិធីតាមដាន' : 'My Applications',
      icon: LayoutDashboard,
      color: 'text-purple-600',
      badge: bookmarkCount > 0 ? bookmarkCount : null,
      href: '/',
    },
    {
      id: 'curation' as const,
      label: language === 'km' ? 'ការណែនាំពីសាស្ត្រាចារ្យ' : 'Curated Lists',
      icon: GraduationCap,
      color: 'text-emerald-600',
      href: '/',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 cursor-pointer shrink-0 group select-none"
            onClick={() => setCurrentView && setCurrentView('opportunities')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/30 transition-all duration-200">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
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
          </Link>

          {/* Centered Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-2xl text-xs font-semibold border border-slate-200/60 shadow-2xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              if (setCurrentView) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`relative px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                      isActive ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
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
              } else {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="relative px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 text-slate-600 hover:text-slate-900"
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              }
            })}
          </nav>

          {/* Right Tools & Actions (Clean, minimal, high-end) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage && setLanguage(language === 'en' ? 'km' : 'en')}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1.5 border border-slate-200/60"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'ខ្មែរ' : 'EN'}</span>
            </button>

            {/* Clean Divider */}
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block mx-0.5" />

            {/* Sign In / User Profile */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-100/90 pl-2.5 pr-1.5 py-1 rounded-xl border border-slate-200/70 text-xs">
                <Link
                  href="/profile"
                  className="flex items-center space-x-1.5 hover:opacity-80 transition-opacity"
                  title="View Skill Profile & Alerts"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                    {currentUser.full_name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold uppercase">
                    {currentUser.role}
                  </span>
                </Link>

                {currentUser.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors ml-0.5"
                    title="Open Admin Portal"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {currentUser.role === 'staff' && (
                  <Link
                    href="/staff"
                    className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors ml-0.5"
                    title="Open Career Officer Portal"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {currentUser.role === 'teacher' && (
                  <Link
                    href="/teacher"
                    className="p-1 text-slate-500 hover:text-purple-600 hover:bg-white rounded-lg transition-colors ml-0.5"
                    title="Open Teacher Portal"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {currentUser.role === 'student' && (
                  <Link
                    href="/profile"
                    className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors ml-0.5"
                    title="Skill Profile & Alerts"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Enhanced Modern Fancy Sign In Button */
              <div className="relative group">
                {/* Ambient glowing border halo */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl blur-xs opacity-50 group-hover:opacity-90 transition duration-300 -z-10" />

                <Link
                  href="/login"
                  className="relative flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:shadow-blue-500/25 active:scale-95 transition-all duration-200"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-100 group-hover:scale-110 transition-transform" />
                  <span>{language === 'km' ? 'ចូលគណនី' : 'Sign In'}</span>
                  <ArrowRight className="w-3 h-3 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
