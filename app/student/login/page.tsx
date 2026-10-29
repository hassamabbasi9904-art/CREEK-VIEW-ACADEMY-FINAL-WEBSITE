'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, CheckCircle, School, Eye, EyeOff } from 'lucide-react';

const campuses = ['Darusslam Campus', 'Lucknow Campus', 'Zaman Town Campus'];
const classes = ['Nursery','KG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];

const CAMPUS_PASSWORDS: Record<string, string> = {
  'Darusslam Campus': 'darussalam1239',
  'Lucknow Campus': 'lucknow4560',
  'Zaman Town Campus': 'zaman1230',
};
const ADMIN_PASSWORD = 'admin.cva123';

export default function StudentLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'register'|'login'>('login');
  const [name,setName]=useState(''); const [rollNumber,setRollNumber]=useState(''); const [phone,setPhone]=useState(''); const [campus,setCampus]=useState(''); const [studentClass,setStudentClass]=useState(''); const [password,setPassword]=useState('');
  const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(()=>{ 
    fetch('/api/auth/student',{cache:'no-store'}).then(r=>r.json()).then(d=>{
      if(d.success) router.replace('/student/portal');
      else {
        const reg = window.localStorage.getItem('student_registered');
        if(reg !== 'true') setMode('register');
      }
    }).catch(()=>{});
  },[router]);

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setError(''); setLoading(true);
    try{
      if(mode === 'register'){
         if(!studentClass){ setError('Please select your class'); setLoading(false); return; }
         if(campus && password !== CAMPUS_PASSWORDS[campus] && password !== ADMIN_PASSWORD){
            setError(`Password galat hai!`); setLoading(false); return;
         }
      }
      const payload=mode==='register'?{action:'register',name,rollNumber,phone,campus,studentClass,password}:{action:'login',name,password};
      const res=await fetch('/api/auth/student',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await res.json();
      if(!res.ok||!data.success){setError(data.message||'Login failed.'); setLoading(false); return;}
      
      window.localStorage.setItem('student_registered','true');
      window.localStorage.setItem('student_campus', data.campus || campus);
      window.localStorage.setItem('student_class', data.studentClass || studentClass);
      window.localStorage.setItem('is_admin', data.isAdmin ? 'true' : 'false');
      setShowPopup(true);
      setTimeout(()=>{ router.push('/student/portal'); router.refresh(); }, 1200);
    }catch{setError('Server error.'); setLoading(false);}
  };

  const inputClass='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B0000] pr-12';
  const selectClass='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B0000]';

  return <div className="min-h-screen flex flex-col bg-gray-50"><Navbar/><main className="flex-1 flex items-center justify-center p-4 py-10"><div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border overflow-hidden"><div className="bg-[#8B0000] text-white p-8 text-center"><div className="w-14 h-14 bg-white text-[#8B0000] rounded-2xl mx-auto mb-3 flex items-center justify-center"><School className="w-8 h-8"/></div><h1 className="text-2xl font-black">{mode==='register'?'Student Registration':'Student Login'}</h1></div><form onSubmit={submit} className="p-7 space-y-4">
    {error&&<div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-sm text-red-700"><AlertCircle className="w-5 h-5 shrink-0"/>{error}</div>}
    {mode==='register'&&<><Field label="Child Name"><input required value={name} onChange={e=>setName(e.target.value)} className={selectClass} placeholder="Full name"/></Field><Field label="GR Number"><input required value={rollNumber} onChange={e=>setRollNumber(e.target.value)} className={selectClass} placeholder="GR No"/></Field><Field label="Phone"><input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className={selectClass} placeholder="03XXXXXXXXX"/></Field><div className="grid grid-cols-2 gap-3"><Field label="Campus"><select required value={campus} onChange={e=>setCampus(e.target.value)} className={selectClass}><option value="">Campus</option>{campuses.map(c=><option key={c}>{c}</option>)}</select></Field><Field label="Class"><select required value={studentClass} onChange={e=>setStudentClass(e.target.value)} className={selectClass}><option value="">Class</option>{classes.map(c=><option key={c}>{c}</option>)}</select></Field></div></>}
    {mode==='login'&&<Field label="Child Name"><input required value={name} onChange={e=>setName(e.target.value)} className={selectClass} placeholder="Registered name"/></Field>}
    <Field label="Password"><div className="relative"><input required type={showPass ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} className={inputClass} placeholder="Campus password"/><button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><span>{showPass ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</span></button></div></Field>
    <button disabled={loading} className="w-full bg-[#8B0000] text-white font-extrabold py-3.5 rounded-xl">{loading?'Please wait...':mode==='register'?'Register & Open Diary':'Login'}</button>
    <p className="text-center text-sm text-gray-600">{mode==='register'?'Already registered?':'First time?'} <button type="button" onClick={()=>setMode(mode==='register'?'login':'register')} className="text-[#8B0000] font-bold underline">{mode==='register'?'Login here':'Register here'}</button></p>
  </form></div></main><Footer/>
  {showPopup && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-[28px] p-8 max-w-sm w-full text-center shadow-2xl"><div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"><CheckCircle className="w-10 h-10 text-green-600"/></div><h2 className="text-2xl font-black">Login Successful!</h2><p className="text-gray-600 mt-1 text-sm">Diary open ho rahi hai...</p></div></div>}
  </div>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1.5">{label}</span>{children}</label>}