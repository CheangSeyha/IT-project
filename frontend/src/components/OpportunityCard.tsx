'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Opportunity, Language } from '@/types';
import {
  Calendar,
  DollarSign,
  Bookmark,
  ShieldCheck,
  Sparkles,
  Share2,
  Check,
  MapPin,
  Globe,
  ArrowUpRight,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opp: Opportunity) => void;
  onToggleBookmark: (id: number) => void;
  onTrack?: (opp: Opportunity) => void;
  onApply?: (opp: Opportunity) => void;
  isApplied?: boolean;
  language?: Language;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  onToggleBookmark,
  onTrack,
  onApply,
  isApplied = false,
  language = 'en',
}) => {
  const [copied, setCopied] = useState(false);

  // Category styling
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'job':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
          avatarBg: 'bg-gradient-to-br from-blue-500 to-blue-700',
        };
      case 'internship':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
          avatarBg: 'bg-gradient-to-br from-purple-500 to-indigo-700',
        };
      case 'scholarship':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
          avatarBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        };
      case 'upskilling':
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
        };
      case 'school_work':
        return {
          badge: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
          avatarBg: 'bg-gradient-to-br from-indigo-600 to-violet-700',
        };
      default:
        return {
          badge: 'bg-slate-50 text-slate-700 border-slate-200',
          avatarBg: 'bg-gradient-to-br from-slate-600 to-slate-800',
        };
    }
  };

  const theme = getCategoryTheme(opportunity.category);

  // Initials for avatar
  const initials = opportunity.organization
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(opportunity.source_url);
    setCopied(true);
    toast.success('Application link copied to clipboard', {
      description: opportunity.title,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(opportunity.id);
    if (!opportunity.is_bookmarked) {
      toast.success('Saved to your bookmarks', {
        description: opportunity.title,
      });
    } else {
      toast.info('Removed from bookmarks');
    }
  };

  // Format deadline and check if closing soon
  const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const isClosingSoon = deadlineDate
    ? (deadlineDate.getTime() - Date.now()) <= 14 * 86400000 && (deadlineDate.getTime() - Date.now()) > 0
    : false;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-blue-400/80 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        {/* Header Row: Avatar + Organization + Match Score & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-2xl ${theme.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm`}
            >
              {initials || 'OP'}
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                <span className="text-slate-900 font-bold">{opportunity.organization}</span>
                {opportunity.is_verified && (
                  <span title="Verified Institutional Listing">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${theme.badge}`}>
                  {language === 'km'
                    ? opportunity.category === 'job'
                      ? 'ការងារ'
                      : opportunity.category === 'internship'
                      ? 'កម្មសិក្សា'
                      : opportunity.category === 'scholarship'
                      ? 'អាហារូបករណ៍'
                      : opportunity.category === 'upskilling'
                      ? 'វគ្គបណ្តុះបណ្តាល'
                      : 'កិច្ចការសាលា'
                    : opportunity.category.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-slate-500 font-medium inline-flex items-center space-x-1">
                  {opportunity.location_type === 'local' ? (
                    <>
                      <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                      <span>{opportunity.province_city || (language === 'km' ? 'កម្ពុជា' : 'Cambodia')}</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>{opportunity.country}</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Icons: Match Score + Share + Bookmark */}
          <div className="flex items-center space-x-1">
            {opportunity.matchScore && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{opportunity.matchScore}%</span>
              </span>
            )}

            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Copy Application Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleBookmarkToggle}
              className={`p-1.5 rounded-xl border transition-colors ${
                opportunity.is_bookmarked
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={opportunity.is_bookmarked ? "Remove Bookmark" : "Save Bookmark"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${opportunity.is_bookmarked ? 'fill-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(opportunity)}
          className={`text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 mb-2 ${
            language === 'km' ? 'leading-normal font-bold' : 'leading-snug'
          }`}
        >
          {opportunity.title}
        </h3>

        {/* Short Description */}
        <p className={`text-xs text-slate-600 line-clamp-2 mb-3 ${language === 'km' ? 'leading-relaxed' : 'leading-relaxed'}`}>
          {opportunity.description}
        </p>

        {/* Highlights: Salary / Funding & Visa / Format */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          {opportunity.salary_or_funding && (
            <span className="inline-flex items-center text-xs font-semibold text-slate-800 bg-slate-100/90 border border-slate-200/60 px-2 py-0.5 rounded-lg">
              <DollarSign className="w-3 h-3 text-emerald-600 mr-1 shrink-0" />
              <span>{opportunity.salary_or_funding}</span>
            </span>
          )}

          {opportunity.visa_sponsorship && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              {language === 'km' ? 'រាប់បញ្ចូលទិដ្ឋាការ' : 'Visa Included'}
            </span>
          )}

          <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 capitalize">
            {language === 'km'
              ? opportunity.work_format === 'on_site'
                ? 'នៅកន្លែងផ្ទាល់'
                : opportunity.work_format === 'hybrid'
                ? 'ចម្រុះ'
                : 'ពីចម្ងាយ'
              : opportunity.work_format.replace('_', '-')}
          </span>
        </div>

        {/* Skills Chips */}
        {opportunity.skills && (
          <div className="flex flex-wrap gap-1 mb-4">
            {opportunity.skills.split(',').slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100/80 text-slate-600 border border-slate-200/50">
                {skill.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {opportunity.deadline ? (
            <span className={isClosingSoon ? 'text-amber-700 font-bold' : 'font-medium'}>
              {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {isClosingSoon && (language === 'km' ? ' (ជិតផុតកំណត់)' : ' (Closing Soon)')}
            </span>
          ) : (
            <span className="font-medium">{language === 'km' ? 'គ្មានថ្ងៃកំណត់' : 'Rolling'}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onTrack && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTrack(opportunity);
                toast.success(language === 'km' ? 'បានបន្ថែមចូលកម្មវិធីតាមដាន' : 'Opportunity tracked in pipeline');
              }}
              className="px-2 py-1 text-[11px] font-semibold rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Track in Pipeline"
            >
              {language === 'km' ? 'តាមដាន' : 'Track'}
            </button>
          )}

          {isApplied ? (
            <span className="px-2.5 py-1 text-xs font-extrabold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'បានដាក់ពាក្យ' : 'Applied'}</span>
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onApply) onApply(opportunity);
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs hover:shadow transition-all"
            >
              {language === 'km' ? 'ដាក់ពាក្យស្នើសុំ' : 'Apply as Student'}
            </button>
          )}

          <button
            onClick={() => onSelect(opportunity)}
            className="px-3 py-1 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all inline-flex items-center space-x-1"
          >
            <span>{language === 'km' ? 'ព័ត៌មានលម្អិត' : 'Details'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
