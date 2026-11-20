'use client';

import React, { useState } from 'react';
import { X, Bell, Send, Check } from 'lucide-react';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('daily');
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [scholarshipAlerts, setScholarshipAlerts] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Personalized Match & Alert Rules</h3>
              <p className="text-[11px] text-gray-500">Receive notifications when crawled opportunities match you</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Notification Channels */}
          <div>
            <label className="font-bold text-gray-800 uppercase tracking-wider text-[11px] block mb-2">
              Delivery Channels
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
                <span className="font-medium text-gray-800">Email Digest Notifications</span>
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 cursor-pointer">
                <div className="flex items-center space-x-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium text-gray-800">Telegram Bot Notifications (Cambodia)</span>
                </div>
                <input
                  type="checkbox"
                  checked={telegramEnabled}
                  onChange={(e) => setTelegramEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </label>
            </div>
          </div>

          {/* Alert Frequency */}
          <div>
            <label className="font-bold text-gray-800 uppercase tracking-wider text-[11px] block mb-2">
              Notification Cadence
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['instant', 'daily', 'weekly'] as const).map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`py-2 rounded-xl text-center capitalize font-semibold border transition-all ${
                    frequency === freq
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Types */}
          <div>
            <label className="font-bold text-gray-800 uppercase tracking-wider text-[11px] block mb-2">
              Alert Triggers
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={jobAlerts}
                  onChange={(e) => setJobAlerts(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>New Job & Internship listings matching your skills</span>
              </label>
              <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scholarshipAlerts}
                  onChange={(e) => setScholarshipAlerts(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>New International Scholarship announcements (Fully Funded)</span>
              </label>
              <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deadlineAlerts}
                  onChange={(e) => setDeadlineAlerts(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Approaching deadline alerts (7, 3, and 1 day remaining)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Alert Rules</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
