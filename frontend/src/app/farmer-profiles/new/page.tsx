"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import {
  FarmerProfileForm,
  type FarmerProfileFormValues,
} from "@/components/FarmerProfileForm";
import { useI18n } from "@/lib/i18n";
import { FARMER_PROFILE_ROLES } from "@/lib/roles";
import { createFarmerProfile } from "@/lib/api/farmerprofiles";
import { ApiError } from "@/lib/api/errors";

export default function NewFarmerProfilePage() {
  return (
    <AuthGate>
      <RoleGuard roles={FARMER_PROFILE_ROLES}>
        <NewFarmerProfileContent />
      </RoleGuard>
    </AuthGate>
  );
}

function NewFarmerProfileContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (values: FarmerProfileFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    try {
      const profile = await createFarmerProfile({
        user: Number(values.user),
        phone_number: values.phone_number.trim(),
        address: values.address.trim(),
        village: values.village.trim(),
        date_of_birth: values.date_of_birth || null,
        emergency_contact: values.emergency_contact.trim(),
      });
      router.push(`/farmer-profiles/${profile.id}`);
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
      <PageHeader title={t("farmers.newTitle")} />
      <FarmerProfileForm
        mode="create"
        submitting={submitting}
        serverError={serverError}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/farmer-profiles")}
      />
    </div>
  );
}
