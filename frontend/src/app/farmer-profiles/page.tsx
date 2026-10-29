"use client";

import Link from "next/link";
import { MapPin, Plus } from "lucide-react";

import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { fetchFarmerProfiles } from "@/lib/api/farmerprofiles";
import { useApiResource } from "@/lib/useApiResource";
import { useI18n } from "@/lib/i18n";

export default function FarmerProfilesPage() {
  return (
    <AuthGate>
      <FarmerProfilesContent />
    </AuthGate>
  );
}

function FarmerProfilesContent() {
  const { t } = useI18n();
  const { data, loading, error, reload } = useApiResource(fetchFarmerProfiles);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("nav.farmerProfiles")}
        actions={
          <Link href="/farmer-profiles/new">
            <Button>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("farmers.new")}
            </Button>
          </Link>
        }
      />

      {error ? (
        <div className="flex flex-col gap-3">
          <Alert tone="error">{error}</Alert>
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
        </div>
      ) : null}

      {loading ? <Spinner label={t("common.loading")} /> : null}

      {!loading && !error && data ? (
        data.length === 0 ? (
          <EmptyState
            title={t("common.empty")}
            message={t("farmers.emptyMessage")}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((profile) => (
              <Link key={profile.id} href={`/farmer-profiles/${profile.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <h2 className="font-semibold text-forest">
                    {profile.username}
                  </h2>
                  <p className="mt-1 text-sm text-secondary">{profile.email}</p>
                  <p className="mt-3 flex items-center gap-1 text-sm text-secondary">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {profile.village}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {profile.phone_number}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
