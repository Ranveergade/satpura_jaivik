# Satpura Jaivik frontend

Next.js 15 App Router frontend for the Satpura Jaivik farmer transparency
platform. It talks to the Django REST API in the repository root.

## Local development

1. Start Django from the repository root (use the project virtualenv):

   ```bash
   .venv/Scripts/python.exe manage.py runserver 127.0.0.1:8000
   ```

2. Start the frontend from this directory:

   ```bash
   npm install
   npm run dev
   ```

3. Open <http://127.0.0.1:3000>. Login OTP codes are printed by the Django
   development server (console email backend).

The browser calls same-origin `/backend/api/*`; `next.config.ts` proxies that
prefix to `DJANGO_ORIGIN` (default `http://127.0.0.1:8000`). To use another
backend, set both values in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
DJANGO_ORIGIN=https://your-django-host.example
```

Django must trust the browser origin. For localhost development the backend
defaults to `http://127.0.0.1:3000,http://localhost:3000`; set
`CSRF_TRUSTED_ORIGINS` on the backend for any other host.

## Checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Deployment note

The Vercel deployment only hosts this Next.js app. `DJANGO_ORIGIN` must point
at a publicly reachable Django deployment, and Django must include the Vercel
origin in `CSRF_TRUSTED_ORIGINS` and `ALLOWED_HOSTS`. The repository's local
console email backend is development-only; a real email provider is required
for login OTPs in production.
