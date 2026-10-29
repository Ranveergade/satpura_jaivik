"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { Shell } from "@/components/Shell";

const PUBLIC_PATHS = ["/login", "/verify-otp"];

function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (PUBLIC_PATHS.includes(pathname ?? "")) {
    return <>{children}</>;
  }
  return <Shell>{children}</Shell>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <Chrome>{children}</Chrome>
      </AuthProvider>
    </I18nProvider>
  );
}
