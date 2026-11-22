'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Opportunity, CuratedCollection } from '@/types';
import { X, GraduationCap, Plus } from 'lucide-react';

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
  const [targetGroup, setTargetGroup] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
          className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/80 z-10"
        >
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/50 sticky top-0 bg-white z-10">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Create Curated Opportunity Collection</h3>
                <p className="text-[11px] text-slate-500">Curate and broadcast targeted opportunities to students</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Collection Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Recommended Graduate Fellowships 2027"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Student Cohort / Class *</label>
              <input
                type="text"
                required
                placeholder="e.g. Year 4 CS Seniors, AI Lab Students"
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instructor Note / Guidance</label>
              <textarea
                rows={2}
                placeholder="Special instructions or tips for applicants..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Select listings to include */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Select Opportunities to Include ({selectedIds.length} selected)
              </label>
              <div className="max-h-52 overflow-y-auto space-y-2 border border-slate-200 rounded-2xl p-2 bg-slate-50/50">
                {opportunities.map(opp => (
                  <label
                    key={opp.id}
                    className={`flex items-start space-x-2.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                      selectedIds.includes(opp.id)
                        ? 'bg-purple-50/80 border-purple-200'
                        : 'bg-white border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(opp.id)}
                      onChange={() => toggleSelect(opp.id)}
                      className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold uppercase text-purple-700 block">{opp.category}</span>
                      <h5 className="font-bold text-slate-900 truncate">{opp.title}</h5>
                      <p className="text-[11px] text-slate-500">{opp.organization} • {opp.province_city || opp.country}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedIds.length === 0}
                className="px-5 py-2 text-xs font-bold rounded-2xl bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-1.5 shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Publish Collection</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
