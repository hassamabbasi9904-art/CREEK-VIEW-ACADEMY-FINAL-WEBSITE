#!/usr/bin/env node
/**
 * Teacher account admin tool (there is NO public sign-up: only the school admin
 * can create accounts or reset passwords, by running this on a trusted machine).
 * It reads and writes the MongoDB Atlas database configured in .env.local.
 *
 *   node scripts/manage-teachers.mjs list
 *   node scripts/manage-teachers.mjs add --phone 03001234567 --name "Miss Sana" [--designation "Math Teacher"] [--campus "Lucknow Campus"] [--admin]
 *   node scripts/manage-teachers.mjs reset-password --phone 03001234567
 *   node scripts/manage-teachers.mjs disable --phone 03001234567
 *   node scripts/manage-teachers.mjs enable  --phone 03001234567
 *
 * add / reset-password print a random one-time password. The teacher must change
 * it at first login.
 */
import nextEnv from '@next/env';
import mongoose from 'mongoose';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectToMongoDB } from '../lib/mongodb.mjs';
import { SessionModel, TeacherModel } from '../lib/models.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
nextEnv.loadEnvConfig(projectRoot);

const CAMPUSES = ['Darusslam Campus', 'Lucknow Campus', 'Zaman Town Campus'];

// ---- same scrypt format as lib/password.ts ----
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return ['scrypt', 16384, 8, 1, salt.toString('base64'), hash.toString('base64')].join('$');
}
function tempPassword() {
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(10);
  let out = '';
  for (let i = 0; i < 10; i++) out += alphabet[bytes[i] % alphabet.length];
  return out + '7k';
}
function normalizePhone(phone) {
  let d = String(phone || '').replace(/\D/g, '');
  if (d.startsWith('92') && d.length === 12) d = '0' + d.slice(2);
  return d;
}

function args() {
  const out = { _: [] };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith('--')) {
      const key = a[i].slice(2);
      const next = a[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else { out[key] = next; i++; }
    } else out._.push(a[i]);
  }
  return out;
}

function need(opts, key) {
  if (!opts[key] || opts[key] === true) {
    console.error(`Missing --${key}`);
    process.exit(1);
  }
  return String(opts[key]);
}

async function findByPhone(phone) {
  const p = normalizePhone(phone);
  const direct = await TeacherModel.findOne({ phone: p }).lean();
  if (direct) return direct;
  const all = await TeacherModel.find().lean();
  return all.find((t) => normalizePhone(t.phone) === p) || null;
}

async function main() {
  const opts = args();
  const cmd = opts._[0];
  if (!['list', 'add', 'reset-password', 'disable', 'enable'].includes(cmd)) {
    console.log('Commands: list | add | reset-password | disable | enable\nSee the comment at the top of scripts/manage-teachers.mjs');
    return;
  }

  await connectToMongoDB();

  if (cmd === 'list') {
    const teachers = await TeacherModel.find().sort({ name: 1 }).lean();
    for (const t of teachers) {
      console.log(
        `${t.id}\t${t.phone}\t${t.name || '(no name)'}\t${t.role || 'teacher'}\t${t.active === false ? 'DISABLED' : 'active'}` +
          `${t.mustChangePassword ? '\tmust-change-password' : ''}${t.passwordHash ? '' : '\tNO-PASSWORD-SET'}`
      );
    }
    console.log(`\n${teachers.length} teacher(s).`);
  } else if (cmd === 'add') {
    const phone = normalizePhone(need(opts, 'phone'));
    const name = need(opts, 'name');
    if (!/^03\d{9}$/.test(phone)) { console.error('Phone must look like 03XXXXXXXXX'); process.exit(1); }
    if (await findByPhone(phone)) { console.error('A teacher with this phone already exists.'); process.exit(1); }
    const campus = opts.campus && opts.campus !== true ? String(opts.campus) : 'Darusslam Campus';
    if (!CAMPUSES.includes(campus)) { console.error(`Campus must be one of: ${CAMPUSES.join(', ')}`); process.exit(1); }
    const pw = tempPassword();
    await TeacherModel.create({
      id: 't-' + Date.now() + '-' + crypto.randomBytes(2).toString('hex'),
      name,
      phone,
      role: opts.admin ? 'admin' : 'teacher',
      passwordHash: hashPassword(pw),
      mustChangePassword: true,
      passwordChangedAt: new Date().toISOString(),
      failedAttempts: 0,
      active: true,
      designation: opts.designation && opts.designation !== true ? String(opts.designation) : '',
      campus,
      subjects: [],
      assignedGrades: [],
      registeredAt: new Date().toISOString(),
    });
    console.log(`Created ${name} (${phone}).\nOne-time password: ${pw}\n(They must change it at first login. This is shown only once.)`);
  } else if (cmd === 'reset-password') {
    const t = await findByPhone(need(opts, 'phone'));
    if (!t) { console.error('Teacher not found.'); process.exit(1); }
    const pw = tempPassword();
    await TeacherModel.updateOne(
      { id: t.id },
      { $set: { passwordHash: hashPassword(pw), mustChangePassword: true, failedAttempts: 0 }, $unset: { lockedUntil: '' } }
    );
    await SessionModel.deleteMany({ teacherId: t.id });
    console.log(`New one-time password for ${t.name || t.phone}: ${pw}\n(All their old sessions were logged out. Shown only once.)`);
  } else if (cmd === 'disable' || cmd === 'enable') {
    const t = await findByPhone(need(opts, 'phone'));
    if (!t) { console.error('Teacher not found.'); process.exit(1); }
    const active = cmd === 'enable';
    await TeacherModel.updateOne({ id: t.id }, { $set: { active } });
    if (!active) await SessionModel.deleteMany({ teacherId: t.id });
    console.log(`${t.name || t.phone} is now ${active ? 'active' : 'disabled'}.`);
  }
}

main()
  .catch((error) => {
    const uri = process.env.MONGODB_URI;
    let message = error instanceof Error ? error.message : String(error);
    if (uri) message = message.split(uri).join('[redacted MongoDB URI]');
    console.error(`Teacher admin tool failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
