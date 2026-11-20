'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Database,
  LayoutDashboard,
  Server,
  ShieldCheck,
  BarChart3,
  FileText,
  Play,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowLeft,
  Search,
  ExternalLink,
  Trash2,
  Check,
  MapPin,
  Globe,
} from 'lucide-react';
import { ScraperSource, ScraperLog, Opportunity } from '@/types';
import { fallbackScraperSources, fallbackScraperLogs, fallbackOpportunities } from '@/services/api';
import { AddSourceModal } from '@/components/AddSourceModal';

type AdminTab = 'overview' | 'crawlers' | 'moderation' | 'analytics' | 'logs';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sources, setSources] = useState<ScraperSource[]>(fallbackScraperSources);
  const [logs, setLogs] = useState<ScraperLog[]>(fallbackScraperLogs);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(fallbackOpportunities);
  const [runningId, setRunningId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [moderationFilter, setModerationFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchCrawler, setSearchCrawler] = useState('');

  // Trigger individual scraper
  const handleTriggerScraper = (id: number) => {
    setRunningId(id);
    setTimeout(() => {
      setSources(prev =>
        prev.map(s =>
          s.id === id ? { ...s, last_run_at: 'Just now', items_scraped_total: s.items_scraped_total + 4 } : s
        )
      );
      setLogs(prev => [
        {
          id: Date.now(),
          source_name: sources.find(s => s.id === id)?.name || 'Target Crawler',
          started_at: 'Just now',
          finished_at: 'Just now',
          status: 'SUCCESS',
          items_found: 18,
          new_items: 4,
          duplicates: 14,
        },
        ...prev,
      ]);
      setRunningId(null);
    }, 1200);
  };

  // Run all scrapers
  const handleRunAllScrapers = () => {
    setRunningId(-1);
    setTimeout(() => {
      setSources(prev =>
        prev.map(s => ({ ...s, last_run_at: 'Just now', items_scraped_total: s.items_scraped_total + 3 }))
      );
      setRunningId(null);
    }, 1500);
  };

  const handleAddSource = (newSource: ScraperSource) => {
    setSources(prev => [...prev, newSource]);
  };

  const handleToggleVerify = (id: number) => {
    setOpportunities(prev =>
      prev.map(opp => (opp.id === id ? { ...opp, is_verified: !opp.is_verified } : opp))
    );
  };

  const handleDeleteOpportunity = (id: number) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  const totalScraped = sources.reduce((acc, s) => acc + s.items_scraped_total, 0);
  const filteredSources = sources.filter(s =>
    s.name.toLowerCase().includes(searchCrawler.toLowerCase()) ||
    s.target_url.toLowerCase().includes(searchCrawler.toLowerCase())
  );

  const filteredOpportunities = opportunities.filter(opp => {
    if (moderationFilter === 'verified') return opp.is_verified;
    if (moderationFilter === 'pending') return !opp.is_verified;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white tracking-tight">OppHub Admin</h1>
              <p className="text-[11px] text-slate-400">Management & Crawlers</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('crawlers')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'crawlers'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Web Crawlers & Spiders</span>
            </button>

            <button
              onClick={() => setActiveTab('moderation')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'moderation'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Content Moderation</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Student & Search Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'logs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ingestion Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Back to Client Experience */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-2.5 rounded-xl transition-colors border border-slate-700/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Client Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <span>Admin Console</span>
              <span>/</span>
              <span className="capitalize text-slate-700 font-semibold">{activeTab}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 capitalize mt-0.5">
              {activeTab === 'overview' && 'System Health & Crawl Metrics'}
              {activeTab === 'crawlers' && 'Scraper Sources & Automated Pipeline'}
              {activeTab === 'moderation' && 'Listing Moderation & Verification'}
              {activeTab === 'analytics' && 'Engagement & Keyword Intelligence'}
              {activeTab === 'logs' && 'Crawler Ingestion History & Deduplication'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>5 Spiders Healthy</span>
            </div>

            {activeTab === 'crawlers' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source URL</span>
              </button>
            )}

            <button
              onClick={handleRunAllScrapers}
              disabled={runningId === -1}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningId === -1 ? 'animate-spin' : ''}`} />
              <span>{runningId === -1 ? 'Running Pipeline...' : 'Run All Spiders'}</span>
            </button>
          </div>
        </header>

        {/* Tab Views */}
        <div className="p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-xs font-medium text-slate-500 block">Active Target Sources</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">{sources.length}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">100% Crawl Success Rate</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-xs font-medium text-slate-500 block">Total Opportunities Ingested</span>
                  <span className="text-2xl font-black text-blue-600 mt-1 block">{totalScraped}</span>
                  <span className="text-[11px] text-slate-400 font-medium mt-1 block">Across Cambodia & Abroad</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-xs font-medium text-slate-500 block">Deduplication Efficiency</span>
                  <span className="text-2xl font-black text-indigo-600 mt-1 block">78.4%</span>
                  <span className="text-[11px] text-slate-400 font-medium mt-1 block">SimHash & canonical dedup</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-xs font-medium text-slate-500 block">Verified Institutional Posts</span>
                  <span className="text-2xl font-black text-emerald-600 mt-1 block">
                    {opportunities.filter(o => o.is_verified).length}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium mt-1 block">Authenticated partners</span>
                </div>
              </div>

              {/* Spider Health Quick Matrix */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Crawler Pipeline Operational Status
                  </h3>
                  <span className="text-xs text-slate-400">Strict robots.txt Rate-Limiting Enforced</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <span className="text-slate-400 block font-medium">Local Career Spiders</span>
                    <span className="font-bold text-slate-800 text-sm block">CamHR & BongThom Spiders</span>
                    <span className="text-emerald-700 font-semibold block">Schedule: Every 6 Hours</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <span className="text-slate-400 block font-medium">Academic & University Notice Crawlers</span>
                    <span className="font-bold text-slate-800 text-sm block">CADT & RUPP Portals</span>
                    <span className="text-blue-700 font-semibold block">Schedule: Daily Cron (24h)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <span className="text-slate-400 block font-medium">International Fellowship Spiders</span>
                    <span className="font-bold text-slate-800 text-sm block">Chevening & MEXT Japan</span>
                    <span className="text-indigo-700 font-semibold block">Schedule: Weekly Sync</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRAWLERS */}
          {activeTab === 'crawlers' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2 w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search scraper source or URL..."
                    value={searchCrawler}
                    onChange={(e) => setSearchCrawler(e.target.value)}
                    className="bg-transparent text-slate-800 focus:outline-none w-full"
                  />
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  Showing {filteredSources.length} configured endpoints
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-5">Source & Target URL</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Scope</th>
                      <th className="py-3 px-4">Schedule</th>
                      <th className="py-3 px-4">Last Run</th>
                      <th className="py-3 px-4">Total Ingested</th>
                      <th className="py-3 px-4">Success Rate</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredSources.map(source => (
                      <tr key={source.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-5">
                          <span className="font-bold text-slate-900 block">{source.name}</span>
                          <a
                            href={source.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-600 hover:underline truncate max-w-xs block flex items-center space-x-1"
                          >
                            <span>{source.target_url}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>
                        <td className="py-3.5 px-4 capitalize font-semibold">{source.category}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                            source.location_type === 'local' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {source.location_type === 'local' ? (
                              <MapPin className="w-2.5 h-2.5" />
                            ) : (
                              <Globe className="w-2.5 h-2.5" />
                            )}
                            <span>{source.location_type === 'local' ? 'Local' : 'Overseas'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{source.schedule_interval}</td>
                        <td className="py-3.5 px-4 text-slate-500">{source.last_run_at || 'Pending'}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{source.items_scraped_total}</td>
                        <td className="py-3.5 px-4 text-emerald-600 font-bold">{source.successRate}%</td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => handleTriggerScraper(source.id)}
                            disabled={runningId === source.id}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors disabled:opacity-50 inline-flex items-center space-x-1.5"
                          >
                            {runningId === source.id ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Ingesting...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" />
                                <span>Run Spider</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MODERATION */}
          {activeTab === 'moderation' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold">
                  <span className="text-slate-500">Filter By Status:</span>
                  {(['all', 'verified', 'pending'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setModerationFilter(f)}
                      className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                        moderationFilter === f
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  {filteredOpportunities.length} listings in review queue
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {filteredOpportunities.map(opp => (
                  <div key={opp.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 uppercase text-slate-700">
                          {opp.category}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{opp.title}</span>
                        {opp.is_verified ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center space-x-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                            Unverified Crawl
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500">
                        {opp.organization} • {opp.province_city || opp.country} • Source: {opp.source_name}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleToggleVerify(opp.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition-colors ${
                          opp.is_verified
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{opp.is_verified ? 'Revoke Badge' : 'Verify Listing'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                        title="Delete / Take Down Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Cambodian Student Search Trends</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { kw: 'Python / FastAPI Fintech', count: '482 queries', growth: '+28%' },
                    { kw: 'Chevening UK Scholarship', count: '520 queries', growth: '+34%' },
                    { kw: 'Phnom Penh Tech Internships', count: '390 queries', growth: '+19%' },
                    { kw: 'CADT AI Bootcamp', count: '284 queries', growth: '+42%' },
                    { kw: 'MEXT Japan Postgraduate', count: '315 queries', growth: '+12%' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-800">{item.kw}</span>
                        <span className="text-slate-400 block text-[11px] mt-0.5">{item.count}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {item.growth}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Opportunity Engagement Distribution</h3>
                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>International Scholarships</span>
                      <span>41%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '41%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Local Tech & Software Jobs</span>
                      <span>32%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '32%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Undergraduate Internships</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Digital Upskilling</span>
                      <span>9%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '9%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Automated Scraper Execution Audit Trail
                </h3>
                <span className="text-xs text-slate-400">Deduplication & Extraction History</span>
              </div>

              <div className="space-y-2.5">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900">{log.source_name}</span>
                        <span className="text-slate-400 block text-[11px]">{log.started_at}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-600 mt-2 sm:mt-0 font-medium">
                      <span>Found: <strong className="text-slate-800">{log.items_found}</strong></span>
                      <span>Normalized New: <strong className="text-emerald-700">{log.new_items}</strong></span>
                      <span>Duplicates Deduplicated: <strong className="text-amber-700">{log.duplicates}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Scraper Target Modal */}
      <AddSourceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSource={handleAddSource}
      />
    </div>
  );
}
