'use client';

import React, { useState } from 'react';
import { Opportunity, CuratedCollection } from '@/types';
import { X, GraduationCap, Plus, Check } from 'lucide-react';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  onAddCollection: (collection: CuratedCollection) => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  opportunities,
  onAddCollection,
}) => {
  const [title, setTitle] = useState('');
  const [targetGroup, setTargetGroup] = useState('Year 4 CS Students');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 6]);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    const newCol: CuratedCollection = {
      id: Date.now(),
      title,
      author: 'Prof. David Kim (Faculty of CS & IT)',
      targetGroup,
      description,
      opportunityIds: selectedIds,
      createdAt: 'Just now',
      viewsCount: 0,
    };

    onAddCollection(newCol);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-purple-50/50 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Create Curated Opportunity Collection</h3>
              <p className="text-[11px] text-gray-500">Curate and broadcast targeted opportunities to students</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Collection Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Recommended Graduate Fellowships 2027"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Target Student Cohort / Class *</label>
            <input
              type="text"
              required
              placeholder="e.g. Year 4 CS Seniors, AI Lab Students"
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Instructor Note / Guidance</label>
            <textarea
              rows={2}
              placeholder="Special instructions or tips for applicants..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Select listings to include */}
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Select Opportunities to Include ({selectedIds.length} selected)
            </label>
            <div className="max-h-52 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-2 bg-gray-50/50">
              {opportunities.map(opp => (
                <label
                  key={opp.id}
                  className={`flex items-start space-x-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                    selectedIds.includes(opp.id)
                      ? 'bg-purple-50/80 border-purple-200'
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(opp.id)}
                    onChange={() => toggleSelect(opp.id)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-purple-700 block">{opp.category}</span>
                    <h5 className="font-bold text-gray-900 truncate">{opp.title}</h5>
                    <p className="text-[11px] text-gray-500">{opp.organization} • {opp.province_city || opp.country}</p>
                  </div>
                </label>
              ))}
            </div>
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
              disabled={selectedIds.length === 0}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-1.5 shadow-md shadow-purple-600/20 disabled:opacity-50"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Collection Created!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-white" />
                  <span>Publish Collection</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
