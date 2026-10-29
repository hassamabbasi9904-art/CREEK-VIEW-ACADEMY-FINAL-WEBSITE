'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, Mail, Calendar, Lock, GraduationCap, UserCheck, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'ACADEMICS', href: '/academics' },
    { name: 'BLOG & NEWS', href: '/blog' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  useEffect(() => {
    const localAuth = typeof window !== 'undefined' ? localStorage.getItem('teacher_auth') === 'true' : false;
    if (localAuth) { setIsTeacherLoggedIn(true); return; }
    fetch('/api/auth/teacher', { cache: 'no-store' }).then(r => setIsTeacherLoggedIn(r.ok)).catch(() => setIsTeacherLoggedIn(false));
  }, [pathname]);

  const isActive = (h: string) => h === '/' ? pathname === '/' : pathname.startsWith(h);

  return (
    <>
      {/* Top Bar - bilkul image jaisa */}
      <div className="bg-[#9c0b0b] text-white py-2.5 px-4">
        <div className="max-w-[90%] mx-auto flex justify-between items-center text-[13px]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +92 3715613330</span>
            <span className="hidden md:flex items-center gap-2"><Mail className="w-4 h-4" /> info@creekviewacademy.edu.pk</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/diary" className="hidden md:flex items-center gap-1.5 bg-[#7a0a0a]/60 border border-white/10 px-3 py-1 rounded-full text-[12px]"> 
              <Calendar className="w-3.5 h-3.5" /> Roznamcha / Student Diary
            </Link>
            <button onClick={() => router.push(isTeacherLoggedIn ? '/teacher/dashboard' : '/teacher/login')} className="flex items-center gap-1.5 border border-white/20 bg-[#7a0a0a]/60 px-4 py-1 rounded-full text-[12px] font-bold">
              <Lock className="w-3.5 h-3.5 text-yellow-300" /> Teacher Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Pill - NO WRAP FIX */}
      <div className="bg-white py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[95%] mx-auto px-4">
          <div className="bg-[#a10b0b] rounded-full h-[72px] px-6 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center">
                <img src="/assets/logo.png" alt="logo" className="w-full h-full object-contain" onError={e => (e.target as any).src='https://amazing-smakager-c23372.netlify.app/assets/logo.png'} />
              </div>
              <div className="text-white leading-none">
                <div className="font-black text-[22px] leading-[20px]">CREEK VIEW</div>
                {/* <div className="font-black text-[18px] leading-[18px]"></div> */}
                <div className="text-[18px] font-bold tracking-wider">ACADEMY</div>
              </div>
            </Link>

            {/* Links - whitespace-nowrap se tootega nahi */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-white font-bold text-[14px] tracking-wide">
              {navLinks.map(l => (
                <Link key={l.name} href={l.href} className={`whitespace-nowrap hover:opacity-80 ${isActive(l.href) ? 'underline underline-offset-8' : ''}`}>
                  {l.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/admissions" className="hidden lg:flex bg-white text-[#9c0b0b] font-black px-6 py-2.5 rounded-full text-[14px] items-center gap-2">
                <GraduationCap className="w-4 h-4" /> ADMISSIONS
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white p-2">
                {mobileMenuOpen ? <X /> : <Menu />}
                
              </button>
            </div>
          </div>
        </div>

        {/* Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#9c0b0b] mx-4 mt-3 rounded-2xl p-4 text-white">
            {navLinks.map(l => (
              <Link key={l.name} href={l.href} onClick={() => setMobileMenuOpen(false)} className="flex justify-between py-2.5 border-b border-white/10 last:border-0">
                <span>{l.name}</span><ChevronRight className="w-4 h-4" />
              </Link>
            ))}
            <Link href="/admissions" onClick={() => setMobileMenuOpen(false)} className="mt-3 bg-white text-[#9c0b0b] py-2.5 rounded-xl font-black text-center block">ADMISSIONS</Link>
          </div>
        )}
      </div>
    </>
  );
}