'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  BookOpen,
  GraduationCap,
  FlaskConical,
  Laptop,
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight,
  School
} from 'lucide-react';

export default function AcademicsPage() {
  const wings = [
    {
      title: 'Pre-Primary Wing (Montessori / Early Childhood)',
      grades: 'Playgroup, Nursery & Kindergarten (KG-1 & KG-2)',
      motto: 'Play. Explore. Discover.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600',
      description: 'Focuses on early phonics, sensory learning, creative art, and social interaction in a warm, child-friendly environment.',
      subjects: ['English Phonics', 'Urdu Haroof-e-Tahajji', 'Early Numeracy', 'General Knowledge', 'Rhymes & Arts'],
    },
    {
      title: 'Primary School Wing',
      grades: 'Class 1 through Class 5',
      motto: 'Build. Explore. Discover.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600',
      description: 'Strengthens foundational literacy, analytical mathematics, basic sciences, and Islamic values.',
      subjects: ['Mathematics', 'English Language & Literature', 'Urdu', 'General Science', 'Social Studies', 'Islamiat', 'Computer'],
    },
    {
      title: 'Middle School Wing',
      grades: 'Class 6 through Class 8',
      motto: 'Learn. Engage. Excel.',
      image: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=600',
      description: 'Prepares students for secondary board rigor through critical thinking, experimental lab tasks, and speech competitions.',
      subjects: ['Algebra & Geometry', 'General Science (Physics, Bio, Chem basics)', 'English Grammar & Composition', 'Urdu Adab', 'Computer Science', 'Islamiat'],
    },
    {
      title: 'Secondary Wing (Matriculation)',
      grades: 'Class 9 & Class 10 (BSEK Board)',
      motto: 'Focus. Achieve. Lead.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600',
      description: 'Specialized preparation for Board of Secondary Education Karachi with dedicated laboratory practicals and mock exam drills.',
      subjects: ['Physics', 'Chemistry', 'Biology / Computer Science', 'Mathematics', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'],
    },
    {
      title: 'Senior Secondary / Intermediate',
      grades: 'Class 11 & Class 12 (Pre-Engineering, Pre-Medical, Computer)',
      motto: 'Prepare. Perform. Succeed.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600',
      description: 'Advanced college-level instruction empowering future engineers, doctors, software developers, and professionals.',
      subjects: ['Pre-Medical (Biology, Chem, Physics)', 'Pre-Engineering (Maths, Chem, Physics)', 'Computer Science (Programming, Stats, Maths)'],
    },
    {
      title: 'Modern Library & Resource Center',
      grades: 'All Classes (Nursery to 12)',
      motto: 'Read. Imagine. Discover.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600',
      description: 'Extensive repository of over 5,000 academic titles, reference encyclopedias, Islamic literature, and digital e-learning stations.',
      subjects: ['Reference Reading', 'Literary Clubs', 'Quiet Study Rooms', 'Digital Research Terminals'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white py-14 px-4 shadow-md">
        <div className="max-w-[93%] mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Comprehensive Curriculum</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Academic Wings & Curriculum
            </h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              From foundational early-childhood Montessori exploration to Board of Secondary Education Karachi (BSEK) matriculation excellence.
            </p>
          </div>

          <Link
            href="/diary"
            className="bg-white text-[#8B0000] hover:bg-gray-100 font-extrabold px-6 py-3 rounded-full shadow-lg transition text-sm flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>View Daily Homework Diary</span>
          </Link>
        </div>
      </section>

      {/* Main Content Wings */}
      <main className="max-w-[94%] mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-gray-900">Academic Structure</h2>
          <p className="text-gray-600 text-sm mt-1">
            Progressive developmental stages tailored for every milestone in your child&apos;s educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wings.map((wing, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition flex flex-col"
            >
              <div className="relative h-52 w-full">
                <img
                  src={wing.image}
                  alt={wing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#8B0000] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                  {wing.grades}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">{wing.title}</h3>
                  <p className="text-xs font-bold text-[#8B0000] mb-3">{wing.motto}</p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {wing.description}
                  </p>

                  <div className="space-y-1.5 mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Key Subjects Covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {wing.subjects.map((sub, sIdx) => (
                        <span key={sIdx} className="text-[11px] bg-red-50 text-[#8B0000] px-2 py-0.5 rounded font-medium">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href="/admissions"
                    className="text-xs text-[#8B0000] font-bold hover:underline flex items-center gap-1"
                  >
                    Apply for this wing <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/diary?grade=${encodeURIComponent(wing.grades.split(',')[0])}`}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    Check Diary
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Co-Curricular & Facilities Banner */}
        <div className="bg-[#8B0000] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest block mb-1">Beyond The Classroom</span>
            <h2 className="text-2xl sm:text-4xl font-black mb-4">Co-Curricular & Character Development</h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6">
              True education transcends textbooks. At Creek View Academy, our students actively take part in Naat & Qirat competitions, Urdu & English debates, inter-school cricket tournaments, science fairs, and annual stage dramas.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-2xl font-black text-yellow-300">50+</p>
                <p className="text-xs text-white/80">Smart Classrooms</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-2xl font-black text-yellow-300">10+</p>
                <p className="text-xs text-white/80">Science & IT Labs</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-2xl font-black text-yellow-300">3</p>
                <p className="text-xs text-white/80">Campuses in Karachi</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-2xl font-black text-yellow-300">100%</p>
                <p className="text-xs text-white/80">Matric 1st Division</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
