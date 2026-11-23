'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '@/types';
import {
  Compass,
  FileCheck2,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HowItWorksSectionProps {
  language?: Language;
  onExploreClick?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  language = 'en',
  onExploreClick,
}) => {
  const steps = [
    {
      num: '01',
      icon: Compass,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      titleEn: 'Target & Filter Accurately',
      titleKm: 'ស្វែងរក និងកំណត់តម្រងច្បាស់លាស់',
      descEn:
        'Narrow down 15+ verified vacancies by province city, foreign host country, degree level, or full funding coverage in seconds.',
      descKm:
        'ស្វែងរកឱកាសការងារ ឬអាហារូបករណ៍រាប់សិបកន្លែង ដោយជ្រើសរើសតាមរាជធានី-ខេត្ត ប្រទេសគោលដៅ កម្រិតសិក្សា ឬជំនួយឧបត្ថម្ភពេញលេញ។',
      highlightEn: 'Faceted Location & Category Filters',
      highlightKm: 'តម្រងទីតាំង និងប្រភេទការងារច្បាស់លាស់',
    },
    {
      num: '02',
      icon: FileCheck2,
      color: 'from-indigo-600 to-purple-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      titleEn: '1-Click Direct Application',
      titleKm: 'ដាក់ពាក្យស្នើសុំដោយចុចតែម្តង',
      descEn:
        'Submit a verified statement of interest with your student profile, or seamlessly jump to canonical ministry and embassy application portals.',
      descKm:
        'បញ្ជូនសារចំណាប់អារម្មណ៍ និងប្រវត្តិរូបសិស្សទៅកាន់ស្ថាប័ន ឬបើកមើលតំណភ្ជាប់ផ្លូវការរបស់ក្រសួង និងស្ថានទូតដោយផ្ទាល់។',
      highlightEn: 'Verified Canonical Links & Direct Apply',
      highlightKm: 'តំណភ្ជាប់ផ្លូវការ & ការដាក់ពាក្យផ្ទាល់',
    },
    {
      num: '03',
      icon: Trophy,
      color: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      titleEn: 'Track Pipeline & Land Offer',
      titleKm: 'តាមដានលទ្ធផល និងសម្រេចគោលដៅ',
      descEn:
        'Monitor your progression in the interactive Kanban tracker. Receive deadline countdown notices so you never miss an interview.',
      descKm:
        'តាមដានស្ថានភាពពាក្យស្នើសុំក្នុងផ្ទាំង Kanban និងទទួលបានការជូនដំណឹងមុនពេលផុតកំណត់ ដើម្បីត្រៀមខ្លួនសម្រាប់វគ្គសម្ភាសន៍។',
      highlightEn: 'Real-time Pipeline & Deadline Alerts',
      highlightKm: 'ការតាមដានពេលវេលាជាក់ស្ដែង & ការដាស់តឿន',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200/80 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {language === 'km' ? 'មាគ៌ាឆ្ពោះទៅកាន់ជោគជ័យ' : 'Simple 3-Step Student Roadmap'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'km'
              ? 'របៀបដែល OpportunityHub ជួយជំរុញអាជីព និងការសិក្សារបស់អ្នក'
              : 'How OpportunityHub Accelerates Your Academic & Career Growth'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'km'
              ? 'ដំណើរការងាយស្រួល ច្បាស់លាស់ និងគ្មានភាពស្មុគស្មាញ ផ្ដល់អត្ថប្រយោជន៍ដល់សិស្ស និងស្ថាប័នអប់រំគ្រប់កម្រិត។'
              : 'Designed to eliminate friction between searching for opportunities and landing verified positions.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 flex flex-col justify-between space-y-6 relative group"
              >
                {/* Step Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-200 group-hover:text-blue-500/30 transition-colors">
                      {step.num}
                    </span>
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    {language === 'km' ? step.titleKm : step.titleEn}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {language === 'km' ? step.descKm : step.descEn}
                  </p>
                </div>

                {/* Step Footer Badge */}
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 text-[11px] font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{language === 'km' ? step.highlightKm : step.highlightEn}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="text-center pt-2">
          <button
            onClick={onExploreClick}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95"
          >
            <span>{language === 'km' ? 'ស្វែងរកឱកាសទាំងអស់ឥឡូវនេះ' : 'Explore All Verified Opportunities'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
