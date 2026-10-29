import { NextRequest, NextResponse } from 'next/server';
import { getDiaryEntries, addDiaryEntry, deleteDiaryEntry, findDiaryById, getLastPurgedAt, CAMPUSES, DiaryEntry, updateDiaryEntry, createAuditLog } from '@/lib/db';
import { requireTeacher, isAuthContext, sameOriginOrReject } from '@/lib/auth';
import { normalizePhone } from '@/lib/password';
import { getStudentAuth } from '@/lib/student-auth';
import { getAuth } from '@/lib/auth';

const MAX_IMAGE_CHARS = 7 * 1024 * 1024; // ~5MB image as base64
const MAX_TEXT = 5000;

// Students / parents only ever get this read-only view (no phone numbers, no internal ids).
function toPublicEntry(e: DiaryEntry) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { teacherPhone, teacherId, ...rest } = e;
  return rest;
}

// ---------- READ: public (students & parents) ----------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campus = searchParams.get('campus');
    const grade = searchParams.get('grade');
    const date = searchParams.get('date');
    const subject = searchParams.get('subject');

    // Diary is private: only authenticated students or teachers may read it.
    const studentAuth = await getStudentAuth(request);
    const teacherAuth = studentAuth ? null : await getAuth(request);
    if (!studentAuth && !teacherAuth) return NextResponse.json({ success: false, message: 'Please log in to view the diary.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    let entries = await getDiaryEntries();
    if (studentAuth) {
      if (campus && campus !== 'ALL' && campus.toLowerCase() !== studentAuth.student.campus.toLowerCase()) {
        return NextResponse.json({ success: false, code: 'CAMPUS_FORBIDDEN', message: 'Please log in to this campus to view its diary.' }, { status: 403 });
      }
      entries = entries.filter((e) => (e.campus || '').toLowerCase() === studentAuth.student.campus.toLowerCase());
    } else if (teacherAuth && teacherAuth.teacher.role !== 'admin') {
      entries = entries.filter((e) => (e.campus || '').toLowerCase() === (teacherAuth.teacher.campus || '').toLowerCase());
    }

    if (campus && campus !== 'ALL') {
      const c = campus.toLowerCase();
      entries = entries.filter((e) => {
        const itemCamp = (e.campus || '').toLowerCase();
        return itemCamp === c || itemCamp.includes(c) || c.includes(itemCamp);
      });
    }

    if (grade && grade !== 'ALL') {
      entries = entries.filter((e) => e.grade.toLowerCase() === grade.toLowerCase());
    }

    if (date && date !== 'ALL') {
      entries = entries.filter((e) => e.date === date);
    }

    if (subject && subject !== 'ALL') {
      entries = entries.filter((e) => e.subject.toLowerCase() === subject.toLowerCase());
    }

    const lastPurgedAt = await getLastPurgedAt();

    return NextResponse.json({
      success: true,
      count: entries.length,
      entries: entries.map(toPublicEntry),
      lastPurgedAt,
      retentionNotice: 'Only recent 3 days of homework diaries are stored. Older records are automatically purged.',
    });
  } catch (error) {
    console.error('Error fetching diaries:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch diaries' }, { status: 500 });
  }
}

// ---------- CREATE: logged-in teachers only ----------
export async function POST(request: NextRequest) {
  try {
    const blocked = sameOriginOrReject(request);
    if (blocked) return blocked;

    const auth = await requireTeacher(request);
    if (!isAuthContext(auth)) return auth;
    const teacher = auth.teacher;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
    }

    const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
    const grade = str(body.grade);
    const section = str(body.section);
    const subject = str(body.subject);
    const title = str(body.title);
    const homeworkText = str(body.homeworkText);
    const imageUrl = str(body.imageUrl);
    const campus = str(body.campus) || teacher.campus || 'Darusslam Campus';
    const date = str(body.date);

    if (!grade || !subject || !homeworkText) {
      return NextResponse.json(
        { success: false, message: 'Class, Subject and Homework text are required.' },
        { status: 400 }
      );
    }
    if (
      grade.length > 40 || section.length > 40 || subject.length > 80 ||
      title.length > 200 || homeworkText.length > MAX_TEXT
    ) {
      return NextResponse.json({ success: false, message: 'Some fields are too long.' }, { status: 400 });
    }
    if (!(CAMPUSES as readonly string[]).includes(campus)) {
      return NextResponse.json({ success: false, message: 'Invalid campus.' }, { status: 400 });
    }
    if (teacher.role !== 'admin' && campus !== teacher.campus) return NextResponse.json({ success: false, message: 'You can only upload diary entries for your assigned campus.' }, { status: 403 });
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ success: false, message: 'Invalid date.' }, { status: 400 });
    }
    if (imageUrl) {
      const okImage = imageUrl.startsWith('data:image/') || imageUrl.startsWith('https://');
      if (!okImage || imageUrl.length > MAX_IMAGE_CHARS) {
        return NextResponse.json({ success: false, message: 'Invalid or too large image.' }, { status: 400 });
      }
    }

    const targetDate = date || new Date().toISOString().split('T')[0];

    // Teacher identity comes from the login session, NOT from the request body
    const newEntry = await addDiaryEntry({
      date: targetDate,
      grade,
      section,
      subject,
      campus,
      teacherId: teacher.id,
      teacherName: teacher.name || 'Faculty Member',
      teacherDesignation: teacher.designation || '',
      teacherPhone: teacher.phone,
      title: title || `${subject} Homework (${grade})`,
      homeworkText,
      imageUrl,
    });

    await createAuditLog({ action: 'diary_created', teacherId: teacher.id, teacherName: teacher.name, teacherPhone: teacher.phone, campus, grade, section, diaryId: newEntry.id, ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '', userAgent: request.headers.get('user-agent') || '', details: `Diary uploaded: ${subject}` });

    return NextResponse.json({
      success: true,
      message: 'School diary uploaded successfully!',
      entry: toPublicEntry(newEntry),
    });
  } catch (error) {
    console.error('Error adding diary:', error);
    return NextResponse.json({ success: false, message: 'Failed to post diary entry' }, { status: 500 });
  }
}

// ---------- UPDATE: owner teacher, or admin ----------
export async function PUT(request: NextRequest) {
  try {
    const blocked = sameOriginOrReject(request);
    if (blocked) return blocked;
    const auth = await requireTeacher(request);
    if (!isAuthContext(auth)) return auth;
    const teacher = auth.teacher;
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
    const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
    const id = str(body.id);
    const entry = await findDiaryById(id);
    if (!entry) return NextResponse.json({ success: false, message: 'Entry not found.' }, { status: 404 });
    const isOwner = entry.teacherId === teacher.id || (!entry.teacherId && normalizePhone(entry.teacherPhone || '') === normalizePhone(teacher.phone));
    if (teacher.role !== 'admin' && !isOwner) return NextResponse.json({ success: false, message: 'You can only update your own diary entries.' }, { status: 403 });
    const grade = str(body.grade), section = str(body.section), subject = str(body.subject), title = str(body.title), homeworkText = str(body.homeworkText), imageUrl = str(body.imageUrl), campus = str(body.campus), date = str(body.date);
    if (!grade || !subject || !homeworkText) return NextResponse.json({ success: false, message: 'Class, Subject and Homework text are required.' }, { status: 400 });
    if (grade.length > 40 || section.length > 40 || subject.length > 80 || title.length > 200 || homeworkText.length > MAX_TEXT) return NextResponse.json({ success: false, message: 'Some fields are too long.' }, { status: 400 });
    if (!(CAMPUSES as readonly string[]).includes(campus)) return NextResponse.json({ success: false, message: 'Invalid campus.' }, { status: 400 });
    if (teacher.role !== 'admin' && campus !== teacher.campus) return NextResponse.json({ success: false, message: 'You can only update diary entries for your assigned campus.' }, { status: 403 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ success: false, message: 'Invalid date.' }, { status: 400 });
    if (imageUrl) { const ok = imageUrl.startsWith('data:image/') || imageUrl.startsWith('https://'); if (!ok || imageUrl.length > MAX_IMAGE_CHARS) return NextResponse.json({ success: false, message: 'Invalid or too large image.' }, { status: 400 }); }
    const updated = await updateDiaryEntry(id, { date, grade, section, subject, campus, title: title || `${subject} Homework - ${grade}`, homeworkText, imageUrl });
    await createAuditLog({ action: 'diary_updated', teacherId: teacher.id, teacherName: teacher.name, teacherPhone: teacher.phone, campus, grade, section, diaryId: id, ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '', userAgent: request.headers.get('user-agent') || '' });
    return NextResponse.json({ success: true, message: 'Diary updated successfully.', entry: updated ? toPublicEntry(updated) : null });
  } catch (error) {
    console.error('Error updating diary:', error);
    return NextResponse.json({ success: false, message: 'Failed to update diary entry.' }, { status: 500 });
  }
}

// ---------- DELETE: owner teacher, or admin ----------
export async function DELETE(request: NextRequest) {
  try {
    const blocked = sameOriginOrReject(request);
    if (blocked) return blocked;

    const auth = await requireTeacher(request);
    if (!isAuthContext(auth)) return auth;
    const teacher = auth.teacher;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Entry ID is required' }, { status: 400 });
    }

    const entry = await findDiaryById(id);
    if (!entry) {
      return NextResponse.json({ success: false, message: 'Entry not found' }, { status: 404 });
    }

    // Older entries (before login accounts existed) have no teacherId - match by phone
    const isOwner =
      entry.teacherId === teacher.id ||
      (!entry.teacherId && normalizePhone(entry.teacherPhone || '') === normalizePhone(teacher.phone));
    if (teacher.role !== 'admin' && !isOwner) {
      return NextResponse.json(
        { success: false, message: 'You can only delete your own diary entries.' },
        { status: 403 }
      );
    }

    await deleteDiaryEntry(id);
    await createAuditLog({ action: 'diary_deleted', teacherId: teacher.id, teacherName: teacher.name, teacherPhone: teacher.phone, campus: entry.campus, grade: entry.grade, section: entry.section, diaryId: id, ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '', userAgent: request.headers.get('user-agent') || '' });
    return NextResponse.json({ success: true, message: 'Diary entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting diary:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete entry' }, { status: 500 });
  }
}
