'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/types';
import {
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface FaqSectionProps {
  language?: Language;
}

interface FaqItem {
  qEn: string;
  qKm: string;
  aEn: string;
  aKm: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    qEn: 'Is OpportunityHub completely free for Cambodian students and job seekers?',
    qKm: 'តើ OpportunityHub ឥតគិតថ្លៃទាំងស្រុងសម្រាប់សិស្ស និស្សិត និងអ្នកស្វែងរកការងារកម្ពុជាមែនទេ?',
    aEn: 'Yes, OpportunityHub is 100% free and open for all Cambodian students, graduates, and job seekers. There are no paywalls, hidden fees, or subscription charges to access listings or submit applications.',
    aKm: 'បាទ/ចាស! OpportunityHub គឺឥតគិតថ្លៃ ១០០% សម្រាប់សិស្ស និស្សិត និងអ្នកស្វែងរកការងារកម្ពុជាទាំងអស់។ មិនមានការបង់ប្រាក់ ឬការទាមទារកម្រៃសេវាកម្មណាមួយឡើយ។',
  },
  {
    qEn: 'How are foreign scholarships and local job postings verified?',
    qKm: 'តើអាហារូបករណ៍បរទេស និងការងារក្នុងស្រុកត្រូវបានផ្ទៀងផ្ទាត់ដោយរបៀបណា?',
    aEn: 'Every listing undergoes strict verification. Web crawlers ingest data directly from certified host portals (CamHR, BongThom, CADT, RUPP) and official foreign embassy bulletins (Chevening UK, MEXT Japan). University career offices also authenticate listings directly.',
    aKm: 'រាល់ការប្រកាសទាំងអស់ឆ្លងកាត់ការផ្ទៀងផ្ទាត់យ៉ាងម៉ឺងម៉ាត់។ ប្រព័ន្ធស្រង់ទិន្នន័យដោយផ្ទាល់ពីគេហទំព័រផ្លូវការ និងព្រឹត្តិបត្រស្ថានទូត ហើយមន្ត្រីសាកលវិទ្យាល័យក៏ពិនិត្យបញ្ជាក់មុននឹងបង្ហាញជូនសិស្ស។',
  },
  {
    qEn: 'How can university lecturers and faculty members share school work cards?',
    qKm: 'តើសាស្ត្រាចារ្យ និងលោកគ្រូអ្នកគ្រូអាចបង្កើតកាតកិច្ចការសាលាដោយរបៀបណា?',
    aEn: 'Lecturers can log in with their Teacher account to access the Teacher Portal. From there, they can publish School Work cards, create Curated Opportunity Collections for specific cohorts, and broadcast academic seminars.',
    aKm: 'លោកគ្រូអ្នកគ្រូអាចចូលគណនីជា Teacher ដើម្បីបើកផ្ទាំង Teacher Portal។ ពីទីនោះ អាចបង្កើតកាតកិច្ចការសាលា បង្កើតកញ្ចប់ឱកាសចែករំលែកដល់ថ្នាក់រៀន និងផ្សព្វផ្សាយសិក្ខាសាលាបានយ៉ាងងាយស្រួល។',
  },
  {
    qEn: 'How does the ethical web crawler protect host sites from overload?',
    qKm: 'តើប្រព័ន្ធស្រង់ទិន្នន័យការពារគេហទំព័រម្ចាស់កុំឱ្យលើសទម្ងន់ដោយរបៀបណា?',
    aEn: 'Our crawlers strictly follow ethical scraping standards: they respect robots.txt crawl delays, implement exponential backoff, run on scheduled intervals (every 6 hours for jobs, weekly for embassies), and avoid aggressive scraping.',
    aKm: 'ប្រព័ន្ធស្រង់ទិន្នន័យរបស់យើងគោរពតាមក្រមសីលធម៌ និងបទដ្ឋាន robots.txt យ៉ាងតឹងរ៉ឹង ដោយកំណត់ចន្លោះពេលច្បាស់លាស់ មិនធ្វើឱ្យប៉ះពាល់ដល់ដំណើរការរបស់គេហទំព័រដើមឡើយ។',
  },
  {
    qEn: 'Can I track deadlines and get notified before opportunities close?',
    qKm: 'តើខ្ញុំអាចតាមដានកាលបរិច្ឆេទផុតកំណត់ និងទទួលបានការដាស់តឿនបានទេ?',
    aEn: 'Yes! Listings approaching their deadline (within 7 days) display an urgent "Closing Soon" badge. You can track opportunities in your Application Tracker and configure instant, daily, or weekly alerts via email or telegram in Alert Settings.',
    aKm: 'ពិតជាអាចបាន! ឱកាសណាដែលជិតដល់ថ្ងៃផុតកំណត់ (ក្នុងរយៈពេល ៧ ថ្ងៃ) នឹងបង្ហាញផ្លាក "ជិតផុតកំណត់" ពណ៌ក្រហម។ អ្នកក៏អាចតាមដានក្នុងផ្ទាំង My Applications និងកំណត់ការជូនដំណឹងបានផងដែរ។',
  },
];

export const FaqSection: React.FC<FaqSectionProps> = ({ language = 'en' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'km' ? 'សំណួរដែលសួរញឹកញាប់' : 'Frequently Asked Questions'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'km'
              ? 'សំណួរ & ចម្លើយអំពី OpportunityHub'
              : 'Everything You Need to Know About OppHub'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'km'
              ? 'ស្វែងយល់បន្ថែមអំពីប្រភពទិន្នន័យ ការផ្ទៀងផ្ទាត់ និងរបៀបប្រើប្រាស់ប្រព័ន្ធឱ្យមានប្រសិទ្ធភាពខ្ពស់។'
              : 'Clear answers on scraping policies, verification workflows, and student privacy.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {language === 'km' ? item.qKm : item.qEn}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600 border-blue-300' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                        {language === 'km' ? item.aKm : item.aEn}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
