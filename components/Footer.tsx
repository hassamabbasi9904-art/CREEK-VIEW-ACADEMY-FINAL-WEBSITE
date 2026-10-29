'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import {
  Phone, Mail, Clock, ArrowRight, CheckCircle,
  Facebook, Instagram, Youtube
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/academics', label: 'Academics & Wings' },
  { href: '/diary', label: 'Daily School Diary', highlight: 'text-yellow-300 font-semibold' },
  { href: '/blog', label: 'School Blog & News' },
  { href: '/admissions', label: 'Admission Process' },
  { href: '/student/login', label: 'Student Login', highlight: 'text-yellow-200' },
  { href: '/teacher/login', label: 'Teacher Login', highlight: 'text-red-200' },
];

const CAMPUSES = [
  { name: 'Drusslum Society Campus', address: 'Opp. Fazal-e-Elahi Hospital, Drusslum Society, Karachi', mapQuery: 'Drusslum+Society+Fazal+E+Elahi+Hospital+Karachi' },
  { name: 'Lucknow Society Campus', address: 'Shaq al Mandi Street, Lucknow Society, Karachi', mapQuery: 'Lucknow+Society+Shaq+al+Mandi+Street+Karachi' },
  { name: 'Zaman Town Campus', address: 'Zaman Town, Korangi, Karachi', mapQuery: 'Zaman+Town+Karachi' },
];

const SOCIALS = [
  { href: 'https://www.facebook.com/share/1FZPfQf1oi/', icon: Facebook, label: 'Facebook' },
  { href: 'https://www.instagram.com/popular/creek-view-karachi/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.youtube.com/watch?v=LNSZEZ0CSDk', icon: Youtube, label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#8B0000] text-white border-t-4 border-red-900 mt-auto">
      <div className="bg-[#680000] py-6 px-4 border-b border-white/10">
        <div className="max-w-[90%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-wide">Admissions Open for Session 2026-27!</h3>
            <p className="text-white/80 text-sm mt-0.5">Secure your child&apos;s future at Creek View Academy.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/admissions" className="bg-white text-[#8B0000] hover:bg-red-50 font-extrabold px-6 py-2.5 rounded-full text-sm shadow-lg transition">Apply Online Now</Link>
            <a href="https://wa.me/923126172674?text=Hello%20Creek%20View%20Academy" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-lg flex items-center gap-1.5">WhatsApp Us</a>
          </div>
        </div>
      </div>

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full p-1.5 shadow-lg flex items-center justify-center shrink-0">
                <img src="/assets/logo.png" alt="Creek View Academy" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://amazing-smakager-c23372.netlify.app/assets/logo.png'; }} />
              </div>
              <div>
                <h3 className="text-2xl font-black leading-none">CREEK VIEW</h3>
                <p className="text-xl font-bold tracking-wider text-red-200">ACADEMY</p>
              </div>
            </div>
            <p className="text-sm text-white/85 leading-relaxed">Nurturing minds. Shaping futures. A premier institution from Pre-Primary to Matriculation.</p>
            <div className="flex gap-2.5 pt-2">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#8B0000] transition">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider border-b border-white/20 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/85">
              {QUICK_LINKS.map(link => (
                <li key={link.href}><Link href={link.href} className={`hover:text-white hover:translate-x-1 inline-block transition ${link.highlight || ''}`}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider border-b border-white/20 pb-2">Our 3 Campuses</h4>
            <div className="space-y-3">
              {CAMPUSES.map((campus, i) => (
                <div key={campus.name} className="bg-white/5 p-2.5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                  <p className="font-bold text-white text-sm">{i + 1}. {campus.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">{campus.address}</p>
                  <a href={`https://maps.google.com/?q=${campus.mapQuery}`} target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:underline text-xs font-semibold mt-1 inline-block">Map Location →</a>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-extrabold text-sm uppercase tracking-wider border-b border-white/20 pb-2">Get In Touch</h4>
            <ul className="space-y-2.5 text-xs text-white/85">
              <li className="flex gap-2.5"><Phone className="w-4 h-4 text-red-200 shrink-0 mt-0.5" /><a href="tel:+923126172674" className="hover:text-white underline">+92 312 6172674</a></li>
              <li className="flex gap-2.5"><Mail className="w-4 h-4 text-red-200 shrink-0 mt-0.5" /><a href="mailto:info@creekviewacademy.edu.pk">info@creekviewacademy.edu.pk</a></li>
              <li className="flex gap-2.5"><Clock className="w-4 h-4 text-red-200 shrink-0 mt-0.5" />Mon - Sat: 8:00 AM - 2:00 PM</li>
            </ul>
            <div className="pt-2">
              {subscribed ? (
                <div className="bg-white/20 text-white text-xs p-2.5 rounded-lg flex items-center gap-2"><CheckCircle className="w-4 h-4 text-yellow-300" />Subscribed! Thank you.</div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email for alerts" required className="w-full px-3 py-2 text-xs rounded-l-lg text-gray-900 bg-white focus:outline-none" />
                  <button type="submit" className="bg-red-950 hover:bg-black text-white px-3 py-2 rounded-r-lg"><ArrowRight className="w-4 h-4" /></button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 bg-[#680000] py-4 px-4 text-center text-xs text-white/75">
        © {CURRENT_YEAR} Creek View Academy Karachi. All Rights Reserved.
      </div>
    </footer>
  );
}