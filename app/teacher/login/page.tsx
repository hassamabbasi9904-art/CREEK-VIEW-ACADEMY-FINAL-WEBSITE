'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, Phone, User, Briefcase, Building, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const campuses = ['Darusslam Campus', 'Lucknow Campus', 'Zaman Town Campus'];
const ADMIN_PASSWORD = 'admin.cva123';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', designation: '', phone: '', campus: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    fetch('/api/auth/teacher', { cache: 'no-store' }).then(r => r.json()).then(d => { if (d.success) router.replace('/teacher/dashboard'); }).catch(() => { });
  }, [router]);

  useEffect(() => {
    if (formData.password === ADMIN_PASSWORD) {
      setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
    }
  }, [formData.password]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (formData.password === ADMIN_PASSWORD) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('is_admin', 'true');
          localStorage.setItem('teacher_name', formData.name || 'Admin');
          localStorage.setItem('teacher_campus', 'ALL CAMPUSES');
        }
        await fetch('/api/auth/teacher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, campus: 'ALL CAMPUSES', role: 'admin', is_admin: true })
        });
        router.push('/teacher/dashboard');
        router.refresh();
        return;
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('is_admin');
        localStorage.setItem('teacher_campus', formData.campus);
      }
      const res = await fetch('/api/auth/teacher', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message || 'Login failed. Check campus password.'); return; }
      router.push('/teacher/dashboard');
      router.refresh();
    } catch { setError('Could not connect to the server.'); } finally { setLoading(false); }
  };

  return <div className="min-h-screen bg-gray-50 flex flex-col"><Navbar />
    <main className="flex-1 flex items-center justify-center p-4 py-10">
      <div className="bg-white rounded-[28px] shadow-xl border w-full max-w-lg overflow-hidden">
        <div className={`text-white p-7 text-center transition-all ${isAdminMode ? 'bg-black' : 'bg-[#8B0000]'}`}>
          <h1 className="text-2xl font-black flex items-center justify-center gap-2">
            {isAdminMode ? <ShieldCheck className="w-7 h-7 text-yellow-400" /> : null}
            {isAdminMode ? 'Admin Portal Login' : 'Teacher Portal Login'}
          </h1>
          <p className="text-sm text-white/80 mt-1">
            {isAdminMode ? 'Admin access - All 3 campuses' : 'Use your campus password'}
          </p>
        </div>

        <form onSubmit={submit} className="p-7 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-[14px] text-red-700 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}
          {isAdminMode && <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-xl text-[14px] text-yellow-800 flex gap-2 font-semibold"><ShieldCheck className="w-4 h-4" />Admin password detected - You will get access to all campuses</div>}

          <Field label="Full Name"><input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="field-input" placeholder={isAdminMode ? "Admin Name" : "Teacher full name"} /></Field>
          <Field label="Designation"><input required value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} className="field-input" placeholder={isAdminMode ? "Administrator" : "e.g. Class Teacher"} /></Field>
          <Field label="Phone Number"><input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="field-input" placeholder="03XXXXXXXXX" /></Field>

          {!isAdminMode ? (
            <Field label="Campus"><select required value={formData.campus} onChange={e => setFormData({ ...formData, campus: e.target.value })} className="field-input bg-white"><option value="">Select campus</option>{campuses.map(c => <option key={c}>{c}</option>)}</select></Field>
          ) : (
            <Field label="Campus Access"><input readOnly value="ALL CAMPUSES (Admin)" className="field-input bg-yellow-50 font-bold" /></Field>
          )}

          <Field label={isAdminMode ? "Admin Password" : "Campus Password"}><input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className={`field-input ${isAdminMode ? 'border-black ring-2 ring-yellow-400' : ''}`} placeholder={isAdminMode ? "Admin password active" : "Enter your campus password"} /></Field>


          <button disabled={loading} className={`w-full text-white font-bold py-3.5 rounded-full flex justify-center items-center gap-2 disabled:opacity-50 transition-all text-[15px] ${isAdminMode ? 'bg-black hover:bg-gray-900' : 'bg-[#8B0000] hover:bg-[#a00000]'}`}>
            {loading ? 'Please wait...' : isAdminMode ? 'Login as Admin' : 'Login & Open Teacher Portal'}<ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main><Footer />
    <style jsx>{`
  .icon{
    position:absolute;
    left:14px;
    top:50%;
    transform:translateY(-50%);
    width:18px;
    height:18px;
    color:#6b7280;
    pointer-events:none;
    z-index:10;
  }
  .field-input{
    width:100%;
    height:52px;
    padding-left:44px;
    padding-right:16px;
    border:1.5px solid #d1d5db;
    border-radius:9999px;
    font-size:15px;
    font-weight:600;
    color:#111827;
    background:white;
    outline:none;
  }
  .field-input:focus{
    border-color:#8B0000;
    box-shadow:0 0 0 3px rgba(139,0,0,0.08);
  }
 `}</style>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block relative">
    {/* YAHAN LABEL BARA KIYA */}
    <span className="block text-[15px] font-bold text-gray-800 mb-2.5 ml-1 tracking-wide">
      {label} <span className="text-red-600">*</span>
    </span>
    <div className="relative flex items-center">
      {children}
    </div>
  </label>
}