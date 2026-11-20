'use client';

import React from 'react';
import { Opportunity, ApplicationStatus } from '@/types';
import { LayoutDashboard } from 'lucide-react';

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
  const columns: { id: ApplicationStatus; title: string; color: string }[] = [
    { id: 'saved', title: 'Saved for Later', color: 'bg-gray-100 text-gray-700' },
    { id: 'preparing', title: 'Preparing Documents', color: 'bg-blue-100 text-blue-800' },
    { id: 'applied', title: 'Applied / Submitted', color: 'bg-purple-100 text-purple-800' },
    { id: 'interviewing', title: 'Interviewing', color: 'bg-amber-100 text-amber-800' },
    { id: 'offered', title: 'Offers Received', color: 'bg-emerald-100 text-emerald-800' },
  ];

  // Map opportunities to tracker status
  const getOpportunitiesByStatus = (status: ApplicationStatus) => {
    return opportunities.filter(opp => trackers[opp.id] === status);
  };

  const totalTracked = Object.keys(trackers).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-gray-900">Student Application Pipeline</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Personalized tracking pipeline: drag or advance opportunities from saved to submitted and offered.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 w-fit">
          {totalTracked} Opportunities in Tracking Pipeline
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map(col => {
          const items = getOpportunitiesByStatus(col.id);
          return (
            <div key={col.id} className="bg-gray-50/70 rounded-2xl p-3 border border-gray-200/80 flex flex-col min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                  {items.length}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3 flex-1">
                {items.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-center p-3">
                    <span className="text-[11px] text-gray-400 font-medium">No items yet</span>
                  </div>
                ) : (
                  items.map(opp => (
                    <div
                      key={opp.id}
                      className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                          {opp.category}
                        </span>
                        <h4
                          onClick={() => onSelect(opp)}
                          className="text-xs font-bold text-gray-900 group-hover:text-blue-600 cursor-pointer line-clamp-2"
                        >
                          {opp.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{opp.organization}</p>
                      </div>

                      {/* Status advancement controls */}
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 font-medium">Move to:</span>
                        <select
                          value={col.id}
                          onChange={(e) => onUpdateStatus(opp.id, e.target.value as ApplicationStatus)}
                          className="bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-[11px] text-gray-700 focus:outline-none"
                        >
                          <option value="saved">Saved</option>
                          <option value="preparing">Preparing</option>
                          <option value="applied">Applied</option>
                          <option value="interviewing">Interview</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Archived</option>
                        </select>
                      </div>
                    </div>
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
