# Verification report

Facts only: what was run, what passed, what is missing. No estimates.

## 1. Handoff verification

Read from the repository, not assumed:

- Django 6.x + DRF backend, custom `accounts.User` with a six-value `role`
  enum, JWT via SimpleJWT (`rest_framework_simplejwt`).
- Authentication is password + emailed six-digit OTP. `verify-otp` returns
  `username`, `role`, `access`, `refresh`. There is **no** current-user
  endpoint.
- `GET /api/accounts/csrf/` is the only CSRF bootstrap; browser POSTs to
  `login` / `verify-otp` are CSRF-protected, DRF views are not.
- No CORS configuration. The frontend must proxy the API same-origin.
- Only audit logs are paginated (20/page). Every other list returns a full
  array (projects: `{"projects": [...]}`).
- The `project_name` read-only field on assignments used
  `source="project.name"`, but `Project` has no `name` field.
- The four attendance tests still posted a free-text `worker_name` after the
  serializer made `worker` a required registered ID.

## 2. Architecture

| Part | Stack | Where it runs |
|------|-------|---------------|
| API | Django, DRF, SimpleJWT, WhiteNoise, Postgres | Vercel project `satpura-jaivik-api`, root directory, Python runtime |
| Database | Neon Postgres (Vercel Marketplace integration) | `DATABASE_URL`, pooled connection string |
| Web | Next.js 15.5.12 App Router, TypeScript, Tailwind 4, Lucide | Vercel project `satpura-jaivik`, root directory `frontend` |

- Browser → Next.js same-origin rewrite `/backend/api/:path*` → `${DJANGO_ORIGIN}/api/:path*`. `skipTrailingSlashRedirect: true`; the destination ends in `/` because Django routes do.
- Tokens in `sessionStorage`, mirrored in memory; single-flight refresh on 401, then sign-out if the refresh fails.
- Role from `verify-otp`, cached with the session.
- Production URLs: <https://satpura-jaivik.vercel.app> (web), <https://satpura-jaivik-api.vercel.app> (API).

## 3. Pages

| Route | Contents |
|-------|----------|
| `/login`, `/verify-otp` | Password step, six-digit OTP step |
| `/dashboard` | Counts composed from the list endpoints the role may read |
| `/projects`, `/projects/new`, `/projects/[id]`, `/projects/[id]/edit` | List, create, detail (incl. expenses, work logs, labour summary), edit |
| `/workers`, `/workers/new`, `/workers/[id]` | Worker directory and edit |
| `/assignments`, `/assignments/new`, `/assignments/[id]` | Assignments |
| `/work-logs`, `/work-logs/new`, `/work-logs/[id]` | Daily logs |
| `/attendance`, `/attendance/new` | Attendance list, mark present/half-day/absent |
| `/expenses`, `/expenses/new`, `/expenses/[id]` | Expenses with status filter, submit, review |
| `/audit-logs` | Paginated audit trail |
| `/farmer-profiles`, `/farmer-profiles/new`, `/farmer-profiles/[id]` | Farmer profiles |

Nav items are filtered by role, but the API remains the authority.

## 4. Endpoints the frontend calls

`POST /api/accounts/login/`, `POST /api/accounts/verify-otp/`,
`POST /api/accounts/logout/`, `GET /api/accounts/csrf/`,
`GET|POST /api/accounts/farmer-profiles/`,
`GET|PATCH /api/accounts/farmer-profiles/<id>/`,
`GET /api/projects/`, `GET /api/projects/<id>/`, `POST /api/projects/create/`,
`PATCH /api/projects/<id>/update/`,
`GET /api/work-logs/`, `GET /api/work-logs/<id>/`, `POST /api/work-logs/`,
`GET|POST /api/work-logs/workers/`, `GET|PATCH /api/work-logs/workers/<id>/`,
`GET|POST /api/work-logs/assignments/`,
`GET|PATCH /api/work-logs/assignments/<id>/`,
`GET /api/work-logs/projects/labour-summary/`,
`GET|POST /api/work-logs/attendance/`,
`GET /api/expenses/`, `POST /api/expenses/`,
`POST /api/expenses/<id>/review/`,
`GET /api/audit-logs/?page=<n>`,
`POST /api/token/refresh/`.

No endpoint is invented; pages that would need one show the server response
instead.

## 5. Backend changes

| Change | Files |
|--------|-------|
| Assignment `project_name` built from ID + crop instead of the missing `project.name` (three regression tests, including empty crop) | `worklogs/serializers.py`, `worklogs/tests.py` |
| Attendance tests updated to the registered-worker contract; duplicate expectation is 409 (stale tests, not weakened) | `worklogs/tests_attendance.py` |
| Mail configuration moved to `MAILERS` only; `EMAIL_BACKEND` removed because Django 6.1 rejects mixing them. SMTP is selected when `EMAIL_HOST` is set, console otherwise | `config/settings.py` |
| `DATABASE_URL` + `DB_CONN_MAX_AGE` (default 0) support; `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, `SECURE_HSTS_SECONDS` from environment; WhiteNoise | `config/settings.py`, `requirements.txt` |
| Idempotent `bootstrap_users` command for first hosted accounts | `accounts/management/commands/bootstrap_users.py` |
| Vercel deploy support: upload ignore list, build command in project settings | `.vercelignore` |
| Docs rewritten for the live Vercel topology; superseded `render.yaml` removed | `docs/DEPLOYMENT.md`, `docs/API_CONTRACT.md`, `.env.example` |

## 6. Run commands

```bash
# backend
.venv/Scripts/python.exe manage.py migrate
.venv/Scripts/python.exe manage.py runserver 8000
.venv/Scripts/python.exe manage.py test --verbosity 1

# frontend
cd frontend
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```

Local frontend env (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_BASE_URL=/backend
DJANGO_ORIGIN=http://127.0.0.1:8000
```

## 7. Test counts

| Suite | Result |
|-------|--------|
| Django (`manage.py test`) | **70 tests, OK** (Django 6.1.2 from `.venv`, ~5 min) |
| Frontend (`npm run test`) | **41 tests passed, 10 files** |
| `npm run typecheck` | clean |
| `npm run lint` | clean |
| `manage.py check` | no issues |

Pre-existing baseline before this work: 66 tests with 4 attendance failures.

## 8. Build result

`npm run build` succeeds; every route compiles (static or dynamic), shared
first-load JS 102 kB. Both Vercel projects build from the same repository and
report `Ready`.

Backend build command:
`python manage.py collectstatic --noinput && python manage.py migrate --noinput && python manage.py bootstrap_users`.

## 9. Integration evidence (production)

Run against `https://satpura-jaivik.vercel.app/backend` (the same-origin proxy)
and `https://satpura-jaivik-api.vercel.app` directly:

- `GET /api/accounts/csrf/` → 200 `{"message": "CSRF cookie set."}`
- `GET /api/projects/` unauthenticated → 401
- Admin OTP login → 200, role `SUPER_ADMINISTRATOR`; farmer profile created (201); project created (201, Soybean); worker created (201); assignment created (201) with `project_name: "Project #1 - Soybean"`
- Admin creating a work log → 403 `Only supervisors can submit daily work logs.` (role enforcement, not a silent failure)
- Supervisor OTP login → 200, role `SUPERVISOR`; work log created (201); attendance created (201); duplicate attendance → 409; expense created (201, `PENDING`); labour summary → 200 (`present_count: 1`, `labour_cost: 350`); audit logs → 403
- Admin approves the supervisor's expense → 200, `status: APPROVED`, `reviewed_by: satpura_admin`
- Re-review of an approved expense → 400 (transition is one-shot)
- Admin reviewing their own expense → 403
- Farmer OTP login → 200, role `FARMER`; own project list 200; own project detail 200; project 999 → 404 `Project not found.`; expenses 200; work logs `[]`; attendance 403; audit logs 403; farmer profiles 200; project create 403
- Browser: `/login` → `/verify-otp?challenge=…` → `/dashboard` shows 1 Projects, 1 Work Logs, 1 Attendance, 2 Expenses, 1 Pending Reviews, 14 Audit Events; reload on `/dashboard` keeps the session (`sj.user`, `sj.access`, `sj.refresh` present) and renders the nav with no failed requests; the Hindi switch changes the heading to डैशबोर्ड and nav to परियोजनाएँ / मजदूर / असाइनमेंट; switching back to English and reloading stays English
- Drawer close button is `md:hidden`; measured width 0 at desktop width

## 10. Unsupported / planned

Not implemented in the backend and therefore not in the UI:

- Media and receipt upload, notifications, offline sync, CCTV/IoT, OCR
- Current-user / session profile endpoint
- User management (create users, list supervisors, change roles) — Django admin only
- Delete project; update or delete work logs, attendance, expenses
- Server-side pagination/filter/search outside audit logs
- Dashboard aggregate endpoint (counts are composed client-side)
- i18n API (translations are in the frontend)
- Expense detail endpoint (the page derives the row from the list)

## 11. Known bugs and gaps

1. **OTP delivery in production uses the console mailer.** Codes appear only
   in the Vercel runtime log (`npx vercel logs --since 5m --json`). Real users
   will not receive a code until SMTP variables are set.
2. **Farmers see an empty work-log list and 403 on attendance for their own
   project.** `visible_work_logs` returns `none()` for `FARMER`. The UI shows
   the server response; it does not fabricate rows.
3. **No supervisor-directory endpoint**, so the project form takes a numeric
   supervisor account ID. The farmer field is a dropdown.
4. **Assignment `project_name` was broken upstream** (fixed here, but any other
   consumer of `project.name` would still break).
5. **Expense/attendance/work-log lists are unpaginated**; large datasets load
   in one response.
6. Untranslated strings: API error text returned by Django is English only
   (e.g. `Only supervisors can submit daily work logs.`). The UI labels,
   navigation, form fields, and statuses are translated.
7. A repository-root `vercel.json` is not used; a root config is also applied
   to the `frontend` project and breaks its build. Backend settings live in the
   Vercel project.

## 12. Verified vs untested

Verified: local integration for all three roles, 70 Django tests, 41 frontend
tests, typecheck, lint, production build, production OTP login for all three
roles, role enforcement (403/404/409/400 paths listed in section 9), production
UI render, session persistence across reload, English/Hindi switch.

Untested: real SMTP delivery; physical mobile devices and screen readers; large
datasets against pagination-free endpoints; concurrency on expense review
beyond the `select_for_update` in the view; long-running production uptime;
email content rendering in real clients.

## 13. Answers to the handoff questions

**A1. `.strip(" -")` in the serializer.** Replaced. `get_project_name` returns
`f"Project #{project_id}"` and appends `f" - {crop}"` only when the crop is
non-empty. No character stripping, so a crop containing dashes or spaces
survives. Covered by three tests, one with an empty crop.

**A2. Test independence.** `worklogs/tests_attendance.py` builds its own users,
project, worker, and assignment in `setUp` per test; no test depends on data
from another test or on ordering, and each `APITestCase` runs in a rolled-back
transaction.

**A3. Role source and session restore.** `POST /api/accounts/verify-otp/`
returns the role; there is no `/me`. The frontend stores `{username, role}`
next to the tokens in `sessionStorage`. On reload the cached role renders the
nav immediately; every request still carries the JWT and the backend decides.
A 401 triggers one refresh; if that fails the session is cleared and the user
returns to `/login`.

**A4. XSS trade-off of `sessionStorage`.** The backend returns tokens in the
JSON body, so any storage is JS-readable. `sessionStorage` limits the window to
the tab and dies with it, which is a smaller blast radius than `localStorage`
and avoids a backend change for httpOnly cookies. Mitigation in place: all
user text goes through React escaping and there is no
`dangerouslySetInnerHTML`, `innerHTML`, or `eval` anywhere in `frontend/src`.
Access tokens last 5 minutes.

**A5. Farmer and supervisor dropdowns.** The farmer field is a real dropdown
fed by `GET /api/accounts/farmer-profiles/`, which returns both `user` (the
account ID the API needs) and `username`. There is no supervisor-list endpoint
and no generic user listing, so the supervisor field is a numeric account ID
validated by the server's 400 response.

**A6. Expense list pagination and not-found.** `GET /api/expenses/` is
unpaginated and there is no expense-detail endpoint, so `/expenses/[id]` loads
the visible list and selects the matching row. If the ID is absent (deleted,
out of scope, or wrong), the page renders a distinct
"Expense #N not found" state rather than an empty form or a spinner.

**A7. `.env` ignore.** `.env` and `.env.local` are in `.gitignore` (both the
repository root and `frontend/`), and only `.env.example` is committed. No
secret is in git history from this work; production values live in Vercel
environment variables.
