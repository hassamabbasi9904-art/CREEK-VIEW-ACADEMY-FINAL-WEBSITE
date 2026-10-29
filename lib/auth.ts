import crypto from 'node:crypto';
import type { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from './mongodb.mjs';
import { SessionModel } from './models.mjs';
import { findTeacherById, TeacherUser } from './db';

/**
 * Server-side login sessions (stored in the MongoDB `sessions` collection).
 *  - The browser only gets a random token in an httpOnly cookie (JS cannot read it).
 *  - The server stores only a SHA-256 hash of that token, so a leaked database
 *    cannot be used to log in.
 *  - Sessions expire after IDLE_MS without use, or ABSOLUTE_MS after login.
 *    MongoDB also deletes them automatically (TTL index on `expireAt`).
 *  - Logout / password change deletes sessions on the server immediately.
 */

export const SESSION_COOKIE = 'creek_session';
const IDLE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days of inactivity
const ABSOLUTE_MS = 30 * 24 * 60 * 60 * 1000; // hard limit 30 days
const TOUCH_INTERVAL_MS = 5 * 60 * 1000; // don't write to the DB on every request

interface SessionRecord {
  tokenHash: string;
  teacherId: string;
  createdAt: number;
  lastSeenAt: number;
  expiresAt: number; // sliding idle expiry
  absoluteExpiresAt: number;
}

const Sessions = SessionModel as unknown as Model<Record<string, unknown>>;

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createSession(teacherId: string): Promise<{ token: string; maxAgeSeconds: number }> {
  await connectToMongoDB();
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  await Sessions.create({
    tokenHash: hashToken(token),
    teacherId,
    createdAt: now,
    lastSeenAt: now,
    expiresAt: now + IDLE_MS,
    absoluteExpiresAt: now + ABSOLUTE_MS,
    expireAt: new Date(now + ABSOLUTE_MS),
  });
  return { token, maxAgeSeconds: Math.floor(IDLE_MS / 1000) };
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return;
  await connectToMongoDB();
  await Sessions.deleteOne({ tokenHash: hashToken(token) });
}

/** Logs a teacher out everywhere (optionally keeping the current session). */
export async function destroyTeacherSessions(teacherId: string, keepToken?: string): Promise<void> {
  await connectToMongoDB();
  await Sessions.deleteMany(
    keepToken ? { teacherId, tokenHash: { $ne: hashToken(keepToken) } } : { teacherId }
  );
}

export function setSessionCookie(res: NextResponse, token: string, maxAgeSeconds: number): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export interface AuthContext {
  teacher: TeacherUser;
  token: string;
}

/** Returns the logged-in teacher for this request, or null. */
export async function getAuth(request: NextRequest): Promise<AuthContext | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  await connectToMongoDB();
  const h = hashToken(token);
  const session = await Sessions.findOne({ tokenHash: h }).lean() as unknown as SessionRecord | null;
  if (!session) return null;

  const now = Date.now();
  if (session.expiresAt <= now || session.absoluteExpiresAt <= now) {
    await Sessions.deleteOne({ tokenHash: h });
    return null;
  }

  const teacher = await findTeacherById(session.teacherId);
  if (!teacher || teacher.active === false) {
    await Sessions.deleteOne({ tokenHash: h });
    return null;
  }

  // Sliding expiry, but only write to the DB every few minutes
  if (now - session.lastSeenAt > TOUCH_INTERVAL_MS) {
    await Sessions.updateOne(
      { tokenHash: h },
      { $set: { lastSeenAt: now, expiresAt: Math.min(now + IDLE_MS, session.absoluteExpiresAt) } }
    );
  }

  return { teacher, token };
}

function jsonNoStore(body: unknown, status: number): NextResponse {
  const res = NextResponse.json(body, { status });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

/** Use at the top of any teacher-only API. */
export async function requireTeacher(request: NextRequest): Promise<AuthContext | NextResponse> {
  const auth = await getAuth(request);
  if (!auth) {
    return jsonNoStore({ success: false, message: 'Please log in as a teacher first.' }, 401);
  }
  if (auth.teacher.mustChangePassword) {
    return jsonNoStore(
      { success: false, code: 'PASSWORD_CHANGE_REQUIRED', message: 'Please change your temporary password first.' },
      403
    );
  }
  return auth;
}

export function isAuthContext(v: AuthContext | NextResponse): v is AuthContext {
  return !(v instanceof NextResponse);
}

/** Basic CSRF protection: state-changing requests must come from our own site. */
export function sameOriginOrReject(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');
  if (origin) {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    try {
      if (new URL(origin).host !== host) {
        return jsonNoStore({ success: false, message: 'Cross-site request blocked.' }, 403);
      }
    } catch {
      return jsonNoStore({ success: false, message: 'Invalid origin.' }, 403);
    }
  }
  return null;
}

/** Fields that are safe to send to the browser (never the hash). */
export function publicTeacher(t: TeacherUser) {
  return {
    id: t.id,
    name: t.name || '',
    phone: t.phone,
    role: t.role,
    designation: t.designation || '',
    campus: t.campus || 'Darusslam Campus',
    subjects: t.subjects || [],
    assignedGrades: t.assignedGrades || [],
    mustChangePassword: Boolean(t.mustChangePassword),
  };
}

// ---- Login throttling (per IP, in memory) ----
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX_ATTEMPTS = 20;

export function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

export function ipRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = ipAttempts.get(ip);
  if (!rec || rec.resetAt <= now) return false;
  return rec.count >= IP_MAX_ATTEMPTS;
}

export function recordIpFailure(ip: string): void {
  const now = Date.now();
  const rec = ipAttempts.get(ip);
  if (!rec || rec.resetAt <= now) {
    ipAttempts.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
  } else {
    rec.count += 1;
  }
}

export function clearIpFailures(ip: string): void {
  ipAttempts.delete(ip);
}
