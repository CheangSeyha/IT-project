'use client';

import React, { useState } from 'react';
import { Opportunity, CuratedCollection } from '@/types';
import { fallbackCuratedCollections } from '@/services/api';
import { CreateCollectionModal } from './CreateCollectionModal';
import { GraduationCap, Share2, Plus, Users, Check } from 'lucide-react';

interface TeacherCurationViewProps {
  opportunities: Opportunity[];
  onSelect: (opp: Opportunity) => void;
}

export const TeacherCurationView: React.FC<TeacherCurationViewProps> = ({
  opportunities,
  onSelect,
}) => {
  const [collections, setCollections] = useState<CuratedCollection[]>(fallbackCuratedCollections);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleShare = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCollection = (newCol: CuratedCollection) => {
    setCollections(prev => [newCol, ...prev]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-gray-900">Teacher & Career Officer Collections</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Curate, bundle, and share verified scholarship lists, internship programs, and academic events directly with student cohorts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-sm flex items-center space-x-1.5 transition-all w-fit"
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
            <div key={col.id} className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{col.targetGroup}</span>
                    </span>
                    <span className="text-xs text-gray-400">• Curated by {col.author}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{col.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{col.description}</p>
                </div>

                <button
                  onClick={() => handleShare(col.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center space-x-1.5 transition-colors self-start shrink-0"
                >
                  {copiedId === col.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Invite Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-gray-500" />
                      <span>Share with Class</span>
                    </>
                  )}
                </button>
              </div>

              {/* Opportunities inside collection */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Included Listings ({matchedOpps.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {matchedOpps.map(opp => (
                    <div
                      key={opp.id}
                      onClick={() => onSelect(opp)}
                      className="bg-gray-50 hover:bg-purple-50/50 p-3 rounded-xl border border-gray-200/80 cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-0.5">
                          {opp.category}
                        </span>
                        <h5 className="text-xs font-bold text-gray-900 group-hover:text-purple-700 line-clamp-2">
                          {opp.title}
                        </h5>
                        <p className="text-[11px] text-gray-500 mt-0.5">{opp.organization}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium mt-2 block">
                        {opp.province_city || opp.country}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
