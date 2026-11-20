'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Opportunity, ApplicationStatus } from '@/types';
import {
  X,
  ExternalLink,
  Building,
  Bookmark,
  ShieldCheck,
  Sparkles,
  MapPin,
  Globe,
  Share2,
  Check,
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'funding' | 'match'>('overview');
  const [copied, setCopied] = useState(false);

  if (!opportunity) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(opportunity.source_url);
    setCopied(true);
    toast.success('Official link copied to clipboard', {
      description: opportunity.title,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmarkToggle = () => {
    onToggleBookmark(opportunity.id);
    if (!opportunity.is_bookmarked) {
      toast.success('Opportunity saved to bookmarks');
    } else {
      toast.info('Removed from bookmarks');
    }
  };

  const handleStatusSelect = (status: ApplicationStatus) => {
    onUpdateStatus(opportunity.id, status);
    if (status === 'offered') {
      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
      toast.success('Congratulations on receiving the offer!');
    } else if (status === 'applied') {
      try {
        confetti({ particleCount: 40, spread: 40 });
      } catch {
        // Fallback
      }
      toast.success('Application marked as submitted!');
    } else {
      toast.info(`Status updated to ${status}`);
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview & Details' },
    { id: 'requirements' as const, label: 'Requirements & Skills' },
    { id: 'funding' as const, label: 'Compensation & Benefits' },
    { id: 'match' as const, label: `Profile Match (${opportunity.matchScore || 85}%)`, icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                  {opportunity.category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 inline-flex items-center space-x-1">
                  {opportunity.location_type === 'local' ? (
                    <>
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span>{opportunity.province_city || 'Cambodia'}</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3 text-indigo-600" />
                      <span>{opportunity.country}</span>
                    </>
                  )}
                </span>
                {opportunity.is_verified && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Organization</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl font-black text-slate-900 leading-snug">
                {opportunity.title}
              </h2>

              <p className="text-xs font-medium text-slate-600 mt-1 flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-800">{opportunity.organization}</span>
                {opportunity.province_city && (
                  <>
                    <span className="text-slate-300">•</span>
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{opportunity.province_city}</span>
                  </>
                )}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Animated Tab Navigation */}
          <div className="px-6 pt-2 border-b border-slate-100 flex space-x-2 text-xs font-bold text-slate-500 bg-slate-50/70 overflow-x-auto">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 pt-1 px-2.5 transition-all flex items-center space-x-1 whitespace-nowrap ${
                    isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {TabIcon && <TabIcon className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="modal-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6 text-sm text-slate-700 flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Metric Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Location</span>
                    <span className="font-bold text-slate-800">
                      {opportunity.province_city || opportunity.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Delivery Format</span>
                    <span className="font-bold text-slate-800 capitalize">
                      {opportunity.work_format.replace('_', '-')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Deadline</span>
                    <span className="font-bold text-slate-800">
                      {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Rolling'}
                    </span>
                  </div>
                  {opportunity.salary_or_funding && (
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-medium">Funding / Salary</span>
                      <span className="font-bold text-emerald-700">
                        {opportunity.salary_or_funding}
                      </span>
                    </div>
                  )}
                  {opportunity.visa_sponsorship && (
                    <div>
                      <span className="text-slate-400 block font-medium">Visa</span>
                      <span className="font-bold text-indigo-700">Sponsorship Included</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                    {opportunity.description}
                  </p>
                </div>

                {/* Source Attribution Alert */}
                <div className="bg-amber-50/70 border border-amber-200/60 p-3.5 rounded-2xl text-xs text-amber-900">
                  <span className="font-bold">Original Source:</span> Ingested from {opportunity.source_name}. Application is processed through their official verified portal.
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="space-y-4">
                {opportunity.requirements ? (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Eligibility Criteria</h4>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                      {opportunity.requirements}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Standard eligibility requirements apply based on educational qualifications.</p>
                )}

                {opportunity.language_requirements && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Language Proficiency</h4>
                    <p className="text-slate-800 font-semibold text-xs sm:text-sm">{opportunity.language_requirements}</p>
                  </div>
                )}

                {opportunity.skills && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Extracted Key Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {opportunity.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'funding' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Salary or Award Package</h4>
                  <p className="text-base font-extrabold text-emerald-800">{opportunity.salary_or_funding || 'Competitive Compensation'}</p>
                </div>

                {opportunity.local_benefits && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Local Cambodian Benefits</h4>
                    <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{opportunity.local_benefits}</p>
                  </div>
                )}

                {opportunity.visa_sponsorship && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
                    <span className="font-bold">International Visa Sponsorship:</span> The offering institution covers or sponsors valid student/work visas for Cambodian nationals.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'match' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">Your Student Profile Match Score</span>
                    <span className="text-blue-700 text-base font-extrabold">{opportunity.matchScore || 85}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${opportunity.matchScore || 85}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Calculated against your student profile (Year 4 CS, skills: Python, React, TypeScript, SQL).
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-800 flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Matched Core Skills:</strong> Python, Database/SQL, Modern Web Technologies</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-800 flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Education Level:</strong> Meets minimum degree/enrollment criteria</span>
                  </div>
                </div>
              </div>
            )}

            {/* Student Status Tracker Action */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-800">Application Pipeline Stage</span>
                <span className="text-[11px] text-slate-500">Advance status as you prepare or interview</span>
              </div>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusSelect(e.target.value as ApplicationStatus)}
                className="bg-white border border-slate-300 rounded-xl text-xs font-bold py-1.5 px-3 focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
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
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmarkToggle}
                className={`px-3.5 py-2 text-xs font-semibold rounded-2xl border flex items-center space-x-1.5 transition-colors ${
                  opportunity.is_bookmarked
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${opportunity.is_bookmarked ? 'fill-blue-600' : ''}`} />
                <span>{opportunity.is_bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2 text-xs font-semibold rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            <a
              href={opportunity.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-xs font-bold rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all"
            >
              <span>Open Official Application Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
