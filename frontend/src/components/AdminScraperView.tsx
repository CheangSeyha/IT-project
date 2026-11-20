'use client';

import React, { useState } from 'react';
import { ScraperSource, ScraperLog } from '@/types';
import { fallbackScraperSources, fallbackScraperLogs } from '@/services/api';
import { AddSourceModal } from './AddSourceModal';
import { Database, Play, CheckCircle2, RefreshCw, Server, Activity, Plus } from 'lucide-react';

export const AdminScraperView: React.FC = () => {
  const [sources, setSources] = useState<ScraperSource[]>(fallbackScraperSources);
  const [logs, setLogs] = useState<ScraperLog[]>(fallbackScraperLogs);
  const [runningId, setRunningId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleTriggerScraper = (id: number) => {
    setRunningId(id);
    setTimeout(() => {
      setSources(prev =>
        prev.map(s => (s.id === id ? { ...s, last_run_at: 'Just now', items_scraped_total: s.items_scraped_total + 3 } : s))
      );
      setLogs(prev => [
        {
          id: Date.now(),
          source_name: sources.find(s => s.id === id)?.name || 'Target Scraper',
          started_at: 'Just now',
          finished_at: 'Just now',
          status: 'SUCCESS',
          items_found: 15,
          new_items: 3,
          duplicates: 12,
        },
        ...prev,
      ]);
      setRunningId(null);
    }, 1200);
  };

  const handleAddSource = (newSource: ScraperSource) => {
    setSources(prev => [...prev, newSource]);
  };

  const totalScraped = sources.reduce((acc, s) => acc + s.items_scraped_total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-extrabold text-gray-900">Scraper Engine & Crawler Health</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            System administration for scheduled crawlers, rate limiting, duplicate detection, and source health monitoring.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Spiders Operating Normally</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Target URL</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <span className="text-xs font-medium text-gray-500 block">Configured Sources</span>
          <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{sources.length} Portals</span>
          <span className="text-[11px] text-emerald-600 font-medium">100% Active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <span className="text-xs font-medium text-gray-500 block">Total Items Ingested</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{totalScraped}</span>
          <span className="text-[11px] text-gray-400 font-medium">Historical aggregate</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <span className="text-xs font-medium text-gray-500 block">Deduplication Rate</span>
          <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">78.4%</span>
          <span className="text-[11px] text-gray-400 font-medium">SimHash exact & fuzzy</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <span className="text-xs font-medium text-gray-500 block">robots.txt Compliance</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">Strict</span>
          <span className="text-[11px] text-emerald-600 font-medium">100% Enforced</span>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <Server className="w-4 h-4 text-purple-600" />
            <span>Target Crawl Sources</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">Automated Cron Pipeline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Portal / Source Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Last Run</th>
                <th className="py-3 px-4">Ingested</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {sources.map(source => (
                <tr key={source.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 block">{source.name}</span>
                    <span className="text-[11px] text-gray-400 truncate max-w-xs block">{source.target_url}</span>
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold">{source.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      source.location_type === 'local' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {source.location_type === 'local' ? '🇰🇭 Local' : '🌏 Overseas'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{source.schedule_interval}</td>
                  <td className="py-3 px-4 text-gray-500">{source.last_run_at || 'Never'}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">{source.items_scraped_total}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleTriggerScraper(source.id)}
                      disabled={runningId === source.id}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors disabled:opacity-50 inline-flex items-center space-x-1"
                    >
                      {runningId === source.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Crawling...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Run Now</span>
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

      {/* Scraper Execution Logs */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Recent Ingestion & Deduplication Audit Logs</h3>
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-gray-900">{log.source_name}</span>
                <span className="text-gray-400">• {log.started_at}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 mt-1 sm:mt-0">
                <span>Found: <strong className="text-gray-800">{log.items_found}</strong></span>
                <span>New: <strong className="text-emerald-700">{log.new_items}</strong></span>
                <span>Duplicates Dropped: <strong className="text-amber-700">{log.duplicates}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddSourceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSource={handleAddSource}
      />
    </div>
  );
};
