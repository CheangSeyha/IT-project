'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '@/types';
import {
  Bot,
  Layers,
  ShieldCheck,
  CheckCircle,
  Kanban,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';

interface PlatformFeaturesSectionProps {
  language?: Language;
}

export const PlatformFeaturesSection: React.FC<PlatformFeaturesSectionProps> = ({
  language = 'en',
}) => {
  const features = [
    {
      icon: Bot,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200/80',
      titleEn: 'Automated Multi-Source Web Spiders',
      titleKm: 'ប្រព័ន្ធស្រង់ទិន្នន័យស្វ័យប្រវត្តិតាមគេហទំព័រធំៗ',
      descEn:
        'Ethical Python crawler pipeline indexing verified postings from CamHR, BongThom, CADT, RUPP, and global university boards with strict robots.txt rate-limiting.',
      descKm:
        'ម៉ាស៊ីនស្រង់ទិន្នន័យស្វ័យប្រវត្តិគោរពតាមបទដ្ឋាន robots.txt យ៉ាងម៉ឺងម៉ាត់ ដោយធ្វើសមកាលកម្មរៀងរាល់ ៦ ម៉ោងម្តងពីប្រភពការងារ និងសាកលវិទ្យាល័យធំៗ។',
      metricEn: 'Every 6h live sync',
      metricKm: 'ធ្វើបច្ចុប្បន្នភាពរាល់ ៦ ម៉ោង',
    },
    {
      icon: Layers,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200/80',
      titleEn: 'SimHash Anti-Duplicate Deduplication',
      titleKm: 'បច្ចេកវិទ្យាកម្ចាត់ទិន្នន័យស្ទួន SimHash AI',
      descEn:
        'Intelligent 64-bit Hamming distance algorithm fingerprints cross-posted vacancies across disparate job portals to eliminate duplicate clutter and save search time.',
      descKm:
        'ក្បួនដោះស្រាយឆ្លាតវៃពិនិត្យស្នាមម្រាមដៃអត្ថបទ ដើម្បីកម្ចាត់ការងារស្ទួនដែលបានបង្ហោះលើគេហទំព័រច្រើនផ្សេងគ្នា ធានាថាទិន្នន័យតែងតែថ្មី និងច្បាស់លាស់។',
      metricEn: '0% duplicate guarantee',
      metricKm: 'គ្មានទិន្នន័យស្ទួនរំខាន',
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/80',
      titleEn: 'Direct Institutional Verification',
      titleKm: 'ការផ្ទៀងផ្ទាត់ផ្លូវការពីសាកលវិទ្យាល័យ & ដៃគូ',
      descEn:
        'Direct publishing access for university professors and career center officers. Verified listings feature certified institutional badges to protect students.',
      descKm:
        'ផ្ដល់សិទ្ធិដល់សាស្ត្រាចារ្យ និងមន្ត្រីមជ្ឈមណ្ឌលការងារសាកលវិទ្យាល័យដើម្បីផ្សាយផ្ទាល់ ភ្ជាប់មកជាមួយផ្លាកសញ្ញាផ្ទៀងផ្ទាត់ផ្លូវការការពារសុវត្ថិភាពសិស្ស។',
      metricEn: 'Authenticated sponsors',
      metricKm: 'ប្រភពទទួលស្គាល់ផ្លូវការ',
    },
    {
      icon: Kanban,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200/80',
      titleEn: 'Milestone Application Tracker View',
      titleKm: 'ផ្ទាំងតាមដានពាក្យស្នើសុំជាដំណាក់កាល Kanban',
      descEn:
        'Move opportunities seamlessly across pipeline columns: Saved, Preparing, Applied, Interviewing, and Offered with deadline countdown alerts.',
      descKm:
        'គ្រប់គ្រងដំណាក់កាលពាក្យស្នើសុំយ៉ាងងាយស្រួល ពីការរក្សាទុក រៀបចំឯកសារ បានដាក់ពាក្យ សម្ភាសន៍ រហូតដល់ទទួលបានឱកាសជោគជ័យ។',
      metricEn: 'End-to-end pipeline',
      metricKm: 'តាមដានគ្រប់ជំហាន',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {language === 'km' ? 'គុណសម្បត្តិបច្ចេកវិទ្យា & ភាពជឿជាក់' : 'Enterprise Architecture & Reliability'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'km'
              ? 'ហេតុអ្វី OpportunityHub ជាជម្រើសឈានមុខរបស់និស្សិត & សាកលវិទ្យាល័យ?'
              : 'Why Leading Cambodian Universities & Students Trust OpportunityHub'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'km'
              ? 'រចនាឡើងជាមួយស្ថាបត្យកម្ម Next.js + FastAPI ល្បឿនលឿន ស្រង់ទិន្នន័យជាក់ស្ដែង និងធានាសុវត្ថិភាពព័ត៌មានខ្ពស់បំផុត។'
              : 'Engineered for speed, ethical compliance, and high data fidelity to bridge higher education and the digital economy.'}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className={`p-6 rounded-3xl bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-xl hover:shadow-slate-200/50 group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl ${feat.bgColor} flex items-center justify-center ${feat.color} shadow-xs border ${feat.borderColor}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-2xs">
                      {language === 'km' ? feat.metricKm : feat.metricEn}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                    {language === 'km' ? feat.titleKm : feat.titleEn}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {language === 'km' ? feat.descKm : feat.descEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center space-x-1 text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>{language === 'km' ? 'ស្វែងយល់លម្អិត' : 'Built-in Feature'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
