"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import {
  FarmerProfileForm,
  type FarmerProfileFormValues,
} from "@/components/FarmerProfileForm";
import { Alert, Button, Spinner } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { FARMER_PROFILE_ROLES } from "@/lib/roles";
import {
  fetchFarmerProfile,
  updateFarmerProfile,
} from "@/lib/api/farmerprofiles";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";

export default function FarmerProfileDetailPage() {
  return (
    <AuthGate>
      <RoleGuard roles={FARMER_PROFILE_ROLES}>
        <FarmerProfileDetailContent />
      </RoleGuard>
    </AuthGate>
  );
}

function FarmerProfileDetailContent() {
  const params = useParams<{ id: string }>();
  const profileId = Number(params.id);
  const { t } = useI18n();
  const router = useRouter();
  const { data, loading, error, reload } = useApiResource(
    () => fetchFarmerProfile(profileId),
    [profileId],
  );

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (loading) return <Spinner label={t("common.loading")} />;

  if (error || !data) {
    return (
      <div className="flex flex-col gap-3">
        <Alert tone="error">{error ?? t("common.error")}</Alert>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/farmer-profiles")}
          >
            {t("common.back")}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values: FarmerProfileFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    try {
      await updateFarmerProfile(profileId, {
        phone_number: values.phone_number.trim(),
        address: values.address.trim(),
        village: values.village.trim(),
        date_of_birth: values.date_of_birth || null,
        emergency_contact: values.emergency_contact.trim(),
      });
      reload();
    } catch (caught) {
      if (caught instanceof ApiError) {
        setServerError(caught.message);
        setFieldErrors(caught.fieldErrors);
      } else {
        setServerError(
          caught instanceof Error ? caught.message : t("common.error"),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={data.username}
        subtitle={`${data.email} · ${t("common.accountId")} #${data.user}`}
      />
      <FarmerProfileForm
        mode="edit"
        initial={{
          phone_number: data.phone_number,
          address: data.address,
          village: data.village,
          date_of_birth: data.date_of_birth ?? "",
          emergency_contact: data.emergency_contact,
        }}
        submitting={submitting}
        serverError={serverError}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/farmer-profiles")}
      />
    </div>
  );
}
