'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { Opportunity, User } from '@/types';
import { applyToOpportunity } from '@/services/api';
import {
  X,
  Send,
  Building,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  Phone,
  FileText,
  MapPin,
} from 'lucide-react';

interface StudentApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  currentUser: User | null;
  onApplicationSubmitted: (opportunityId: number) => void;
}

export const StudentApplyModal: React.FC<StudentApplyModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  currentUser,
  onApplicationSubmitted,
}) => {
  const [statement, setStatement] = useState(
    'I am excited to submit my candidacy for this position. My academic coursework and practical projects align strongly with the required skills.'
  );
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/sokha-chan');
  const [phoneNumber, setPhoneNumber] = useState('+855 12 889 900');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const notes = `Applicant: ${currentUser?.full_name || 'Student'}\nEmail: ${currentUser?.email || ''}\nPhone: ${phoneNumber}\nPortfolio: ${portfolioUrl}\nNote: ${statement}`;
      await applyToOpportunity(opportunity.id, notes);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#10B981', '#6366F1', '#F59E0B'],
        });
      } catch {}

      toast.success('Application Submitted Successfully!', {
        description: `Applied as Student for "${opportunity.title}" at ${opportunity.organization}.`,
      });

      onApplicationSubmitted(opportunity.id);
      onClose();
    } catch {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
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
          className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/90 z-10"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative sticky top-0 z-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Student Application Gateway</span>
            </div>
            <h3 className="text-lg font-black tracking-tight">{opportunity.title}</h3>
            <p className="text-xs text-blue-100 flex items-center space-x-2 mt-1">
              <span className="flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-blue-200" />
                <span className="font-semibold">{opportunity.organization}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-200" />
                <span>{opportunity.province_city || opportunity.country}</span>
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Student Profile Card Snippet */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider">
                  Applying as Verified Student
                </span>
                <p className="text-xs font-black text-slate-900 mt-0.5">
                  {currentUser?.full_name || 'Sokha Chan'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {currentUser?.email || 'student@opphub.kh'} • {currentUser?.field_of_study || 'Computer Science'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {(currentUser?.full_name || 'S').charAt(0)}
              </div>
            </div>

            {/* Statement of Interest */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Statement of Interest / Message to Employer or Faculty *</span>
              </label>
              <textarea
                required
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Highlight your relevant coursework, projects, or why you are passionate about this role..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            {/* Portfolio or Resume URL */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Resume / GitHub / Portfolio Link</span>
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/your-username or Google Drive CV"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact Phone Number</span>
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+855 12 345 678"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Smart Matching Alert */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-2 text-[11px] text-slate-600">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Your application will be tracked in real-time under <strong>My Applications</strong> milestone tracker.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/25 flex items-center space-x-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Submitting Application...' : 'Confirm & Submit Application'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
