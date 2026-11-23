'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Language } from '@/types';
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
  Plus,
} from 'lucide-react';

interface RolePathwaysSectionProps {
  currentUser: User | null;
  language: Language;
  onOpenTeacherPostModal: () => void;
  onOpenStaffPostModal: () => void;
  onScrollToCatalog: () => void;
}

export const RolePathwaysSection: React.FC<RolePathwaysSectionProps> = ({
  currentUser,
  language,
  onOpenTeacherPostModal,
  onOpenStaffPostModal,
  onScrollToCatalog,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-800 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'km' ? 'ប្រព័ន្ធតួនាទី OpportunityHub' : 'OpportunityHub Role Pathways'}</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl text-slate-950 ${language === 'km' ? 'font-bold tracking-normal leading-snug' : 'font-black tracking-tight'}`}>
          {language === 'km' ? (
            <>
              ស្វែងរក ឬ បង្ហោះ <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">ឱកាសសិក្សា & ការងារ</span>
            </>
          ) : (
            <>
              Find Jobs or Post Work by <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Your Role</span>
            </>
          )}
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {language === 'km'
            ? 'សិស្សអាចបង្កើតគណនីដើម្បីជ្រើសរើសកាតការងារ និងដាក់ពាក្យស្នើសុំ។ សាស្ត្រាចារ្យ និងបុគ្គលិកមានផ្ទាំងគ្រប់គ្រង (Dashboard) ដើម្បីបង្កើតកាត និងបង្ហោះឱកាសថ្មីៗ។'
            : 'Students register to select cards and submit applications. Teachers and university staff have dedicated dashboards to create and manage listings.'}
        </p>
      </div>

      {/* 3 Pathway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: For Students */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-3xl -z-10" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 tracking-wider">
                {language === 'km' ? 'តួនាទីសិស្ស' : 'Student Role'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {language === 'km' ? 'ស្វែងរកការងារ & កិច្ចការសាលា' : 'Find Job & School Work'}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {language === 'km'
                ? 'ចុះឈ្មោះជាសិស្ស ស្វែងរកឱកាសដែលបានផ្ទៀងផ្ទាត់ គណនាពិន្ទុត្រូវគ្នាតាមជំនាញ និងជ្រើសរើសកាតណាមួយដើម្បីដាក់ពាក្យស្នើសុំភ្លាមៗ។'
                : 'Register as a student, browse curated verified listings, calculate your skill-match score, and select any card to submit your application directly.'}
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{language === 'km' ? 'ជ្រើសរើសកាតដើម្បីដាក់ពាក្យផ្ទាល់' : 'Select any card to apply directly'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{language === 'km' ? 'តាមដានដំណាក់កាលពាក្យស្នើសុំ' : 'Track application pipeline & offers'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{language === 'km' ? 'គណនាពិន្ទុត្រូវគ្នាតាមជំនាញ' : 'AI skill profile matching score'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100">
            {currentUser && currentUser.role === 'student' ? (
              <button
                onClick={onScrollToCatalog}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>{language === 'km' ? 'ជ្រើសរើសកាតការងារខាងក្រោម' : 'Browse & Select Cards Below'}</span>
              </button>
            ) : (
              <Link
                href="/login?mode=register&role=student"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition-all"
              >
                <span>{language === 'km' ? 'ចុះឈ្មោះជាសិស្សដើម្បីដាក់ពាក្យ' : 'Register as Student to Apply'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </motion.div>

        {/* Card 2: For Teachers & Professors */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-3xl -z-10" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 tracking-wider">
                {language === 'km' ? 'តួនាទីសាស្ត្រាចារ្យ' : 'Teacher Role'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              {language === 'km' ? 'ផ្ទាំងគ្រូបង្រៀន & បង្កើតកាត' : 'Teacher Dashboard & Post Cards'}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {language === 'km'
                ? 'បង្កើតកិច្ចការសាលា និងគម្រោងស្រាវជ្រាវសម្រាប់និស្សិត ចងក្រងបញ្ជីអាហារូបករណ៍ និងផ្សព្វផ្សាយសិក្ខាសាលាអប់រំ។'
                : 'Create academic work and project cards for your students, curate recommended scholarship bundles for cohorts, and broadcast seminars.'}
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{language === 'km' ? 'បង្កើត និងបង្ហោះកាតកិច្ចការសាលា' : 'Create & post school work cards'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{language === 'km' ? 'ចងក្រងកម្រងឱកាសសម្រាប់និស្សិត' : 'Curate cohort opportunity collections'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{language === 'km' ? 'ផ្សព្វផ្សាយសិក្ខាសាលា និងព្រឹត្តិការណ៍' : 'Broadcast academic events & seminars'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center space-x-2">
            <button
              onClick={onOpenTeacherPostModal}
              className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'បង្កើតកាត' : 'Create Card'}</span>
            </button>
            <Link
              href="/teacher"
              className="py-2.5 px-3.5 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-2xl border border-purple-200/80 transition-colors"
            >
              {language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard'}
            </Link>
          </div>
        </motion.div>

        {/* Card 3: For Staff & Career Officers */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-3xl -z-10" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                {language === 'km' ? 'តួនាទីបុគ្គលិក' : 'Staff Role'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {language === 'km' ? 'ផ្ទាំងបុគ្គលិក & បង្ហោះឱកាស' : 'Staff Dashboard & Postings'}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {language === 'km'
                ? 'បង្ហោះឱកាសការងារផ្លូវការរបស់ស្ថាប័ន គ្រប់គ្រងទំនាក់ទំនងនិយោជក និងត្រួតពិនិត្យទិន្នន័យនៃការដាក់ពាក្យរបស់និស្សិត។'
                : 'Post verified institutional career listings, manage university employer partnerships, and inspect live student application and search analytics.'}
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{language === 'km' ? 'បង្ហោះឱកាសដែលមានការបញ្ជាក់ផ្លូវការ' : 'Post verified institutional opportunities'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{language === 'km' ? 'គ្រប់គ្រងកាតការងារ និងកម្មសិក្សា' : 'Manage official job & internship cards'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{language === 'km' ? 'ផ្ទាំងវិភាគទិន្នន័យ និងពាក្យស្វែងរក' : 'Engagement & keyword analytics dashboard'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center space-x-2">
            <button
              onClick={onOpenStaffPostModal}
              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'បង្ហោះឱកាស' : 'Post Verified Card'}</span>
            </button>
            <Link
              href="/staff"
              className="py-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200/80 transition-colors"
            >
              {language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
