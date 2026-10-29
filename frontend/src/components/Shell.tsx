"use client";

import {
  LayoutDashboard,
  Sprout,
  Users,
  Link2,
  NotebookPen,
  CalendarCheck,
  Receipt,
  ScrollText,
  UserRound,
  Leaf,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { useAuth } from "@/lib/auth";
import { hasRole, NAV_ITEMS, type NavItem } from "@/lib/roles";
import { useI18n, type Language } from "@/lib/i18n";

const ICONS: Record<string, typeof LayoutDashboard> = {
  "/dashboard": LayoutDashboard,
  "/projects": Sprout,
  "/workers": Users,
  "/assignments": Link2,
  "/work-logs": NotebookPen,
  "/attendance": CalendarCheck,
  "/expenses": Receipt,
  "/audit-logs": ScrollText,
  "/farmer-profiles": UserRound,
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  pathname,
  t,
}: {
  item: NavItem;
  pathname: string;
  t: (key: string) => string;
}) {
  const active = isActive(pathname, item.href);
  const Icon = ICONS[item.href] ?? LayoutDashboard;
  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-white/15 text-white"
            : "text-pale/90 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
        {t(item.labelKey)}
      </Link>
    </li>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const options: Array<{ value: Language; label: string }> = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिन्दी" },
  ];
  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-white/30 bg-white/10 p-0.5"
      role="group"
      aria-label="Language"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLang(option.value)}
          className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
            lang === option.value
              ? "bg-white text-forest"
              : "text-pale/90 hover:text-white"
          }`}
          aria-pressed={lang === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const { user, status, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (status === "loading") {
    return null;
  }

  const visibleNav = NAV_ITEMS.filter((item) =>
    hasRole(user?.role ?? null, item.roles),
  );

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const drawer = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2 text-white">
          <Leaf className="h-6 w-6" aria-hidden="true" />
          <span className="text-lg font-bold">Satpura Jaivik</span>
        </div>
        <button
          type="button"
          className="rounded-md p-2 text-white hover:bg-white/10"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2" aria-label="Primary">
        <ul className="flex flex-col gap-1">
          {visibleNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname ?? ""}
              t={t}
            />
          ))}
        </ul>
      </nav>
      <div className="border-t border-white/15 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pale hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          {t("common.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-ink">
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:block">
        <div className="flex h-full flex-col bg-forest">{drawer}</div>
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-forest shadow-xl">
            {drawer}
          </aside>
        </div>
      ) : null}

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-secondary/20 bg-bg px-4 md:hidden">
          <button
            type="button"
            className="rounded-lg p-2 text-forest hover:bg-pale"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <span className="text-base font-bold text-forest">Satpura Jaivik</span>
          <LanguageSwitcher />
        </header>
        <header className="sticky top-0 z-30 hidden h-14 items-center justify-between border-b border-secondary/20 bg-bg px-4 md:flex">
          <span className="text-base font-bold text-forest">Satpura Jaivik</span>
          <LanguageSwitcher />
        </header>

        <main className="mx-auto w-full max-w-6xl p-4 pb-16 md:p-6">{children}</main>
      </div>
    </div>
  );
}
