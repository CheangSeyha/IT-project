'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '@/types';
import {
  GraduationCap,
  Building2,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PartnerEcosystemSectionProps {
  language?: Language;
}

interface PartnerItem {
  name: string;
  category: 'university' | 'ministry' | 'international' | 'industry';
  badgeEn: string;
  badgeKm: string;
  descEn: string;
  descKm: string;
  highlight?: boolean;
}

const PARTNERS: PartnerItem[] = [
  {
    name: 'CADT',
    category: 'university',
    badgeEn: 'Digital Academy',
    badgeKm: 'បណ្ឌិត្យសភាឌីជីថល',
    descEn: 'Cambodia Academy of Digital Technology • AI & Software Lab',
    descKm: 'បណ្ឌិត្យសភាបច្ចេកវិទ្យាឌីជីថលកម្ពុជា • មន្ទីរពិសោធន៍ AI & Software',
    highlight: true,
  },
  {
    name: 'RUPP',
    category: 'university',
    badgeEn: 'Premier University',
    badgeKm: 'សាកលវិទ្យាល័យជាតិ',
    descEn: 'Royal University of Phnom Penh • FE & Science Bulletins',
    descKm: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ • មហាវិទ្យាល័យវិស្វកម្ម & វិទ្យាសាស្ត្រ',
  },
  {
    name: 'MoEYS / MPTC',
    category: 'ministry',
    badgeEn: 'Ministry Grant',
    badgeKm: 'អាហារូបករណ៍ក្រសួង',
    descEn: 'Digital Skills Development Fund & National Research Grants',
    descKm: 'មូលនិធិអភិវឌ្ឍន៍ជំនាញឌីជីថល និងជំនួយស្រាវជ្រាវថ្នាក់ជាតិ',
    highlight: true,
  },
  {
    name: 'Chevening UK',
    category: 'international',
    badgeEn: 'UK Embassy',
    badgeKm: 'ស្ថានទូតអង់គ្លេស',
    descEn: 'Fully Funded UK Master’s Degrees for Cambodian Leaders',
    descKm: 'អាហារូបករណ៍ថ្នាក់អនុបណ្ឌិតពេញលេញនៅចក្រភពអង់គ្លេស',
  },
  {
    name: 'MEXT Japan',
    category: 'international',
    badgeEn: 'Japan Embassy',
    badgeKm: 'ស្ថានទូតជប៉ុន',
    descEn: 'Japanese Government Scholarships for Research & Undergrad',
    descKm: 'អាហារូបករណ៍រដ្ឋាភិបាលជប៉ុនសម្រាប់ថ្នាក់ស្រាវជ្រាវ & បរិញ្ញាបត្រ',
  },
  {
    name: 'ITC',
    category: 'university',
    badgeEn: 'Tech Institute',
    badgeKm: 'វិទ្យាស្ថានបច្ចេកទេស',
    descEn: 'Institute of Technology of Cambodia • Engineering Internships',
    descKm: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (តិចណូ) • កម្មសិក្សាវិស្វកម្ម',
  },
  {
    name: 'CamHR & BongThom',
    category: 'industry',
    badgeEn: 'Direct Ingestion',
    badgeKm: 'ប្រភពការងារធំៗ',
    descEn: 'Verified local tech & corporate job crawlers synced every 6 hours',
    descKm: 'ប្រព័ន្ធស្រង់ទិន្នន័យការងារបច្ចេកវិទ្យាធ្វើបច្ចុប្បន្នភាពរៀងរាល់ ៦ ម៉ោង',
  },
  {
    name: 'Smart & Wing Bank',
    category: 'industry',
    badgeEn: 'FinTech Hubs',
    badgeKm: 'ក្រុមហ៊ុនឌីជីថល',
    descEn: 'Private sector technology traineeships & software internships',
    descKm: 'កម្មវិធីបណ្តុះបណ្តាលបច្ចេកវិទ្យា និងកម្មសិក្សាផ្នែក FinTech ឈានមុខ',
  },
];

export const PartnerEcosystemSection: React.FC<PartnerEcosystemSectionProps> = ({
  language = 'en',
}) => {
  return (
    <section className="py-12 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-y border-slate-200/70 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-blue-100/40 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {language === 'km'
                ? 'ប្រព័ន្ធអេកូឡូស៊ីដៃគូស្ថាប័នផ្លូវការ'
                : 'Verified Institutional Network & Sponsors'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'km'
              ? 'តភ្ជាប់និស្សិតកម្ពុជាជាមួយសាកលវិទ្យាល័យ ក្រសួង និងអាហារូបករណ៍ពិភពលោក'
              : 'Connecting Cambodian Talent with Premier Universities, Ministries & Embassies'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'km'
              ? 'ទិន្នន័យស្រង់ចេញដោយផ្ទាល់ និងមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវពីប្រភពផ្លូវការ គ្មានការផ្សាយពាណិជ្ជកម្មក្លែងបន្លំ'
              : 'Automated ingestion and official postings from authorized career offices, government grants, and foreign diplomatic missions.'}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {PARTNERS.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className={`p-4 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md ${
                partner.highlight
                  ? 'border-blue-200/90 ring-1 ring-blue-500/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Partner Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100/90 text-slate-800 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    {partner.category === 'university' && <GraduationCap className="w-4 h-4 text-purple-600" />}
                    {partner.category === 'ministry' && <Building2 className="w-4 h-4 text-emerald-600" />}
                    {partner.category === 'international' && <Globe2 className="w-4 h-4 text-blue-600" />}
                    {partner.category === 'industry' && <Sparkles className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 tracking-tight leading-tight">
                      {partner.name}
                    </h3>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    partner.category === 'international'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                      : partner.category === 'ministry'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                      : partner.category === 'university'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200/70'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                  }`}
                >
                  {language === 'km' ? partner.badgeKm : partner.badgeEn}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {language === 'km' ? partner.descKm : partner.descEn}
              </p>

              {/* Verified Indicator */}
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-1 text-[10px] text-emerald-600 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{language === 'km' ? 'ប្រភពផ្លូវការផ្ទៀងផ្ទាត់រួច' : 'Authenticated Source'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
