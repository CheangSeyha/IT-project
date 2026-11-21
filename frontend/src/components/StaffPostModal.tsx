'use client';

import React, { useState } from 'react';
import { Opportunity, OpportunityCategory, LocationType, WorkFormat } from '@/types';
import { createOpportunity } from '@/services/api';
import { X, ShieldCheck, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

interface StaffPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOpportunity: (opp: Opportunity) => void;
}

export const StaffPostModal: React.FC<StaffPostModalProps> = ({
  isOpen,
  onClose,
  onAddOpportunity,
}) => {
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('job');
  const [locationType, setLocationType] = useState<LocationType>('local');
  const [provinceCity, setProvinceCity] = useState('Phnom Penh');
  const [country, setCountry] = useState('Cambodia');
  const [workFormat, setWorkFormat] = useState<WorkFormat>('on_site');
  const [salaryOrFunding, setSalaryOrFunding] = useState('');
  const [localBenefits, setLocalBenefits] = useState('NSSF, Health Insurance, Meal Allowance');
  const [visaSponsorship, setVisaSponsorship] = useState(false);
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        local_benefits: locationType === 'local' ? localBenefits : undefined,
        visa_sponsorship: visaSponsorship,
        skills,
        description,
        requirements,
        source_url: sourceUrl || 'https://opphub.kh/verified-post',
        source_name: 'Verified Career Center Posting',
        is_verified: true,
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
      };

      const created = await createOpportunity(oppPayload);
      onAddOpportunity(created);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch {
      toast.error('Failed to publish opportunity');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Post Verified Opportunity</h3>
              <p className="text-[11px] text-gray-500">Career Officer & Institutional Publishing Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Opportunity Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Junior Cybersecurity Engineer, ASEAN Tech Internship"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Organization / Employer *</label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Axiata, Wing, Ministry"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 capitalize"
              >
                <option value="job">Job</option>
                <option value="internship">Internship</option>
                <option value="upskilling">Upskilling</option>
                <option value="scholarship">Scholarship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Scope</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as LocationType)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="local">Local (Cambodia)</option>
                <option value="international">International (Overseas)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                {locationType === 'local' ? 'Province / City' : 'Host Country'}
              </label>
              {locationType === 'local' ? (
                <input
                  type="text"
                  value={provinceCity}
                  onChange={(e) => setProvinceCity(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Japan, Singapore"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Compensation / Funding</label>
              <input
                type="text"
                placeholder="e.g. $700 - $1,100 / month, Fully Funded"
                value={salaryOrFunding}
                onChange={(e) => setSalaryOrFunding(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Work / Program Format</label>
              <select
                value={workFormat}
                onChange={(e) => setWorkFormat(e.target.value as WorkFormat)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="on_site">On-Site</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">100% Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Required Skills (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Python, React, Cybersecurity, English"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Role Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Provide a detailed overview of the opportunity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Key Requirements & Eligibility</label>
            <textarea
              rows={2}
              placeholder="Eligibility criteria, GPA, or required qualifications..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Application URL</label>
              <input
                type="url"
                placeholder="https://company.com/apply"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Benefits or Local Perks</label>
              <input
                type="text"
                placeholder="e.g. NSSF, Insurance, Flight allowance"
                value={localBenefits}
                onChange={(e) => setLocalBenefits(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visaSponsorship}
                onChange={(e) => setVisaSponsorship(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-gray-700 font-semibold">Includes International Visa Sponsorship</span>
            </label>
          </div>

          {/* Footer */}
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
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Published Successfully!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-white" />
                  <span>Publish Verified Opportunity</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
