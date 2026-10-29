# Deployment

The application has two deployable parts:

| Part | Directory | Suggested host |
|------|-----------|----------------|
| Next.js frontend | `frontend/` | Vercel |
| Django API | repository root | Render, Railway, Fly.io, or any WSGI host with PostgreSQL |

Vercel cannot run this Django API as-is: it needs PostgreSQL, persistent
process configuration, and real email delivery for login OTPs. The current
`MAILERS` console backend only prints OTPs to the server terminal.

## 1. Deploy the Django API

Set these environment variables on the backend host:

```env
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=5432
CSRF_TRUSTED_ORIGINS=https://<your-vercel-app>.vercel.app
```

Also set `ALLOWED_HOSTS` for the backend hostname (the repository currently
leaves it empty for DEBUG development). Replace the console mailer with a real
provider (for example SMTP) in `config/settings.py`, then run:

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

Serve with a production WSGI server such as Gunicorn. Keep `DEBUG = False` in
production and load `SECRET_KEY` from the environment.

## 2. Deploy the frontend on Vercel

1. Import `Ranveergade/satpura_jaivik` in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Next.js.
4. Add environment variables:

   ```env
   NEXT_PUBLIC_API_BASE_URL=/backend
   DJANGO_ORIGIN=https://<your-django-api-host>
   ```

5. Deploy.

`DJANGO_ORIGIN` is read by the server-side rewrite in `frontend/next.config.ts`;
it is not exposed to the browser. `NEXT_PUBLIC_API_BASE_URL` must stay
`/backend` so browser requests remain same-origin and CSRF cookies work.

Alternatively, with the Vercel CLI:

```bash
cd frontend
npx vercel login
npx vercel --prod -e DJANGO_ORIGIN=https://<your-django-api-host>
```

## 3. Post-deploy checks

- `GET https://<vercel-app>/backend/api/accounts/csrf/` returns `200` JSON.
- Login sends an OTP through the backend's real mailer.
- The Vercel origin is present in the backend's `CSRF_TRUSTED_ORIGINS`.
- Admin, supervisor, and farmer logins each land on the correct role view.
