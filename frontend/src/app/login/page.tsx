'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle2,
  Layers,
  Bot,
  Kanban,
  Building2,
  Check,
} from 'lucide-react';
import { loginUser, registerUser, getStoredLanguage, saveStoredLanguage } from '@/services/api';
import { Language } from '@/types';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

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
    fieldOfStudy: '',
    educationLevel: 'Undergraduate',
  });

  useEffect(() => {
    const saved = getStoredLanguage();
    setLanguage(saved);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = saved;
    }

    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setAuthMode('register');
    }
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'teacher', 'staff', 'public'].includes(roleParam)) {
      setRegisterData(prev => ({ ...prev, role: roleParam as 'student' | 'teacher' | 'staff' | 'public' }));
    }
  }, [searchParams]);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'km' : 'en';
    setLanguage(next);
    saveStoredLanguage(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
  };

  // 1-Click Fast Demo Logins
  const handleDemoLogin = async (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    try {
      const res = await loginUser(demoEmail, 'password123');
      toast.success(
        language === 'km'
          ? `បានចូលគណនីជោគជ័យជា ${res.user.full_name}`
          : `Signed in successfully as ${res.user.full_name}`,
        {
          description:
            language === 'km'
              ? `សិទ្ធិ៖ ${roleName.toUpperCase()} • គណនីសកម្ម`
              : `Privileges: ${roleName.toUpperCase()} • Session active`,
        }
      );
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch {
      toast.error(
        language === 'km' ? 'មិនអាចចូលដោយគណនីសាកល្បងបានទេ' : 'Failed to log in with demo account'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(
        language === 'km' ? 'សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់' : 'Please enter both email and password'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      toast.success(
        language === 'km' ? `សូមស្វាគមន៍មកវិញ, ${res.user.full_name}!` : `Welcome back, ${res.user.full_name}!`,
        {
          description:
            language === 'km'
              ? `បានចូលដោយសិទ្ធិ ${res.user.role.toUpperCase()}`
              : `Logged in with ${res.user.role.toUpperCase()} privileges.`,
        }
      );
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch {
      toast.error(
        language === 'km' ? 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ' : 'Invalid email or password',
        {
          description:
            language === 'km'
              ? 'សូមសាកល្បងចុចលើគណនី Demo ខាងលើ ឬពិនិត្យពាក្យសម្ងាត់ឡើងវិញ។'
              : 'Try the 1-click demo accounts above or check your password.',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.fullName || !registerData.email || !registerData.password) {
      toast.error(
        language === 'km' ? 'សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់' : 'Please complete all required fields'
      );
      return;
    }

    if (registerData.password.length < 6) {
      toast.error(
        language === 'km' ? 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' : 'Password must be at least 6 characters'
      );
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
      await loginUser(registerData.email, registerData.password);
      toast.success(
        language === 'km' ? `បានបង្កើតគណនីសម្រាប់ ${newUser.full_name}!` : `Account created for ${newUser.full_name}!`,
        {
          description:
            language === 'km'
              ? 'ប្រវត្តិរូបរបស់អ្នកត្រូវបានរក្សាទុក។ កំពុងប្តូរទៅទំព័រដើម...'
              : 'Your profile has been saved. Redirecting to catalog...',
        }
      );
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch {
      toast.error(
        language === 'km' ? 'ការចុះឈ្មោះមិនបានសម្រេច។ សូមព្យាយាមម្តងទៀត។' : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const rolesConfig = [
    {
      id: 'student' as const,
      icon: GraduationCap,
      labelEn: 'Student',
      labelKm: 'សិស្ស / និស្សិត',
      descEn: 'Apply & track opportunities',
      descKm: 'ដាក់ពាក្យ & តាមដានឱកាស',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'teacher' as const,
      icon: Briefcase,
      labelEn: 'Teacher / Faculty',
      labelKm: 'សាស្ត្រាចារ្យ / គ្រូ',
      descEn: 'Curate cards & school work',
      descKm: 'បង្កើតកាត & កិច្ចការសាលា',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'staff' as const,
      icon: ShieldCheck,
      labelEn: 'Career Staff',
      labelKm: 'មន្ត្រីការងារ',
      descEn: 'Publish verified postings',
      descKm: 'ផ្សព្វផ្សាយឱកាសផ្លូវការ',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      id: 'public' as const,
      icon: Globe,
      labelEn: 'Public Applicant',
      labelKm: 'បេក្ខជនទូទៅ',
      descEn: 'General career seeker',
      descKm: 'ស្វែងរកការងារទូទៅ',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ];

  return (
    <div
      lang={language}
      className={`min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-100 selection:text-blue-900 ${
        language === 'km' ? 'font-khmer leading-relaxed' : 'font-sans'
      }`}
    >
      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group select-none">
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

          {/* Action Links */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1.5 border border-slate-200/60 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'ខ្មែរ' : 'EN'}</span>
            </button>

            {/* Back to Catalog */}
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'km' ? 'ត្រឡប់ទៅកាតាឡុក' : 'Back to Catalog'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dual-Panel Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Panel: Hero Brand & Ecosystem Showcase (Hidden on small mobile, visible on lg) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
            {/* Decorative Ambient Radial Lights */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Statement */}
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{language === 'km' ? 'ច្រកទ្វារឱកាសឌីជីថលកម្ពុជា' : 'Cambodia Opportunity Gateway'}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                  {language === 'km'
                    ? 'តភ្ជាប់និស្សិតកម្ពុជាជាមួយការងារ & អាហារូបករណ៍ពិភពលោក'
                    : 'Unlocking Opportunities for Cambodia’s Next Generation'}
                </h2>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {language === 'km'
                    ? 'ប្រព័ន្ធស្រង់ទិន្នន័យស្វ័យប្រវត្តិតាមបទដ្ឋាន robots.txt ធានាភាពត្រឹមត្រូវ និងគ្មានការផ្សាយពាណិជ្ជកម្មក្លែងបន្លំ។'
                    : 'Direct access to verified tech jobs, digital internships, and fully funded overseas fellowships with automated milestone tracking.'}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3.5 pt-2">
                {[
                  {
                    icon: Bot,
                    titleEn: 'Automated 6-Hour Spider Ingestion',
                    titleKm: 'ស្រង់ទិន្នន័យស្វ័យប្រវត្តិរៀងរាល់ ៦ ម៉ោង',
                    descEn: 'From CamHR, BongThom, CADT, and RUPP portals.',
                    descKm: 'ពីប្រភព CamHR, BongThom, CADT និង RUPP។',
                  },
                  {
                    icon: Layers,
                    titleEn: 'SimHash Anti-Duplicate Deduplication',
                    titleKm: 'បច្ចេកវិទ្យាកម្ចាត់ទិន្នន័យស្ទួន SimHash AI',
                    descEn: 'Zero duplicate clutter with 64-bit Hamming hashing.',
                    descKm: 'កម្ចាត់ការងារស្ទួនទាំងស្រុងដើម្បីសន្សំពេលវេលា។',
                  },
                  {
                    icon: Kanban,
                    titleEn: 'Interactive Application Pipeline',
                    titleKm: 'ផ្ទាំងតាមដានដំណាក់កាលពាក្យស្នើសុំ',
                    descEn: 'Manage from Saved to Interview and Official Offer.',
                    descKm: 'គ្រប់គ្រងពីការរក្សាទុក រហូតដល់ដំណាក់កាលសម្ភាសន៍។',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start space-x-3 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">
                          {language === 'km' ? item.titleKm : item.titleEn}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {language === 'km' ? item.descKm : item.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Institutional Endorsement */}
            <div className="relative z-10 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-[11px] text-slate-300 font-medium">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'km'
                    ? 'កិច្ចសហការសិក្សា៖ CADT • RUPP • ITC • MoEYS'
                    : 'Academic Collaboration: CADT • RUPP • ITC • MoEYS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Year 5 IT Project Management Capstone • 2026
              </p>
            </div>
          </div>

          {/* Right Panel: Interactive Authentication Forms */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Segmented Auth Mode Switcher */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`relative py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${
                    authMode === 'signin' ? 'text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
                  className={`relative py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${
                    authMode === 'register' ? 'text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
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

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  {authMode === 'signin'
                    ? language === 'km'
                      ? 'ចូលប្រើប្រាស់ OpportunityHub'
                      : 'Sign in to OpportunityHub'
                    : language === 'km'
                    ? 'បង្កើតគណនីថ្មីរបស់អ្នក'
                    : 'Create Your OpportunityHub Account'}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {authMode === 'signin'
                    ? language === 'km'
                      ? 'ជ្រើសរើសគណនី Demo ខាងក្រោម ឬបញ្ចូលព័ត៌មានគណនីរបស់អ្នក។'
                      : 'Select a 1-click role demo below or enter your registered credentials.'
                    : language === 'km'
                    ? 'ជ្រើសរើសតួនាទីរបស់អ្នក និងបំពេញព័ត៌មានដើម្បីចាប់ផ្តើម។'
                    : 'Select your ecosystem role and profile information to get started.'}
                </p>
              </div>

              {/* 1-Click Fast Demo Accounts Strip (Only in Sign In mode) */}
              {authMode === 'signin' && (
                <div className="mb-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {language === 'km' ? 'ចុចចូលភ្លាមៗ (គណនីសាកល្បង):' : '1-Click Quick Demo Accounts:'}
                      </span>
                    </span>
                    <span className="text-[10px] text-blue-700 font-extrabold bg-white px-2 py-0.5 rounded-full border border-blue-200/80 shadow-2xs">
                      Evaluator Mode
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      {
                        email: 'student@opphub.kh',
                        role: 'Student',
                        name: 'Sokha Chan',
                        icon: GraduationCap,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50',
                        border: 'hover:border-blue-300',
                      },
                      {
                        email: 'teacher@opphub.kh',
                        role: 'Teacher',
                        name: 'Prof. David Kim',
                        icon: Briefcase,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50',
                        border: 'hover:border-purple-300',
                      },
                      {
                        email: 'staff@opphub.kh',
                        role: 'Staff',
                        name: 'Bopha Chea',
                        icon: Zap,
                        color: 'text-amber-600',
                        bg: 'bg-amber-50',
                        border: 'hover:border-amber-300',
                      },
                      {
                        email: 'admin@opphub.kh',
                        role: 'Admin',
                        name: 'System Admin',
                        icon: ShieldCheck,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-50',
                        border: 'hover:border-emerald-300',
                      },
                    ].map((demo, idx) => {
                      const Icon = demo.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleDemoLogin(demo.email, demo.role)}
                          className={`p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 ${demo.border} text-[11px] font-bold text-left transition-all shadow-2xs flex items-center space-x-2.5 active:scale-95 cursor-pointer`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg ${demo.bg} ${demo.color} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="leading-tight font-extrabold">{demo.role} Demo</p>
                            <p className="text-[10px] text-slate-500 font-normal truncate">{demo.name}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form Body */}
              <AnimatePresence mode="wait">
                {authMode === 'signin' ? (
                  /* SIGN IN FORM */
                  <motion.form
                    key="signin-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSignInSubmit}
                    className="space-y-4"
                  >
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
                          placeholder="student@opphub.kh"
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
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-10 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0"
                        />
                        <span className="font-medium">
                          {language === 'km' ? 'ចងចាំគណនីខ្ញុំ' : 'Remember me'}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(
                            language === 'km'
                              ? 'ពាក្យសម្ងាត់សាកល្បងគឺ: password123'
                              : 'Default demo password is: password123'
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer"
                      >
                        {language === 'km' ? 'ភ្លេចពាក្យសម្ងាត់?' : 'Forgot password?'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      <span>
                        {loading
                          ? language === 'km'
                            ? 'កំពុងផ្ទៀងផ្ទាត់...'
                            : 'Authenticating...'
                          : language === 'km'
                          ? 'ចូលគណនីឥឡូវនេះ'
                          : 'Sign In to Account'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.form>
                ) : (
                  /* REGISTER / CREATE ACCOUNT FORM */
                  <motion.form
                    key="register-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleRegisterSubmit}
                    className="space-y-4"
                  >
                    {/* Visual Role Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        {language === 'km' ? 'ជ្រើសរើសតួនាទីរបស់អ្នក *' : 'Select Your Ecosystem Role *'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {rolesConfig.map((r) => {
                          const Icon = r.icon;
                          const isSelected = registerData.role === r.id;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setRegisterData((prev) => ({ ...prev, role: r.id }))}
                              className={`p-2.5 rounded-2xl border text-left transition-all duration-150 flex items-start space-x-2.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/10'
                                  : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-100/60'
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-xl ${r.bgColor} ${r.color} flex items-center justify-center shrink-0 mt-0.5`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-black text-slate-900 leading-tight">
                                    {language === 'km' ? r.labelKm : r.labelEn}
                                  </p>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                  {language === 'km' ? r.descKm : r.descEn}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {language === 'km' ? 'ឈ្មោះពេញ *' : 'Full Name *'}
                        </label>
                        <div className="relative flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center absolute left-2 shrink-0">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={registerData.fullName}
                            onChange={(e) =>
                              setRegisterData((prev) => ({ ...prev, fullName: e.target.value }))
                            }
                            placeholder="e.g. Sothea Meng"
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {language === 'km' ? 'អាសយដ្ឋានអ៊ីមែល *' : 'Email Address *'}
                        </label>
                        <div className="relative flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center absolute left-2 shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            value={registerData.email}
                            onChange={(e) =>
                              setRegisterData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            placeholder="sothea@student.cadt.edu.kh"
                            className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {language === 'km' ? 'បង្កើតពាក្យសម្ងាត់ *' : 'Create Password *'}
                      </label>
                      <div className="relative flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center absolute left-2 shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData((prev) => ({ ...prev, password: e.target.value }))
                          }
                          placeholder={
                            language === 'km' ? 'យ៉ាងតិច ៦ តួអក្សរ' : 'Minimum 6 characters'
                          }
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-12 pr-10 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Role-Specific Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {registerData.role === 'student'
                            ? language === 'km'
                              ? 'ជំនាញសិក្សា'
                              : 'Field of Study'
                            : registerData.role === 'teacher'
                            ? language === 'km'
                              ? 'មហាវិទ្យាល័យ / ដេប៉ាតឺម៉ង់'
                              : 'Faculty / Department'
                            : registerData.role === 'staff'
                            ? language === 'km'
                              ? 'ការិយាល័យ / មជ្ឈមណ្ឌល'
                              : 'University Career Office'
                            : language === 'km'
                            ? 'ជំនាញឯកទេស'
                            : 'Specialization'}
                        </label>
                        <input
                          type="text"
                          value={registerData.fieldOfStudy}
                          onChange={(e) =>
                            setRegisterData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))
                          }
                          placeholder={
                            registerData.role === 'student'
                              ? 'e.g. Computer Science & AI'
                              : registerData.role === 'teacher'
                              ? 'e.g. Faculty of Engineering'
                              : 'e.g. Career & Placement Center'
                          }
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {language === 'km' ? 'កម្រិតអប់រំ / បទពិសោធន៍' : 'Education / Experience Level'}
                        </label>
                        <select
                          value={registerData.educationLevel}
                          onChange={(e) =>
                            setRegisterData((prev) => ({ ...prev, educationLevel: e.target.value }))
                          }
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
                        >
                          <option value="Undergraduate">Undergraduate (Year 1-4)</option>
                          <option value="Postgraduate">Postgraduate (Master / PhD)</option>
                          <option value="Vocational / TVET">Vocational / TVET Diploma</option>
                          <option value="Faculty / Staff">Faculty / University Staff</option>
                          <option value="Fresh Graduate">Fresh Graduate</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 mt-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      <span>
                        {loading
                          ? language === 'km'
                            ? 'កំពុងបង្កើតគណនី...'
                            : 'Creating Account...'
                          : language === 'km'
                          ? 'បញ្ចប់ការចុះឈ្មោះ'
                          : 'Complete Registration'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Sub-card Trust Footnote */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'km' ? 'សុវត្ថិភាព TLS / AES-256' : 'TLS / AES-256 Encrypted'}</span>
              </span>
              <span className="text-slate-400">
                {language === 'km' ? 'ឥតគិតថ្លៃ ១០០% សម្រាប់សិស្ស' : '100% Free for Students'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Legal Footer */}
      <footer className="border-t border-slate-200/80 py-4 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-medium">
          <p>
            {language === 'km'
              ? '© ២០២៦ OpportunityHub (OppHub) • ច្រកទ្វារផ្ទៀងផ្ទាត់សុវត្ថិភាព'
              : '© 2026 OpportunityHub (OppHub) • Secure Authentication Gateway'}
          </p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'km' ? 'ប្រព័ន្ធ Spiders សកម្ម ៩៩.៩%' : 'All Systems Operational 99.9%'}</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">
          Loading OpportunityHub Auth...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
