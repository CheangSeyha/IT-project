'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Language, User } from '@/types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Users,
  Compass,
} from 'lucide-react';

interface CtaSectionProps {
  language?: Language;
  currentUser?: User | null;
  onExploreClick?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  language = 'en',
  currentUser,
  onExploreClick,
}) => {
  return (
    <section className="py-16 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl"
        >
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            {/* Live Micro Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {language === 'km'
                  ? 'ប្រព័ន្ធស្រង់ទិន្នន័យកំពុងដំណើរការ ២៤/៧'
                  : 'Automated Crawlers Actively Indexing 24/7'}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              {language === 'km'
                ? 'ត្រៀមខ្លួនរួចរាល់ដើម្បីបើកទំព័រថ្មីនៃអាជីព និងការសិក្សារបស់អ្នកហើយឬនៅ?'
                : 'Ready to Accelerate Your Academic & Digital Career Journey?'}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              {language === 'km'
                ? 'ចូលរួមជាមួយនិស្សិត សាស្ត្រាចារ្យ និងស្ថាប័នឈានមុខនៅកម្ពុជា ដើម្បីស្វែងរកការងារបច្ចេកវិទ្យា កម្មសិក្សាឌីជីថល និងអាហារូបករណ៍អន្តរជាតិឥតគិតថ្លៃ។'
                : 'Join Cambodian students, professors, and career officers using OppHub for verified tech jobs, internships, and fully funded global fellowships.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              {currentUser ? (
                <button
                  onClick={onExploreClick}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>
                    {language === 'km' ? 'បន្តស្វែងរកក្នុងកាតាឡុក' : 'Continue Browsing Catalog'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <Link
                    href="/login?mode=register&role=student"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 active:scale-95"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{language === 'km' ? 'ចុះឈ្មោះគណនីសិស្សឥតគិតថ្លៃ' : 'Create Free Student Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold transition-all flex items-center justify-center space-x-2 backdrop-blur-sm"
                  >
                    <Users className="w-4 h-4 text-slate-300" />
                    <span>{language === 'km' ? 'ចូលគណនីសាស្ត្រាចារ្យ / បុគ្គលិក' : 'Teacher & Staff Portals'}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Bullet Line */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'km' ? 'ឥតគិតថ្លៃ ១០០% សម្រាប់សិស្ស' : '100% Free for Students'}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'km' ? 'គោរពក្រមសីលធម៌ robots.txt' : 'Strict robots.txt Ethics'}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់ស្ថាប័នពិតប្រាកដ' : 'Verified Institutional Posts'}</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
