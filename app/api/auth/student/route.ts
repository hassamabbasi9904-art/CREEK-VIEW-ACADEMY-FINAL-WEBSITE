import { NextRequest, NextResponse } from 'next/server';
import { CAMPUSES, findStudentByName, findStudentByRoll, registerStudent, verifyStudentPassword } from '@/lib/db';
import { createStudentSession, destroyStudentSession, clearStudentCookie, getStudentAuth, publicStudent, setStudentCookie, STUDENT_SESSION_COOKIE } from '@/lib/student-auth';
import { sameOriginOrReject } from '@/lib/auth';

const MAX_PASSWORD = 128;
function json(body: Record<string, unknown>, status = 200) { const r = NextResponse.json(body, { status }); r.headers.set('Cache-Control', 'no-store'); return r; }

export async function GET(request: NextRequest) {
  const auth = await getStudentAuth(request);
  if (!auth) return json({ success: false, loggedIn: false }, 401);
  return json({ success: true, loggedIn: true, student: publicStudent(auth.student) });
}

export async function POST(request: NextRequest) {
  const blocked = sameOriginOrReject(request); if (blocked) return blocked;
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') return json({ success: false, message: 'Invalid request.' }, 400);
    const action = typeof body.action === 'string' ? body.action : '';
    if (action === 'logout') { await destroyStudentSession(request.cookies.get(STUDENT_SESSION_COOKIE)?.value); const r = json({ success: true }); clearStudentCookie(r); return r; }

    if (action === 'register') {
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const rollNumber = typeof body.rollNumber === 'string' ? body.rollNumber.trim() : '';
      const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
      const campus = typeof body.campus === 'string' ? body.campus.trim() : '';
      const password = typeof body.password === 'string' ? body.password : '';
      if (!name || !rollNumber || !phone || !campus || !password) return json({ success: false, message: 'Please complete all required fields.' }, 400);
      if (name.length > 100 || rollNumber.length > 40 || phone.length > 20 || password.length > MAX_PASSWORD) return json({ success: false, message: 'One or more fields exceed the allowed length.' }, 400);
      if (!(CAMPUSES as readonly string[]).includes(campus)) return json({ success: false, message: 'Please select a valid campus.' }, 400);
      if (password.length < 8) return json({ success: false, message: 'Password must contain at least 8 characters.' }, 400);
      const student = await registerStudent({ name, rollNumber, phone, campus, password });
      const session = await createStudentSession(student.id);
      const r = json({ success: true, message: 'Registration successful. You can now view your campus diary.', student: publicStudent(student) }, 201);
      setStudentCookie(r, session.token, session.maxAgeSeconds);
      return r;
    }

    if (action !== 'login') return json({ success: false, message: 'Invalid action.' }, 400);
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!name || !password || password.length > MAX_PASSWORD) return json({ success: false, message: 'Name and password are required.' }, 400);
    const student = await findStudentByName(name);
    if (!student || student.active === false || !verifyStudentPassword(student, password)) return json({ success: false, message: 'The name or password is incorrect.' }, 401);
    const { token, maxAgeSeconds } = await createStudentSession(student.id);
    const r = json({ success: true, message: 'Login successful.', student: publicStudent(student) });
    setStudentCookie(r, token, maxAgeSeconds);
    return r;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The request failed.';
    const status = /registered/i.test(message) ? 409 : 500;
    return json({ success: false, message: status === 500 ? 'The request could not be completed because the database is unavailable. Check the MongoDB connection settings and try again.' : message }, status);
  }
}
