<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Login & Security (Teacher Portal)

- **Passwords are hashed** (scrypt, unique salt per password). Plain-text passwords/PINs are never stored.
- **No public sign-up.** Only the admin creates teacher accounts, from the server:
  - `npm run teachers -- list`
  - `npm run teachers -- add --phone 03001234567 --name "Miss Sana" --campus "Lucknow Campus"`
  - `npm run teachers -- reset-password --phone 03001234567`
  - `npm run teachers -- disable --phone 03001234567` (and `enable`)
  - New / reset accounts get a random one-time password; the teacher must change it at first login.
- **Sessions**: random token in an `HttpOnly`, `SameSite=Lax` (and `Secure` in production) cookie. The server stores only a hash of the token. Idle expiry 7 days, hard limit 30 days. Logout and password change end sessions on the server.
- **Access separation**: students/parents only use the public read-only diary (`GET /api/diary`, no phone numbers shown). Posting/deleting diaries needs a teacher login; teachers can delete only their own entries, `admin` can delete any.
- **Brute-force protection**: 5 wrong passwords lock the account for 15 minutes; per-IP throttling too.
- `data/sessions.json` is created automatically and is git-ignored. Set `CREEK_DATA_DIR` to keep data in a different folder (e.g. a persistent volume).


## Phase 4 — Student Portal & Daily Diary
- Student login uses a separate secure HttpOnly session cookie (`creek_student_session`).
- Student passwords are stored as salted scrypt hashes, never plain text.
- Student portal is protected by middleware and server-side session validation.
- Each logged-in student only receives diary entries matching their grade, section and campus.
- Teachers can add, edit and delete their own diary entries; admins can manage all entries.
- Sessions persist for up to 7 days of inactivity (30-day absolute limit) and are renewed while active.

### Demo student account
- Roll number: `1001`
- Password: `Student@123`
- Class: Class 9 (A)
- Campus: Darusslam Campus

Change the demo password/account before production use.

## MongoDB Atlas data import

The initial school records are in `data/school_database.json`. The importer
creates the `teachers`, `students`, `diaries`, and `school_metadata` collections
in the configured database. It inserts by each record's stable `id` using
insert-only upserts, so an existing record is never overwritten or deleted.
`lastPurgedAt` is kept in the singleton `school_metadata` document.

1. In MongoDB Atlas, create a cluster if needed, then create a database user in
   **Database Access**.
2. In **Network Access**, allow the IP address of the machine running the
   import. Avoid allowing access from anywhere (`0.0.0.0/0`) unless you
   deliberately accept that exposure.
3. Choose **Connect → Drivers**, select Node.js, and copy the connection URI.
   Replace its username, password, and cluster host as instructed by Atlas.
4. Copy `.env.example` to `.env.local`; set `MONGODB_URI` and, if desired,
   `MONGODB_DB`. Keep `.env.local` private and never paste the URI into chat,
   commit it, or expose it to browser code.
5. Run `npm run import:school-data`. The command reports inserted and already
   present records, collection totals, and verifies representative records.
   It is safe to rerun; records with existing IDs are preserved unchanged.

In Atlas, open **Browse Collections**, select the configured database, then
open `teachers`, `students`, `diaries`, or `school_metadata` to inspect records.

## The app now runs on MongoDB Atlas

All reads and writes (teacher/student login, sessions, diaries, profile
updates) go to MongoDB Atlas. `data/school_database.json` is only the one-time
source for `npm run import:school-data`; the app no longer reads or writes it.

First-time setup:
1. Set `MONGODB_URI` and `MONGODB_DB` in `.env.local`.
2. Run `npm run import:school-data` once to load the existing teachers,
   students and diaries into Atlas.
3. Start the app (`npm run dev`). Everyone has to log in again, because the old
   `data/sessions.json` sessions are not carried over.

Collections: `teachers`, `students`, `diaries`, `school_metadata`, `sessions`,
`student_sessions` (sessions delete themselves automatically via a TTL index).

Teacher accounts are managed with `npm run teachers -- list|add|reset-password|disable|enable`
(see `scripts/manage-teachers.mjs`); it now edits Atlas too.

## Phase 5 — Website Features
- Footer Facebook link updated to the supplied school Facebook share URL.
- Campus Google Maps links are preserved and open the relevant school campus location query.
- Existing chatbot and website pages/components are preserved.

## Campus Diary, Student Login, Teacher Audit & Blog

### Required private environment variables

Keep these in the local `.env.local` file only; never commit or share that file:

- `MONGODB_URI` and optionally `MONGODB_DB`
- `CAMPUS_PASSWORD_DARUSSLAM`
- `CAMPUS_PASSWORD_LUCKNOW`
- `CAMPUS_PASSWORD_ZAMAN_TOWN`

Use three different, strong campus passwords. They are checked server-side and are not sent to the browser. The example names/values are in `.env.example`; replace the placeholder values in `.env.local` with passwords chosen by the school.

### Implemented access rules

- Teachers log in with name, designation, phone, campus, and that campus's shared password. Diary uploads are locked to the teacher's assigned campus.
- Diary entries are stored in MongoDB and the active diary view purges entries outside today and the previous two dates whenever the diary is requested. Teacher accounts and audit logs are not part of this cleanup.
- `audit_logs` records teacher login, diary create/update/delete and blog publishing, including teacher name, phone, campus, class/section where relevant, timestamp, and request metadata.
- First-time students register with name, GR number, phone, campus, and password. Later they can log in with their registered name and password. Password hashes, not plain-text passwords, are stored.
- Diary API requests require a valid student or teacher session. Students can only retrieve diary entries from their registered campus; attempts to select another campus are blocked.
- Logged-in teachers can publish a blog at `/teacher/dashboard/blog`; posts are saved in the `blogs` collection and appear on the public Blog page. Teacher phone numbers are not exposed by the public blog API.

### Start locally

1. Add the MongoDB URI and the three campus passwords to `.env.local`.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL shown in the terminal.
