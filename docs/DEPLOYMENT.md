# Deployment

The application has two deployable parts:

| Part | Directory | Host |
|------|-----------|------|
| Django API | repository root | Render (blueprint included) |
| Next.js frontend | `frontend/` | Vercel |

Vercel cannot run this Django API as-is: it needs PostgreSQL, a long-lived
WSGI process, and real email delivery for login OTPs. The local `MAILERS`
console backend only prints OTPs to the server terminal, so production
requires an SMTP provider.

## 1. Deploy the Django API on Render

The repository contains `render.yaml`, which creates a free web service and a
free PostgreSQL database.

1. Create a Render account and choose **New > Blueprint**.
2. Connect `Ranveergade/satpura_jaivik` and apply the blueprint.
3. Fill the `sync: false` values when prompted:

   | Variable | Value |
   |----------|-------|
   | `CSRF_TRUSTED_ORIGINS` | Vercel URL, e.g. `https://satpura-jaivik.vercel.app` (can be added after the frontend deploy) |
   | `EMAIL_HOST` | SMTP host, e.g. `smtp.resend.com` |
   | `EMAIL_HOST_USER` | SMTP username, e.g. `resend` |
   | `EMAIL_HOST_PASSWORD` | SMTP password/API key |
   | `DEFAULT_FROM_EMAIL` | Verified sender address |

   `EMAIL_PORT=587` and `EMAIL_USE_TLS=true` are set by the blueprint.
   Any provider that allows port 587 works (Resend, Brevo, Mailgun, a Gmail
   app password). Do not use the console mailer in production.

4. The build runs `collectstatic` and `migrate`, then starts
   `gunicorn config.wsgi:application`.
5. Verify `https://<service>.onrender.com/api/accounts/csrf/` returns `200`.
6. Create the first users through `python manage.py createsuperuser` in the
   Render shell, or via Django admin.

Render's free PostgreSQL plan is time-limited. Move to a paid database before
relying on it long-term.

## 2. Deploy the frontend on Vercel

1. Import `Ranveergade/satpura_jaivik` in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Next.js.
4. Add environment variables:

   ```env
   NEXT_PUBLIC_API_BASE_URL=/backend
   DJANGO_ORIGIN=https://<service>.onrender.com
   ```

5. Deploy.
6. Add the final Vercel URL to the Render `CSRF_TRUSTED_ORIGINS` value and
   redeploy the backend if Render does not restart automatically.

`DJANGO_ORIGIN` is read by the server-side rewrite in `frontend/next.config.ts`;
it is not exposed to the browser. `NEXT_PUBLIC_API_BASE_URL` must stay
`/backend` so browser requests stay same-origin and the CSRF cookie works.

With the Vercel CLI, from `frontend/`:

```bash
npx vercel login
npx vercel --prod -e DJANGO_ORIGIN=https://<service>.onrender.com
```

On Windows without symlink privileges, use the Vercel dashboard or Git
integration instead of a local CLI build; Vercel then builds remotely.

## 3. Post-deploy checks

- `GET https://<vercel-app>/backend/api/accounts/csrf/` returns `200` JSON.
- Login sends an OTP through the configured SMTP provider.
- The Vercel origin is present in `CSRF_TRUSTED_ORIGINS`.
- Admin, supervisor, and farmer logins each land on the correct role view.
