"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, translations } from "@/lib/i18n";
import { Navbar } from "@/components/pwa/Navbar";
import { PWAHeader } from "@/components/pwa/PWAHeader";
import { FarmerDashboard } from "@/components/dashboards/FarmerDashboard";
import { SupervisorDashboard } from "@/components/dashboards/SupervisorDashboard";
import { AccountsDashboard } from "@/components/dashboards/AccountsDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { ManagementDashboard } from "@/components/dashboards/ManagementDashboard";

export type UserRole = "FARMER" | "SUPERVISOR" | "ACCOUNTS" | "ADMIN" | "SUPER_ADMIN" | "MANAGEMENT";

const ROLE_DASHBOARD: Record<UserRole, React.ReactNode | null> = {
  FARMER: null,
  SUPERVISOR: null,
  ACCOUNTS: null,
  ADMIN: null,
  SUPER_ADMIN: null,
  MANAGEMENT: null,
};

export default function PWADashboardPage() {
  const [lang, setLang] = useState<Language>("en");
  const [role, setRole] = useState<UserRole>("FARMER");

  const t = translations[lang];

  const getDashboard = () => {
    switch (role) {
      case "FARMER": return <FarmerDashboard lang={lang} />;
      case "SUPERVISOR": return <SupervisorDashboard lang={lang} />;
      case "ACCOUNTS": return <AccountsDashboard lang={lang} />;
      case "ADMIN": return <AdminDashboard lang={lang} />;
      case "SUPER_ADMIN": return <AdminDashboard lang={lang} />;
      case "MANAGEMENT": return <ManagementDashboard lang={lang} />;
      default: return <FarmerDashboard lang={lang} />;
    }
  };

  const getRoleLabel = () => {
    const roleLabels: Record<UserRole, string> = {
      FARMER: t.roleFarmer,
      SUPERVISOR: t.roleSupervisor,
      ACCOUNTS: t.roleAccounts,
      ADMIN: t.roleAdmin,
      SUPER_ADMIN: t.roleSuperAdmin,
      MANAGEMENT: t.roleManagement,
    };
    return roleLabels[role] || role;
  };

  const getRoleBadgeColor = () => {
    const colors: Record<UserRole, string> = {
      FARMER: "bg-leaf-900/60 text-leaf-300 border-leaf-700/40",
      SUPERVISOR: "bg-teal-900/60 text-teal-300 border-teal-700/40",
      ACCOUNTS: "bg-blue-900/60 text-blue-300 border-blue-700/40",
      ADMIN: "bg-purple-900/60 text-purple-300 border-purple-700/40",
      SUPER_ADMIN: "bg-amber-900/60 text-amber-300 border-amber-700/40",
      MANAGEMENT: "bg-red-900/60 text-red-300 border-red-700/40",
    };
    return colors[role] || "bg-forest-900/60 text-cream-300 border-forest-700/40";
  };

  const getUserAvatar = () => {
    const initials: Record<UserRole, string> = {
      FARMER: "RP",
      SUPERVISOR: "SY",
      ACCOUNTS: "RV",
      ADMIN: "DP",
      SUPER_ADMIN: "KS",
      MANAGEMENT: "MG",
    };
    return initials[role] || "U";
  };

  const getUserName = () => {
    const names: Record<UserRole, string> = {
      FARMER: lang === "hi" ? "रामेश्वर पटेल" : "Rameshwar Patel",
      SUPERVISOR: lang === "hi" ? "सुनील यादव" : "Sunil Yadav",
      ACCOUNTS: lang === "hi" ? "राजेश वर्मा" : "Rajesh Verma",
      ADMIN: lang === "hi" ? "दिनेश पटेल" : "Dinesh Patel",
      SUPER_ADMIN: lang === "hi" ? "कविता सिंह" : "Kavita Singh",
      MANAGEMENT: lang === "hi" ? "प्रबंधन" : "Management",
    };
    return names[role] || "User";
  };

  return (
    <div className="min-h-screen bg-forest-950 text-cream-100 font-sans antialiased">
      {/* PWA Status Header */}
      <PWAHeader lang={lang} />

      {/* Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        role={role}
        setRole={setRole}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-6">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-leaf-600 to-forest-800 flex items-center justify-center text-white font-bold text-lg shadow-lg border border-leaf-500/30">
              {getUserAvatar()}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-leaf-400 border-2 border-forest-950" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-cream-100">
                {lang === "hi" ? `नमस्ते, ${getUserName()}` : `Welcome, ${getUserName()}`}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeColor()}`}>
                  {getRoleLabel()}
                </span>
                <span className="text-[10px] text-cream-400 font-mono">
                  {lang === "hi" ? "सतपुड़ा जैविक एफपीओ" : "Satpura Jaivik FPO"} • MP
                </span>
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="hidden sm:flex items-center gap-2 p-1 rounded-xl bg-forest-900 border border-forest-800">
            {(["en", "hi"] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === l
                    ? "bg-leaf-600 text-white shadow-md"
                    : "text-cream-400 hover:text-cream-200"
                }`}
              >
                {l === "en" ? "English" : "हिंदी"}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {getDashboard()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
