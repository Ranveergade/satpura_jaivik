"use client";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const { t } = useI18n();
  const { user, status, pendingChallengeId, verifyOtp, clearChallenge } =
    useAuth();
  const router = useRouter();

  const [otp, setOtp] = useState("");
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

  if (pendingChallengeId === null) {
    return (
      <div className="mx-auto max-w-md pt-10 text-center">
        <p className="text-secondary">{t("auth.backToLogin")}</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => router.push("/login")}
        >
          {t("common.back")}
        </Button>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    if (!/^\d{6}$/.test(otp)) {
      setError(t("auth.verifyErrorInvalid"));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await verifyOtp(pendingChallengeId, otp);
      clearChallenge();
      router.push("/dashboard");
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
        <h1 className="text-2xl font-bold text-forest">{t("auth.verifyTitle")}</h1>
        <p className="mt-2 text-sm text-secondary">{t("auth.verifySubtitle")}</p>
      </div>

      <Card>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label={t("auth.verifyOtp")} required>
            <Input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              placeholder="123456"
              required
            />
          </Field>

          {error ? <Alert tone="error">{error}</Alert> : null}

          <Button type="submit" loading={submitting} disabled={!otp}>
            {t("auth.verifySubmit")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
