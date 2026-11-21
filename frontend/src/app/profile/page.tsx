'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Sparkles,
  Bell,
  Plus,
  X,
  Save,
  ArrowLeft,
  ExternalLink,
  Award,
} from 'lucide-react';
import { User } from '@/types';
import {
  getStoredUser,
  updateUserProfile,
  fallbackOpportunities,
  fallbackUsers,
} from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { AlertSettingsModal } from '@/components/AlertSettingsModal';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science & Engineering');
  const [educationLevel, setEducationLevel] = useState('Bachelor Year 4');
  const [skillsList, setSkillsList] = useState<string[]>(['Python', 'FastAPI', 'Next.js', 'SQL']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getStoredUser() || fallbackUsers[0];
    setCurrentUser(user);
    setFullName(user.full_name || '');
    if (user.field_of_study) setFieldOfStudy(user.field_of_study);
    if (user.education_level) setEducationLevel(user.education_level);
    if (user.skills) {
      setSkillsList(user.skills.split(',').map(s => s.trim()).filter(Boolean));
    }
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList(prev => [...prev, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(prev => prev.filter(s => s !== skill));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateUserProfile({
        full_name: fullName,
        field_of_study: fieldOfStudy,
        education_level: educationLevel,
        skills: skillsList.join(', '),
      });
      setCurrentUser(updated);
      toast.success('Skill profile updated successfully', {
        description: 'New skills will now automatically calculate your opportunity match score.',
      });
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Matched opportunities calculation
  const matchedOpps = fallbackOpportunities
    .map(opp => {
      const oppSkills = (opp.skills || '').toLowerCase();
      const matchedCount = skillsList.filter(s => oppSkills.includes(s.toLowerCase())).length;
      const score = Math.min(100, Math.max(60, 60 + matchedCount * 12));
      return { ...opp, dynamicMatchScore: score };
    })
    .sort((a, b) => b.dynamicMatchScore - a.dynamicMatchScore)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Student Skill Profile & Preferences</h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                  {currentUser?.role || 'Student'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your verified technical skills, academic focus, and notification alerts for automated matching.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAlertModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs flex items-center space-x-2 transition-colors self-start sm:self-auto"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>Configure Match Alerts</span>
          </button>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Skill Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Academic & Skill Attributes</h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Field of Study</label>
                    <select
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                      <option value="Telecommunication & Networking">Telecommunication & Networking</option>
                      <option value="Business Information Systems">Business Information Systems</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Education Level</label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    >
                      <option value="Bachelor Year 1">Bachelor Year 1</option>
                      <option value="Bachelor Year 2">Bachelor Year 2</option>
                      <option value="Bachelor Year 3">Bachelor Year 3</option>
                      <option value="Bachelor Year 4">Bachelor Year 4 (Graduating)</option>
                      <option value="Master's Candidate">Master&apos;s Candidate</option>
                      <option value="Doctorate">Doctorate / Ph.D.</option>
                    </select>
                  </div>
                </div>

                {/* Skills Manager */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Technical Skills & Keywords (used for automatic matching)
                  </label>
                  <form onSubmit={handleAddSkill} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="e.g. Docker, Next.js, Figma, CyberSecurity..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80 text-xs font-semibold shadow-2xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {skillsList.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No skills added yet. Add key technical skills above.</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Match Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Matched Postings</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live Match
                </span>
              </div>

              <div className="space-y-3">
                {matchedOpps.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/40 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-slate-500">{opp.category}</span>
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                        {opp.dynamicMatchScore}% Match
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{opp.title}</h4>
                    <p className="text-[11px] text-slate-500">{opp.organization}</p>
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 pt-1"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                ))}
              </div>

              <Link
                href="/"
                className="block text-center py-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
              >
                Explore All Matching Listings →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <AlertSettingsModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
}
