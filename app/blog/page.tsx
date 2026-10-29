'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
  Share2,
  X,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: 'Campus News' | 'Academic Excellence' | 'Sports & Events' | 'Parenting & Study Tips';
  author: string;
  role: string;
  date: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [

];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  useEffect(() => { fetch('/api/blog', { cache: 'no-store' }).then(r => r.json()).then(d => { if (d.success && Array.isArray(d.posts)) { const mapped = d.posts.map((p: any) => ({ ...p, content: Array.isArray(p.content) ? p.content : [String(p.content || '')], tags: Array.isArray(p.tags) ? p.tags : [], category: p.category || 'Campus News', author: p.author || 'Teacher', role: p.role || 'Teacher', date: p.date || '', readTime: p.readTime || '1 min read', imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800' })); setPosts([...mapped, ...blogPosts]); } }).catch(() => {}); }, []);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = [
    'ALL',
    'Campus News',
    'Academic Excellence',
    'Sports & Events',
    'Parenting & Study Tips',
  ];

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== 'ALL' && post.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white py-14 px-4 shadow-md">
        <div className="max-w-[90%] mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-yellow-300" />
              <span>Campus Chronicle & Insights</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              School Blog & News
            </h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Stay updated with academic achievements, school notifications, co-curricular highlights, and educational insights from Creek View Academy.
            </p>
          </div>

          <Link
            href="/admissions"
            className="bg-white text-[#8B0000] hover:bg-gray-100 font-extrabold px-6 py-3 rounded-full shadow-lg transition text-sm shrink-0 border-2 border-white"
          >
            Admissions 2026-27 Open
          </Link>
        </div>
      </section>

      {/* Filters and Search Bar */}
      <section className="max-w-[94%] mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#8B0000] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'All Articles' : cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search news, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#8B0000] focus:outline-none"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition transform group-hover:scale-105 duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#8B0000] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8B0000]" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#8B0000] transition leading-snug mb-2.5">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-red-50 text-[#8B0000] px-2 py-0.5 rounded-md font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">By {post.author}</span>
                    <span className="text-[#8B0000] font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                      Read Article <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Detail Modal */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActivePost(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl border-2 border-red-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-80 w-full">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="bg-[#8B0000] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {activePost.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow">
                  {activePost.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-gray-200 text-xs text-gray-600 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-[#8B0000] font-bold flex items-center justify-center">
                    {activePost.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">{activePost.author}</span>
                    <span className="text-[11px] text-gray-500">{activePost.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span>{activePost.date}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                </div>
              </div>

              {/* Body paragraphs */}
              <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                {activePost.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Tags and share */}
              <div className="pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {activePost.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-red-50 text-[#8B0000] font-bold px-2.5 py-1 rounded-lg"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setActivePost(null)}
                  className="bg-[#8B0000] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-red-800 transition"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}
