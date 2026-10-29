'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CalendarDays, LogOut, RefreshCw, School, UserRound, MapPin, Filter, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

type Student = { id:string; rollNumber:string; name:string; grade:string; section:string; campus:string; guardianName:string; studentClass?: string };
type Entry = { id:string; date:string; grade:string; section?:string; subject:string; campus:string; teacherName:string; teacherDesignation?:string; title:string; homeworkText:string; imageUrl?:string; class?: string };

const allClasses = ['Nursery','KG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];
const allCampuses = ['Darusslam Campus', 'Lucknow Campus', 'Zaman Town Campus'];

export default function StudentPortalPage() {
  const router = useRouter(); 
  const [student,setStudent]=useState<Student|null>(null); 
  const [entries,setEntries]=useState<Entry[]>([]); 
  const [loading,setLoading]=useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterCampus, setFilterCampus] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [studentCampus, setStudentCampus] = useState('');

  const load=async()=>{ 
    setLoading(true); 
    try { 
      const me=await fetch('/api/auth/student',{cache:'no-store'}); 
      const md=await me.json(); 
      if(!md.success){router.push('/student/login');return;} 
      setStudent(md.student); 
      if(typeof window !== 'undefined'){
        setIsAdmin(localStorage.getItem('is_admin') === 'true');
        setStudentCampus(localStorage.getItem('student_campus') || md.student?.campus || '');
      }
      const r=await fetch('/api/diary?student=1',{cache:'no-store'}); 
      const d=await r.json(); 
      if(d.success) setEntries(d.entries||[]); 
    } finally {setLoading(false);} 
  };

  useEffect(()=>{load();},[]);
  
  const logout=async()=>{
    await fetch('/api/auth/student',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logout'})});
    if(typeof window !== 'undefined'){
      localStorage.removeItem('is_admin');
      localStorage.removeItem('student_campus');
      localStorage.removeItem('student_class');
    }
    router.push('/student/login'); router.refresh();
  };

  const finalList = useMemo(()=>{
    return entries.filter(e => {
      if(!isAdmin){
        if(studentCampus && e.campus !== studentCampus) return false;
      } else {
        if(filterCampus && e.campus !== filterCampus) return false;
      }
      if(filterDate && e.date !== filterDate) return false;
      if(filterClass){
        const entryClass = e.grade || (e as any).class || '';
        if(!entryClass.toLowerCase().includes(filterClass.toLowerCase())) return false;
      }
      return true;
    });
  }, [entries, filterDate, filterClass, filterCampus, isAdmin, studentCampus]);

  const clearFilters = () => {
    setFilterDate(''); setFilterClass('');
    if(isAdmin) setFilterCampus('');
  };

  return <div className="min-h-screen flex flex-col bg-gray-50"><Navbar />
  <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white py-9 px-4">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-5 md:items-center">
      <div>
        <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <School className="w-3.5 h-3.5 text-yellow-300"/> {isAdmin ? 'ADMIN - All Campuses' : 'Secure Student Session'}
        </div>
        <h1 className="text-3xl font-black">Welcome, {student?.name || 'Student'}</h1>
        <p className="text-white/80 text-sm mt-1">{isAdmin ? 'Viewing all 3 campuses' : `Campus: ${studentCampus} | Class: ${student?.grade || 'All'}`}</p>
      </div>
      <button onClick={logout} className="bg-black/25 hover:bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-2 self-start"><LogOut className="w-4 h-4"/> Sign Out</button>
    </div>
  </section>

  <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-7">
      {[
        [<UserRound className="w-5 h-5"/>,'Student',student?.name],
        [<BookOpen className="w-5 h-5"/>,'Class',`${student?.grade || ''}${student?.section ? ` (${student.section})`:''}`],
        [<MapPin className="w-5 h-5"/>,'Campus', isAdmin ? 'ALL (Admin)' : studentCampus],
        [<CalendarDays className="w-5 h-5"/>,'Showing',`${finalList.length} diaries`]
      ].map((x,i)=><div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"><div className="text-[#8B0000] mb-2">{x[0]}</div><p className="text-[11px] uppercase font-black tracking-wider text-gray-500">{x[1]}</p><p className="text-sm font-bold text-gray-900 mt-1">{x[2]}</p></div>)}
    </div>

    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      {/* SINGLE PREMIUM HEADER + FILTER */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#c00000] flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white"/>
            </div>
            <div>
              <h2 className="font-black text-[22px] leading-none text-gray-900 tracking-tight">{isAdmin ? 'All Campuses Diary' : 'My Campus Diary'}</h2>
              <p className="text-[13px] text-gray-500 mt-1.5 font-medium">{isAdmin ? 'Showing diaries from all 3 campuses' : 'Showing all diaries from your campus'}</p>
            </div>
          </div>
          <button onClick={load} className="h-fit bg-white border border-gray-200 hover:bg-gray-50 text-[#8B0000] text-xs font-black px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
            <RefreshCw className="w-4 h-4"/> Refresh
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-[20px] border border-gray-200 p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2 pr-2">
              <div className="w-8 h-8 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                <Filter className="w-4 h-4 text-[#8B0000]"/>
              </div>
              <span className="text-sm font-black text-gray-800">Filters</span>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">DATE</label>
              <div className="relative group">
                <CalendarDays className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000]"/>
                <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]"/>
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">CLASS</label>
              <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20">
                <option value="">All Classes</option>{allClasses.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {isAdmin && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">CAMPUS</label>
                <select value={filterCampus} onChange={e=>setFilterCampus(e.target.value)} className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20">
                  <option value="">All Campuses</option>{allCampuses.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            <button onClick={clearFilters} className="bg-[#8B0000] hover:bg-[#a00000] text-white rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2 shadow-[0_4px_12px_rgba(139,0,0,0.3)]">
              <X className="w-4 h-4"/> Clear
            </button>
          </div>
        </div>
      </div>

      {loading?<div className="p-12 text-center text-sm text-gray-500">Loading your diary...</div>:finalList.length===0?<div className="p-12 text-center"><BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3"/><p className="font-bold text-gray-700">No diary found for this filter.</p><p className="text-xs text-gray-500 mt-1">Clear filters and try again.</p></div>:<div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">{finalList.map(e=><article key={e.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5"><div className="flex justify-between gap-3"><div><span className="inline-block text-[10px] font-black bg-[#8B0000] text-white px-2 py-1 rounded">{e.subject} • {e.grade}</span><h3 className="font-extrabold text-gray-900 mt-2">{e.title}</h3><span className="text-[10px] bg-white border px-2 py-0.5 rounded mt-1 inline-block">{e.campus}</span></div><span className="text-[10px] font-bold bg-white border rounded-lg px-2 py-1 h-fit">{e.date}</span></div><p className="text-sm text-gray-700 leading-relaxed mt-3 whitespace-pre-wrap">{e.homeworkText}</p>{e.imageUrl&&<img src={e.imageUrl} alt="Diary" className="mt-4 rounded-xl max-h-64 w-full object-cover"/>}<div className="mt-4 text-[11px] text-gray-500">Posted by <strong>{e.teacherName}</strong></div></article>)}</div>}
    </div>
    <div className="mt-6 flex gap-3"><Link href="/diary" className="text-sm font-bold text-[#8B0000] hover:underline">Open public diary</Link><Link href="/" className="text-sm font-bold text-gray-600 hover:underline">Back to website</Link></div>
  </main><Footer/><BackToTop/></div>;
}