# Deployment

Both halves run on Vercel, as two separate projects built from this one
repository.

| Part | Vercel project | Root Directory | Production URL |
|------|----------------|----------------|----------------|
| Django API | `satpura-jaivik-api` | repository root | https://satpura-jaivik-api.vercel.app |
| Next.js frontend | `satpura-jaivik` | `frontend` | https://satpura-jaivik.vercel.app |

Django runs on Vercel's Python runtime with no adapter: Vercel detects
`manage.py` and `config/wsgi.py` and serves them as a single Python function.
The database is Neon Postgres from the Vercel Marketplace.

## 1. Backend project (`satpura-jaivik-api`)

Repository root, framework preset **Django**.

Build command (set in the Vercel project, not in a repository-root
`vercel.json` — a root `vercel.json` is also applied to the frontend project
and breaks its build):

```bash
python manage.py collectstatic --noinput && python manage.py migrate --noinput && python manage.py bootstrap_users
```

Environment variables:

| Variable | Value |
|----------|-------|
| `SECRET_KEY` | long random string |
| `DEBUG` | `false` |
| `ALLOWED_HOSTS` | `.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://*.vercel.app` |
| `DATABASE_URL` | injected by the Neon integration (pooled connection string) |
| `BOOTSTRAP_ADMIN_USERNAME` / `_EMAIL` / `_PASSWORD` | first administrator |
| `BOOTSTRAP_SUPERVISOR_USERNAME` / `_EMAIL` / `_PASSWORD` | first supervisor |
| `BOOTSTRAP_FARMER_USERNAME` / `_EMAIL` / `_PASSWORD` | first farmer |
| `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `DEFAULT_FROM_EMAIL` | SMTP provider (see the OTP note below) |

`config/settings.py` reads `DATABASE_URL`, so no other database variables are
needed. `DB_CONN_MAX_AGE` defaults to `0`, which is correct for serverless
instances; set a positive value only on a host that keeps a process alive.

`bootstrap_users` is idempotent: a username that already exists is skipped, so
a redeploy never resets a password. It creates nothing unless the matching
`BOOTSTRAP_<PREFIX>_*` variables are present. Delete those variables once the
accounts exist.

### Login OTP delivery

Login is two-step: password, then a six-digit code by email. Without SMTP
settings the project falls back to the console mailer, which writes the code to
the Vercel runtime log only. That is enough to verify the deployment
(`npx vercel logs --since 5m --json`), but **end users will never receive a
code**. Configure a real SMTP provider before handing the site to anyone.

## 2. Frontend project (`satpura-jaivik`)

Root Directory `frontend`, framework preset **Next.js**.

```env
NEXT_PUBLIC_API_BASE_URL=/backend
DJANGO_ORIGIN=https://satpura-jaivik-api.vercel.app
```

`DJANGO_ORIGIN` is read only by the server-side rewrite in
`frontend/next.config.ts` (`/backend/api/:path*` → `DJANGO_ORIGIN/api/:path*`)
and is not exposed to the browser. `NEXT_PUBLIC_API_BASE_URL` must stay
`/backend` so browser requests remain same-origin and the CSRF cookie works.

Do not add a repository-root `vercel.json`; keep project settings in the
dashboard or set them with the CLI.

### Repository-root `.vercelignore`

A root `.vercelignore` applies to every project built from the repo, including
the frontend. It must not exclude `frontend/`; it only excludes
`frontend/node_modules/`, `frontend/.next/`, and `frontend/.vercel/`.

## 3. Post-deploy checks

```bash
curl -i https://satpura-jaivik-api.vercel.app/api/accounts/csrf/     # 200 + CSRF cookie
curl -i https://satpura-jaivik-api.vercel.app/api/projects/          # 401 unauthenticated
curl -i https://satpura-jaivik.vercel.app/login                      # 200
curl -i https://satpura-jaivik.vercel.app/backend/api/accounts/csrf/ # 200, proxied
```

Then log in through the UI as each role and confirm the landing view matches
the role.

## 4. Redeploying

Vercel is connected to `Ranveergade/satpura_jaivik`, so `git push origin main`
rebuilds both projects. Because the backend build runs `migrate`, new
migrations are applied on deploy.

Local CLI deploys are not the supported path on Windows: `vercel deploy` fails
with `[EPERM] symlink ... .func`. Use the Git integration.

## 5. Local development

```bash
.venv/Scripts/python.exe manage.py migrate
.venv/Scripts/python.exe manage.py runserver 8000

cd frontend
npm install
npm run dev            # http://localhost:3000, proxies /backend to :8000
```

`frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
DJANGO_ORIGIN=http://127.0.0.1:8000
```

`.env` and `.env.local` are gitignored; use `.env.example` as the template.
