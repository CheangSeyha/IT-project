'use client';

import React from 'react';
import { Opportunity, ApplicationStatus } from '@/types';
import { X, ExternalLink, Building, Bookmark, ShieldCheck } from 'lucide-react';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onToggleBookmark: (id: number) => void;
  onUpdateStatus: (opportunityId: number, status: ApplicationStatus) => void;
  currentStatus?: ApplicationStatus;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  opportunity,
  onClose,
  onToggleBookmark,
  onUpdateStatus,
  currentStatus = 'saved',
}) => {
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                {opportunity.category}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {opportunity.location_type === 'local' ? '🇰🇭 Cambodia' : `🌏 ${opportunity.country}`}
              </span>
              {opportunity.is_verified && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 leading-snug">
              {opportunity.title}
            </h2>
            <p className="text-sm font-medium text-gray-600 mt-1 flex items-center space-x-1">
              <Building className="w-4 h-4 text-gray-400" />
              <span>{opportunity.organization}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          {/* Key Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Location</span>
              <span className="font-bold text-gray-800">
                {opportunity.province_city || opportunity.country}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Format</span>
              <span className="font-bold text-gray-800 capitalize">
                {opportunity.work_format.replace('_', '-')}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Deadline</span>
              <span className="font-bold text-gray-800">
                {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Rolling'}
              </span>
            </div>
            {opportunity.salary_or_funding && (
              <div className="col-span-2">
                <span className="text-gray-400 block font-medium">Compensation / Funding</span>
                <span className="font-bold text-emerald-700">
                  {opportunity.salary_or_funding}
                </span>
              </div>
            )}
            {opportunity.visa_sponsorship && (
              <div>
                <span className="text-gray-400 block font-medium">Visa</span>
                <span className="font-bold text-indigo-700">Sponsorship Included</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Overview</h4>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{opportunity.description}</p>
          </div>

          {/* Requirements */}
          {opportunity.requirements && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Requirements & Eligibility</h4>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{opportunity.requirements}</p>
            </div>
          )}

          {/* Benefits */}
          {opportunity.local_benefits && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Benefits</h4>
              <p className="text-gray-600 leading-relaxed">{opportunity.local_benefits}</p>
            </div>
          )}

          {/* Skills Required */}
          {opportunity.skills && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.skills.split(',').map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source Attribution */}
          <div className="bg-amber-50/70 border border-amber-200/60 p-3.5 rounded-xl text-xs text-amber-900">
            <span className="font-bold">Source Publisher:</span> Crawled from {opportunity.source_name}. Application is submitted directly through their official portal.
          </div>

          {/* Student Status Tracker Action */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-gray-800">Application Pipeline Status</span>
              <span className="text-[11px] text-gray-500">Update where you are in the application process</span>
            </div>
            <select
              value={currentStatus}
              onChange={(e) => onUpdateStatus(opportunity.id, e.target.value as ApplicationStatus)}
              className="bg-white border border-gray-300 rounded-lg text-xs font-semibold py-1.5 px-3 focus:outline-none focus:border-blue-500"
            >
              <option value="saved">Saved</option>
              <option value="preparing">Preparing Application</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Archived</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <button
            onClick={() => onToggleBookmark(opportunity.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center space-x-1.5 transition-colors ${
              opportunity.is_bookmarked
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${opportunity.is_bookmarked ? 'fill-blue-600' : ''}`} />
            <span>{opportunity.is_bookmarked ? 'Bookmarked' : 'Save Bookmark'}</span>
          </button>

          <a
            href={opportunity.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all"
          >
            <span>Open Official Application</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
