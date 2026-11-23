'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  GraduationCap,
  Calendar,
  Share2,
  Plus,
  ArrowLeft,
  Users,
  MapPin,
  Clock,
  BookOpen,
  Trash2,
  ExternalLink,
  Building,
} from 'lucide-react';
import { Opportunity } from '@/types';
import { fetchOpportunities, createOpportunity, deleteOpportunity } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { TeacherCurationView } from '@/components/TeacherCurationView';
import { TeacherPostCardModal } from '@/components/TeacherPostCardModal';

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState<'cards' | 'collections' | 'events'>('cards');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  // New Academic Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [targetCohort, setTargetCohort] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');

  useEffect(() => {
    fetchOpportunities()
      .then(res => {
        if (res && res.items) {
          setOpportunities(res.items);
        }
      })
      .catch(() => {});
  }, []);

  // Academic Events dynamically derived from backend opportunities
  const academicEvents = useMemo(() => {
    return opportunities
      .filter(
        o =>
          o.category === 'upskilling' ||
          o.category === 'school_work' ||
          o.title.toLowerCase().includes('academic') ||
          o.title.toLowerCase().includes('seminar') ||
          o.title.toLowerCase().includes('workshop')
      )
      .map(o => ({
        id: o.id,
        title: o.title,
        organizer: o.organization,
        date: o.deadline ? new Date(o.deadline).toLocaleDateString() : 'Upcoming Session',
        venue: o.province_city || 'Campus & Online',
        target: o.field_of_study || 'All Students & Cohorts',
        category: o.category,
      }));
  }, [opportunities]);

  const handleCardCreated = (newOpp: Opportunity) => {
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const handleDeleteCard = async (id: number) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
    try {
      await deleteOpportunity(id);
      toast.info('Card deleted from database');
    } catch {
      toast.info('Card removed locally');
    }
  };

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) {
      toast.error('Please enter an event title');
      return;
    }

    try {
      const created = await createOpportunity({
        title: `[Academic Event] ${eventTitle}`,
        organization: organizer,
        category: 'upskilling',
        location_type: 'local',
        country: 'Cambodia',
        province_city: 'Phnom Penh',
        description: `${description} \nTarget Cohort: ${targetCohort}. Venue: ${venue}.`,
        source_name: 'Teacher Academic Bulletin',
        source_url: registrationLink || 'https://opphub.kh/academic-events',
        is_verified: true,
      });
      setOpportunities(prev => [created, ...prev]);
    } catch {}

    toast.success('Academic Event & Seminar Published!', {
      description: `Broadcasted to ${targetCohort} across OpportunityHub.`,
    });

    setShowEventModal(false);
    setEventTitle('');
    setDescription('');
    setRegistrationLink('');
  };

  // Filter cards relevant to faculty / school work / academic
  const facultyCards = opportunities.filter(
    o => o.category === 'school_work' || o.organization.includes('Faculty') || o.organization.includes('Department') || o.source_name.includes('Academic') || o.is_verified
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Header & Role Capabilities Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Teacher & Professor Portal</h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                  Teacher Role
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Create school work cards, share curated opportunity bundles with student cohorts, and broadcast academic events.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setShowCardModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post School Work / Card</span>
            </button>

            <button
              onClick={() => setShowEventModal(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>New Seminar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-slate-200/70 p-1 rounded-2xl w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Posted Cards & School Work ({facultyCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'collections'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Curated Lists for Cohorts</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'events'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Academic Events & Seminars ({academicEvents.length})</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'cards' ? (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Faculty-Posted School Work & Opportunities</h3>
                  <p className="text-[11px] text-slate-500">Live cards visible to students in the public catalog</p>
                </div>
                <button
                  onClick={() => setShowCardModal(true)}
                  className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-xl border border-purple-200 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Card</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {facultyCards.map(opp => (
                  <div
                    key={opp.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                          {opp.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                          Active Listing
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {opp.location_type === 'local' ? 'Cambodia' : 'International'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{opp.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{opp.organization}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{opp.province_city || opp.country}</span>
                        </span>
                        {opp.salary_or_funding && (
                          <span className="font-semibold text-emerald-700">
                            {opp.salary_or_funding}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
                      <Link
                        href={`/opportunities/${opp.id}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteCard(opp.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {facultyCards.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    No faculty cards posted yet. Click &quot;Post School Work / Card&quot; to publish one.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'collections' ? (
          <div>
            <TeacherCurationView
              opportunities={opportunities}
              onSelect={() => {}}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Department Seminars & Academic Events</h3>
                  <p className="text-[11px] text-slate-500">Live academic seminars, guest lectures, and bootcamps</p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  {academicEvents.length} Active Events
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {academicEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                          Academic Seminar
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
                          <Users className="w-3 h-3 text-purple-600" />
                          <span>Target: {evt.target}</span>
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{evt.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">Host: {evt.organizer}</p>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.venue}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.origin);
                          toast.success('Event invite link copied to clipboard');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold flex items-center space-x-1.5 transition-colors border border-purple-200/80"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share with Cohort</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <TeacherPostCardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onCardCreated={handleCardCreated}
      />

      {/* Post Academic Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Post Academic Event or Seminar</h3>
                  <p className="text-[11px] text-slate-500">Broadcast seminars and workshops to student cohorts</p>
                </div>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostEvent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Seminar / Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master's Thesis Workshop, AI Ethics Seminar"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organizer / Host *</label>
                  <input
                    type="text"
                    required
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Student Cohort</label>
                  <input
                    type="text"
                    value={targetCohort}
                    onChange={(e) => setTargetCohort(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date & Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Next Friday, 3:00 PM"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue or Hybrid Link</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Agenda</label>
                <textarea
                  rows={3}
                  placeholder="Outline topics covered, key speakers, or preparation needed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registration or Zoom Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-600/20"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
