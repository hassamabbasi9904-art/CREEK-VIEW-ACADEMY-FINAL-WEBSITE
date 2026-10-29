import type { Model } from 'mongoose';
import { connectToMongoDB } from './mongodb.mjs';
import { AuditLogModel, BlogModel, DiaryModel, SchoolMetadataModel, StudentModel, TeacherModel } from './models.mjs';
import { hashPassword, normalizePhone, verifyPassword } from './password';

export const CAMPUSES = ['Darusslam Campus', 'Lucknow Campus', 'Zaman Town Campus'] as const;
export type CampusType = (typeof CAMPUSES)[number];

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  grade: string; // e.g. "Class 5", "Class 9", "Pre-Primary"
  section?: string; // "A", "B", "Rose"
  subject: string; // "Mathematics", "English", "Urdu", "Science", etc.
  campus: string; // "Darusslam Campus" | "Lucknow Campus" | "Zaman Town Campus"
  teacherId?: string; // owner (set by server from login session)
  teacherName: string;
  teacherDesignation?: string;
  teacherPhone: string;
  title: string;
  homeworkText: string;
  imageUrl?: string; // Base64 or image link
  createdAt: string; // ISO
}

export type TeacherRole = 'teacher' | 'admin';

export interface StudentUser {
  id: string;
  rollNumber: string;
  name: string;
  phone: string;
  grade: string;
  section?: string;
  campus: string;
  guardianName?: string;
  passwordHash: string;
  active?: boolean;
  registeredAt?: string;
}

export interface TeacherUser {
  id: string;
  name: string;
  phone: string;
  role: TeacherRole; // 'admin' can manage everyone's diaries; 'teacher' only their own
  passwordHash: string; // scrypt hash - plain-text passwords are never stored
  mustChangePassword?: boolean; // true while the password is a one-time temporary one
  passwordChangedAt?: string;
  failedAttempts?: number; // consecutive wrong passwords (for lockout)
  lockedUntil?: string; // ISO time until which login is blocked
  active?: boolean; // false = account disabled
  designation?: string; // e.g. "Senior Faculty", "Mathematics Specialist"
  campus?: string; // Default or assigned campus
  subjects: string[];
  assignedGrades: string[];
  registeredAt?: string;
}

/**
 * Data layer: MongoDB Atlas (via Mongoose).
 *
 * Collections: teachers, students, diaries, school_metadata
 * (sessions live in lib/auth.ts and lib/student-auth.ts).
 *
 * Every function that touches the database is async - always `await` it.
 */

type Doc = Record<string, unknown>;

const Teachers = TeacherModel as unknown as Model<Doc>;
const Students = StudentModel as unknown as Model<Doc>;
const Diaries = DiaryModel as unknown as Model<Doc>;
const Metadata = SchoolMetadataModel as unknown as Model<Doc>;
const Blogs = BlogModel as unknown as Model<Doc>;
const AuditLogs = AuditLogModel as unknown as Model<Doc>;

const METADATA_ID = 'school-state';

async function ready(): Promise<void> {
  await connectToMongoDB();
}

// Strips MongoDB's internal fields so records look exactly like the old JSON ones.
function clean<T>(doc: unknown): T | undefined {
  if (!doc) return undefined;
  const { _id, __v, ...rest } = doc as Doc;
  return rest as T;
}

// Helper to format date YYYY-MM-DD
export function getLocalDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------------- diaries

/**
 * 3-Day Rule:
 * Valid dates are today, yesterday and 2 days ago.
 * Anything older is deleted automatically.
 */
export async function purgeOldDiaries(): Promise<{ purgedCount: number; remainingCount: number }> {
  await ready();
  const validDates = [getLocalDateString(0), getLocalDateString(1), getLocalDateString(2)];

  const result = await Diaries.deleteMany({ date: { $nin: validDates } });
  const purgedCount = result.deletedCount ?? 0;

  // Public pages call this on every request - only touch metadata if something was deleted.
  if (purgedCount > 0) {
    await Metadata.updateOne(
      { _id: METADATA_ID },
      { $set: { lastPurgedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }

  return { purgedCount, remainingCount: await Diaries.countDocuments() };
}

export async function getLastPurgedAt(): Promise<string> {
  await ready();
  const meta = await Metadata.findById(METADATA_ID).lean() as { lastPurgedAt?: string } | null;
  return meta?.lastPurgedAt || new Date().toISOString();
}

export async function getDiaryEntries(): Promise<DiaryEntry[]> {
  // Purge expired entries whenever diaries are requested
  await purgeOldDiaries();
  const docs = await Diaries.find().sort({ date: -1, createdAt: -1 }).lean();
  return docs.map((d) => clean<DiaryEntry>(d) as DiaryEntry);
}

export async function addDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt'>): Promise<DiaryEntry> {
  await ready();
  const newEntry: DiaryEntry = {
    ...entry,
    campus: entry.campus || 'Darusslam Campus',
    id: 'diary-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };
  await Diaries.create(newEntry);
  return newEntry;
}

export async function deleteDiaryEntry(id: string): Promise<boolean> {
  await ready();
  const result = await Diaries.deleteOne({ id });
  return (result.deletedCount ?? 0) > 0;
}

export async function findDiaryById(id: string): Promise<DiaryEntry | undefined> {
  await ready();
  return clean<DiaryEntry>(await Diaries.findOne({ id }).lean());
}

export async function updateDiaryEntry(
  id: string,
  updates: Partial<Omit<DiaryEntry, 'id' | 'createdAt'>>
): Promise<DiaryEntry | undefined> {
  await ready();
  const set = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
  const doc = await Diaries.findOneAndUpdate({ id }, { $set: set }, { new: true }).lean();
  return clean<DiaryEntry>(doc);
}

// --------------------------------------------------------------- students

export async function findStudentByName(name: string): Promise<StudentUser | undefined> {
  await ready();
  const cleaned = String(name || '').trim();
  if (!cleaned) return undefined;
  const matches = await Students.find({ name: { $regex: '^' + cleaned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', $options: 'i' } }).limit(2).lean();
  if (matches.length !== 1) return undefined;
  return clean<StudentUser>(matches[0]);
}

export async function registerStudent(input: { name: string; rollNumber: string; phone: string; campus: string; password: string }): Promise<StudentUser> {
  await ready();
  const rollNumber = input.rollNumber.trim();
  const existing = await Students.findOne({ rollNumber }).collation({ locale: 'en', strength: 2 }).lean();
  if (existing) throw new Error('This GR number is already registered. Please log in.');
  const student: StudentUser = { id: 's-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7), name: input.name.trim(), rollNumber, phone: input.phone.trim(), campus: input.campus, grade: '', section: '', passwordHash: hashPassword(input.password), active: true, registeredAt: new Date().toISOString() };
  await Students.create(student);
  return student;
}

export async function findStudentByRoll(rollNumber: string): Promise<StudentUser | undefined> {
  await ready();
  const clean_ = String(rollNumber || '').trim();
  if (!clean_) return undefined;
  // strength 2 = case-insensitive, same as the old toLowerCase() comparison
  const doc = await Students.findOne({ rollNumber: clean_ })
    .collation({ locale: 'en', strength: 2 })
    .lean();
  return clean<StudentUser>(doc);
}

export async function findStudentById(id: string): Promise<StudentUser | undefined> {
  await ready();
  return clean<StudentUser>(await Students.findOne({ id }).lean());
}

export function verifyStudentPassword(student: StudentUser, password: string): boolean {
  return verifyPassword(password, student.passwordHash);
}

// --------------------------------------------------------------- teachers

export async function findTeacherByPhone(phone: string): Promise<TeacherUser | undefined> {
  await ready();
  const cleaned = normalizePhone(phone);
  if (!cleaned) return undefined;

  const direct = await Teachers.findOne({ phone: cleaned }).lean();
  if (direct) return clean<TeacherUser>(direct);

  // Fallback for records stored with spaces/dashes/+92 - the school is small, so a scan is fine.
  const all = await Teachers.find().lean();
  return clean<TeacherUser>(all.find((t) => normalizePhone(String(t.phone || '')) === cleaned));
}

export async function findTeacherById(id: string): Promise<TeacherUser | undefined> {
  await ready();
  return clean<TeacherUser>(await Teachers.findOne({ id }).lean());
}

// Insert or update a teacher. A field set to `undefined` is REMOVED from the
// stored record (e.g. clearing `lockedUntil` after a successful login).
export async function saveTeacher(teacher: TeacherUser): Promise<void> {
  await ready();
  const record: Doc = { ...teacher, phone: normalizePhone(teacher.phone) };
  const set: Doc = {};
  const unset: Doc = {};
  for (const [key, value] of Object.entries(record)) {
    if (key === '_id' || key === '__v') continue;
    if (value === undefined) unset[key] = '';
    else set[key] = value;
  }
  const update = Object.keys(unset).length ? { $set: set, $unset: unset } : { $set: set };
  await Teachers.updateOne({ id: teacher.id }, update, { upsert: true });
}

// Update teacher profile (name, designation, campus, subjects) permanently
export async function updateTeacherProfile(
  id: string,
  updates: { name?: string; designation?: string; campus?: string; subjects?: string[] }
): Promise<TeacherUser | null> {
  await ready();
  const set: Doc = {};

  if (updates.name && updates.name.trim()) set.name = updates.name.trim();
  if (updates.designation !== undefined) set.designation = updates.designation.trim();
  if (updates.campus && updates.campus.trim()) set.campus = updates.campus.trim();
  if (updates.subjects && Array.isArray(updates.subjects)) set.subjects = updates.subjects;

  const doc = Object.keys(set).length
    ? await Teachers.findOneAndUpdate({ id }, { $set: set }, { new: true }).lean()
    : await Teachers.findOne({ id }).lean();
  return clean<TeacherUser>(doc) ?? null;
}

// Helper for account creation (used by admin tools)
export async function createTeacherAccount(input: {
  name: string;
  phone: string;
  password: string;
  role?: TeacherRole;
  designation?: string;
  campus?: string;
  mustChangePassword?: boolean;
}): Promise<TeacherUser> {
  await ready();
  const phone = normalizePhone(input.phone);
  if (await findTeacherByPhone(phone)) {
    throw new Error('A teacher with this phone number already exists.');
  }
  const teacher: TeacherUser = {
    id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: input.name.trim(),
    phone,
    role: input.role || 'teacher',
    passwordHash: hashPassword(input.password),
    mustChangePassword: input.mustChangePassword ?? true,
    passwordChangedAt: new Date().toISOString(),
    failedAttempts: 0,
    active: true,
    designation: input.designation || '',
    campus: input.campus || 'Darusslam Campus',
    subjects: [],
    assignedGrades: [],
    registeredAt: new Date().toISOString(),
  };
  await Teachers.create(teacher);
  return teacher;
}

export async function createAuditLog(log: { action: string; teacherId?: string; teacherName?: string; teacherPhone?: string; campus?: string; grade?: string; section?: string; diaryId?: string; blogId?: string; ip?: string; userAgent?: string; details?: string }): Promise<void> {
  await ready();
  await AuditLogs.create({ ...log, createdAt: new Date().toISOString() });
}

export async function getBlogPosts(): Promise<Doc[]> {
  await ready();
  return (await Blogs.find().sort({ createdAt: -1 }).lean()).map((d) => clean<Doc>(d) as Doc);
}

export async function createBlogPost(post: { title: string; excerpt: string; content: string[]; category: string; author: string; role: string; campus: string; teacherId: string; teacherPhone: string; imageUrl: string; tags: string[] }): Promise<Doc> {
  await ready();
  const record = { ...post, id: 'blog-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7), date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), readTime: Math.max(1, Math.ceil(post.content.join(' ').split(/\s+/).length / 200)) + ' min read', createdAt: new Date().toISOString() };
  await Blogs.create(record);
  return record;
}
