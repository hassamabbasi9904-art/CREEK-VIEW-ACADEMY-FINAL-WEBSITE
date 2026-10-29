import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { connectToMongoDB } from '@/lib/mongodb.mjs';
import { TeacherModel } from '@/lib/models.mjs';
import {
  Award,
  BookOpen,
  Users,
  Target,
  Compass,
  CheckCircle2,
  School,
  GraduationCap,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export const dynamic = 'force-dynamic';

type PublicTeacher = {
  id: string;
  name?: string;
  designation?: string;
  campus?: string;
  subjects?: string[];
};

export default async function AboutPage() {
  let teachers: PublicTeacher[] = [];
  let facultyLoadFailed = false;

  try {
    await connectToMongoDB();
    teachers = await TeacherModel.find({ active: true })
      .select({ _id: 0, id: 1, name: 1, designation: 1, campus: 1, subjects: 1 })
      .sort({ name: 1 })
      .lean<PublicTeacher[]>();
  } catch (error) {
    console.error(
      'Unable to load faculty from MongoDB Atlas.',
      error instanceof Error ? error.name : 'Unknown error',
    );
    facultyLoadFailed = true;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white py-14 px-4 shadow-md">
        <div className="max-w-[90%] mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <School className="w-3.5 h-3.5 text-yellow-300" />
              <span>About Creek View Academy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Nurturing Minds. Shaping Futures.
            </h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Founded on the belief that every child possesses infinite potential, Creek View Academy provides world-class academics, strong moral values, and modern facilities in Karachi.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admissions"
              className="bg-white text-[#8B0000] hover:bg-gray-100 font-extrabold px-6 py-3 rounded-full shadow-lg transition text-sm"
            >
              Enroll Your Child
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[90%] mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-md border-t-4 border-[#8B0000]">
            <div className="w-12 h-12 bg-red-100 text-[#8B0000] rounded-2xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              To inspire a lifelong love for learning by offering rigorous academic programs, character-building values, and dynamic co-curricular activities. We nurture critical thinkers, articulate communicators, and compassionate citizens who lead with integrity.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-md border-t-4 border-[#8B0000]">
            <div className="w-12 h-12 bg-red-100 text-[#8B0000] rounded-2xl flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Our Vision</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              To be recognized as a benchmark institution of holistic education in Karachi, bridging modern scientific curiosity with time-tested ethical principles, and fostering students who excel on national and global stages.
            </p>
          </div>
        </div>

        {/* Principal's Message */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center">
              <div className="w-44 h-44 rounded-full overflow-hidden mx-auto shadow-xl border-4 border-[#8B0000]">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600"
                  alt="Principal"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mt-4">Sir Hassam & Leadership Team</h3>
              <p className="text-xs text-[#8B0000] font-semibold">Managing Board & Senior Faculty</p>
            </div>

            <div className="lg:col-span-8">
              <span className="text-xs font-bold text-[#8B0000] uppercase tracking-wider block mb-1">
                From The Principal&apos;s Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
                &ldquo;Education is not merely the accumulation of facts, but the ignition of intellect.&rdquo;
              </h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Dear Parents and Valued Guardians, Welcome to Creek View Academy. Choosing the right educational environment for your child is one of the most vital decisions you will ever make.
                </p>
                <p>
                  At Creek View Academy, we combine an enriched BSEK curriculum with modern digital tools, active sports, and individualized mentoring. Our newly introduced daily homework diary system ensures that parents and teachers work together seamlessly every single day.
                </p>
                <p>
                  We invite you to visit any of our three campuses in Drusslum Society, Lucknow Society, and Zaman Town to experience the vibrant learning atmosphere firsthand.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us 4 Pillars */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Why Families Choose Creek View</h2>
            <p className="text-gray-600 text-sm mt-1">Our pillars of educational excellence in Karachi</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 text-[#8B0000] rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">100% Board Results</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Consistent top grades and First Division results across Secondary Board examinations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 text-[#8B0000] rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">Qualified Faculty</h3>
              {facultyLoadFailed ? (
                <p className="text-xs text-gray-600 leading-relaxed" role="status">
                  Faculty information is temporarily unavailable.
                </p>
              ) : teachers.length === 0 ? (
                <p className="text-xs text-gray-600 leading-relaxed" role="status">
                  No faculty members are currently listed.
                </p>
              ) : (
                <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
                  {teachers.map((teacher) => (
                    <li key={teacher.id}>
                      <span className="font-semibold text-gray-900">
                        {teacher.name || 'Faculty Member'}
                      </span>
                      {teacher.designation ? ` — ${teacher.designation}` : ''}
                      {teacher.campus ? ` · ${teacher.campus}` : ''}
                      {teacher.subjects?.length ? ` · ${teacher.subjects.join(', ')}` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 text-[#8B0000] rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">3-Day Daily Diary</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Transparent daily tracking of homework, lesson notes, and teacher board photographs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 text-[#8B0000] rounded-xl flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">Affordable Quality</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Accessible fee structure coupled with merit-based scholarships for deserving students.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
