"use client";

import React from "react";
import { Sprout, UserCheck, Smartphone } from "lucide-react";
import { Language, translations } from "@/lib/i18n";

export type UserRole = "FARMER" | "SUPERVISOR" | "ACCOUNTS" | "ADMIN" | "SUPER_ADMIN" | "MANAGEMENT";

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export function Navbar({ lang, setLang, role, setRole }: NavbarProps) {
  const t = translations[lang];

  const rolesList: { key: UserRole; label: string }[] = [
    { key: "FARMER", label: t.roleFarmer },
    { key: "SUPERVISOR", label: t.roleSupervisor },
    { key: "ACCOUNTS", label: t.roleAccounts },
    { key: "ADMIN", label: t.roleAdmin },
    { key: "SUPER_ADMIN", label: t.roleSuperAdmin },
    { key: "MANAGEMENT", label: t.roleManagement },
  ];

  return (
    <header className="sticky top-0 z-40 bg-forest-950/90 backdrop-blur-xl border-b border-forest-800 shadow-2xl py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-leaf-500 to-forest-700 flex items-center justify-center text-white shadow-lg shadow-leaf-600/30">
            <Sprout className="w-5 h-5 text-cream-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-wider text-cream-100">
                {t.appName}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-leaf-950 text-leaf-300 text-[10px] font-mono border border-leaf-700/50 flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                PWA
              </span>
            </div>
            <p className="text-[10px] text-cream-400 font-mono -mt-0.5">
              {t.platformSubtitle}
            </p>
          </div>
        </div>

        {/* Control Controls: Language Switcher & Role Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Language Switcher Toggle */}
          <div className="flex items-center bg-forest-900 border border-forest-700/80 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                lang === "en"
                  ? "bg-leaf-500 text-forest-950 shadow-md"
                  : "text-cream-300 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                lang === "hi"
                  ? "bg-leaf-500 text-forest-950 shadow-md"
                  : "text-cream-300 hover:text-white"
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Role Switcher Selector */}
          <div className="flex items-center gap-1.5 bg-forest-900/90 border border-forest-700/80 px-3 py-1.5 rounded-2xl">
            <UserCheck className="w-4 h-4 text-leaf-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-bold text-cream-100 focus:outline-none cursor-pointer"
            >
              {rolesList.map((r) => (
                <option key={r.key} value={r.key} className="bg-forest-950 text-cream-100">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </header>
  );
}
