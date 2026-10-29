"use client";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

export default function LoginPage() {
  const { t } = useI18n();
  const { user, status, signInWithPassword } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-secondary">Loading…</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    if (!username.trim() || !password) {
      setError(t("common.required"));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const challenge = await signInWithPassword(
        username.trim(),
        password,
      );
      router.push(`/verify-otp?challenge=${challenge.challenge_id}`);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : t("common.error"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 pt-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-forest">{t("auth.loginTitle")}</h1>
        <p className="mt-2 text-sm text-secondary">{t("auth.loginSubtitle")}</p>
      </div>

      <Card>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label={t("auth.loginUsername")} required>
            <Input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </Field>
          <Field label={t("auth.loginPassword")} required>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>

          {error ? <Alert tone="error">{error}</Alert> : null}

          <Button type="submit" loading={submitting}>
            {t("auth.loginSubmit")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
