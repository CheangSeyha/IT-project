'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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

  if (!isOpen) return null;

  const handleSave = () => {
    toast.success('Alert preferences saved successfully', {
      description: `Delivery cadence set to ${frequency} via ${telegramEnabled ? 'Telegram' : ''} ${emailEnabled ? '& Email' : ''}.`,
    });
    onClose();
  };

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
          className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/80 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Personalized Match & Alert Rules</h3>
                <p className="text-[11px] text-slate-500">Receive notifications when crawled opportunities match you</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-5 space-y-4 text-xs">
            {/* Notification Channels */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                Delivery Channels
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white cursor-pointer transition-colors">
                  <span className="font-semibold text-slate-800">Email Digest Notifications</span>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl border border-blue-200/80 bg-blue-50/40 hover:bg-blue-50/60 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold text-slate-800">Telegram Bot Notifications (Cambodia)</span>
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
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                Notification Cadence
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['instant', 'daily', 'weekly'] as const).map(freq => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`py-2 rounded-xl text-center capitalize font-bold border transition-all ${
                      frequency === freq
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Types */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                Alert Triggers
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobAlerts}
                    onChange={(e) => setJobAlerts(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>New Job & Internship listings matching your skills</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scholarshipAlerts}
                    onChange={(e) => setScholarshipAlerts(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>New International Scholarship announcements (Fully Funded)</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deadlineAlerts}
                    onChange={(e) => setDeadlineAlerts(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>Approaching deadline alerts (7, 3, and 1 day remaining)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Alert Rules</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
