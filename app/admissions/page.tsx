'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  GraduationCap,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  Phone,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  Building
} from 'lucide-react';

// YAHAN PRINCIPAL KE ASAL NUMBER DAL DO
const CAMPUSES = [
  { id: 'darusslam', name: 'Darusslam Campus', principal: 'Principal Darusslam Campus', whatsapp: '923715613330' },
  { id: 'lucknow', name: 'Lucknow Campus', principal: 'Principal Lucknow Campus', whatsapp: '923715616660' },
  { id: 'zaman', name: 'Zaman Town Campus', principal: 'Principal Zaman Town Campus', whatsapp: '923700837881' },
];

export default function AdmissionsPage() {
  const [formData, setFormData] = useState({
    student_name: '',
    dob: '',
    gender: 'Male',
    class: 'Class 1 - 5',
    campus: '', // LAZMI FIELD
    father_name: '',
    mother_name: '',
    mobile: '',
    sibling_student: 'No',
    address: '',
    prev_school: '',
    last_class: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [campusError, setCampusError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.campus) {
      setCampusError('Please select a campus.');
      document.getElementById('campus-select')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setCampusError('');

    const selectedCampus = CAMPUSES.find(c => c.id === formData.campus);
    if (!selectedCampus) return;

    let message = `*New Admission Enquiry - ${selectedCampus.name}*\n`;
    message += `*To: ${selectedCampus.principal}*\n\n`;
    message += `*CAMPUS SELECTED*: ${selectedCampus.name} *\n\n`;
    message += `*STUDENT NAME*: ${formData.student_name}\n`;
    message += `*DATE OF BIRTH*: ${formData.dob}\n`;
    message += `*GENDER*: ${formData.gender}\n`;
    message += `*APPLYING FOR CLASS*: ${formData.class}\n\n`;
    message += `*FATHER NAME*: ${formData.father_name}\n`;
    message += `*MOTHER NAME*: ${formData.mother_name}\n`;
    message += `*MOBILE*: ${formData.mobile}\n`;
    message += `*SIBLING*: ${formData.sibling_student}\n`;
    message += `*ADDRESS*: ${formData.address}\n\n`;
    if (formData.prev_school) message += `*PREVIOUS SCHOOL*: ${formData.prev_school}\n`;
    if (formData.last_class) message += `*LAST CLASS*: ${formData.last_class}\n\n`;
    message += `Creek View Academy`;

    const encoded = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${selectedCampus.whatsapp}?text=${encoded}`;

    window.open(whatsappURL, '_blank');
    setSubmitted(true);
  };

  const selectedCampusInfo = CAMPUSES.find(c => c.id === formData.campus);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white py-14 px-4">
        <div className="max-w-[90%] mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-yellow-300" /> Session 2026-2027
            </div>
            <h1 className="text-xl sm:text-5xl font-black">Admission Enquiry Form</h1>
            <p className="text-white/85 text-sm mt-2">Please fill out the complete form.</p>
          </div>

        </div>
      </section>

      <main className="max-w-[95%] mx-auto px-4 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl border p-6 sm:p-10">
            <div className="mb-8 pb-4 border-b">
              <h2 className="text-2xl font-black">Online Registration Form</h2>
              <p className="text-sm text-gray-600 mt-1">Please Select Campus:</p>
            </div>

            {submitted && selectedCampusInfo && (
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-xl mb-8 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <div className="text-sm text-green-900">
                  <strong>Form Sent to {selectedCampusInfo.name}!</strong><br />
                  WhatsApp has opened for {selectedCampusInfo.principal} ({selectedCampusInfo.whatsapp}). Please send your enquiry.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* CAMPUS SELECT - LAZMI */}
              <div id="campus-select" className="">
                <h3 className="text-base font-black text-[#8B0000] mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5" /> Select Campus
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CAMPUSES.map((campus) => (
                    <label key={campus.id} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-1 transition-all ${formData.campus === campus.id ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-lg' : 'bg-white border-gray-300 hover:border-[#8B0000]'}`}>
                      <input
                        type="radio"
                        name="campus"
                        value={campus.id}
                        checked={formData.campus === campus.id}
                        onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                        className="hidden"
                      />
                      <span className="font-black text-md">{campus.name}</span>
                      <span className={`text-[12px] ${formData.campus === campus.id ? 'text-red-200' : 'text-gray-500'}`}>{campus.principal}</span>
                      {formData.campus === campus.id && <span className="text-[11px] bg-white/20 rounded px-2 py-0.5 mt-1 w-fit">✓ Selected</span>}
                    </label>
                  ))}
                </div>
                {campusError && <div className="mt-3 flex items-center gap-2 text-red-700 text-xs font-bold bg-red-100 p-2 rounded"><AlertCircle className="w-4 h-4" />{campusError}</div>}
                {selectedCampusInfo && <p className="text-xs mt-2 text-green-700 font-bold"> {selectedCampusInfo.principal} - {selectedCampusInfo.whatsapp}</p>}
              </div>

              {/* Student Details */}
              <div>
                <h3 className="text-lg font-black text-[#8B0000] mb-4 border-b pb-2">1. Student Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold uppercase">Student Name *</label><input required value={formData.student_name} onChange={e => setFormData({ ...formData, student_name: e.target.value })} placeholder="Abdullah Khan" className="w-full border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1" /></div>

                  <div><label className="text-xs font-bold uppercase">Date of Birth *</label><input required type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1" /></div>
                  <div><label className="text-xs font-bold uppercase">Gender *</label><select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1"><option>Male</option><option>Female</option></select></div>

                  <div><label className="text-xs font-bold uppercase">Class *</label><select value={formData.class} onChange={e => setFormData({ ...formData, class: e.target.value })} className="w-full border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1 font-semibold text-[#8B0000]">
                    <option>Play Group</option>
                    <option>Pre Nur</option>
                    <option>Nur</option>
                    <option>KG</option>
                    <option>Class 1</option>
                    <option>Class 2</option>
                    <option>Class 3</option>
                    <option>Class 4</option>
                    <option>Class 5</option>
                    <option>Class 6</option>
                    <option>Class 7</option>
                    <option>Class 8</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                    </select></div>
                </div>
              </div>

              {/* Parent */}
              <div>
                <h3 className="text-lg font-black text-[#8B0000] mb-4 border-b pb-2">2. Parent Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold uppercase">Father Name *</label><input required value={formData.father_name} onChange={e => setFormData({ ...formData, father_name: e.target.value })} className="w-full border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1" /></div>
                  <div><label className="text-xs font-bold uppercase">Mother Name *</label><input required value={formData.mother_name} onChange={e => setFormData({ ...formData, mother_name: e.target.value })} className="w-full border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1" /></div>
                  <div><label className="text-xs font-bold uppercase">Mobile *</label><input required type="tel" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="0312-XXXXXXX" className="w-full border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1" /></div>
                  <div><label className="text-xs font-bold uppercase">Sibling?</label><input required value={formData.sibling_student} onChange={e => setFormData({ ...formData, sibling_student: e.target.value })} placeholder="No / Yes - Class" className="w-full  border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1" /></div>
                  <div className="md:col-span-2"><label className="text-xs font-bold uppercase">Address *</label><textarea required rows={2} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border-[#8B0000] border-2 rounded-xl px-4 py-2.5 text-sm mt-1"></textarea></div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="submit" className="bg-[#8B0000] hover:bg-red-800 text-white font-black text-sm px-10 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 mx-auto">
                  <MessageCircle className="w-5 h-5" />
                  {selectedCampusInfo ? `SEND TO ${selectedCampusInfo.name.toUpperCase()}` : ' ADMISSION SUBMIT'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white  rounded-3xl p-6 shadow-md border">
              <h3 className="font-bold text-red-800 mb-3">Campus Wise Numbers</h3>
              <ul className="space-y-2 text-xs">
                {CAMPUSES.map(c => (
                  <li key={c.id} className="flex justify-between border-b pb-2"><span className="font-bold">{c.name}</span><span className="font-mono">{c.whatsapp}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer /><BackToTop />
    </div>
  );
}