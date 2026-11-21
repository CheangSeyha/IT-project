'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Opportunity, User } from '@/types';
import { loginUser } from '@/services/api';
import { toast } from 'sonner';
import {
  X,
  GraduationCap,
  Sparkles,
  Lock,
  ArrowRight,
  UserCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  onLoggedIn: (user: User) => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onLoggedIn,
}) => {
  if (!isOpen || !opportunity) return null;

  const handleQuickStudentLogin = async () => {
    try {
      const res = await loginUser('student@opphub.kh', 'password123');
      toast.success(`Signed in as ${res.user.full_name} (Student)`, {
        description: 'You can now submit your application directly!',
      });
      onLoggedIn(res.user);
      onClose();
    } catch {
      toast.error('Quick student login failed. Please use standard login.');
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
          className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200/90 z-10"
        >
          {/* Top Header */}
          <div className="p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-lg font-black tracking-tight">Student Registration Required</h3>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              To apply for job and school work opportunities and track your milestones, please register or sign in as a <span className="font-bold underline">Student</span>.
            </p>
          </div>

          {/* Opportunity Preview Snippet */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/70">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Target Opportunity:
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-black text-slate-900 line-clamp-1">{opportunity.title}</h4>
                <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>{opportunity.organization}</span>
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase shrink-0">
                {opportunity.category.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Action Options */}
          <div className="p-6 space-y-3">
            {/* 1-Click Fast Student Demo Login */}
            <button
              onClick={handleQuickStudentLogin}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow-md flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold leading-tight">1-Click Fast Student Login</p>
                  <p className="text-[10px] text-emerald-100 font-normal">Sokha Chan (Year 4 CS)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Register New Student Account */}
            <Link
              href="/login?mode=register&role=student"
              onClick={onClose}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold leading-tight">Create Student Account</p>
                  <p className="text-[10px] text-slate-300 font-normal">Free registration for students</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Standard Sign In */}
            <Link
              href="/login?mode=signin"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Already have an account? Sign In</span>
            </Link>
          </div>

          {/* Micro Perks Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Verified Portals Only</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              <span>Free Student Access</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
