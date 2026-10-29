import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

type QAItem = { keywords: string[]; en: string };
const KNOWLEDGE_BASE: QAItem[] = [
  { keywords: ['admission','dakhla','enroll','apply','new admission'], en: 'Admissions 2026-27 are open for Playgroup to Class 10 (Matric - BSEK Board). Select NEW ADMISSIONS on the website, complete the form, and contact the school on WhatsApp at +92 312 6172674. Campus visits: Monday-Saturday, 8:00 AM-1:30 PM.' },
  { keywords: ['fees','fee','charges','kitni fees','kharcha','paisa'], en: 'Fees depend on the class and campus. Contact the admission desk on WhatsApp at +92 312 6172674. Sibling discounts are available.' },
  { keywords: ['diary','dairy','homework','roznamcha','h.w','kaam'], en: 'Open the Daily Diary at /diary. Filter by campus, class, and subject. Only the latest 3 days of diary entries are retained.' },
  { keywords: ['campus','branches','location','address','zaman','darusslam','lucknow','kahan hai'], en: 'We have 3 campuses: Darusslam Campus, opposite Fazal-e-Elahi Hospital; Lucknow Campus, Shaq al Mandi Street; and Zaman Town Campus in Korangi (main campus with labs). School hours: Monday-Saturday, 8:00 AM-1:30 PM.' },
  { keywords: ['timing','time','chutti time','khulne','band','kitne baje','kab khulta'], en: 'School hours are Monday-Saturday, 8:00 AM-1:30 PM. The office remains open until 3:30 PM. Sunday is closed.' },
  { keywords: ['uniform','dress','wardi','kapre','shoes','tie','belt'], en: 'The school uniform is compulsory: a white shirt and grey trousers. Uniform items are available at the school.' },
  { keywords: ['book','books','copy','copies','course','kitab','kitaben'], en: 'Books and notebooks are available at the school.' },
  { keywords: ['van','bus','transport','pick and drop','gaari'], en: 'Van service is available in nearby areas. Transport charges are separate from tuition fees. Contact the school on +92 312 6172674.' },
  { keywords: ['grades','classes','playgroup','nursery','kg','primary','montessori','matric'], en: 'We offer Playgroup to Grade 10 (Matric). Montessori focuses on activity-based learning and Islamic values.' },
  { keywords: ['exam','test','paper','imtihan','mid term','final'], en: 'Monthly tests, mid-term exams, and final exams are held. Date sheets are shared one week in advance through the diary and WhatsApp group.' },
  { keywords: ['result','report card','marks','number'], en: 'Results are announced after the final exams. Report cards are distributed on Parent-Teacher Meeting (PTM) day.' },
  { keywords: ['holiday','vacation','chuttiyan','summer','winter','sunday off'], en: 'Sunday is the weekly day off. Summer and winter vacations follow government notifications. Updates are shared through the WhatsApp group.' },
  { keywords: ['lab','computer','science','library','facilities','sahulat'], en: 'Facilities include smart digital classrooms, Physics, Chemistry, Biology and Computer labs, a library, and sports periods.' },
  { keywords: ['sports','games','activity','function','event','annual'], en: 'We conduct sports activities, Islamic events, annual functions, and extracurricular activities.' },
  { keywords: ['ptm','parents meeting','walidain'], en: 'Parent-Teacher Meetings are held after each term examination. Information is shared through the diary and WhatsApp group.' },
  { keywords: ['leave','absent','bimar','sick','late','application'], en: 'For leave, send a written application in the diary or contact the class teacher. Three consecutive days of absence without information may lead to further action.' },
  { keywords: ['rules','discipline','nails','hair','clean'], en: 'Students must wear the proper uniform, keep nails trimmed and hair neat, and wear clean, polished shoes.' },
  { keywords: ['principal','owner','director','head'], en: 'For special questions, please visit the school and meet the Principal during school hours.' },
];
function findAnswer(userMessage: string): QAItem | undefined {
  const lower = userMessage.toLowerCase();
  let best: QAItem | undefined;
  let maxScore = 0;
  for (const item of KNOWLEDGE_BASE) {
    const score = item.keywords.reduce((total, keyword) => total + (lower.includes(keyword) ? 1 : 0), 0);
    if (score > maxScore) { maxScore = score; best = item; }
  }
  return best;
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const lastMsg = String(messages[messages.length - 1]?.content || '');
    const matched = findAnswer(lastMsg);
    const reply = matched?.en || 'Welcome to Creek View Academy! You can ask about admissions, fees, the daily diary, campus locations, school timings, and facilities. For further help, contact us on WhatsApp at +92 312 6172674.';
    return NextResponse.json({ success: true, reply, detected: 'en' });
  } catch {
    return NextResponse.json({ success: true, reply: 'Please contact us on WhatsApp at +92 312 6172674.' });
  }
}
