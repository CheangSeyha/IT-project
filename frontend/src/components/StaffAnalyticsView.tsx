'use client';

import React from 'react';
import { BarChart3, Eye, Bookmark, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const StaffAnalyticsView: React.FC = () => {
  const topKeywords = [
    { keyword: 'Python / FastAPI', count: 482, growth: '+28%' },
    { keyword: 'Flutter Mobile', count: 351, growth: '+15%' },
    { keyword: 'Fully Funded Scholarship', count: 520, growth: '+34%' },
    { keyword: 'Phnom Penh Internship', count: 390, growth: '+19%' },
    { keyword: 'CADT AI Bootcamp', count: 284, growth: '+42%' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-extrabold text-gray-900">Student Opportunity Engagement Analytics</h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Career Office analytics dashboard: track student search volume, bookmark conversion, and application click-throughs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Opportunity Views</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-gray-900 mt-2 block">14,890</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +24% this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Student Bookmarks</span>
            <Bookmark className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-gray-900 mt-2 block">2,410</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18% this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Applications Started</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-gray-900 mt-2 block">1,120</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +32% this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Verified Postings</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-gray-900 mt-2 block">38</span>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">Institutional partners</span>
        </div>
      </div>

      {/* Grid: Popular Search Keywords & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Top Student Search Queries</h3>
          <div className="space-y-3">
            {topKeywords.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-xs">
                <div>
                  <span className="font-bold text-gray-800">{item.keyword}</span>
                  <span className="text-gray-400 block text-[11px] mt-0.5">{item.count} searches</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {item.growth}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Opportunity Engagement by Category</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>International Scholarships</span>
                <span>41%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '41%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Local Software & Tech Jobs</span>
                <span>32%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Student Internships</span>
                <span>18%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Upskilling & Bootcamps</span>
                <span>9%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '9%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
