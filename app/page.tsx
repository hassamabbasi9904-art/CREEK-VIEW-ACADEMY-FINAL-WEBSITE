'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Lock,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  CheckCircle,
  Award,
  Users,
  Shield,
  Sparkles,
  School,
  Video,
  ChevronRight,
  Star,
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';

export default function HomePage() {
  const [selectedCampus, setSelectedCampus] = useState<'drusslum' | 'lucknow' | 'zaman'>('drusslum');

  // Campuses data
  const campuses = {
    drusslum: {
      name: 'Drusslum Society Campus',
      location: 'Fazal-e-Elahi Hospital ke samnay, Drusslum Society, Karachi',
      wings: 'Pre-Primary, Primary & Middle Wing',
      phone: '+92 312 6172674',
      mapQuery: 'Drusslum+Society+Fazal+E+Elahi+Hospital+Karachi',
    },
    lucknow: {
      name: 'Lucknow Society Campus',
      location: 'Shaq al Mandi Street, Lucknow Society, Karachi',
      wings: 'Primary, Middle & Secondary Wing',
      phone: '+92 312 6172674',
      mapQuery: 'Lucknow+Society+Shaq+al+Mandi+Street+Karachi',
    },
    zaman: {
      name: 'Zaman Town Campus',
      location: 'Zaman Town, Korangi, Karachi',
      wings: 'Comprehensive All Wings & High-tech Science Labs',
      phone: '+92 312 6172674',
      mapQuery: 'Zaman+Town+Karachi',
    },
  };

  // Reviews from user's original site
  const reviews = [
    {
      name: 'Priya Sharma',
      role: 'Parent of Class 5 Student',
      rating: 5,
      avatar: 'https://i.pravatar.cc/60?img=1',
      review: 'Creek View Academy has been a wonderful experience for my child. The teachers are supportive and the environment is perfect for overall growth.',
    },
    {
      name: 'Ahmed Khan',
      role: 'Parent of Class 3 Student',
      rating: 4,
      avatar: 'https://i.pravatar.cc/60?img=2',
      review: 'The focus on both academics and extra-curricular activities is amazing. My daughter loves going to school every day.',
    },
    {
      name: 'Fatima Ali',
      role: 'Parent of Class 8 Student',
      rating: 4,
      avatar: 'https://i.pravatar.cc/60?img=3',
      review: 'Best decision we made. The principal and staff are very cooperative and keep parents updated regularly through the daily diary.',
    },
    {
      name: 'Usman Malik',
      role: 'Parent of Class 10 Student',
      rating: 5,
      avatar: 'https://i.pravatar.cc/60?img=4',
      review: 'Clean campus, modern labs and very caring teachers. Highly recommend this school to everyone in Karachi.',
    },
    {
      name: 'Sana Iqbal',
      role: 'Parent of Class 6 Student',
      rating: 5,
      avatar: 'https://i.pravatar.cc/60?img=5',
      review: 'My son has improved so much in confidence. The sports facilities and annual events are top class. Great job!',
    },
    {
      name: 'Bilal Raza',
      role: 'Parent of Class 1 Student',
      rating: 5,
      avatar: 'https://i.pravatar.cc/60?img=6',
      review: 'Fee structure is reasonable and education quality is excellent. We are very satisfied parents. Thank you!',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* 1. Hero Section matching user's original Creek View Academy Header */}
      <section className="relative min-h-[600px] lg:min-h-[660px] flex items-center bg-gray-50 overflow-hidden border-b border-gray-200">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/header-img.png"
            alt="Creek View Academy Campus Life"
            className="w-full h-full object-cover opacity-85 object-right-top"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://amazing-smakager-c23372.netlify.app/assets/header-img.png';
            }}
          />
        </div>

        {/* White Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/95 to-transparent w-full lg:w-3/5"></div>

        <div className="max-w-[95%] mx-auto px-4 sm:px-6 w-full relative z-10 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-red-100/90 text-[#8B0000] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WHERE YOUNG MINDS SHINE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#8B0000] leading-[1.08] tracking-tight">
                Education is <br />
                <span className="text-gray-900">the Best Solution.</span>
              </h1>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Empowering students across Karachi with knowledge, values, and 21st-century skills to thrive in an ever-evolving world.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 pt-2 justify-center lg:justify-start">
                <Link
                  href="/admissions"
                  className="bg-[#8B0000] text-white font-black text-sm uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-xl hover:bg-red-800 transition transform hover:-translate-y-0.5"
                >NEW ADMISSIONS</Link>
                <Link
                  href="/diary"
                  className="bg-white text-[#8B0000] font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:bg-red-50 transition border-2 border-[#8B0000] flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#8B0000]" />
                  <span>Daily School Diary</span>
                </Link>
                <Link
                  href="/teacher/login"
                  className="bg-gray-900 text-white font-bold text-sm px-5 py-3.5 rounded-xl shadow-md hover:bg-black transition flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4 text-yellow-400" />
                  <span>Teacher Login</span>
                </Link>
              </div>

              {/* Bottom Feature Badges */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-8 border-t border-gray-300">
                <div className="text-center">
                  <div className="w-13 h-13 mx-auto rounded-full bg-red-100 flex items-center justify-center text-[#8B0000] mb-1">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <p className="text-[12px] font-bold text-gray-800 leading-tight">Holistic Education</p>
                </div>
                <div className="text-center">
                  <div className="w-13 h-13 mx-auto rounded-full bg-red-100 flex items-center justify-center text-[#8B0000] mb-1">
                    <Award className="w-7 h-7" />
                  </div>
                  <p className="text-[12px] font-bold text-gray-800 leading-tight">Experienced Faculty</p>
                </div>
                <div className="text-center">
                  <div className="w-13 h-13 mx-auto rounded-full bg-red-100 flex items-center justify-center text-[#8B0000] mb-1">
                    <School className="w-7 h-7" />
                  </div>
                  <p className="text-[12px] font-bold text-gray-800 leading-tight">3 Campuses</p>
                </div>
                <div className="text-center">
                  <div className="w-13 h-13 mx-auto rounded-full bg-red-100 flex items-center justify-center text-[#8B0000] mb-1">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <p className="text-[12px] font-bold text-gray-800 leading-tight">BSEK Matric</p>
                </div>
                <div className="text-center col-span-3 sm:col-span-1">
                  <div className="w-13 h-13 mx-auto rounded-full bg-red-100 flex items-center justify-center text-[#8B0000] mb-1">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <p className="text-[12px] font-bold text-gray-800 leading-tight">Daily Diary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* 2. QUICK ACCESS CARDS - 3 CARDS */}
<section className="py-10 bg-white -mt-8 relative z-20">
  <div className="max-w-[95%] mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Card 1: DIRECT DIARY UPLOAD - NO LOGIN */}
      <div className="bg-[#8B0000] text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between border border-red-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-300" />
            </span>
            <span className="bg-white text-[#8B0000] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
              Direct Upload
            </span>
          </div>
          <h3 className="text-xl font-black text-white mb-1.5">
            Upload Diary Directly
          </h3>
          <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-4">
            No login needed. Teachers can directly upload whiteboard photos and homework.
          </p>
        </div>
        <Link
          href="/teacher/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-300 hover:translate-x-1 transition"
        >
          Upload Diary Now <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Card 2: BLOGS */}
      <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between border border-gray-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </span>
            <span className="bg-yellow-400 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
              New Blogs
            </span>
          </div>
          <h3 className="text-xl font-black text-white mb-1.5">
            School Blogs & News
          </h3>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4">
            Read latest campus events, achievements, and educational articles from our teachers.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-300 hover:translate-x-1 transition"
        >
          View All Blogs <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Card 3: STUDENT LOGIN */}
      <div className="bg-white text-gray-900 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between border-2 border-gray-100">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="w-12 h-12 bg-red-100 text-[#8B0000] rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </span>
            <span className="bg-[#8B0000] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
              Student Portal
            </span>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-1.5">
            Student Login
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
            Students can login with campus password to view daily diary and homework.
          </p>
        </div>
        <Link
          href="/student/login"
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#8B0000] hover:translate-x-1 transition"
        >
          Login as Student <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  </div>
</section>

      {/* 3. Academic Wings (From original Creek View Academy) */}
      <section className="py-20 bg-gray-50 mt-12">
        <div className="max-w-[90%] mx-auto px-2 sm:px-3">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest block mb-2">
              EXCELLENCE IN LEARNING
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Our Academic Wings
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Comprehensive educational journeys designed to bring out the very best in every age group.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Primary School */}
            <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col group border border-gray-100">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600"
                  alt="Primary School"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute -bottom-5 left-5 bg-[#8B0000] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 pt-9 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Primary School</h3>
                  <p className="text-[#8B0000] font-semibold text-sm mb-2">Build. Explore. Discover.</p>
                  <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
                    Strong fundamentals in languages, arithmetic, and conceptual science for a bright future.
                  </p>
                </div>
                <Link
                  href="/academics"
                  className="text-white text-center font-bold py-2.5 px-6 rounded-xl text-xs bg-[#8B0000] hover:bg-red-800 transition"
                >
                  READ MORE
                </Link>
              </div>
            </div>

            {/* Middle School */}
            <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col group border border-gray-100">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=600"
                  alt="Middle School"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute -bottom-5 left-5 bg-[#8B0000] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 pt-9 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Middle School</h3>
                  <p className="text-[#8B0000] font-semibold text-sm mb-2">Learn. Engage. Excel.</p>
                  <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
                    Encouraging analytical reasoning, laboratory experiments, and collaborative projects.
                  </p>
                </div>
                <Link
                  href="/academics"
                  className="text-white text-center font-bold py-2.5 px-6 rounded-xl text-xs bg-[#8B0000] hover:bg-red-800 transition"
                >
                  READ MORE
                </Link>
              </div>
            </div>

            {/* High School */}
            <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col group border border-gray-100">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600"
                  alt="High School"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute -bottom-5 left-5 bg-[#8B0000] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 pt-9 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">High School (Matric)</h3>
                  <p className="text-[#8B0000] font-semibold text-sm mb-2">Focus. Achieve. Lead.</p>
                  <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
                    Targeted preparation for Board examinations with science labs, past papers, and mentoring.
                  </p>
                </div>
                <Link
                  href="/academics"
                  className="text-white text-center font-bold py-2.5 px-6 rounded-xl text-xs bg-[#8B0000] hover:bg-red-800 transition"
                >
                  READ MORE
                </Link>
              </div>
            </div>

            {/* Senior Secondary */}
            <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col group border border-gray-100">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600"
                  alt="Senior Secondary"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute -bottom-5 left-5 bg-[#8B0000] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 pt-9 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Senior Secondary</h3>
                  <p className="text-[#8B0000] font-semibold text-sm mb-2">Prepare. Perform. Succeed.</p>
                  <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
                    Empowering future engineers, doctors, and innovators with high-level academic training.
                  </p>
                </div>
                <Link
                  href="/academics"
                  className="text-white text-center font-bold py-2.5 px-6 rounded-xl text-xs bg-[#8B0000] hover:bg-red-800 transition"
                >
                  READ MORE
                </Link>
              </div>
            </div>

            {/* Library */}
            <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col group border border-gray-100">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600"
                  alt="Library"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute -bottom-5 left-5 bg-[#8B0000] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 pt-9 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Library & E-Resources</h3>
                  <p className="text-[#8B0000] font-semibold text-sm mb-2">Read. Imagine. Discover.</p>
                  <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
                    A world of books, journals, encyclopedias, and digital stations to fuel curiosity.
                  </p>
                </div>
                <Link
                  href="/academics"
                  className="text-white text-center font-bold py-2.5 px-6 rounded-xl text-xs bg-[#8B0000] hover:bg-red-800 transition"
                >
                  READ MORE
                </Link>
              </div>
            </div>

            {/* Daily Roznamcha Card */}
            <div className="bg-gradient-to-br from-[#8B0000] to-[#600000] text-white rounded-3xl shadow-md p-8 flex flex-col justify-between">
              <div>
                <span className="bg-white/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full uppercase inline-block mb-3">
                  Online Portal
                </span>
                <h3 className="text-2xl font-black text-white mb-2">
                  Daily Homework Roznamcha
                </h3>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-6">
                  Check daily syllabus tasks and classroom whiteboard photos for all classes. Automatically maintained for the active 3-day cycle.
                </p>
              </div>
              <div className="space-y-2">
                <Link
                  href="/diary"
                  className="w-full block text-center bg-white text-[#8B0000] font-black py-3 rounded-xl text-xs shadow-lg hover:bg-red-50 transition"
                >
                  VIEW STUDENT DIARY
                </Link>
                <Link
                  href="/teacher/login"
                  className="w-full block text-center bg-black/30 hover:bg-black/50 text-white font-bold py-2.5 rounded-xl text-xs border border-white/20 transition"
                >
                  TEACHER LOGIN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stats Ribbon (from original site) */}
      <section className="bg-[#8B0000] py-12 text-white border-y-4 border-red-950">
        <div className="max-w-[96%] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 border-r border-white/20 last:border-0 p-2">
              <School className="w-10 h-10 text-white shrink-0" />
              <div className="text-left">
                <h3 className="text-2xl sm:text-3xl font-black">2+</h3>
                <p className="text-xs text-white/80">Acres Campus</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 border-r border-white/20 last:border-0 p-2">
              <BookOpen className="w-10 h-10 text-white shrink-0" />
              <div className="text-left">
                <h3 className="text-2xl sm:text-3xl font-black">60+</h3>
                <p className="text-xs text-white/80">Smart Classrooms</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 border-r border-white/20 last:border-0 p-2">
              <Award className="w-10 h-10 text-white shrink-0" />
              <div className="text-left">
                <h3 className="text-2xl sm:text-3xl font-black">6+</h3>
                <p className="text-xs text-white/80">Science Labs</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 border-r border-white/20 last:border-0 p-2">
              <Users className="w-10 h-10 text-white shrink-0" />
              <div className="text-left">
                <h3 className="text-2xl sm:text-3xl font-black">5+</h3>
                <p className="text-xs text-white/80">Activity Rooms</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-2 col-span-2 lg:col-span-1">
              <Sparkles className="w-10 h-10 text-white shrink-0" />
              <div className="text-left">
                <h3 className="text-2xl sm:text-3xl font-black">100%</h3>
                <p className="text-xs text-white/80">Digital Campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Announcements & Virtual Campus Tour (from original announcements.html) */}
      <section className="py-20 bg-white">
        <div className="max-w-[93%] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Announcements */}
            <div className="bg-red-50/60 rounded-3xl p-8 border-2 border-red-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#8B0000] font-black text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Important Updates</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
                  CAMPUS ANNOUNCEMENTS
                </h3>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
                    <span className="text-[10px] font-bold bg-[#8B0000] text-white px-2 py-0.5 rounded">NEW</span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">
                      Admissions Open for Academic Session 2026-27
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Applications are invited from Pre-Primary to Matriculation. Limited seats available in Drusslum, Lucknow, and Zaman Town campuses.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
                    <span className="text-[10px] font-bold bg-gray-200 text-gray-800 px-2 py-0.5 rounded">NOTICE</span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">
                      Daily School Diary System Active (3-Day Cycle)
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Teachers post daily whiteboard snapshots and homework assignments. Only the latest 3 days are stored.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-red-200 flex items-center justify-between">
                <Link href="/blog" className="text-xs text-[#8B0000] font-bold hover:underline">
                  View All Campus News →
                </Link>
                <Link
                  href="/admissions"
                  className="bg-[#8B0000] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-800 transition"
                >
                  Apply Online
                </Link>
              </div>
            </div>

            {/* Right: Schedule a Campus Tour */}
            <div className="bg-[#8B0000] rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest block mb-2">
                  EXPERIENCE OUR CAMPUS
                </span>
                <h3 className="text-2xl sm:text-4xl font-black mb-3">
                  SCHEDULE A CAMPUS TOUR
                </h3>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-6">
                  Visit our campuses in Karachi and experience our smart classrooms, science labs, friendly faculty, and dedicated playgrounds in person.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/watch?v=LNSZEZ0CSDk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#8B0000] font-black px-6 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-gray-100 transition shadow-lg text-xs sm:text-sm"
                >
                  <Video className="w-4 h-4 text-[#8B0000]" />
                  <span>WATCH VIRTUAL TOUR (YOUTUBE)</span>
                </a>
                <Link
                  href="/contact"
                  className="bg-red-950/70 hover:bg-red-950 text-white font-bold px-5 py-3.5 rounded-xl inline-flex items-center gap-1.5 transition text-xs sm:text-sm border border-white/20"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Visit Campuses</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Campuses in Karachi (from original campus.html) */}
      <section id="campus" className="py-20 bg-gray-100">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest block mb-1">
              LOCATIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#8B0000]">OUR CAMPUSES</h2>
            <p className="text-gray-600 text-sm mt-2">
              Visit us at any of our 3 locations across Karachi
            </p>
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-3xl shadow-xl p-3 mb-10 border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.123456789!2d67.123456789!3d24.987654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDU5JzE1LjYiTiA2N8KwMDcnMjQuNCJF!5e0!3m2!1sen!2sPK!4v1690000000000!5m2!1sen!2sPK"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            ></iframe>
          </div>

          {/* Campus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Campus 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#8B0000] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-[#8B0000] mb-1">Drusslum Society Campus</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4">
                  Fazal-e-Elahi Hospital ke samnay, Drusslum Society, Karachi
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Drusslum+Society+Fazal+E+Elahi+Hospital+Karachi"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8B0000] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-800 transition text-center shadow"
              >
                Get Directions
              </a>
            </div>

            {/* Campus 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#8B0000] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-[#8B0000] mb-1">Lucknow Society Campus</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4">
                  Shaq al Mandi Street, Lucknow Society, Karachi
                </p>
              </div>
              <a
                href="https://www.google.com/maps/place/Creek+View+Academy-Campus+1/@24.8212813,67.1170869,16.7z/data=!4m15!1m8!3m7!1s0x3eb33ba1aee34bcb:0xfaddd83ef1952179!2sLucknow+Society+Sector+31+E+Korangi,+Karachi,+Pakistan!3b1!8m2!3d24.8235551!4d67.1194406!16s%2Fg%2F1w0p42vl!3m5!1s0x3eb33ba03d0da437:0xbd499c127047c033!8m2!3d24.8207566!4d67.1186516!16s%2Fg%2F11bbrj6b9d?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8B0000] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-800 transition text-center shadow"
              >
                Get Directions
              </a>
            </div>

            {/* Campus 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#8B0000] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-[#8B0000] mb-1">Zaman Town Campus</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4">
                  Zaman Town, Karachi
                </p>
              </div>
              <a
                href="https://www.google.com/maps/place/Owais+Shaheed+Park/@24.8367255,67.1527152,18.14z/data=!4m15!1m8!3m7!1s0x3eb33a5060446437:0xb9e6deac2b0e67a!2sZaman+Town+Sector+35+A+Korangi,+Karachi,+Pakistan!3b1!8m2!3d24.8316222!4d67.1522097!16zL20vMDlueGgy!3m5!1s0x3eb33a45498d7b97:0x931e62ae64cd028f!8m2!3d24.8366786!4d67.155086!16s%2Fg%2F11gbwyn4z3?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8B0000] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-800 transition text-center shadow"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Parent Reviews (from original review.html) */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest block mb-1">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#8B0000]">WHAT PARENTS SAY</h2>
            <p className="text-gray-600 text-sm mt-2">
              Hear directly from guardians whose children thrive at Creek View Academy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl shadow-md p-8 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition"
              >
                <div>
                  <p className="text-5xl text-[#8B0000] font-serif leading-none mb-2">&ldquo;</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 font-normal">
                    {rev.review}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-red-200"
                    />
                    <div>
                      <h4 className="font-bold text-[#8B0000] text-sm">{rev.name}</h4>
                      <p className="text-xs text-gray-500">{rev.role}</p>
                    </div>
                  </div>
                  <div className="text-yellow-400 mt-2 text-sm flex gap-0.5">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action Strip */}
      <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white py-14 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black mb-4">
            Give Your Child the Gift of Quality Education
          </h2>
          <p className="text-white/85 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Admissions for 2026-27 are currently underway. Connect with us on WhatsApp or submit your online enquiry today!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/admissions"
              className="bg-white text-[#8B0000] font-black px-8 py-3.5 rounded-full shadow-xl hover:bg-gray-100 transition text-sm"
            >
              Apply Online Now
            </Link>
            <a
              href="https://wa.me/923126172674?text=Hello%20Creek%20View%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20admissions"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-7 py-3.5 rounded-full shadow-xl transition text-sm flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}


