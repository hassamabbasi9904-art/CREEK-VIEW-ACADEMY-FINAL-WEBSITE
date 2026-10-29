import crypto from 'node:crypto';

/**
 * Password hashing using Node's built-in scrypt (no extra dependencies).
 * Stored format:  scrypt$N$r$p$<salt base64>$<hash base64>
 * Every password gets its own random salt, so identical passwords never
 * produce identical hashes.
 */

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;
const SALT_LEN = 16;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

// Passwords that were hard-coded / displayed in the old login screen.
const KNOWN_WEAK_PASSWORDS = new Set(['teacher@creek123', 'password', '12345678', 'creek123']);

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LEN);
  const hash = crypto.scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return ['scrypt', SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString('base64'), hash.toString('base64')].join('$');
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
    const N = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    const salt = Buffer.from(parts[4], 'base64');
    const expected = Buffer.from(parts[5], 'base64');
    const actual = crypto.scryptSync(password, salt, expected.length, { N, r, p });
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// Used when the phone number does not exist, so response time looks the same
// as for a wrong password (prevents guessing which numbers are registered).
let dummyHash: string | null = null;
export function verifyAgainstDummy(password: string): void {
  if (!dummyHash) dummyHash = hashPassword(crypto.randomBytes(8).toString('hex'));
  verifyPassword(password, dummyHash);
}

export function validatePasswordStrength(password: string, phone?: string): string | null {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.`;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  if (KNOWN_WEAK_PASSWORDS.has(password.toLowerCase())) {
    return 'This password is too common. Please choose a different password.';
  }
  if (phone && password.replace(/\D/g, '') === phone.replace(/\D/g, '')) {
    return 'Your password cannot be your phone number.';
  }
  return null;
}

/** Random one-time password (shown once to the admin, then must be changed). */
export function generateTempPassword(): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(12);
  let out = '';
  for (let i = 0; i < 12; i++) out += alphabet[bytes[i] % alphabet.length];
  // guarantee at least one digit and one letter
  return out.slice(0, 10) + '7' + 'k';
}

export function normalizePhone(phone: string): string {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) digits = '0' + digits.slice(2);
  return digits;
}

export interface IssuedCredential {
  name: string;
  phone: string;
  tempPassword: string;
}

interface MigratableTeacher {
  id: string;
  name?: string;
  phone: string;
  role?: string;
  pin?: string;
  password?: string;
  passwordHash?: string;
  mustChangePassword?: boolean;
  failedAttempts?: number;
  lockedUntil?: string;
  active?: boolean;
  [key: string]: unknown;
}

/**
 * Upgrades old teacher records (plain-text `password` + `pin`) to the new format.
 * Old shared passwords are NOT carried over: each teacher gets a fresh random
 * one-time password and must change it at first login.
 * Returns the credentials that were issued (so the caller can show them once).
 */
export function migrateTeachers(teachers: MigratableTeacher[]): { changed: boolean; issued: IssuedCredential[] } {
  const issued: IssuedCredential[] = [];
  let changed = false;

  for (const t of teachers) {
    if (!t.role) {
      t.role = t.id === 't-1' ? 'admin' : 'teacher';
      changed = true;
    }
    if (t.active === undefined) {
      t.active = true;
      changed = true;
    }
    if (t.failedAttempts === undefined) {
      t.failedAttempts = 0;
      changed = true;
    }

    if (!t.passwordHash) {
      const temp = generateTempPassword();
      t.passwordHash = hashPassword(temp);
      t.mustChangePassword = true;
      issued.push({ name: String(t.name || ''), phone: t.phone, tempPassword: temp });
      changed = true;
    }

    if ('password' in t) {
      delete t.password;
      changed = true;
    }
    if ('pin' in t) {
      delete t.pin;
      changed = true;
    }
  }

  return { changed, issued };
}
