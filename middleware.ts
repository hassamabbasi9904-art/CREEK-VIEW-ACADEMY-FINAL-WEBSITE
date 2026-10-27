import { NextRequest, NextResponse } from 'next/server';

// Quick gate: the dashboard needs a session cookie. The real check (is the
// session valid / not expired?) happens on the server in /api/auth/teacher
// and in every teacher-only API.
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/teacher/dashboard')) {
    if (!request.cookies.has('creek_session')) return NextResponse.redirect(new URL('/teacher/login', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/student/portal')) {
    if (!request.cookies.has('creek_student_session')) return NextResponse.redirect(new URL('/student/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/dashboard/:path*', '/student/portal/:path*'],
};
