'use client';
import React,{useEffect,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, CheckCircle, AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';

const categories=['Campus News','Academic Excellence','Sports & Events','Parenting & Study Tips'];

export default function TeacherBlogPage(){
  const router=useRouter();
  const [teacher,setTeacher]=useState<{name:string;campus:string}|null>(null);
  const [title,setTitle]=useState('');
  const [excerpt,setExcerpt]=useState('');
  const [content,setContent]=useState('');
  const [category,setCategory]=useState(categories[0]);
  const [imageUrl,setImageUrl]=useState('');
  const [preview,setPreview]=useState('');
  const [status,setStatus]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const [showSuccess,setShowSuccess]=useState(false);

  useEffect(()=>{
    fetch('/api/auth/teacher',{cache:'no-store'}).then(r=>r.json()).then(d=>{
      if(!d.success){router.replace('/teacher/login');return;}
      setTeacher(d.teacher);
    }).catch(()=>router.replace('/teacher/login'));
  },[router]);

  const handleImageSelect = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    if(file.size > 5 * 1024 * 1024){ setError('Image must be less than 5MB'); return; }
    setPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setPreview(''); setImageUrl(''); }

  const submit = async(e:React.FormEvent)=>{
    e.preventDefault(); setStatus(''); setError(''); setLoading(true);
    try{
      const res = await fetch('/api/blog',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ title, excerpt, content, category, imageUrl, campus: teacher?.campus })
      });
      const data = await res.json();
      if(!res.ok || !data.success){ setError(data.message || 'Blog could not be published'); return; }
      setShowSuccess(true);
      setTimeout(()=>{ setShowSuccess(false); router.push('/blog'); }, 1500);
      setStatus('Blog published successfully!');
      setTitle(''); setExcerpt(''); setContent(''); setImageUrl(''); setPreview('');
    }catch{ setError('Server error'); }
    finally{ setLoading(false); }
  };

  const field = 'w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]';
  const fieldArea = 'w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]';

  return <div className="min-h-screen flex flex-col bg-gray-50"><Navbar/>
    <div className="max-w-3xl mx-auto w-full px-4 pt-6">
      <Link href="/teacher/dashboard" className="inline-flex items-center gap-1 text-sm font-bold text-[#8B0000] hover:underline">
        <ArrowLeft className="w-4 h-4"/> Back to Teacher Dashboard
      </Link>
    </div>

    <main className="flex-1 max-w-3xl mx-auto w-full p-4">
      <div className="bg-white border border-gray-200 rounded-[28px] shadow-xl overflow-hidden">
        {/* Header like your screenshot */}
        <div className="bg-[#8B0000] text-white p-7">
          <h1 className="text-2xl font-black">Publish a Blog Post</h1>
          <p className="text-white/80 text-sm mt-1">{teacher?.name || 'Teacher'} · {teacher?.campus || 'Campus'}</p>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          {error&&<div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-sm flex gap-2"><AlertCircle className="w-5 h-5"/>{error}</div>}
          {status&&<div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-2xl text-sm flex gap-2"><CheckCircle className="w-5 h-5"/>{status}</div>}

          <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-600 mb-2 ml-1">BLOG TITLE</label>
            <input required value={title} onChange={e=>setTitle(e.target.value)} className={field} placeholder="Enter blog title"/></div>

          <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-600 mb-2 ml-1">SHORT DESCRIPTION</label>
            <textarea required rows={3} value={excerpt} onChange={e=>setExcerpt(e.target.value)} className={fieldArea} placeholder="A short summary for the blog card"/></div>

          <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-600 mb-2 ml-1">BLOG CONTENT</label>
            <textarea required rows={8} value={content} onChange={e=>setContent(e.target.value)} className={fieldArea} placeholder="Write full blog content here..."/></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-600 mb-2 ml-1">CATEGORY</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} className={field}>{categories.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-600 mb-2 ml-1">CAMPUS (Auto)</label>
              <input readOnly value={teacher?.campus || ''} className={`${field} bg-gray-100 font-bold`}/></div>
          </div>

          {/* IMAGE SELECT FROM GALLERY */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-600 mb-2 ml-1">BLOG IMAGE (Select from gallery)</label>
            {!preview ? (
              <label className="w-full border-2 border-dashed border-gray-300 rounded-[20px] p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#8B0000] hover:bg-[#8B0000]/5 transition-all">
                <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center mb-3"><Upload className="w-6 h-6 text-[#8B0000]"/></div>
                <span className="text-sm font-bold text-gray-700">Click to select image</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden"/>
              </label>
            ) : (
              <div className="relative rounded-[20px] overflow-hidden border">
                <img src={preview} alt="Preview" className="w-full max-h-80 object-cover"/>
                <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"><X className="w-4 h-4"/></button>
              </div>
            )}
          </div>

          <button disabled={loading} className="w-full bg-[#8B0000] hover:bg-[#a00000] text-white font-black py-4 rounded-full disabled:opacity-60 shadow-[0_8px_20px_rgba(139,0,0,0.3)]">
            {loading ? 'Publishing...' : 'Publish Blog'}
          </button>
        </form>
      </div>
    </main>

    {showSuccess && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-[28px] p-8 max-w-sm w-full text-center shadow-2xl"><div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"><CheckCircle className="w-10 h-10 text-green-600"/></div><h2 className="text-xl font-black">Blog Published!</h2><p className="text-sm text-gray-500 mt-1">Redirecting to blog page...</p></div></div>}

    <Footer/></div>
}