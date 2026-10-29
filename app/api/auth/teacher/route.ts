import { NextRequest, NextResponse } from 'next/server';
import { CAMPUSES, createAuditLog, createTeacherAccount, findTeacherByPhone, saveTeacher } from '@/lib/db';
import { hashPassword, normalizePhone } from '@/lib/password';
import { SESSION_COOKIE, createSession, destroySession, setSessionCookie, clearSessionCookie, getAuth, publicTeacher, sameOriginOrReject, clientIp, ipRateLimited, recordIpFailure, clearIpFailures } from '@/lib/auth';

const cleanEnv = (v?: string) => {
  if(!v) return undefined;
  return v.trim().replace(/^["']|["']$/g, '').trim();
};

const campusEnv: Record<string,string|undefined> = {
  'Darusslam Campus': cleanEnv(process.env.CAMPUS_PASSWORD_DARUSSLAM || process.env.CAMPUS_PASSWORD_DARUSSALAM),
  'Lucknow Campus': cleanEnv(process.env.CAMPUS_PASSWORD_LUCKNOW),
  'Zaman Town Campus': cleanEnv(process.env.CAMPUS_PASSWORD_ZAMAN_TOWN),
};

const ADMIN_PASSWORD = cleanEnv(process.env.ADMIN_PASSWORD) || 'admin.cva123';
const ADMIN_CAMPUS = 'ALL CAMPUSES';

const json=(body:Record<string,unknown>,status=200)=>{const r=NextResponse.json(body,{status});r.headers.set('Cache-Control','no-store');return r;};

export async function GET(req:NextRequest){
  try { const auth=await getAuth(req); if(!auth)return json({success:false,loggedIn:false},401); return json({success:true,loggedIn:true,teacher:publicTeacher(auth.teacher)}); }
  catch { return json({success:false,loggedIn:false,message:'Database connection failed.'},503); }
}

export async function POST(req:NextRequest){
  const blocked=sameOriginOrReject(req);if(blocked)return blocked;
  try {
    const body=await req.json().catch(()=>null);if(!body||typeof body!=='object')return json({success:false,message:'Invalid request.'},400);
    const ip=clientIp(req);if(ipRateLimited(ip))return json({success:false,message:'Too many login attempts. Please try again in 15 minutes.'},429);
    if(body.action==='logout'){await destroySession(req.cookies.get(SESSION_COOKIE)?.value);const r=json({success:true,message:'Logged out.'});clearSessionCookie(r);return r;}
    const name=typeof body.name==='string'?body.name.trim():'';
    const designation=typeof body.designation==='string'?body.designation.trim():'';
    const phone=normalizePhone(typeof body.phone==='string'?body.phone:'');
    let campus=typeof body.campus==='string'?body.campus.trim():'';
    const password=typeof body.password==='string'?body.password.trim():'';
    const isAdminRequest = password === ADMIN_PASSWORD;

    if(!name||!designation||!phone||!campus||!password)return json({success:false,message:'Please complete all required fields.'},400);
    if(name.length>100||designation.length>100||!/^03\d{9}$/.test(phone))return json({success:false,message:'Please check the name, designation, or phone number.'},400);

    if(isAdminRequest){
      clearIpFailures(ip);
      let teacher=await findTeacherByPhone(phone);
      if(!teacher){
        teacher=await createTeacherAccount({name,phone,password: ADMIN_PASSWORD,role:'admin',designation: designation || 'Administrator',campus: ADMIN_CAMPUS,mustChangePassword:false});
      }else{
        teacher={...teacher,name,phone,designation: designation || teacher.designation || 'Administrator',campus: ADMIN_CAMPUS,active:true,role: 'admin' as any,passwordHash: teacher.passwordHash || hashPassword(ADMIN_PASSWORD),mustChangePassword:false,failedAttempts:0,lockedUntil:undefined};
        await saveTeacher(teacher);
      }
      const session=await createSession(teacher.id);
      await createAuditLog({action:'teacher_admin_login',teacherId:teacher.id,teacherName:teacher.name,teacherPhone:teacher.phone,campus: ADMIN_CAMPUS,ip:req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'',userAgent:req.headers.get('user-agent')||'',details:'Admin login'});
      const r=json({success:true,message:'Admin login successful.',teacher:publicTeacher(teacher)});setSessionCookie(r,session.token,session.maxAgeSeconds);return r;
    }

    if(!(CAMPUSES as readonly string[]).includes(campus))return json({success:false,message:'Please select a valid campus.'},400);
    const expected=campusEnv[campus];
    if(!expected)return json({success:false,message:`The password for ${campus} has not been configured.`},503);
    if(password!==expected){recordIpFailure(ip);return json({success:false,message:`The password for this campus is incorrect. Expected format check server logs.`},401);}
    clearIpFailures(ip);

    let teacher=await findTeacherByPhone(phone);
    if(teacher&&teacher.campus&&teacher.campus!==campus&&teacher.role!=='admin')return json({success:false,message:'This phone number is registered with another campus.'},403);
    if(!teacher){
      teacher=await createTeacherAccount({name,phone,password:expected,role:'teacher',designation,campus,mustChangePassword:false});
    }else{
      teacher={...teacher,name,phone,designation,campus,active:true,passwordHash:teacher.passwordHash||hashPassword(expected),mustChangePassword:false,failedAttempts:0,lockedUntil:undefined};
      await saveTeacher(teacher);
    }
    const session=await createSession(teacher.id);
    await createAuditLog({action:'teacher_login',teacherId:teacher.id,teacherName:teacher.name,teacherPhone:teacher.phone,campus,ip:req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'',userAgent:req.headers.get('user-agent')||'',details:'Campus password login'});
    const r=json({success:true,message:'Login successful.',teacher:publicTeacher(teacher)});setSessionCookie(r,session.token,session.maxAgeSeconds);return r;
  }catch(error){console.error('Teacher login error:',error);return json({success:false,message:'Login could not be completed.'},500);}
}