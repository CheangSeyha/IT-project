'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ShieldCheck,
  BarChart3,
  Plus,
  ArrowLeft,
  Building,
  Calendar,
  MapPin,
  ExternalLink,
  Trash2,
  FileCheck2,
} from 'lucide-react';
import { Opportunity, FilterState } from '@/types';
import { fallbackOpportunities, fetchOpportunities, deleteOpportunity } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { StaffAnalyticsView } from '@/components/StaffAnalyticsView';
import { StaffPostModal } from '@/components/StaffPostModal';

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'postings'>('analytics');
  const [showPostModal, setShowPostModal] = useState(false);
  const [institutionalOpps, setInstitutionalOpps] = useState<Opportunity[]>(
    fallbackOpportunities.filter(o => o.is_verified)
  );

  useEffect(() => {
    fetchOpportunities({ verifiedOnly: true } as Partial<FilterState> as FilterState)
      .then(res => {
        if (res && res.items && res.items.length > 0) {
          setInstitutionalOpps(res.items.filter(o => o.is_verified));
        }
      })
      .catch(() => {});
  }, []);

  const handleAddOpportunity = (newOpp: Opportunity) => {
    setInstitutionalOpps(prev => [newOpp, ...prev]);
    toast.success('Verified Institutional Opportunity Published!', {
      description: `${newOpp.title} is now broadcasted to students and public search.`,
    });
  };

  const handleDeletePosting = async (id: number) => {
    setInstitutionalOpps(prev => prev.filter(o => o.id !== id));
    try {
      await deleteOpportunity(id);
      toast.info('Posting deleted from institutional database');
    } catch {
      toast.info('Posting removed locally');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Header & Role Capabilities Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Career Officer Portal</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  Staff Role
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Post verified institutional opportunities and monitor live student engagement metrics and search analytics.
              </p>
            </div>
          </div>

          {/* Action Button: Post Verified Opportunity */}
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post Verified Opportunity</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-slate-200/70 p-1 rounded-2xl w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Engagement Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('postings')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'postings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Postings ({institutionalOpps.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' ? (
          <div>
            <StaffAnalyticsView />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Institutional Postings</h3>
                  <p className="text-[11px] text-slate-500">Official career, internship, and scholarship listings</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {institutionalOpps.length} Verified
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {institutionalOpps.map(opp => (
                  <div
                    key={opp.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                          {opp.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Partner</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {opp.location_type === 'local' ? 'Cambodia' : 'International'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{opp.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{opp.organization}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{opp.province_city || opp.country}</span>
                        </span>
                        {opp.deadline && (
                          <span className="flex items-center space-x-1 text-amber-700 font-semibold">
                            <Calendar className="w-3 h-3" />
                            <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
                      <Link
                        href={`/opportunities/${opp.id}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDeletePosting(opp.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {institutionalOpps.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    No institutional opportunities posted yet. Click &quot;Post Verified Opportunity&quot; to publish one.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <StaffPostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onAddOpportunity={handleAddOpportunity}
      />
    </div>
  );
}
