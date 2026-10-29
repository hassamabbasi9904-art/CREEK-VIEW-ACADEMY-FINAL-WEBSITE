'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  Calendar,
  BookOpen,
  Filter,
  Search,
  Image as ImageIcon,
  Clock,
  User,
  AlertCircle,
  Download,
  Share2,
  Printer,
  X,
  Maximize2,
  Lock,
  PlusCircle,
  CheckCircle2,
  RefreshCw,
  Building,
  MapPin
} from 'lucide-react';
import { DiaryEntry } from '@/lib/db';

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [studentCampus, setStudentCampus] = useState<string>('');
  const [campusError, setCampusError] = useState<string>('');

  // Generate the 3 active days strings
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const label =
        i === 0
          ? 'Today (' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ')'
          : i === 1
          ? 'Yesterday (' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ')'
          : '2 Days Ago (' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ')';
      dates.push({ value: str, label });
    }
    return dates;
  };

  const activeDates = getDates();

  const loadDiaries = async () => {
    setLoading(true);
    try {
      const me = await fetch('/api/auth/student', { cache: 'no-store' });
      const student = await me.json();
      if (!student.success) { window.location.assign('/student/login'); return; }
      setStudentCampus(student.student.campus || '');
      setSelectedCampus(student.student.campus || 'ALL');
      const res = await fetch('/api/diary');
      const data = await res.json();
      if (data.success && data.entries) setEntries(data.entries);
    } catch (err) {
      console.error('Failed to load diaries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const me = await fetch('/api/auth/student', { cache: 'no-store' });
        const student = await me.json();
        if (!student.success) { window.location.assign('/student/login'); return; }
        if (!ignore) { setStudentCampus(student.student.campus || ''); setSelectedCampus(student.student.campus || 'ALL'); }
        const res = await fetch('/api/diary', { cache: 'no-store' });
        const data = await res.json();
        if (!ignore && data.success && data.entries) setEntries(data.entries);
      } catch (err) { console.error(err); }
      finally { if (!ignore) setLoading(false); }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const chooseCampus = (campus: string) => {
    if (campus === 'ALL' || (studentCampus && campus !== studentCampus)) {
      setCampusError('You can only view the diary for your registered campus. To view another campus diary, you must register or log in for that campus.');
      return;
    }
    setCampusError(''); setSelectedCampus(campus);
  };

  // Filter entries
  const filteredEntries = entries.filter((item) => {
    // Campus filter (Darusslam, Lucknow, Zaman Town, or ALL)
    if (selectedCampus !== 'ALL') {
      const itemCamp = (item.campus || '').toLowerCase();
      const selCamp = selectedCampus.toLowerCase();
      const match =
        itemCamp === selCamp ||
        (selCamp.includes('darusslam') && itemCamp.includes('darusslam')) ||
        (selCamp.includes('lucknow') && itemCamp.includes('lucknow')) ||
        (selCamp.includes('zaman') && itemCamp.includes('zaman'));
      if (!match) return false;
    }

    if (selectedDate !== 'ALL' && item.date !== selectedDate) return false;
    if (selectedGrade !== 'ALL' && item.grade.toLowerCase() !== selectedGrade.toLowerCase()) return false;
    if (selectedSubject !== 'ALL' && item.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.homeworkText.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.grade.toLowerCase().includes(q) ||
        (item.campus && item.campus.toLowerCase().includes(q)) ||
        item.teacherName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const campusesList = [
    { id: 'ALL', label: 'All Campuses', icon: '🏫' },
    { id: 'Darusslam Campus', label: 'Darusslam Campus', icon: '🏛️' },
    { id: 'Lucknow Campus', label: 'Lucknow Campus', icon: '🏫' },
    { id: 'Zaman Town Campus', label: 'Zaman Town Campus', icon: '🏢' },
  ];

  const gradesList = [
    'ALL',
    'Pre-Primary',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
  ];

  const subjectsList = [
    'ALL',
    'Mathematics',
    'English',
    'Urdu',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Islamiat',
    'Social Studies',
    'General Knowledge & Rhymes',
  ];

  const printDiary = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white py-12 px-4 shadow-md">
        <div className="max-w-[90%] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-5 bg-white/20 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Calendar className="w-3.5 h-3.5 text-yellow-300" />
                <span>Daily Student Diary (Roznamcha)</span>
              </div>
              <h1 className="text-xl sm:text-5xl font-black tracking-tight">
                School Diary & Homework
              </h1>
              <p className="text-white/85 text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
                Check daily diary entries, classroom tasks, syllabus homework, test announcements, and whiteboard snapshots for the Darusslam, Lucknow Society, and Zaman Town campuses.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/teacher/login"
                className="bg-white text-[#8B0000] hover:bg-gray-100 font-extrabold px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm border-2 border-white"
              >
                <Lock className="w-4 h-4 text-[#8B0000]" />
                Teacher Portal Login
              </Link>
              <Link
                href="/student/login"
                className="bg-yellow-400 hover:bg-yellow-300 text-[#8B0000] font-extrabold px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Student Login
              </Link>
          
            </div>
          </div>

          {/* 3-Day Rule Notification Banner */}
          <div className="mt-8 bg-black/25 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-start sm:items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-xs sm:text-sm text-white/95">
              <span className="font-bold text-yellow-300">Automatic 3-Day Retention & Campus Filtering: </span>
             Only the homework entries from the last 3 consecutive days (Today, Yesterday, and 2 days ago) remain live in the database. Students can select their campus below to view the specific diary.
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[95%] mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* STUDENT CAMPUS SELECTOR (Mandatory & Prominent) */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-red-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xl font-black text-[#8B0000] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#8B0000]" />
                <span>Step 1: Select Student Campus (Select Karein):</span>
              </span>
              <p className="text-sm text-gray-500 mt-0.5">
                Select your campus to view its daily homework diary.
              </p>
            </div>
            {selectedCampus !== 'ALL' && (
              <span className="text-xs font-extrabold bg-red-100 text-[#8B0000] px-3 py-1 rounded-full">
                Active Filter: {selectedCampus}
              </span>
            )}
          </div>

          {/* Big Interactive Campus Buttons */}
          {campusError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{campusError}</div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {campusesList.map((c) => {
              const isSelected = selectedCampus === c.id;
              // Count matching entries
              const count = entries.filter((e) => {
                if (c.id === 'ALL') return true;
                const itemCamp = (e.campus || '').toLowerCase();
                const target = c.id.toLowerCase();
                return itemCamp.includes(target) || target.includes(itemCamp);
              }).length;

              return (
                <button
                  key={c.id}
                  onClick={() => chooseCampus(c.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-lg ring-4 ring-red-100'
                      : 'bg-gray-50 border-gray-200 text-gray-800 hover:border-red-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{c.icon}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white text-[#8B0000]'
                          : 'bg-gray-200 text-gray-700 group-hover:bg-red-50 group-hover:text-[#8B0000]'
                      }`}
                    >
                      {count} {count === 1 ? 'Entry' : 'Entries'}
                    </span>
                  </div>
                  <h3 className={`font-extrabold text-sm sm:text-base leading-snug ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {c.label}
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {c.id === 'ALL' ? 'Sab campuses ki diary' : `Karachi Campus`}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <Filter className="w-4 h-4 text-[#8B0000]" />
              <span>Filter By Date, Class & Subject</span>
            </div>
            <button
              onClick={loadDiaries}
              className="text-xs text-[#8B0000] hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {/* Quick Date Pills (The 3 active days) */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Active Date (Last 3 Days Only):
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDate('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedDate === 'ALL'
                    ? 'bg-[#8B0000] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All 3 Active Days
              </button>
              {activeDates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedDate === d.value
                      ? 'bg-[#8B0000] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Grade Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Class / Grade:
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-[#8B0000] focus:outline-none font-medium"
              >
                {gradesList.map((g) => (
                  <option key={g} value={g}>
                    {g === 'ALL' ? 'All Classes' : g}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Subject:
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-[#8B0000] focus:outline-none font-medium"
              >
                {subjectsList.map((s) => (
                  <option key={s} value={s}>
                    {s === 'ALL' ? 'All Subjects' : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Query */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Search Topic / Teacher / Keyword:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Exercise 4.2..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#8B0000] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              Active Diary Entries
            </h2>
            <span className="bg-red-100 text-[#8B0000] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {filteredEntries.length} found
            </span>
            {selectedCampus !== 'ALL' && (
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                📍 {selectedCampus}
              </span>
            )}
          </div>

          {(selectedCampus !== 'ALL' || selectedDate !== 'ALL' || selectedGrade !== 'ALL' || selectedSubject !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCampus('ALL');
                setSelectedDate('ALL');
                setSelectedGrade('ALL');
                setSelectedSubject('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-red-700 hover:underline font-semibold"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm">Loading active 3-day school diaries...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-red-50 text-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Diary Found for {selectedCampus !== 'ALL' ? selectedCampus : 'this selection'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              No diary entries are available for this campus or selection from the past three days.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCampus('ALL');
                  setSelectedDate('ALL');
                  setSelectedGrade('ALL');
                  setSelectedSubject('ALL');
                  setSearchQuery('');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Clear Filters
              </button>
              <Link
                href="/teacher/login"
                className="bg-[#8B0000] hover:bg-red-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Teacher: Post Today&apos;s Diary
              </Link>
            </div>
          </div>
        ) : (
          /* Diary Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Header banner */}
                <div className="bg-[#8B0000] text-white p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-white text-[#8B0000] text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                        {item.grade} {item.section ? `(${item.section})` : ''}
                      </span>
                      <span className="text-red-200 text-xs font-semibold">
                        {item.subject}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="bg-black/25 px-2 py-1 rounded text-[11px] font-mono text-white/90 text-right shrink-0">
                    <span className="block font-bold">{item.date}</span>
                  </div>
                </div>

                {/* Campus Badge Strip */}
                <div className="bg-red-50/90 px-4 py-1.5 border-b border-red-100 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#8B0000] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.campus || 'Darusslam Campus'}</span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">
                    3-Day Live
                  </span>
                </div>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Homework & Instructions:
                    </p>
                    <div className="bg-gray-50/80 rounded-xl p-3.5 text-gray-800 text-sm whitespace-pre-line border border-gray-200 leading-relaxed font-sans mb-4">
                      {item.homeworkText}
                    </div>

                    {/* Image Preview */}
                    {item.imageUrl && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1.5">
                          <span className="flex items-center gap-1 text-[#8B0000]">
                            <ImageIcon className="w-3.5 h-3.5" />
                            Attached Board / Notebook Photo
                          </span>
                          <span className="text-[11px] text-gray-400">Click to zoom</span>
                        </div>
                        <div
                          onClick={() => setActiveImageModal(item.imageUrl || null)}
                          className="relative h-44 w-full rounded-xl overflow-hidden cursor-pointer border border-gray-300 group-hover:border-red-400 transition"
                        >
                          <img
                            src={item.imageUrl}
                            alt="Diary snapshot"
                            className="w-full h-full object-cover transition transform group-hover:scale-105 duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-1.5 text-xs font-bold">
                            <Maximize2 className="w-4 h-4" />
                            <span>Click to Zoom</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Teacher & Metadata Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1.5 font-medium text-gray-800">
                      <User className="w-3.5 h-3.5 text-[#8B0000]" />
                      <span>{item.teacherName} {item.teacherDesignation ? `(${item.teacherDesignation})` : ''}</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Image Modal for Zoom */}
      {activeImageModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImageModal}
              alt="Zoomed whiteboard diary"
              className="max-h-[85vh] w-auto object-contain mx-auto rounded-xl"
            />
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}
