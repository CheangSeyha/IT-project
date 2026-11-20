'use client';

import React from 'react';
import { Opportunity } from '@/types';
import { Building, Calendar, DollarSign, Bookmark, ShieldCheck } from 'lucide-react';

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
  // Category badge styles
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'job':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'internship':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'scholarship':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'upskilling':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Format deadline and check if closing soon
  const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const isClosingSoon = deadlineDate ? (deadlineDate.getTime() - Date.now()) <= 14 * 86400000 && (deadlineDate.getTime() - Date.now()) > 0 : false;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Category & Location Scope Badges + Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadge(opportunity.category)}`}>
              {opportunity.category}
            </span>

            {opportunity.location_type === 'local' ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-800 flex items-center space-x-1">
                <span>🇰🇭 Local</span>
                {opportunity.province_city && <span>• {opportunity.province_city}</span>}
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100/70 text-indigo-800 flex items-center space-x-1">
                <span>🌏 {opportunity.country}</span>
              </span>
            )}

            {opportunity.visa_sponsorship && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Visa Sponsor
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(opportunity.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              opportunity.is_bookmarked
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={opportunity.is_bookmarked ? "Remove Bookmark" : "Bookmark Opportunity"}
          >
            <Bookmark className={`w-4 h-4 ${opportunity.is_bookmarked ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Organization Name & Title */}
        <div className="mb-2">
          <div className="flex items-center space-x-1 text-xs text-gray-500 font-medium mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>{opportunity.organization}</span>
            {opportunity.is_verified && (
              <span title="Verified Institutional Listing">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              </span>
            )}
          </div>
          <h3
            onClick={() => onSelect(opportunity)}
            className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
          >
            {opportunity.title}
          </h3>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {opportunity.description}
        </p>

        {/* Compensation / Funding & Benefits */}
        <div className="space-y-1 mb-3">
          {opportunity.salary_or_funding && (
            <div className="inline-flex items-center text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0" />
              <span>{opportunity.salary_or_funding}</span>
            </div>
          )}
          {opportunity.local_benefits && (
            <p className="text-[11px] text-gray-500 line-clamp-1">
              <span className="font-medium text-gray-700">Benefits:</span> {opportunity.local_benefits}
            </p>
          )}
        </div>

        {/* Skills Tags */}
        {opportunity.skills && (
          <div className="flex flex-wrap gap-1 mb-4">
            {opportunity.skills.split(',').slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {skill.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Deadline & Action Buttons */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          {opportunity.deadline ? (
            <span className={isClosingSoon ? 'text-amber-700 font-bold' : ''}>
              {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {isClosingSoon && ' (Closing Soon)'}
            </span>
          ) : (
            <span>Ongoing</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTrack(opportunity)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Track
          </button>
          <button
            onClick={() => onSelect(opportunity)}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
