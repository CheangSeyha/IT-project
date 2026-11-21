'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Opportunity } from '@/types';
import { fallbackOpportunities, createOpportunity } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { TeacherCurationView } from '@/components/TeacherCurationView';

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState<'collections' | 'events'>('collections');
  const [opportunities] = useState<Opportunity[]>(fallbackOpportunities);
  const [showEventModal, setShowEventModal] = useState(false);

  // New Academic Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [organizer, setOrganizer] = useState('Faculty of Engineering & IT');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('CADT Auditorium / Zoom Online');
  const [description, setDescription] = useState('');
  const [targetCohort, setTargetCohort] = useState('Year 3 & Year 4 Students');
  const [registrationLink, setRegistrationLink] = useState('');

  // Academic Events list
  const [academicEvents, setAcademicEvents] = useState([
    {
      id: 101,
      title: 'AI & Large Language Models in Production Seminar',
      organizer: 'Prof. David Kim & Google Developer Group',
      date: 'Next Tuesday, 2:00 PM',
      venue: 'CADT Innovation Hall & Hybrid Stream',
      target: 'Year 4 Computer Science Cohort',
      category: 'upskilling',
    },
    {
      id: 102,
      title: 'Graduate Scholarship Writing & Proposal Workshop',
      organizer: 'Academic Affairs & International Office',
      date: 'Dec 5, 2026, 9:00 AM',
      venue: 'Room 304, Academic Block',
      target: 'Graduating Seniors & Alumni',
      category: 'scholarship',
    },
  ]);

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) {
      toast.error('Please enter an event title');
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      organizer,
      date: eventDate || 'Scheduled for Next Month',
      venue,
      target: targetCohort,
      category: 'upskilling',
    };

    setAcademicEvents(prev => [newEvent, ...prev]);

    // Also persist as an opportunity listing
    try {
      await createOpportunity({
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
    } catch {}

    toast.success('Academic Event & Seminar Published!', {
      description: `Broadcasted to ${targetCohort} across OpportunityHub.`,
    });

    setShowEventModal(false);
    setEventTitle('');
    setDescription('');
    setRegistrationLink('');
  };

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
                Curate and share targeted opportunity lists with students; post academic events, seminars, and workshops.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEventModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center space-x-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post Academic Event / Seminar</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-slate-200/70 p-1 rounded-2xl w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'collections'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Curated Opportunity Lists</span>
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
        {activeTab === 'collections' ? (
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
