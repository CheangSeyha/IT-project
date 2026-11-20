'use client';

import React, { useState } from 'react';
import { Opportunity } from '@/types';
import { Calendar, DollarSign, Bookmark, ShieldCheck, Sparkles, Share2, Check } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opp: Opportunity) => void;
  onToggleBookmark: (id: number) => void;
  onTrack: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  onToggleBookmark,
  onTrack,
}) => {
  const [copied, setCopied] = useState(false);

  // Category badge colors
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'job':
        return { badge: 'bg-blue-50 text-blue-700 border-blue-200/80', avatarBg: 'bg-blue-600' };
      case 'internship':
        return { badge: 'bg-purple-50 text-purple-700 border-purple-200/80', avatarBg: 'bg-purple-600' };
      case 'scholarship':
        return { badge: 'bg-amber-50 text-amber-800 border-amber-200/80', avatarBg: 'bg-amber-600' };
      case 'upskilling':
        return { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80', avatarBg: 'bg-emerald-600' };
      default:
        return { badge: 'bg-slate-50 text-slate-700 border-slate-200', avatarBg: 'bg-slate-600' };
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
    setTimeout(() => setCopied(false), 1500);
  };

  // Format deadline and check if closing soon
  const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const isClosingSoon = deadlineDate
    ? (deadlineDate.getTime() - Date.now()) <= 14 * 86400000 && (deadlineDate.getTime() - Date.now()) > 0
    : false;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:shadow-md hover:border-blue-400/80 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header Row: Avatar + Organization + Match Score & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-xl ${theme.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
              {initials || 'OP'}
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                <span className="text-slate-800 font-semibold">{opportunity.organization}</span>
                {opportunity.is_verified && (
                  <span title="Verified Institutional Listing">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${theme.badge}`}>
                  {opportunity.category}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {opportunity.location_type === 'local' ? `🇰🇭 ${opportunity.province_city || 'Cambodia'}` : `🌏 ${opportunity.country}`}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Icons: Match Score + Bookmark */}
          <div className="flex items-center space-x-1">
            {opportunity.matchScore && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{opportunity.matchScore}%</span>
              </span>
            )}

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              title="Copy Application Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onToggleBookmark(opportunity.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                opportunity.is_bookmarked
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
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
          className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
        >
          {opportunity.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Highlights: Salary / Funding & Visa / Benefits */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          {opportunity.salary_or_funding && (
            <span className="inline-flex items-center text-xs font-semibold text-slate-800 bg-slate-100/80 border border-slate-200/60 px-2 py-0.5 rounded-md">
              <DollarSign className="w-3 h-3 text-emerald-600 mr-1 shrink-0" />
              <span>{opportunity.salary_or_funding}</span>
            </span>
          )}

          {opportunity.visa_sponsorship && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              Visa Included
            </span>
          )}

          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 capitalize">
            {opportunity.work_format.replace('_', '-')}
          </span>
        </div>

        {/* Skills Chips */}
        {opportunity.skills && (
          <div className="flex flex-wrap gap-1 mb-4">
            {opportunity.skills.split(',').slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
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
              {isClosingSoon && ' (Closing Soon)'}
            </span>
          ) : (
            <span className="font-medium">Rolling</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTrack(opportunity)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Track Pipeline
          </button>

          <button
            onClick={() => onSelect(opportunity)}
            className="px-3.5 py-1 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
