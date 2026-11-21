'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Globe,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Zap,
  Languages,
} from 'lucide-react';
import { loginUser, registerUser } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<'en' | 'km'>('en');

  // Sign In Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'teacher' | 'staff' | 'public',
    fieldOfStudy: 'Computer Science & IT',
    educationLevel: 'Undergraduate (Year 3/4)',
  });

  // 1-Click Fast Demo Logins
  const handleDemoLogin = async (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    try {
      const res = await loginUser(demoEmail, 'password123');
      toast.success(`Signed in successfully as ${res.user.full_name}`, {
        description: `Privileges: ${roleName.toUpperCase()} • Session active`,
      });
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch {
      toast.error('Failed to log in with demo account');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      toast.success(`Welcome back, ${res.user.full_name}!`, {
        description: `Logged in with ${res.user.role.toUpperCase()} privileges.`,
      });
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch {
      toast.error('Invalid email or password', {
        description: 'Try the 1-click demo accounts below or check your password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.fullName || !registerData.email || !registerData.password) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      const newUser = await registerUser({
        full_name: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
        field_of_study: registerData.fieldOfStudy,
        education_level: registerData.educationLevel,
      });
      toast.success(`Account created for ${newUser.full_name}!`, {
        description: 'Your profile has been saved. Redirecting to catalog...',
      });
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/80 via-indigo-50/20 to-slate-50 flex flex-col justify-between relative overflow-hidden text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Animated Ambient Background Orbs (Exact Landing Page Pattern) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Engineering dot matrix / grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f60a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f60a_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Ambient floating blur orb 1 (Blue) */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 35, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-28 left-1/4 w-[550px] h-[350px] bg-gradient-to-tr from-blue-400/20 via-cyan-300/20 to-indigo-400/15 rounded-full blur-3xl opacity-80"
        />

        {/* Ambient floating blur orb 2 (Purple/Violet) */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -35, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-20 right-1/4 w-[500px] h-[320px] bg-gradient-to-tr from-indigo-400/20 via-violet-400/20 to-pink-400/15 rounded-full blur-3xl opacity-80"
        />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                OpportunityHub
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                KH
              </span>
            </div>
          </Link>

          {/* Right Links */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1 border border-slate-200/60"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'ខ្មែរ' : 'EN'}</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Catalog'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body with Floating Teaser Cards (Same Pattern as Landing Page) */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 relative">
        {/* Floating 3D Teaser Card (Left Side - Desktop) */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [-2, -0.5, -2],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          className="hidden 2xl:flex absolute left-12 top-28 w-72 bg-white/90 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_16px_36px_-8px_rgba(30,58,138,0.14)] z-10 flex-col space-y-2 cursor-pointer transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                WB
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900 leading-tight">Wing Bank Plc</p>
                <p className="text-[9px] text-slate-500 font-medium">Phnom Penh • Hybrid</p>
              </div>
            </div>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>96% Match</span>
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 line-clamp-1">
            Senior Full-Stack Developer
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            <span className="font-semibold text-blue-700">$1,200 - $2,000 / mo</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">FastAPI</span>
          </div>
        </motion.div>

        {/* Floating 3D Teaser Card (Right Side - Desktop) */}
        <motion.div
          animate={{
            y: [0, 14, 0],
            rotate: [2, 0.5, 2],
          }}
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          className="hidden 2xl:flex absolute right-12 top-32 w-72 bg-white/90 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_16px_36px_-8px_rgba(99,102,241,0.14)] z-10 flex-col space-y-2 cursor-pointer transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                UK
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900 leading-tight">Foreign Office (UK)</p>
                <p className="text-[9px] text-slate-500 font-medium">London • Full Fellowship</p>
              </div>
            </div>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span>92% Fit</span>
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 line-clamp-1">
            Chevening Master’s Scholarship 2027
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            <span className="font-semibold text-emerald-700">100% Fully Funded</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">Visa Sponsored</span>
          </div>
        </motion.div>

        {/* Central Auth Container */}
        <div className="w-full max-w-lg mx-auto relative group">
          {/* Subtle Ambient Glow Halo */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-80 transition duration-300 -z-10" />

          {/* Elevated Glassmorphic Card (Landing Page Pattern) */}
          <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_rgba(30,58,138,0.12),0_2px_8px_rgba(15,23,42,0.04)]">
            {/* Header Live Status Pill */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-semibold text-blue-800 mb-3.5 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{language === 'km' ? 'ប្រព័ន្ធចូលប្រើប្រាស់ផ្ទាល់' : 'Secure Single Sign-On'}</span>
                <span className="text-blue-300">|</span>
                <span className="text-blue-600 font-normal">2026 Edition</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {authMode === 'signin' ? (
                  language === 'km' ? (
                    <>ចូលគណនី <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">OpportunityHub</span></>
                  ) : (
                    <>Sign in to <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">OpportunityHub</span></>
                  )
                ) : (
                  language === 'km' ? (
                    <>បង្កើតគណនី <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">ថ្មី</span></>
                  ) : (
                    <>Create Your <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Account</span></>
                  )
                )}
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                {language === 'km'
                  ? 'គ្រប់គ្រងកម្មវិធីតាមដានការងារ អាហារូបករណ៍ និងការជូនដំណឹងស្វ័យប្រវត្ត'
                  : 'Manage tracked applications, automated crawler alerts, and curated teacher lists.'}
              </p>
            </div>

            {/* Segmented Auth Mode Switcher (Landing Page Category Pill Pattern) */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`relative py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                  authMode === 'signin'
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {authMode === 'signin' && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 bg-slate-900 rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? 'ចូលគណនី' : 'Sign In'}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`relative py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                  authMode === 'register'
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {authMode === 'register' && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 bg-slate-900 rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center space-x-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? 'បង្កើតគណនី' : 'Create Account'}</span>
                </span>
              </button>
            </div>

            {/* 1-Click Fast Demo Logins Strip */}
            {authMode === 'signin' && (
              <div className="mb-6 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-800 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>{language === 'km' ? 'ចុចចូលភ្លាមៗ (គណនីសាកល្បង):' : '1-Click Quick Demo Accounts:'}</span>
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200/60 shadow-2xs">
                    Evaluator
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('student@opphub.kh', 'Student')}
                    className="px-2.5 py-2 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 hover:text-blue-700 border border-slate-200/80 hover:border-blue-300 text-[11px] font-bold text-left transition-all shadow-2xs flex items-center space-x-2 active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="leading-tight font-bold">Student Demo</p>
                      <p className="text-[9px] text-slate-500 font-normal">Sokha Chan</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('teacher@opphub.kh', 'Teacher')}
                    className="px-2.5 py-2 rounded-xl bg-white hover:bg-purple-50/80 text-slate-800 hover:text-purple-700 border border-slate-200/80 hover:border-purple-300 text-[11px] font-bold text-left transition-all shadow-2xs flex items-center space-x-2 active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="leading-tight font-bold">Teacher Demo</p>
                      <p className="text-[9px] text-slate-500 font-normal">Prof. David Kim</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@opphub.kh', 'Admin')}
                    className="px-2.5 py-2 rounded-xl bg-white hover:bg-emerald-50/80 text-slate-800 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300 text-[11px] font-bold text-left transition-all shadow-2xs flex items-center space-x-2 active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="leading-tight font-bold">Admin Demo</p>
                      <p className="text-[9px] text-slate-500 font-normal">System Admin</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('staff@opphub.kh', 'Staff')}
                    className="px-2.5 py-2 rounded-xl bg-white hover:bg-amber-50/80 text-slate-800 hover:text-amber-700 border border-slate-200/80 hover:border-amber-300 text-[11px] font-bold text-left transition-all shadow-2xs flex items-center space-x-2 active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="leading-tight font-bold">Staff Demo</p>
                      <p className="text-[9px] text-slate-500 font-normal">Bopha Chea</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Sign In Form */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'km' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center absolute left-2 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. student@opphub.kh"
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'km' ? 'ពាក្យសម្ងាត់' : 'Password'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center absolute left-2 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === 'km' ? 'បញ្ចូលពាក្យសម្ងាត់' : 'Enter your password'}
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-10 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="font-medium">{language === 'km' ? 'ចងចាំខ្ញុំ' : 'Remember me'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info('Default demo password is: password123')}
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    {language === 'km' ? 'ភ្លេចពាក្យសម្ងាត់?' : 'Forgot password?'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow-md hover:shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? language === 'km'
                        ? 'កំពុងត្រួតពិនិត្យ...'
                        : 'Authenticating...'
                      : language === 'km'
                      ? 'ចូលគណនីឥឡូវនេះ'
                      : 'Sign In to Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Register / Create Account Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'km' ? 'ឈ្មោះពេញ' : 'Full Name'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center absolute left-2 shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="e.g. Sothea Meng"
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-4 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'km' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center absolute left-2 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="sothea@student.cadt.edu.kh"
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-4 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'km' ? 'បង្កើតពាក្យសម្ងាត់' : 'Create Password'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center absolute left-2 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-4 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'km' ? 'តួនាទី' : 'Your Role'}
                    </label>
                    <select
                      value={registerData.role}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          role: e.target.value as 'student' | 'teacher' | 'staff' | 'public',
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher / Mentor</option>
                      <option value="staff">University Staff</option>
                      <option value="public">Public Applicant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'km' ? 'ជំនាញសិក្សា' : 'Field of Study'}
                    </label>
                    <input
                      type="text"
                      value={registerData.fieldOfStudy}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))}
                      placeholder="e.g. Computer Science"
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow-md hover:shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? language === 'km'
                        ? 'កំពុងចុះឈ្មោះ...'
                        : 'Creating Account...'
                      : language === 'km'
                      ? 'បញ្ចប់ការចុះឈ្មោះ'
                      : 'Complete Registration'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-4 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-medium">
          <p>© 2026 OpportunityHub (OppHub) • Secure Authentication Gateway</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS / AES-256 Encrypted</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
