'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building,
  MapPin,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  Share2,
  Check,
} from 'lucide-react';
import { Opportunity } from '@/types';
import { fetchOpportunityById, getStoredUser, toggleBookmarkApi } from '@/services/api';
import { Navbar } from '@/components/Navbar';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function load() {
      if (id) {
        const item = await fetchOpportunityById(id);
        setOpp(item);
        if (item) setBookmarked(!!item.is_bookmarked);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Opportunity share link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleBookmark = async () => {
    const user = getStoredUser();
    if (!user) {
      toast.info('Sign in to save opportunities to your tracking pipeline', {
        action: {
          label: 'Sign In',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }
    const newStatus = !bookmarked;
    setBookmarked(newStatus);
    try {
      await toggleBookmarkApi(id);
      toast.success(newStatus ? 'Saved to My Bookmarks' : 'Removed from Bookmarks');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Opportunity Listing Not Found</h2>
          <p className="text-xs text-slate-500">The listing may have expired or been removed.</p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
          >
            ← Back to Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  const skillsList = opp.skills ? opp.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Opportunities</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1.5 shadow-2xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors ${
                bookmarked
                  ? 'bg-purple-600 text-white'
                  : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-white' : 'text-slate-500'}`} />
              <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        {/* Opportunity Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white relative space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                {opp.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-extrabold flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{opp.is_verified ? 'Verified Institutional Post' : 'Direct Crawl'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-[10px] font-bold">
                {opp.location_type === 'local' ? 'Cambodia Domestic' : 'International Opportunity'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{opp.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-1">
              <span className="flex items-center space-x-1">
                <Building className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold">{opp.organization}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{opp.province_city || opp.country}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span className="capitalize">{opp.work_format.replace('_', ' ')}</span>
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">Salary / Funding</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{opp.salary_or_funding || 'Standard / Unspecified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Application Deadline</span>
                <span className="font-bold text-amber-700 mt-0.5 block">
                  {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling Admission'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Visa Sponsorship</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{opp.visa_sponsorship ? 'Provided' : 'Not Required / Local'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Source Portal</span>
                <span className="font-bold text-blue-600 mt-0.5 block truncate">{opp.source_name}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Role & Opportunity Description</h3>
              <p className="whitespace-pre-line text-slate-600">{opp.description}</p>
            </div>

            {/* Requirements */}
            {opp.requirements && (
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Eligibility & Key Requirements</h3>
                <p className="whitespace-pre-line text-slate-600">{opp.requirements}</p>
              </div>
            )}

            {/* Local Benefits */}
            {opp.local_benefits && (
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Institutional & Local Benefits</h3>
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-blue-900 font-medium">
                  {opp.local_benefits}
                </div>
              </div>
            )}

            {/* Skills */}
            {skillsList.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Target Skills & Technical Competencies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-semibold border border-slate-200/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-slate-400">
                Original listing crawled on {new Date(opp.created_at).toLocaleDateString()}
              </span>

              <a
                href={opp.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
