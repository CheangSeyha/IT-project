'use client';

import React, { useState } from 'react';
import { Opportunity, OpportunityCategory, LocationType, WorkFormat } from '@/types';
import { createOpportunity } from '@/services/api';
import { toast } from 'sonner';
import {
  X,
  GraduationCap,
  Plus,
} from 'lucide-react';

interface TeacherPostCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardCreated: (opp: Opportunity) => void;
}

export const TeacherPostCardModal: React.FC<TeacherPostCardModalProps> = ({
  isOpen,
  onClose,
  onCardCreated,
}) => {
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('Faculty of Computer Science & IT');
  const [category, setCategory] = useState<OpportunityCategory>('school_work');
  const [locationType, setLocationType] = useState<LocationType>('local');
  const [provinceCity, setProvinceCity] = useState('Phnom Penh');
  const [country, setCountry] = useState('Cambodia');
  const [workFormat, setWorkFormat] = useState<WorkFormat>('hybrid');
  const [salaryOrFunding, setSalaryOrFunding] = useState('6 Academic Credits + $250/mo Stipend');
  const [skills, setSkills] = useState('Python, Research, Problem Solving');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('Enrolled in CS/IT Year 3 or 4 with minimum GPA 3.0.');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please enter a title and description');
      return;
    }

    setLoading(true);
    try {
      const oppPayload: Partial<Opportunity> = {
        title,
        organization,
        category,
        location_type: locationType,
        country: locationType === 'local' ? 'Cambodia' : country,
        province_city: locationType === 'local' ? provinceCity : undefined,
        work_format: workFormat,
        salary_or_funding: salaryOrFunding,
        skills,
        description,
        requirements,
        source_url: sourceUrl || 'https://opphub.kh/academic-post',
        source_name: 'Faculty Academic Bulletin',
        is_verified: true,
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
      };

      const created = await createOpportunity(oppPayload);
      toast.success('Academic Opportunity Card Created!', {
        description: `"${title}" has been published to student search and your dashboard.`,
      });

      onCardCreated(created);
      onClose();
    } catch {
      toast.error('Failed to publish opportunity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/50 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Post School Work or Academic Opportunity</h3>
              <p className="text-[11px] text-slate-500">Teacher & Professor Opportunity Creation Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Card / Opportunity Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Research Assistant in Generative AI, Final Year Capstone Project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Faculty / Department / Lab *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white"
              >
                <option value="school_work">School Work / Academic Project</option>
                <option value="internship">Internship</option>
                <option value="scholarship">Graduate Scholarship</option>
                <option value="upskilling">Upskilling / Bootcamp</option>
                <option value="job">Job</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Scope</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as LocationType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white"
              >
                <option value="local">Local (Cambodia)</option>
                <option value="international">International (Overseas)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locationType === 'local' ? 'Campus / City' : 'Host Country'}
              </label>
              {locationType === 'local' ? (
                <input
                  type="text"
                  value={provinceCity}
                  onChange={(e) => setProvinceCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              ) : (
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Japan, UK"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Academic Credits / Stipend
              </label>
              <input
                type="text"
                placeholder="e.g. 6 Credits + $250/mo, Tuition Waiver"
                value={salaryOrFunding}
                onChange={(e) => setSalaryOrFunding(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Format</label>
              <select
                value={workFormat}
                onChange={(e) => setWorkFormat(e.target.value as WorkFormat)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white"
              >
                <option value="hybrid">Hybrid</option>
                <option value="on_site">On-Site Lab / Campus</option>
                <option value="remote">100% Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Required Skills / Tools (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Python, PyTorch, Research Writing, SQL"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Project Description & Responsibilities *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the research goals, tasks, learning outcomes, and expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Eligibility & Prerequisites
            </label>
            <textarea
              rows={2}
              placeholder="Prerequisites, target cohort (Year 3/4), or minimum GPA..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Department Bulletin / Lab URL
            </label>
            <input
              type="url"
              placeholder="https://cadt.edu.kh/lab"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-600/25 flex items-center space-x-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Publishing Card...' : 'Publish Academic Card'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
