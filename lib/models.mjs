import mongoose from 'mongoose';

const recordOptions = { strict: false, versionKey: false, id: false };

const teacherSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  designation: String,
  campus: String,
  phone: String,
  subjects: { type: [String], default: undefined },
  assignedGrades: { type: [String], default: undefined },
  registeredAt: String,
  role: String,
  active: Boolean,
  failedAttempts: Number,
  passwordHash: String,
  mustChangePassword: Boolean,
  passwordChangedAt: String,
  lockedUntil: String,
}, recordOptions);

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true },
  name: String,
  phone: String,
  grade: String,
  section: String,
  campus: String,
  guardianName: String,
  passwordHash: String,
  active: Boolean,
  registeredAt: String,
}, recordOptions);

const diarySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: String,
  grade: String,
  section: String,
  subject: String,
  campus: String,
  teacherId: String,
  teacherName: String,
  teacherDesignation: String,
  teacherPhone: String,
  title: String,
  homeworkText: String,
  imageUrl: String,
  createdAt: String,
}, recordOptions);

const blogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: String,
  content: { type: [String], default: [] },
  category: String,
  author: String,
  role: String,
  campus: String,
  teacherId: String,
  teacherPhone: String,
  date: String,
  readTime: String,
  imageUrl: String,
  tags: { type: [String], default: [] },
  createdAt: String,
}, recordOptions);

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  teacherId: String,
  teacherName: String,
  teacherPhone: String,
  campus: String,
  grade: String,
  section: String,
  diaryId: String,
  blogId: String,
  ip: String,
  userAgent: String,
  details: String,
  createdAt: { type: String, required: true },
}, recordOptions);

const metadataSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  lastPurgedAt: String,
}, { strict: false, versionKey: false, id: false });

// Login sessions. Only a SHA-256 hash of the cookie token is stored.
// `expireAt` is the absolute expiry; MongoDB's TTL monitor deletes the
// document automatically some time after that moment.
const sessionOptions = { strict: false, versionKey: false, id: false };

const sessionSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  teacherId: { type: String, required: true, index: true },
  createdAt: Number,
  lastSeenAt: Number,
  expiresAt: Number,
  absoluteExpiresAt: Number,
  expireAt: { type: Date, index: { expireAfterSeconds: 0 } },
}, sessionOptions);

const studentSessionSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, index: true },
  createdAt: Number,
  lastSeenAt: Number,
  expiresAt: Number,
  absoluteExpiresAt: Number,
  expireAt: { type: Date, index: { expireAfterSeconds: 0 } },
}, sessionOptions);

export const TeacherModel = mongoose.models.TeacherRecord
  || mongoose.model('TeacherRecord', teacherSchema, 'teachers');
export const StudentModel = mongoose.models.StudentRecord
  || mongoose.model('StudentRecord', studentSchema, 'students');
export const DiaryModel = mongoose.models.DiaryRecord
  || mongoose.model('DiaryRecord', diarySchema, 'diaries');
export const SchoolMetadataModel = mongoose.models.SchoolMetadata
  || mongoose.model('SchoolMetadata', metadataSchema, 'school_metadata');
export const SessionModel = mongoose.models.SessionRecord
  || mongoose.model('SessionRecord', sessionSchema, 'sessions');
export const StudentSessionModel = mongoose.models.StudentSessionRecord
  || mongoose.model('StudentSessionRecord', studentSessionSchema, 'student_sessions');

export const BlogModel = mongoose.models.BlogRecord || mongoose.model('BlogRecord', blogSchema, 'blogs');
export const AuditLogModel = mongoose.models.AuditLogRecord || mongoose.model('AuditLogRecord', auditLogSchema, 'audit_logs');
