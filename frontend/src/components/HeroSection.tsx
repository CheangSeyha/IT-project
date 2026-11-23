'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpportunityCategory, LocationType, Language } from '@/types';
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Compass,
  Sparkles,
  TrendingUp,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  BookOpen,
} from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: OpportunityCategory | 'all';
  setSelectedCategory: (cat: OpportunityCategory | 'all') => void;
  locationScope: LocationType | 'all';
  setLocationScope: (scope: LocationType | 'all') => void;
  totalCount: number;
  categoryCounts?: Record<OpportunityCategory | 'all', number>;
  language: Language;
  onSearchSubmit?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  locationScope,
  setLocationScope,
  totalCount,
  categoryCounts,
  language,
  onSearchSubmit,
}) => {
  // Rotating animated headlines
  const dynamicRoles = [
    { en: 'Career Opportunities', km: 'ការងារបច្ចេកវិទ្យា', gradient: 'from-blue-600 via-indigo-600 to-violet-600' },
    { en: 'Tech Internships', km: 'កម្មសិក្សាឌីជីថល', gradient: 'from-purple-600 via-indigo-600 to-blue-600' },
    { en: 'Global Scholarships', km: 'អាហារូបករណ៍អន្តរជាតិ', gradient: 'from-amber-600 via-rose-600 to-indigo-600' },
    { en: 'AI & Cloud Bootcamps', km: 'វគ្គបណ្តុះបណ្តាល AI & Cloud', gradient: 'from-emerald-600 via-teal-600 to-blue-600' },
  ];

  const [roleIndex, setRoleIndex] = useState(0);

  // Rotating search placeholders
  const placeholderQueries = [
    language === 'km' ? "ស្វែងរក: 'Python, FastAPI, Next.js'..." : "Try: 'Python, FastAPI, Next.js'...",
    language === 'km' ? "ស្វែងរក: 'អាហារូបករណ៍ Chevening UK'..." : "Try: 'Chevening Master scholarship'...",
    language === 'km' ? "ស្វែងរក: 'កម្មសិក្សា Flutter Mobile'..." : "Try: 'Flutter mobile banking intern'...",
    language === 'km' ? "ស្វែងរក: 'CADT AI Bootcamp'..." : "Try: 'CADT AI Bootcamp MoEYS'...",
    language === 'km' ? "ស្វែងរក: 'រាជធានីភ្នំពេញ hybrid'..." : "Try: 'Phnom Penh remote or hybrid'...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const roleTimer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % dynamicRoles.length);
    }, 3200);

    const placeholderTimer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderQueries.length);
    }, 3800);

    return () => {
      clearInterval(roleTimer);
      clearInterval(placeholderTimer);
    };
  }, [dynamicRoles.length, placeholderQueries.length]);

  const popularKeywords = [
    'Python',
    'FastAPI',
    'Flutter',
    'IELTS',
    'Full Scholarship',
    'Phnom Penh',
    'CADT',
  ];

  const categories = [
    {
      id: 'all' as const,
      label: language === 'km' ? 'ទាំងអស់' : 'All Categories',
      icon: Compass,
      color: 'text-slate-600',
      count: categoryCounts?.all ?? totalCount,
    },
    {
      id: 'job' as const,
      label: language === 'km' ? 'ការងារ' : 'Jobs',
      icon: Briefcase,
      color: 'text-blue-600',
      count: categoryCounts?.job,
    },
    {
      id: 'internship' as const,
      label: language === 'km' ? 'កម្មសិក្សា' : 'Internships',
      icon: GraduationCap,
      color: 'text-purple-600',
      count: categoryCounts?.internship,
    },
    {
      id: 'scholarship' as const,
      label: language === 'km' ? 'អាហារូបករណ៍' : 'Scholarships',
      icon: Award,
      color: 'text-amber-600',
      count: categoryCounts?.scholarship,
    },
    {
      id: 'upskilling' as const,
      label: language === 'km' ? 'វគ្គបណ្តុះបណ្តាល' : 'Upskilling & Bootcamps',
      icon: Sparkles,
      color: 'text-emerald-600',
      count: categoryCounts?.upskilling,
    },
    {
      id: 'school_work' as const,
      label: language === 'km' ? 'កិច្ចការសាលា' : 'School Work & Research',
      icon: BookOpen,
      color: 'text-indigo-600',
      count: categoryCounts?.school_work,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-indigo-50/20 to-slate-50 pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70">
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle engineering grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f60a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f60a_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating Orb 1 (Blue/Cyan) */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 left-1/4 w-[550px] h-[350px] bg-gradient-to-tr from-blue-400/20 via-cyan-300/20 to-indigo-400/15 rounded-full blur-3xl opacity-75"
        />

        {/* Floating Orb 2 (Violet/Purple) */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 35, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-24 right-1/4 w-[500px] h-[320px] bg-gradient-to-tr from-indigo-400/20 via-violet-400/20 to-pink-400/15 rounded-full blur-3xl opacity-75"
        />

        {/* Floating Orb 3 (Emerald/Teal Accent) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 25, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-48 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-gradient-to-r from-emerald-300/15 via-teal-300/15 to-blue-300/15 rounded-full blur-3xl opacity-60"
        />
      </div>

      {/* 3D Floating Opportunity Teaser Card 1 (Left Side - Desktop) */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [-2, -0.5, -2],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        className="hidden xl:flex absolute left-6 2xl:left-14 top-24 w-72 bg-white/90 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_16px_36px_-8px_rgba(30,58,138,0.14)] z-10 flex-col space-y-2 cursor-pointer transition-shadow hover:shadow-blue-500/15"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              WB
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900 leading-tight">Wing Bank Plc</p>
              <p className="text-[9px] text-slate-500 font-medium">Phnom Penh • Hybrid</p>
            </div>
          </div>
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>96% Match</span>
          </span>
        </div>
        <p className="text-xs font-bold text-slate-800 line-clamp-1">
          Senior Full-Stack Developer
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
          <span className="font-semibold text-blue-700">$1,200 - $2,000 / mo</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">FastAPI</span>
        </div>
      </motion.div>

      {/* 3D Floating Opportunity Teaser Card 2 (Right Side - Desktop) */}
      <motion.div
        animate={{
          y: [0, 14, 0],
          rotate: [2, 0.5, 2],
        }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        className="hidden xl:flex absolute right-6 2xl:right-14 top-28 w-72 bg-white/90 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_16px_36px_-8px_rgba(99,102,241,0.14)] z-10 flex-col space-y-2 cursor-pointer transition-shadow hover:shadow-indigo-500/15"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              UK
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900 leading-tight">Foreign Office (UK)</p>
              <p className="text-[9px] text-slate-500 font-medium">London • Full Fellowship</p>
            </div>
          </div>
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            <span>92% Fit</span>
          </span>
        </div>
        <p className="text-xs font-bold text-slate-800 line-clamp-1">
          Chevening Master’s Scholarship 2027
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
          <span className="font-semibold text-emerald-700">100% Fully Funded</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">Visa Sponsored</span>
        </div>
      </motion.div>

      {/* Floating Micro Badge (Top Left) */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          x: [0, 4, 0],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="hidden lg:flex absolute left-12 2xl:left-24 bottom-12 items-center space-x-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-xs text-[11px] font-semibold text-slate-700 z-10"
      >
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <span>{language === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពរៀងរាល់ ៦ ម៉ោង' : 'BongThom & CamHR • Live 6h Sync'}</span>
      </motion.div>

      {/* Floating Micro Badge (Bottom Right) */}
      <motion.div
        animate={{
          y: [0, 8, 0],
          x: [0, -4, 0],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="hidden lg:flex absolute right-12 2xl:right-24 bottom-12 items-center space-x-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-xs text-[11px] font-semibold text-slate-700 z-10"
      >
        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
        <span>{language === 'km' ? 'អាហារូបករណ៍ និងវគ្គបណ្តុះបណ្តាល' : 'CADT AI Bootcamp • MoEYS Grant'}</span>
      </motion.div>

      <div className="max-w-4xl mx-auto text-center relative z-20">
        {/* Shimmering Live Status Pill Badge */}
        <div className="relative inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/80 text-xs font-medium text-slate-700 mb-6 shadow-xs hover:border-blue-300 transition-all cursor-default overflow-hidden group">
          {/* Shimmer light sweep bar */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-shimmer pointer-events-none" />

          {/* Live Pulsing Beacon */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-slate-900">
            {language === 'km' ? 'ប្រព័ន្ធប្រមូលឱកាសផ្ទាល់ ២០២៦' : 'Live Opportunity Pipeline'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-700 font-semibold text-[11px]">
            {language === 'km'
              ? 'ការងារ កម្មសិក្សា & អាហារូបករណ៍'
              : 'Cambodia & Global Fellowships'}
          </span>
        </div>

        {/* Dynamic Animated Headline with Word Rotator */}
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl text-slate-950 ${
            language === 'km'
              ? 'font-bold tracking-normal leading-[1.3] sm:leading-[1.25]'
              : 'font-black tracking-tight leading-[1.18] sm:leading-[1.12]'
          }`}
        >
          {language === 'km' ? 'ស្វែងរកឱកាស' : 'Find Your Next'}{' '}
          <span className="inline-block relative min-w-[260px] sm:min-w-[420px] text-left">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ y: 24, opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -24, opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`inline-block bg-gradient-to-r ${dynamicRoles[roleIndex].gradient} bg-clip-text text-transparent ${
                  language === 'km' ? 'font-bold tracking-normal' : ''
                }`}
              >
                {language === 'km' ? dynamicRoles[roleIndex].km : dynamicRoles[roleIndex].en}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className={`mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto ${language === 'km' ? 'leading-relaxed font-normal tracking-normal' : 'leading-relaxed font-normal'}`}>
          {language === 'km'
            ? 'ប្រមូលផ្តុំទិន្នន័យស្វ័យប្រវត្តពីគេហទំព័រការងារក្នុងស្រុក និងស្ថាប័នអន្តរជាតិ គ្មានទិន្នន័យស្ទួន និងងាយស្រួលដាក់ពាក្យស្នើសុំ។'
            : 'Automated crawler pipeline indexing verified postings from CamHR, BongThom, CADT, and global university boards with instant tracking and direct apply links.'}
        </p>

        {/* Elevated Command-Style Search Bar with Dynamic Placeholder */}
        <div className="mt-8 max-w-4xl mx-auto relative group">
          {/* Animated Ambient Shadow Halo */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/25 via-indigo-500/25 to-violet-500/25 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition duration-300 -z-10" />

          <div className="bg-white/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-[0_16px_40px_-12px_rgba(30,58,138,0.12),0_2px_8px_rgba(15,23,42,0.04)] border border-slate-200/90 hover:border-blue-400/80 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all flex flex-col sm:flex-row items-center gap-2">
            {/* Keyword Input Box */}
            <div className="flex items-center flex-1 w-full px-2.5 sm:px-3 py-1">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mr-2.5 shadow-2xs group-hover:bg-blue-100 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={placeholderQueries[placeholderIndex]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onSearchSubmit) {
                    onSearchSubmit();
                  }
                }}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0 mr-1"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Vertical Separator */}
            <div className="h-7 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Location Scope Quick Selector */}
            <div className="flex items-center w-full sm:w-auto px-2.5 py-1 justify-between sm:justify-start">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <select
                  value={locationScope}
                  onChange={(e) => setLocationScope(e.target.value as LocationType | 'all')}
                  className="bg-transparent text-xs font-bold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all">{language === 'km' ? 'គ្រប់ទីតាំងទាំងអស់' : 'All Regions'}</option>
                  <option value="local">{language === 'km' ? 'កម្ពុជា (ក្នុងស្រុក)' : 'Cambodia (Local)'}</option>
                  <option value="international">{language === 'km' ? 'ក្រៅប្រទេស (អន្តរជាតិ)' : 'International (Overseas)'}</option>
                </select>
              </div>
            </div>

            {/* Primary Search Button */}
            <button
              onClick={() => {
                if (onSearchSubmit) onSearchSubmit();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:shadow-blue-500/25 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 shrink-0"
            >
              <span>{language === 'km' ? 'ស្វែងរក' : 'Search'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Trending Tag Suggestions */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
            <div className="inline-flex items-center space-x-1 text-slate-500 font-semibold text-[11px] mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'km' ? 'ពាក្យពេញនិយម:' : 'Trending:'}</span>
            </div>
            {popularKeywords.map((kw, idx) => {
              const isSelected = searchQuery.toLowerCase().includes(kw.toLowerCase());
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isSelected) {
                      setSearchQuery('');
                    } else {
                      setSearchQuery(kw);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 active:scale-95 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs border border-blue-600'
                      : 'bg-white/85 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 shadow-2xs'
                  }`}
                >
                  #{kw}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Category Segmented Filter Tabs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex flex-wrap items-center justify-center p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl border border-slate-200/70 gap-1.5 shadow-xs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/25 border border-slate-900'
                      : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200/80 shadow-xs'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : cat.color}`} />
                    <span>{cat.label}</span>
                    {cat.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                        }`}
                      >
                        {cat.count}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Value Proposition Highlights / Trust Badges */}
        <div className="mt-10 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/60 backdrop-blur-xs border border-slate-200/60 text-left hover:bg-white/80 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'km' ? 'ប្រមូលស្វ័យប្រវត្ត' : 'Auto-Aggregated'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {language === 'km' ? 'ប្រភពការងារ & ស្ថាប័នផ្លូវការ' : 'CamHR, BongThom, CADT'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/60 backdrop-blur-xs border border-slate-200/60 text-left hover:bg-white/80 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'km' ? 'គ្មានទិន្នន័យស្ទួន' : 'Zero Duplicates'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {language === 'km' ? 'ត្រួតពិនិត្យភាពត្រឹមត្រូវខ្ពស់' : 'Strict anti-spam hashing'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/60 backdrop-blur-xs border border-slate-200/60 text-left hover:bg-white/80 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'km' ? 'ផ្គូផ្គងឆ្លាតវៃ' : 'Smart Match'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {language === 'km' ? 'តាមជំនាញ និងប្រវត្តិរូប' : 'Skills & profile fit score'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/60 backdrop-blur-xs border border-slate-200/60 text-left hover:bg-white/80 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'km' ? 'ក្នុង & ក្រៅប្រទេស' : 'Global Pipeline'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {language === 'km' ? 'កម្ពុជា អង់គ្លេស ជប៉ុន អូស្ត្រាលី' : 'Cambodia, UK, Japan, AU'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
