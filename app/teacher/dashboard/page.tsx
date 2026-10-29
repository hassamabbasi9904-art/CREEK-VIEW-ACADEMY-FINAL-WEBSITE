'use client';
import React,{useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {LogOut,BookOpen,Newspaper,School, CheckCircle, AlertCircle, Calendar, Image as ImageIcon, Upload, X} from 'lucide-react';

const classes=['Pre-Primary',...Array.from({length:10},(_,i)=>`Class ${i+1}`)];

export default function TeacherDashboard(){
  const router=useRouter();
  const [teacher,setTeacher]=useState<{id:string;name:string;phone:string;designation:string;campus:string;role:string}|null>(null);
  const [grade,setGrade]=useState(''); const [section,setSection]=useState(''); const [subject,setSubject]=useState('');
  const [date,setDate]=useState(new Date().toISOString().slice(0,10)); const [title,setTitle]=useState('');
  const [homeworkText,setHomeworkText]=useState(''); const [imageUrl,setImageUrl]=useState('');
  const [imageFile,setImageFile]=useState<File|null>(null); const [preview,setPreview]=useState('');
  const [status,setStatus]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const [showSuccess,setShowSuccess]=useState(false);

  useEffect(()=>{
    fetch('/api/auth/teacher',{cache:'no-store'}).then(r=>r.json()).then(d=>{if(!d.success){router.replace('/teacher/login');return;}setTeacher(d.teacher);}).catch(()=>router.replace('/teacher/login'));
  },[router]);

  const logout=async()=>{await fetch('/api/auth/teacher',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logout'})});router.replace('/teacher/login');router.refresh();};

  // Image select from gallery
  const handleImageSelect = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    if(file.size > 5 * 1024 * 1024){ setError('Image size should be less than 5MB'); return; }
    setImageFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Convert to base64 so your existing /api/diary can save it
    const reader = new FileReader();
    reader.onloadend = () => { setImageUrl(reader.result as string); };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null); setPreview(''); setImageUrl('');
  };

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setStatus('');setError('');setLoading(true);
    try{
      const payload = { campus: teacher?.campus, grade, section, subject, date, title: title || `${subject} - ${grade}`, homeworkText, imageUrl };
      const r=await fetch('/api/diary',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const d=await r.json();
      if(!r.ok||!d.success){setError(d.message||'Diary could not be uploaded.');return;}
      setShowSuccess(true); setTimeout(()=>setShowSuccess(false), 2500);
      setStatus('Diary uploaded successfully.');
      setGrade('');setSection('');setSubject('');setTitle('');setHomeworkText('');setImageUrl('');setPreview('');setImageFile(null);
    }catch{setError('Could not connect to the server.');}finally{setLoading(false);}
  };

  const field='w-full border border-gray-200 rounded-full px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]';
  const fieldArea='w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]';

  return <div className="min-h-screen flex flex-col bg-gray-50"><Navbar/>
  <section className="bg-gradient-to-r from-[#8B0000] via-[#a00000] to-[#8B0000] text-white p-7">
    <div className="max-w-5xl mx-auto flex justify-between"><div><div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-bold mb-2"><School className="w-4 h-4"/> Teacher Portal</div><h1 className="text-2xl font-black">Welcome, {teacher?.name||'Teacher'}</h1><p className="text-sm text-white/80">{teacher?.campus}</p></div>
    <div className="flex gap-2"><Link href="/teacher/dashboard/blog" className="bg-white text-[#8B0000] font-bold px-4 h-[50px] rounded-full text-sm flex items-center gap-2"><Newspaper className="w-4 h-4"/> Blog</Link><button onClick={logout} className="bg-black/20  h-[50px] border border-white/30 font-bold px-4 py-2.5 rounded-full text-sm flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button></div></div>
  </section>

  <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-7">
    <div className="bg-white border rounded-[28px] shadow-xl overflow-hidden">
      <div className="p-6 border-b flex gap-3"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#c00000] flex items-center justify-center"><BookOpen className="w-6 h-6 text-white"/></div><div><h2 className="text-[20px] font-black">Upload Daily Diary</h2><p className="text-[13px] text-gray-500">Select image from phone, not URL.</p></div></div>

      <form onSubmit={submit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {error&&<div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-sm flex gap-2"><AlertCircle className="w-5 h-5"/>{error}</div>}
        {status&&<div className="md:col-span-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-2xl text-sm flex gap-2"><CheckCircle className="w-5 h-5"/>{status}</div>}

        <Field label="Campus"><input readOnly value={teacher?.campus||''} className={`${field} bg-gray-100 font-bold`}/></Field>
        <Field label="Class *"><select required value={grade} onChange={e=>setGrade(e.target.value)} className={field}><option value="">Select class</option>{classes.map(c=><option key={c}>{c}</option>)}</select></Field>
        <Field label="Section"><input value={section} onChange={e=>setSection(e.target.value)} className={field} placeholder="A / B"/></Field>
        <Field label="Subject *"><input required value={subject} onChange={e=>setSubject(e.target.value)} className={field} placeholder="Mathematics"/></Field>
        <Field label="Date *"><input required type="date" value={date} onChange={e=>setDate(e.target.value)} className={field}/></Field>
        <Field label="Title"><input value={title} onChange={e=>setTitle(e.target.value)} className={field} placeholder="Homework title"/></Field>
        <div className="md:col-span-2"><Field label="Homework *"><textarea required rows={6} value={homeworkText} onChange={e=>setHomeworkText(e.target.value)} className={fieldArea} placeholder="Write homework..."/></Field></div>

        {/* IMAGE SELECT - NEW */}
        <div className="md:col-span-2">
          <Field label="Diary Image (Select from Gallery)">
            {!preview ? (
              <label className="w-full border-2 border-dashed border-gray-300 rounded-[20px] p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#8B0000] hover:bg-[#8B0000]/5 transition-all">
                <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center mb-3"><Upload className="w-6 h-6 text-[#8B0000]"/></div>
                <span className="text-sm font-bold text-gray-700">Click to select image</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden"/>
              </label>
            ) : (
              <div className="relative rounded-[20px] overflow-hidden border">
                <img src={preview} alt="Preview" className="w-full max-h-72 object-cover"/>
                <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"><X className="w-4 h-4"/></button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 px-3 flex justify-between"><span>{imageFile?.name}</span><span>{imageFile ? (imageFile.size/1024).toFixed(0)+' KB' : ''}</span></div>
              </div>
            )}
          </Field>
        </div>

        <button disabled={loading} className="md:col-span-2 w-full bg-[#8B0000] text-white font-black py-3.5 rounded-full disabled:opacity-60 shadow-[0_8px_20px_rgba(139,0,0,0.3)]">{loading?'Uploading...':'Upload Diary'}</button>
      </form>
    </div>
  </main>

  {showSuccess && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-[28px] p-8 max-w-sm w-full text-center shadow-2xl"><div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"><CheckCircle className="w-10 h-10 text-green-600"/></div><h2 className="text-xl font-black">Diary Uploaded!</h2><p className="text-sm text-gray-500 mt-1">Students can now see it.</p></div></div>}
  <Footer/></div>
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">{label}</span>{children}</label>}