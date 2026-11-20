'use client';

import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { Opportunity, ApplicationStatus } from '@/types';
import {
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  Send,
  Clock,
  Award,
  Bookmark,
  Building,
  MapPin,
  Globe,
} from 'lucide-react';

interface ApplicationTrackerViewProps {
  opportunities: Opportunity[];
  trackers: Record<number, ApplicationStatus>;
  onUpdateStatus: (opportunityId: number, status: ApplicationStatus) => void;
  onSelect: (opp: Opportunity) => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  opportunities,
  trackers,
  onUpdateStatus,
  onSelect,
}) => {
  const columns: {
    id: ApplicationStatus;
    title: string;
    color: string;
    badgeBg: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'saved',
      title: 'Saved for Later',
      color: 'border-slate-300 text-slate-700',
      badgeBg: 'bg-slate-100 text-slate-700',
      icon: Bookmark,
    },
    {
      id: 'preparing',
      title: 'Preparing Documents',
      color: 'border-blue-300 text-blue-700',
      badgeBg: 'bg-blue-100 text-blue-800',
      icon: Clock,
    },
    {
      id: 'applied',
      title: 'Applied / Submitted',
      color: 'border-purple-300 text-purple-700',
      badgeBg: 'bg-purple-100 text-purple-800',
      icon: Send,
    },
    {
      id: 'interviewing',
      title: 'Interview Scheduled',
      color: 'border-amber-300 text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800',
      icon: CheckCircle2,
    },
    {
      id: 'offered',
      title: 'Offers Received',
      color: 'border-emerald-300 text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: Award,
    },
  ];

  const getOpportunitiesByStatus = (status: ApplicationStatus) => {
    return opportunities.filter(opp => trackers[opp.id] === status);
  };

  const handleStageChange = (opportunity: Opportunity, newStatus: ApplicationStatus) => {
    onUpdateStatus(opportunity.id, newStatus);

    if (newStatus === 'offered') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
        });
      } catch {
        // Fallback gracefully if confetti fails
      }
      toast.success('Congratulations! Official Offer Received', {
        description: `${opportunity.title} at ${opportunity.organization}`,
      });
    } else if (newStatus === 'applied') {
      try {
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.7 },
        });
      } catch {
        // Fallback gracefully
      }
      toast.success('Application marked as Submitted', {
        description: `Good luck with ${opportunity.organization}!`,
      });
    } else {
      const col = columns.find(c => c.id === newStatus);
      toast.info(`Moved to ${col ? col.title : newStatus}`, {
        description: opportunity.title,
      });
    }
  };

  const totalTracked = Object.keys(trackers).length;
  const appliedCount = getOpportunitiesByStatus('applied').length;
  const interviewCount = getOpportunitiesByStatus('interviewing').length;
  const offerCount = getOpportunitiesByStatus('offered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & KPI Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Student Application Pipeline</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track and advance your job, internship, and scholarship applications through each milestone.
          </p>
        </div>

        {/* Pipeline Summary Mini Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <div className="px-3 py-1.5 bg-white text-slate-800 rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>{totalTracked} Total Tracked</span>
          </div>
          <div className="px-3 py-1.5 bg-purple-50 text-purple-800 rounded-2xl border border-purple-200/80 shadow-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>{appliedCount} Submitted</span>
          </div>
          <div className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200/80 shadow-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>{interviewCount} Interviewing</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>{offerCount} Offers</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map(col => {
          const items = getOpportunitiesByStatus(col.id);
          const ColIcon = col.icon;
          return (
            <div
              key={col.id}
              className="bg-slate-100/70 backdrop-blur-sm rounded-3xl p-3 border border-slate-200/80 flex flex-col min-h-[520px] transition-all"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/80">
                <div className="flex items-center space-x-1.5">
                  <ColIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                    {col.title}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-xl border border-slate-200/80 shadow-xs">
                  {items.length}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3 flex-1">
                {items.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-center p-3 text-slate-400">
                    <span className="text-xs font-medium">No items</span>
                    <span className="text-[10px] text-slate-400">Drag or select stage</span>
                  </div>
                ) : (
                  items.map(opp => (
                    <motion.div
                      key={opp.id}
                      layout
                      whileHover={{ y: -2, transition: { duration: 0.15 } }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400/80 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                            {opp.category}
                          </span>
                          {opp.matchScore && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100 flex items-center space-x-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{opp.matchScore}%</span>
                            </span>
                          )}
                        </div>

                        <h4
                          onClick={() => onSelect(opp)}
                          className="text-xs font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug"
                        >
                          {opp.title}
                        </h4>

                        <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-1">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{opp.organization}</span>
                        </div>

                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1">
                          {opp.location_type === 'local' ? (
                            <>
                              <MapPin className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                              <span className="truncate">{opp.province_city || 'Cambodia'}</span>
                            </>
                          ) : (
                            <>
                              <Globe className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                              <span className="truncate">{opp.country}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Move Stage Selector */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-semibold text-[10px]">Move:</span>
                        <select
                          value={col.id}
                          onChange={(e) => handleStageChange(opp, e.target.value as ApplicationStatus)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-0.5 text-[11px] text-slate-700 font-bold focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-white transition-colors"
                        >
                          <option value="saved">Saved</option>
                          <option value="preparing">Preparing</option>
                          <option value="applied">Applied</option>
                          <option value="interviewing">Interview</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Archived</option>
                        </select>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
