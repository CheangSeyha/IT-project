'use client';

import React from 'react';
import Link from 'next/link';
import { Language } from '@/types';
import {
  Globe,
  Languages,
  ShieldCheck,
  Bot,
  GraduationCap,
  Users,
  ArrowUp,
} from 'lucide-react';

interface FooterProps {
  language?: Language;
  onLanguageToggle?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language = 'en',
  onLanguageToggle,
}) => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
                <Globe className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">OpportunityHub</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/60">
                KH
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              {language === 'km'
                ? 'ប្រព័ន្ធស្វែងរក និងប្រមូលផ្ដុំទិន្នន័យស្វ័យប្រវត្តិនៃឱកាសការងារ កម្មសិក្សា និងអាហារូបករណ៍ពិភពលោក សម្រាប់យុវជនកម្ពុជា។'
                : 'Centralized opportunity indexing platform bridging Cambodian students with domestic tech vacancies, digital internships, and verified global fellowships.'}
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'km' ? 'ប្រព័ន្ធ Spiders៖ ដំណើរការល្អ ៩៩.៩%' : 'Spider Pipeline: 99.9% Operational'}</span>
            </div>
          </div>

          {/* Column 2: Opportunity Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'km' ? 'ប្រភេទឱកាស' : 'Opportunity Sectors'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/?category=job" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span>{language === 'km' ? 'ការងារបច្ចេកវិទ្យាក្នុងស្រុក' : 'Local Tech & Software Jobs'}</span>
                </Link>
              </li>
              <li>
                <Link href="/?category=internship" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span>{language === 'km' ? 'កម្មសិក្សាឌីជីថលសម្រាប់សិស្ស' : 'Undergraduate Internships'}</span>
                </Link>
              </li>
              <li>
                <Link href="/?category=scholarship" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span>{language === 'km' ? 'អាហារូបករណ៍ថ្នាក់បរិញ្ញាបត្រ & អនុបណ្ឌិត' : 'International Scholarships'}</span>
                </Link>
              </li>
              <li>
                <Link href="/?category=upskilling" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span>{language === 'km' ? 'វគ្គបណ្តុះបណ្តាល AI & Cloud' : 'Digital Upskilling Bootcamps'}</span>
                </Link>
              </li>
              <li>
                <Link href="/?category=school_work" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span>{language === 'km' ? 'កាតកិច្ចការសាលា & ជំនួយការស្រាវជ្រាវ' : 'School Work & Research Assistantships'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Role Ecosystem & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'km' ? 'ច្រកទ្វារស្ថាប័ន & តួនាទី' : 'Portals & Role Ecosystem'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/login?role=student" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'km' ? 'គណនីសិស្ស & កម្មវិធីតាមដាន' : 'Student Portal & Application Tracker'}</span>
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>{language === 'km' ? 'ផ្ទាំងគ្រប់គ្រងសាស្ត្រាចារ្យ' : 'Teacher Portal & Collections'}</span>
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'km' ? 'ផ្ទាំងមន្ត្រីការងារ & ស្ថិតិ' : 'Career Staff Portal & Analytics'}</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'km' ? 'ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ Admin' : 'Admin & Crawler Spider Console'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Ethical Policy & University Project */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'km' ? 'បទដ្ឋានក្រមសីលធម៌ & បច្ចេកទេស' : 'Engineering & Ethics'}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              {language === 'km'
                ? 'ប្រព័ន្ធស្រង់ទិន្នន័យគោរពតាមបទដ្ឋាន robots.txt យ៉ាងម៉ឺងម៉ាត់ មិនមានការប្រមូលទិន្នន័យឯកជន និងប្រើបច្ចេកវិទ្យា SimHash AI ដើម្បីលុបបំបាត់ការផ្សាយស្ទួន។'
                : 'Scrapers strictly follow robots.txt rate-limiting, exponential backoff, and 64-bit SimHash Hamming deduplication.'}
            </p>
            <div className="pt-1 text-[11px] text-slate-500 font-semibold">
              <p>Year 5 IT Project Management Capstone</p>
              <p className="text-slate-400">CADT • RUPP Academic Collaboration</p>
            </div>
          </div>
        </div>

        {/* Sub-footer Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>
            {language === 'km'
              ? '© ២០២៦ OpportunityHub (OppHub) • រក្សាសិទ្ធិគ្រប់យ៉ាង'
              : '© 2026 OpportunityHub (OppHub) • All rights reserved.'}
          </p>

          <div className="flex items-center space-x-4">
            {onLanguageToggle && (
              <button
                onClick={onLanguageToggle}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Languages className="w-3 h-3 text-blue-400" />
                <span>{language === 'en' ? 'ភាសាខ្មែរ' : 'English'}</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
