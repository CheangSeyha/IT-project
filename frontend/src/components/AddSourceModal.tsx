'use client';

import React, { useState } from 'react';
import { ScraperSource } from '@/types';
import { X, Server, Plus, Check } from 'lucide-react';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: ScraperSource) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
}) => {
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [category, setCategory] = useState('job');
  const [locationType, setLocationType] = useState('local');
  const [scheduleInterval, setScheduleInterval] = useState('Every 6 hours');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSrc: ScraperSource = {
      id: Date.now(),
      name,
      target_url: targetUrl,
      category,
      location_type: locationType,
      schedule_interval: scheduleInterval,
      last_run_at: 'Pending',
      status: 'active',
      items_scraped_total: 0,
      successRate: 100.0,
    };

    onAddSource(newSrc);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Add New Scraper Target URL</h3>
              <p className="text-[11px] text-gray-500">Configure automated crawler spider endpoint</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Target Portal / Source Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ministry of Foreign Affairs Scholarships"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Listing URL / Sitemap / RSS *</label>
            <input
              type="url"
              required
              placeholder="https://example.gov.kh/announcements"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="job">Jobs</option>
                <option value="internship">Internships</option>
                <option value="scholarship">Scholarships</option>
                <option value="upskilling">Upskilling</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Scope</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="local">🇰🇭 Local Cambodia</option>
                <option value="international">🌏 International</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Automated Crawl Frequency</label>
            <select
              value={scheduleInterval}
              onChange={(e) => setScheduleInterval(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="Every 3 hours">Every 3 hours</option>
              <option value="Every 6 hours">Every 6 hours</option>
              <option value="Daily">Daily (Every 24 hours)</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 leading-relaxed">
            <strong>Compliance Check:</strong> Crawler will automatically parse and respect <code>robots.txt</code> and throttle request rates to 1 req/sec.
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-1.5 shadow-md shadow-purple-600/20"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Target Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-white" />
                  <span>Register Scraper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
