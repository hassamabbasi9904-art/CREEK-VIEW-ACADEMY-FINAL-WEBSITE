'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  ExternalLink,
  School,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    campus: 'Drusslum Society Campus',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare WhatsApp message
    const waText = `*New Contact Inquiry - Creek View Academy*\n\n` +
      `*Name*: ${formData.name}\n` +
      `*Phone*: ${formData.phone}\n` +
      `*Campus of Interest*: ${formData.campus}\n` +
      `*Subject*: ${formData.subject}\n` +
      `*Message*: ${formData.message}\n\n` +
      `Regards: Website Contact Form`;

    const encoded = encodeURIComponent(waText);
    const waUrl = `https://wa.me/923126172674?text=${encoded}`;

    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white py-14 px-4 shadow-md">
        <div className="max-w-[90%] mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Phone className="w-3.5 h-3.5 text-yellow-300" />
              <span>We Are Here To Assist You</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Contact Us & Visit Campuses
            </h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Have questions regarding admissions, fee structures, daily homework diaries, or campus tours? Reach out to our campus offices across Karachi.
            </p>
          </div>

          <a
            href="https://wa.me/923126172674?text=Hello%20Creek%20View%20Academy%2C%20I%20have%20an%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3.5 rounded-full shadow-lg transition flex items-center gap-2 text-sm shrink-0 border-2 border-emerald-400"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+92 312 6172674)</span>
          </a>
        </div>
      </section>

      {/* Main 3 Campuses Showcase */}
      <section className="max-w-[90%] mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">Our 3 Karachi Campuses</h2>
          <p className="text-gray-600 text-sm mt-1">Conveniently situated to serve families across the city</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Campus 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-[#8B0000] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-red-50 text-[#8B0000] rounded-xl flex items-center justify-center mb-4">
                <School className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">
                Drusslum Society Campus
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                Opposite Fazal-e-Elahi Hospital, Drusslum Society, Karachi
              </p>
              <div className="space-y-1.5 text-xs text-gray-500 mb-6">
                <p><strong>Wing:</strong> Pre-Primary, Primary & Middle</p>
                <p><strong>Timings:</strong> 8:00 AM - 1:30 PM</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Drusslum+Society+Fazal+E+Elahi+Hospital+Karachi"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#8B0000] text-white text-center py-2.5 rounded-xl text-xs font-bold hover:bg-red-800 transition flex items-center justify-center gap-1.5 shadow"
            >
              <MapPin className="w-3.5 h-3.5" />
              Get Google Map Directions
            </a>
          </div>

          {/* Campus 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-[#8B0000] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-red-50 text-[#8B0000] rounded-xl flex items-center justify-center mb-4">
                <School className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">
                Lucknow Society Campus
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                Shaq al Mandi Street, Lucknow Society, Karachi
              </p>
              <div className="space-y-1.5 text-xs text-gray-500 mb-6">
                <p><strong>Wing:</strong> Primary, Secondary & Matriculation</p>
                <p><strong>Timings:</strong> 8:00 AM - 2:00 PM</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Lucknow+Society+Shaq+al+Mandi+Street+Karachi"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#8B0000] text-white text-center py-2.5 rounded-xl text-xs font-bold hover:bg-red-800 transition flex items-center justify-center gap-1.5 shadow"
            >
              <MapPin className="w-3.5 h-3.5" />
              Get Google Map Directions
            </a>
          </div>

          {/* Campus 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-[#8B0000] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-red-50 text-[#8B0000] rounded-xl flex items-center justify-center mb-4">
                <School className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">
                Zaman Town Campus
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                Zaman Town, Korangi, Karachi
              </p>
              <div className="space-y-1.5 text-xs text-gray-500 mb-6">
                <p><strong>Wing:</strong> Comprehensive All Wings & Science Labs</p>
                <p><strong>Timings:</strong> 8:00 AM - 2:00 PM</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Zaman+Town+Karachi"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#8B0000] text-white text-center py-2.5 rounded-xl text-xs font-bold hover:bg-red-800 transition flex items-center justify-center gap-1.5 shadow"
            >
              <MapPin className="w-3.5 h-3.5" />
              Get Google Map Directions
            </a>
          </div>
        </div>

        {/* Interactive Contact Form & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Send an Official Inquiry</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-6">
              Fill out the details below. Our administrative desk will review and contact you on WhatsApp or phone.
            </p>

            {submitted && (
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-xl mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 font-semibold">
                  Thank you! Your inquiry was generated and sent. We will respond promptly.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Full Name: *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8B0000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone / Mobile (WhatsApp): *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0312-XXXXXXX"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8B0000] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Campus to Inquire:
                  </label>
                  <select
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8B0000] focus:outline-none font-medium"
                  >
                    <option value="Drusslum Society Campus">Drusslum Society Campus</option>
                    <option value="Lucknow Society Campus">Lucknow Society Campus</option>
                    <option value="Zaman Town Campus">Zaman Town Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Inquiry Type:
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8B0000] focus:outline-none font-medium"
                  >
                    <option value="Admissions 2026-27">Admissions 2026-27</option>
                    <option value="Fee Structure Inquiry">Fee Structure Inquiry</option>
                    <option value="Student Diary & Homework Help">Student Diary & Homework Help</option>
                    <option value="Campus Tour Booking">Campus Tour Booking</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Message / Query: *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8B0000] focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B0000] hover:bg-red-800 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit & Open in WhatsApp (+92 312 6172674)</span>
              </button>
            </form>
          </div>

          {/* Right Info Card & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#8B0000] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Official Contact Helpline</h3>
              <ul className="space-y-4 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Central Admissions Line:</span>
                    <a href="tel:+923126172674" className="hover:underline font-mono">
                      +92 312 6172674
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Official Correspondence:</span>
                    <a href="mailto:info@creekviewacademy.edu.pk" className="hover:underline">
                      info@creekviewacademy.edu.pk
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Visiting Hours:</span>
                    <span>Monday through Saturday, 8:00 AM - 2:00 PM</span>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-xs text-white/80">
                  For teacher portal accounts, password resets, or homework upload assistance, faculty members may contact the Administration Office directly.
                </p>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 p-2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.123456789!2d67.123456789!3d24.987654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDU5JzE1LjYiTiA2N8KwMDcnMjQuNCJF!5e0!3m2!1sen!2sPK!4v1690000000000!5m2!1sen!2sPK"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
