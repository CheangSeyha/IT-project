'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Opportunity, CuratedCollection } from '@/types';
import { fetchCuratedCollections, createCuratedCollection } from '@/services/api';
import { CreateCollectionModal } from './CreateCollectionModal';
import { GraduationCap, Share2, Plus, Users, Check, ArrowUpRight } from 'lucide-react';

interface TeacherCurationViewProps {
  opportunities: Opportunity[];
  onSelect: (opp: Opportunity) => void;
}

export const TeacherCurationView: React.FC<TeacherCurationViewProps> = ({
  opportunities,
  onSelect,
}) => {
  const [collections, setCollections] = useState<CuratedCollection[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCuratedCollections()
      .then(cols => setCollections(cols))
      .catch(() => {});
  }, []);

  const handleShare = (col: CuratedCollection) => {
    setCopiedId(col.id);
    toast.success('Collection invite link copied to clipboard', {
      description: `Shareable link for cohort: ${col.targetGroup}`,
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddCollection = async (newCol: CuratedCollection) => {
    try {
      const created = await createCuratedCollection({
        title: newCol.title,
        description: newCol.description,
        opportunity_ids: newCol.opportunityIds,
        target_group: newCol.targetGroup,
      });
      setCollections(prev => [created, ...prev]);
      toast.success('New Curated Collection published!', {
        description: created.title,
      });
    } catch {
      setCollections(prev => [newCol, ...prev]);
      toast.info('Collection added');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Teacher & Career Officer Collections</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curate, bundle, and share verified scholarship lists, internship programs, and academic events directly with student cohorts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold rounded-2xl bg-purple-600 text-white hover:bg-purple-700 shadow-sm flex items-center space-x-1.5 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Collection</span>
        </button>
      </div>

      {/* Collection Cards */}
      <div className="space-y-6">
        {collections.map(col => {
          const matchedOpps = opportunities.filter(o => col.opportunityIds.includes(o.id));
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3.5 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{col.targetGroup}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• Curated by {col.author}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{col.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{col.description}</p>
                </div>

                <button
                  onClick={() => handleShare(col)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 transition-colors self-start shrink-0 shadow-xs"
                >
                  {copiedId === col.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Share with Cohort</span>
                    </>
                  )}
                </button>
              </div>

              {/* Opportunities inside collection */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Included Listings ({matchedOpps.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {matchedOpps.map(opp => (
                    <motion.div
                      key={opp.id}
                      whileHover={{ y: -2 }}
                      onClick={() => onSelect(opp)}
                      className="bg-slate-50 hover:bg-purple-50/50 p-3.5 rounded-2xl border border-slate-200/80 cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                            {opp.category}
                          </span>
                          <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 line-clamp-2">
                          {opp.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-1">{opp.organization}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium mt-3 block">
                        {opp.province_city || opp.country}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        opportunities={opportunities}
        onAddCollection={handleAddCollection}
      />
    </div>
  );
};
