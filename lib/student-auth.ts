import crypto from 'node:crypto';
import type { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from './mongodb.mjs';
import { StudentSessionModel } from './models.mjs';
import { findStudentById, StudentUser } from './db';

// Student login sessions (MongoDB `student_sessions` collection).
// Same design as teacher sessions: only a SHA-256 hash of the cookie token is stored.

export const STUDENT_SESSION_COOKIE = 'creek_student_session';
const IDLE_MS = 7 * 24 * 60 * 60 * 1000;
const ABSOLUTE_MS = 30 * 24 * 60 * 60 * 1000;
const TOUCH_INTERVAL_MS = 5 * 60 * 1000;

interface StudentSession {
  tokenHash: string;
  studentId: string;
  createdAt: number;
  lastSeenAt: number;
  expiresAt: number;
  absoluteExpiresAt: number;
}

const Sessions = StudentSessionModel as unknown as Model<Record<string, unknown>>;

function hashToken(token: string) { return crypto.createHash('sha256').update(token).digest('hex'); }

export async function createStudentSession(studentId: string) {
  await connectToMongoDB();
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  await Sessions.create({
    tokenHash: hashToken(token),
    studentId,
    createdAt: now,
    lastSeenAt: now,
    expiresAt: now + IDLE_MS,
    absoluteExpiresAt: now + ABSOLUTE_MS,
    expireAt: new Date(now + ABSOLUTE_MS),
  });
  return { token, maxAgeSeconds: Math.floor(IDLE_MS / 1000) };
}

export async function destroyStudentSession(token?: string) {
  if (!token) return;
  await connectToMongoDB();
  await Sessions.deleteOne({ tokenHash: hashToken(token) });
}

export function setStudentCookie(res: NextResponse, token: string, maxAgeSeconds: number) {
  res.cookies.set(STUDENT_SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: maxAgeSeconds });
}
export function clearStudentCookie(res: NextResponse) {
  res.cookies.set(STUDENT_SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}

export interface StudentAuthContext { student: StudentUser; token: string; }

export async function getStudentAuth(request: NextRequest): Promise<StudentAuthContext | null> {
  const token = request.cookies.get(STUDENT_SESSION_COOKIE)?.value;
  if (!token) return null;

  await connectToMongoDB();
  const h = hashToken(token);
  const session = await Sessions.findOne({ tokenHash: h }).lean() as unknown as StudentSession | null;
  if (!session) return null;

  const now = Date.now();
  if (session.expiresAt <= now || session.absoluteExpiresAt <= now) {
    await Sessions.deleteOne({ tokenHash: h });
    return null;
  }

  const student = await findStudentById(session.studentId);
  if (!student || student.active === false) {
    await Sessions.deleteOne({ tokenHash: h });
    return null;
  }

  if (now - session.lastSeenAt > TOUCH_INTERVAL_MS) {
    await Sessions.updateOne(
      { tokenHash: h },
      { $set: { lastSeenAt: now, expiresAt: Math.min(now + IDLE_MS, session.absoluteExpiresAt) } }
    );
  }
  return { student, token };
}

export async function requireStudent(request: NextRequest): Promise<StudentAuthContext | NextResponse> {
  const auth = await getStudentAuth(request);
  if (!auth) {
    const res = NextResponse.json({ success: false, message: 'Please log in as a student first.' }, { status: 401 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
  return auth;
}
export function isStudentAuthContext(v: StudentAuthContext | NextResponse): v is StudentAuthContext { return !(v instanceof NextResponse); }
export function publicStudent(s: StudentUser) {
  return { id: s.id, rollNumber: s.rollNumber, name: s.name, grade: s.grade, section: s.section || '', campus: s.campus, guardianName: s.guardianName || '', active: s.active !== false };
}
