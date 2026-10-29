# Satpura Jaivik API contract

Derived from backend source in this repository. Claims cite file and line. Do not treat this prompt as an extra source of endpoints.

**Audit date:** 2026-10-29  
**Git:** `main` at baseline `5c94200` (`workers proper details added`). The frontend, serializer regression fix, attendance test updates, and the documentation in this file were added after that commit.

## Stray files (Phase 0)

- Repo root contains a file literally named `t --verbosity 1` (17,182 bytes). Content is GNU `less` pager help, consistent with a mistyped test command whose stdout was redirected into a filename. **Not deleted** (per instructions).

## Runtime and configuration

| Item | Source |
|------|--------|
| Django 6.1.2, DRF 3.18.3, SimpleJWT 5.5.1, psycopg 3.3.6 | `.venv` `pip freeze`; pinned in `requirements.txt` |
| Database: PostgreSQL via `DATABASE_URL` when set, otherwise `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` (default `127.0.0.1`), `DB_PORT` (default `5432`) | `config/settings.py` 111–140 |
| `SECRET_KEY`, `DEBUG` (default true), and `ALLOWED_HOSTS` are environment-driven | `config/settings.py` 30–45 |
| `AUTH_USER_MODEL = 'accounts.User'` | `config/settings.py` 92 |
| Email: `MAILERS` SMTP when `EMAIL_HOST` is set, otherwise the console backend (no `EMAIL_BACKEND`; Django rejects mixing the two) | `config/settings.py` 187–215 |
| CSRF trusted dev origins: `http://127.0.0.1:3000`, `http://localhost:3000`; production must set `CSRF_TRUSTED_ORIGINS` | `config/settings.py` 47–58 |
| Static files: `STATIC_ROOT`, WhiteNoise middleware, compressed manifest storage | `config/settings.py` 83, 175–185 |
| No `CORS_*` settings, no `django-cors-headers` | `config/settings.py` (full file) |
| CSRF: default Django `CsrfViewMiddleware` enabled | `config/settings.py` 86 |
| JWT auth only for DRF | `config/settings.py` 218–222 |
| No `SIMPLEJWT` dict in Django settings | `config/settings.py` (full file) |
| Deployment blueprint: Render web service + PostgreSQL | `render.yaml`, `docs/DEPLOYMENT.md` |
| README is a one-line title; frontend has its own README | `README.md` 1, `frontend/README.md` |
| `.env.example` documents DB, production, mail, CSRF, and frontend env values; `.env` is gitignored | `.env.example`, `.gitignore` 2 |

**Token lifetimes (SimpleJWT 5.5.1 defaults, not overridden):** `ACCESS_TOKEN_LIFETIME = timedelta(minutes=5)`, `REFRESH_TOKEN_LIFETIME = timedelta(days=1)`, `ROTATE_REFRESH_TOKENS = False`, `AUTH_HEADER_TYPES = ("Bearer",)`, `AUTH_HEADER_NAME = "HTTP_AUTHORIZATION"`. Source: installed package `rest_framework_simplejwt/settings.py` `DEFAULTS`.

**Baseline Django tests:** the unchanged suite at `5c94200` ran 66 tests with 4 failures, all in `worklogs.tests_attendance` because the tests still POSTed free-text `worker_name` after `LabourAttendanceSerializer` made it read-only and required a registered `worker` (`worklogs/serializers.py` 116–162).

**Current Django tests:** `python manage.py test --verbosity 1` → **Ran 70 tests, OK** (Django 6.1.2 from `.venv`). The four attendance tests were updated to the current contract (they were stale, not weakened), the duplicate-attendance expectation is 409, and regression coverage was added for the assignment serializer and the configured mailer.

`manage.py check`: no issues. PostgreSQL service `postgresql-x64-18` running; Django `connection.ensure_connection()` succeeded (`db_vendor=postgresql`).

---

## Base URL and prefix structure

There is no configured public host. Django `runserver` default is `http://127.0.0.1:8000`.

Prefixes from `config/urls.py` 23–30:

| Prefix | App |
|--------|-----|
| `/admin/` | Django admin |
| `/api/accounts/` | `accounts.urls` |
| `/api/projects/` | `projects.urls` |
| `/api/audit-logs/` | `auditlog.urls` |
| `/api/token/refresh/` | SimpleJWT `TokenRefreshView` |
| `/api/work-logs/` | `worklogs.urls` |
| `/api/expenses/` | `expenses.urls` |

No API version prefix.

### CORS / CSRF / cookies

- **CORS:** not configured. A browser origin other than the Django origin cannot call the API unless a same-origin proxy is used. (`config/settings.py` has no CORS middleware or settings.)
- **CSRF:** `CsrfViewMiddleware` is on (`config/settings.py` 59). Plain Django views `api_login`, `verify_otp` (`accounts/views.py` 113–207, 210–315) are **not** CSRF-exempt. DRF views use `@api_view` / `APIView` / `generics`, which DRF marks CSRF-exempt.
- **CSRF cookie helper:** `GET /api/accounts/csrf/` → `{"message": "CSRF cookie set."}` with `@ensure_csrf_cookie` (`accounts/views.py` 318–320, `accounts/urls.py` 8). Default Django cookie name `csrftoken`; JS-readable (`CSRF_COOKIE_HTTPONLY` not set). Header expected: `X-CSRFToken`.
- **JWT tokens** are returned in the **JSON body**, not cookies (`accounts/views.py` 309–315). Subsequent DRF calls use `Authorization: Bearer <access>`.

---

## Auth flow

1. **Optional CSRF bootstrap (required for browser POST to login/OTP):** `GET /api/accounts/csrf/` (`accounts/urls.py` 8, `accounts/views.py` 318–320).
2. **Login (password → OTP challenge):** `POST /api/accounts/login/` (`accounts/urls.py` 6, `accounts/views.py` 113–207). JSON `{"username": string, "password": string}`. Success `200`: `message`, `challenge_id` (int PK), `expires_in_seconds` (300). Failures: `400` invalid JSON / missing strings / no email; `401` bad credentials; `429` OTP resend cooldown 60s (`OTP_RESEND_COOLDOWN_SECONDS`, line 32, 157–168); `503` mail send failure (lines 183–201). Email uses `send_mail` (`accounts/views.py` 184–194). Console mailer is configured under `MAILERS` (`config/settings.py` 157–163); live login showed the OTP in the `runserver` terminal and verification succeeded. Do not add `EMAIL_BACKEND` alongside `MAILERS` — Django 6.1 raises `ImproperlyConfigured`.
3. **Verify OTP:** `POST /api/accounts/verify-otp/` (`accounts/urls.py` 7, `accounts/views.py` 210–315). JSON `{"challenge_id": int (not bool), "otp": 6 ASCII digits}`. Success `200`: `message`, `username`, `role`, `refresh`, `access`. Failures: `400` invalid/expired/wrong OTP; `429` after `OTP_MAX_ATTEMPTS = 5` (lines 31, 249–255); `403` inactive user after correct OTP (278–284). OTP lifetime `OTP_LIFETIME_MINUTES = 5` (line 30).
4. **Authenticated requests:** `Authorization: Bearer <access>` (`config/settings.py` 150–154).
5. **Refresh:** `POST /api/token/refresh/` (`config/urls.py` 28). SimpleJWT body `{"refresh": "<token>"}` → `{"access": "..."}` (defaults; rotation off).
6. **Logout:** `POST /api/accounts/logout/` JWT required (`accounts/urls.py` 9, `accounts/views.py` 324–367). JSON `{"refresh": string}`. Blacklists that refresh token if `user_id` matches the authenticated user. `400` if JSON/token invalid or belongs to another user.
7. **Current-user endpoint:** **not implemented.** Role and username are only returned from verify-OTP (`accounts/views.py` 309–315). No `/api/accounts/me/` (or similar) in `accounts/urls.py`.

Tokens live in the response **body**. Frontend must store them; they are not httpOnly cookies.

---

## Roles

Exact enum (`accounts/models.py` 12–18):

- `SUPER_ADMINISTRATOR`
- `ADMINISTRATOR`
- `ACCOUNTS`
- `SUPERVISOR`
- `FARMER`
- `MANAGEMENT`

User `role` is a required `CharField` with those choices (`accounts/models.py` 20–23). There is **no** public user-create API; users are created via Django admin (`accounts/admin.py` 7–16).

### Role × resource × action (from permission classes and view bodies)

Permission classes:

- `IsProjectViewer`: authenticated, active, role in `{SUPER_ADMINISTRATOR, ADMINISTRATOR, ACCOUNTS, MANAGEMENT, SUPERVISOR, FARMER}` (`accounts/permissions.py` 13–29).
- `CanManageProjects`: `{SUPER_ADMINISTRATOR, ADMINISTRATOR}` (`accounts/permissions.py` 32–47).
- `IsFarmerOrPrivilegedStaff`: `FARMER` or `{SUPER_ADMINISTRATOR, ADMINISTRATOR, ACCOUNTS, MANAGEMENT}` (`accounts/permissions.py` 52–75). **SUPERVISOR excluded.**
- `CanManageWorkers`: `{SUPER_ADMINISTRATOR, ADMINISTRATOR, SUPERVISOR, ACCOUNTS, MANAGEMENT}` (`worklogs/permissions.py` 5–22). **FARMER excluded.**
- Audit list: extra check `role in {SUPER_ADMINISTRATOR, ADMINISTRATOR}` (`auditlog/views.py` 16–30).

Legend: Y = allowed by code, Q = allowed at permission layer but queryset empty or extra 403 in the view, N = 401/403.

| Resource | Action | SUPER_ADMIN | ADMIN | ACCOUNTS | MANAGEMENT | SUPERVISOR | FARMER |
|----------|--------|-------------|-------|----------|------------|------------|--------|
| Projects | list/detail GET | Y all | Y all | Y all | Y all | Y assigned | Y own |
| Projects | create POST / update PATCH | Y | Y | N | N | N | N |
| Farmer profiles | list/create/retrieve/update | Y | Y | Y | Y | N | Y own only |
| Work logs | GET list/detail | Y | Y | Q empty | Q empty | Y assigned | Q empty |
| Work logs | POST create | N (403 in view) | N | N | N | Y assigned project | N |
| Attendance | GET list/detail | Y | Y | N (403 in view) | N | Y assigned | N |
| Attendance | POST | N | N | N | N | Y assigned | N |
| Workers | list/create/retrieve/update | Y | Y | Y | Y | Y | N |
| Assignments | list/create/retrieve/update | Y | Y | Y | Y | Y (own projects) | N |
| Labour summary GET | | Y | Y | N (403 unless admin/supervisor of project) | N | Y own project | N |
| Expenses | GET | Y | Y | Y | Y | Y assigned | Y own projects |
| Expenses | POST | Y | Y | N | N | Y assigned | N |
| Expenses | POST review | Y | Y | Y | N | N | N |
| Audit logs | GET | Y | Y | N | N | N | N |
| Auth login/OTP | POST | public | public | public | public | public | public |
| Logout | POST | any authenticated | same | same | same | same | same |

Hiding UI is not authorization; the API enforces the matrix above.

---

## Error response formats

Not uniform:

- Many JSON views: `{"error": "<string>"}` plus optional keys (`missing_fields`, `fields`).
- DRF serializers: `{"field": ["message", ...]}` or `{"non_field_errors": [...]}` (`raise_exception=True`).
- Auth login: `{"error": "..."}` (`accounts/views.py` 118–147).
- Unauthenticated DRF: standard `{"detail": "Authentication credentials were not provided."}` (DRF default).
- HTTP 409 attendance duplicate: `{"error": "Attendance for this worker already exists in this work log."}` (`worklogs/views.py` 176–180).

No global exception handler is configured.

**Pagination:** only audit logs. Page size 20, query `page` (default 1). Shape: `count`, `total_pages`, `current_page`, `results` (`auditlog/views.py` 34–66). Invalid page → `400` `{"error": "Invalid page number."}`. All other list endpoints return a full array or `{"projects": [...]}` with **no** filter/search/ordering query params except where noted.

---

## Resources

### Auth

| Method | Path | Auth | Body | Success |
|--------|------|------|------|---------|
| POST | `/api/accounts/login/` | CSRF (browser) | `username` str required, `password` str required | 200 `message`, `challenge_id`, `expires_in_seconds` |
| POST | `/api/accounts/verify-otp/` | CSRF (browser) | `challenge_id` int, `otp` 6-digit ASCII | 200 `message`, `username`, `role`, `refresh`, `access` |
| GET | `/api/accounts/csrf/` | none | — | 200 `message`; sets CSRF cookie |
| POST | `/api/accounts/logout/` | JWT | `refresh` string | 200 `message` |
| POST | `/api/token/refresh/` | none (refresh token in body) | `refresh` | 200 `access` |

Sources: `accounts/urls.py` 5–9, `accounts/views.py` 113–367, `config/urls.py` 28.

### Farmer profiles (not a general user-admin API)

`FarmerProfile` fields (`accounts/models.py` 26–44): `user` (OneToOne, FARMER), `phone_number` max 15 required, `address` required, `village` max 150 required, `date_of_birth` optional, `emergency_contact` max 15 optional.

Serializer (`accounts/serializers.py` 6–60): writable `phone_number`, `address`, `village`, `date_of_birth`, `emergency_contact`. Read-only: `id`, `user`, `username`, `email`, `created_at`, `updated_at`. Phone/address/village stripped, non-empty.

**Create caveat:** `user` is serializer read-only (`accounts/serializers.py` 31–36) but `perform_create` reads raw `request.data["user"]` as farmer PK (`accounts/views.py` 51–84). Clients **must** send `user` anyway. Farmer may only create own profile.

| Method | Path | Auth | Roles | Notes |
|--------|------|------|-------|-------|
| GET | `/api/accounts/farmer-profiles/` | JWT | farmer or privileged staff | Farmer: own row; staff: all FARMER profiles |
| POST | `/api/accounts/farmer-profiles/` | JWT | same | Body: `user` (farmer PK) + writable profile fields |
| GET | `/api/accounts/farmer-profiles/<pk>/` | JWT | same | 404 if out of queryset |
| PUT/PATCH | `/api/accounts/farmer-profiles/<pk>/` | JWT | same | Standard DRF update |

No DELETE. No pagination/filters.

### Projects

Model statuses (`projects/models.py` 7–13): `PLANNED` (default), `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED`. **No enforced transition graph** — PATCH may set any of those values (`projects/views.py` 543–551).

List GET `/api/projects/` (`projects/urls.py` 6, `projects/views.py` 30–67): JWT + `IsProjectViewer`. Response `{"projects": [{id, farmer (username), supervisor (username), crop_type, status, project_budget (string)}]}`. Scoped by role (lines 36–54). No pagination/filters.

Create POST `/api/projects/create/` (`projects/urls.py` 7, `projects/views.py` 70–329): JWT + `CanManageProjects`. Required: `farmer_id`, `supervisor_id`, `land_details`, `land_area`, `crop_type`, `project_budget`, `start_date`, `estimated_completion_date`. Optional: `subsidy_amount` (default 0), `loan_amount` (default 0), `latitude`, `longitude`. Validation: IDs integers of active FARMER / SUPERVISOR; land_area > 0, ≤2 decimal places; money ≥ 0 (budget not forced > 0 on create except implicit via Decimal rules — create allows 0? `min(...) < 0` only, so 0 budget is allowed on create); dates ISO `YYYY-MM-DD`; completion ≥ start; crop_type non-empty ≤100; lat −90..90, lon −180..180, ≤6 decimals. 201 `{message, project: {id, farmer, supervisor, crop_type, status, project_budget}}`.

Detail GET `/api/projects/<project_id>/` (`projects/urls.py` 8, `projects/views.py` 333–396): full project object including land, money, dates, timestamps. 404 if not in scoped queryset.

Update PATCH `/api/projects/<project_id>/update/` (`projects/urls.py` 10–14, `projects/views.py` 425–633): JWT + `CanManageProjects`. Allowed fields only (lines 463–475). Cannot change farmer/supervisor. Status any of `Project.Status.values`. 404 if missing. Unknown fields → 400 `Unsupported fields`. **Note:** audit may be written twice (inside `transaction.atomic` at 583–591 and again at 612–620).

No DELETE. No user-directory API for picking `farmer_id` / `supervisor_id` (admin must know PKs, or infer farmer PKs from farmer-profiles).

### Daily work logs

Mounted at `/api/work-logs/` (`config/urls.py` 29).

GET/POST `/api/work-logs/` (`worklogs/urls.py` 5, `worklogs/views.py` 52–96). JWT + `IsProjectViewer`. GET returns DRF array of serializer objects. Visible logs: admin roles all; supervisor assigned projects; **everyone else empty** (`visible_work_logs`, lines 34–49) including FARMER/ACCOUNTS/MANAGEMENT. POST only `SUPERVISOR` for `project.supervisor_id == request.user.pk`.

Serializer fields (`worklogs/serializers.py` 59–110): write `project`, `work_date`, `activities`, `laborers_present` (≥0), `observations`, `check_in_latitude`/`check_in_longitude` (both or neither; lat −90..90, lon −180..180). Read-only `id`, `supervisor` (string related), timestamps. 201 created object.

GET `/api/work-logs/<log_id>/` (`worklogs/urls.py` 6, `worklogs/views.py` 99–111): 404 if not visible. No PATCH/DELETE.

No query filters.

### Labour attendance

GET/POST `/api/work-logs/attendance/` (`worklogs/urls.py` 8–12, `worklogs/views.py` 115–185). JWT + `IsProjectViewer`. GET: admin all; supervisor own projects; else **403** (not empty list). POST: supervisor only, assigned project.

Serializer (`worklogs/serializers.py` 114–207): write `work_log`, `worker`, `status` (`PRESENT` default, `ABSENT`, `HALF_DAY` — `worklogs/models.py` 84–87). `worker_name` **read-only**. New records require active `worker` with **active assignment** covering `work_log.work_date` (`worklogs/serializers.py` 174–190). Duplicate `(work_log, worker_name)` → 409 (`worklogs/views.py` 176–180). Unique constraint on `work_log` + `worker_name` (`worklogs/models.py` 120–124).

GET `/api/work-logs/attendance/<attendance_id>/` (`worklogs/urls.py` 14–17, `worklogs/views.py` 188–217): 404 if missing; supervisor of other project **403**. No PATCH/DELETE.

### Workers

GET/POST `/api/work-logs/workers/` (`worklogs/urls.py` 19–22, `worklogs/views.py` 220–238). `CanManageWorkers`. Query `active=true|false` filters `is_active`. Serializer (`worklogs/serializers.py` 8–57): write `name` (stripped non-empty), `phone_number` (stripped non-empty), `skill` optional, `daily_wage` ≥ 0, `is_active`. `created_by` set from request user.

GET/PUT/PATCH `/api/work-logs/workers/<pk>/` (`worklogs/urls.py` 24–27, `worklogs/views.py` 241–250). Update keeps original `created_by`. No DELETE.

### Project worker assignments

GET/POST `/api/work-logs/assignments/` (`worklogs/urls.py` 30–33, `worklogs/views.py` 253–296). `CanManageWorkers`. Query `project`, `worker` (IDs). Supervisor queryset limited to `project__supervisor=user`. POST: supervisor may only assign to own projects; inactive worker rejected. `assigned_by` set from request.

GET/PUT/PATCH `/api/work-logs/assignments/<pk>/` (`worklogs/urls.py` 35–38, `worklogs/views.py` 299–339). Serializer fields (`worklogs/serializers.py` 210–272): `project`, `worker`, `start_date`, `end_date` optional (≥ start), `agreed_daily_wage` ≥ 0, `is_active`. Read-only `assigned_by`, `worker_name`, `project_name`, `created_at`.

**Defect:** `project_name` uses `source="project.name"` (`worklogs/serializers.py` 215–218) but `Project` has **no** `name` field (`projects/models.py`). Listing assignments can raise `AttributeError`. Documented as blocking; minimal backend fix is allowed if integration hits it.

### Labour summary

GET `/api/work-logs/projects/labour-summary/?project=<id>&date=YYYY-MM-DD` (`worklogs/urls.py` 40–43, `worklogs/views.py` 343–446). JWT + `IsProjectViewer`, then 403 unless admin or supervisor of that project. Missing params 400; bad project 404; bad date 400. Response: `project_id`, `work_date`, `present_count`, `half_day_count`, `absent_count`, `total_recorded`, `labour_cost` (PRESENT = full `agreed_daily_wage`, HALF_DAY = half; skips records without worker/assignment).

### Expenses

Statuses (`expenses/models.py` 20–23): `PENDING` (create default), `APPROVED`, `REJECTED`. Categories (`expenses/models.py` 8–18): `LABOUR`, `MATERIALS`, `TRANSPORT`, `EQUIPMENT`, `SEEDS_AND_FERTILIZERS`, `OTHER`.

GET/POST `/api/expenses/` (`expenses/urls.py` 5, `expenses/views.py` 45–97). JWT + `IsProjectViewer`. GET scoped (`visible_expenses` 26–42). POST: `ADMIN_ROLES | {SUPERVISOR}` only; supervisor only own projects. Serializer (`expenses/serializers.py` 7–63): write `project`, `amount` > 0, `category`, `description` non-empty stripped, `expense_date` not in the future. `status` read-only (always `PENDING` on create, line 75–77). Client cannot set approved on create.

POST `/api/expenses/<expense_id>/review/` (`expenses/urls.py` 6–10, `expenses/views.py` 100–188). Reviewers: `SUPER_ADMINISTRATOR`, `ADMINISTRATOR`, `ACCOUNTS` (`REVIEW_ROLES` 22–23). Body: `decision` must be `APPROVED` or `REJECTED`; `review_note` string, **required non-empty if REJECTED**. Cannot review own expense (403). Only `PENDING` can be reviewed (400 otherwise). Uses `select_for_update`. No GET-by-id, no PATCH of amount, no DELETE.

**Transitions:** `PENDING` → `APPROVED` | `REJECTED` once. No reopen.

### Audit logs

GET `/api/audit-logs/` (`auditlog/urls.py` 6, `auditlog/views.py` 22–67). JWT + role admin/super-admin. Page size 20. Result objects: `id`, `user_id`, `username`, `action`, `entity_type`, `record_id`, `timestamp` ISO, `ip_address`, `user_agent`, `changes` JSON. POST/PATCH/DELETE 405 (DRF). No filters besides `page`.

Actions (`auditlog/models.py` 7–22): `LOGIN_SUCCESS`, `LOGIN_FAILED`, `LOGOUT`, `OTP_VERIFIED`, `OTP_FAILED`, `PROJECT_CREATED`, `PROJECT_UPDATED`, `WORK_LOG_CREATED`, `LABOUR_ATTENDANCE_CREATED`, `EXPENSE_CREATED`, `EXPENSE_REVIEWED`.

---

## Not implemented / ambiguous

Expected by the product prompt but **absent from code** (omit in UI or label planned):

- Media / receipt upload
- Notifications
- Offline sync
- CCTV / IoT
- OCR
- Current-user / session profile endpoint
- Generic user management (create users, list supervisors, change roles) — only Django admin + farmer profiles
- Project delete; work-log/attendance/expense update or delete
- CORS configuration (frontend must same-origin proxy)
- Pagination/filter/search on projects, work logs, expenses, workers (except `active`, assignment `project`/`worker`, audit `page`)
- Dashboard aggregate API (compose from lists)
- i18n API
- `EMAIL_BACKEND` vs `MAILERS` mismatch — **resolved**: only `MAILERS` is configured; live OTP delivery verified. Do not reintroduce `EMAIL_BACKEND`.
- `project_name` on assignments (`project.name` does not exist) — **resolved** by `ProjectWorkerAssignmentSerializer.get_project_name`, covered by three regression tests (including empty crop).
- Attendance tests still assume free-text `worker_name` create — **resolved**; tests now follow the registered-worker contract.
- Duplicate attendance HTTP code: implementation 409; tests now expect 409.
- No endpoint lists supervisor accounts, so the project form uses a numeric supervisor account ID (farmer has a dropdown).
- Farmers get an empty work-log list (`visible_work_logs` returns `none()` for FARMER) and 403 on attendance, even for their own project. Backend visibility gap; frontend surfaces the server response rather than inventing data.

---

## Proposed frontend pages (only contract-backed)

| Route | Purpose | Roles (nav) |
|-------|---------|-------------|
| `/login`, `/verify-otp` | Auth | public |
| `/dashboard` | Counts from allowed list endpoints | all authenticated |
| `/projects`, `/projects/new`, `/projects/[id]`, `/projects/[id]/edit` | Projects | viewers; new/edit admins only |
| `/workers`, `/workers/new`, `/workers/[id]` | Workers | `CanManageWorkers` |
| `/assignments`, `/assignments/new`, `/assignments/[id]` | Assignments | `CanManageWorkers` |
| `/work-logs`, `/work-logs/new`, `/work-logs/[id]` | Daily logs | nav for supervisor + admins (others would see empty) |
| `/attendance`, `/attendance/new` | Attendance list + record | supervisor + admins |
| `/expenses`, `/expenses/new`, `/expenses/[id]` | Expenses; review on detail | viewers; submit admin/supervisor; review admin/accounts |
| `/audit-logs` | Paginated audit | super admin + admin |
| `/farmer-profiles`, `/farmer-profiles/new`, `/farmer-profiles/[id]` | Farmer profiles | farmer + privileged staff (not supervisor) |

Planned / omitted: user directory, media, notifications, offline, IoT, OCR.

---

## Frontend decisions (implemented)

- **Transport:** same-origin Next rewrite `/backend/api/:path*` → `${DJANGO_ORIGIN}/api/:path*`. `skipTrailingSlashRedirect` is enabled and the destination ends in `/` because Django routes end in slashes.
- **CSRF:** `GET /api/accounts/csrf/` primes the cookie; mutating requests send `X-CSRFToken`. Cookies require a host-consistent URL; prefer `127.0.0.1:3000` or add the origin to `CSRF_TRUSTED_ORIGINS`.
- **Tokens:** access and refresh tokens live in `sessionStorage`, mirrored in memory. No httpOnly cookie was added by the backend. XSS is therefore the main trade-off; the frontend renders all user text through React escaping and contains no `dangerouslySetInnerHTML`, `innerHTML`, or `eval`.
- **Role:** returned by `/api/accounts/verify-otp/`, then cached with the session because no current-user endpoint exists. On reload the cached role is used until an API call returns 401; one refresh is attempted, and if it fails the session is cleared and the user is redirected to login. Backend permissions remain authoritative.
- **Expenses:** the list endpoint is unpaginated, so `/expenses/[id]` finds the row in the full visible list and shows a distinct not-found state when absent. The backend has no expense-detail endpoint.
- **Farmers:** `/api/accounts/farmer-profiles/` provides `user` (account ID) and `username`, so the project form uses a farmer dropdown. There is no supervisor-list endpoint, so supervisor remains a numeric account ID.
- **Audit logs:** read-only, `?page=` with 20 rows; UI shows `count`, `current_page`, and `total_pages`.
