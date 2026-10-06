"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sprout, ShieldCheck, MapPin, Calendar, IndianRupee, Eye,
  Camera, Cctv, Radio, MessageSquare, ChevronRight, CheckCircle2,
  Clock, AlertCircle, TrendingUp
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { fetchProjects, fetchExpenses } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CameraUploadModal } from "@/components/pwa/CameraUploadModal";
import { CCTVPlayerModal } from "@/components/pwa/CCTVPlayerModal";
import { IoTDashboardModal } from "@/components/pwa/IoTDashboardModal";
import { ChatDrawer } from "@/components/pwa/ChatDrawer";

interface FarmerDashboardProps { lang: Language; }

const statusColors: Record<string, string> = {
  PLANNED: "bg-cream-900/60 text-cream-300 border-cream-700/40",
  IN_PROGRESS: "bg-leaf-900/60 text-leaf-300 border-leaf-700/40",
  VERIFICATION: "bg-amber-900/60 text-amber-300 border-amber-700/40",
  COMPLETED: "bg-teal-900/60 text-teal-300 border-teal-700/40",
};

const expenseStatusColors: Record<string, string> = {
  SUBMITTED: "text-amber-400",
  ACCOUNTS_VERIFIED: "text-blue-400",
  ADMIN_APPROVED: "text-purple-400",
  PAID: "text-leaf-400",
  REJECTED: "text-red-400",
};

export function FarmerDashboard({ lang }: FarmerDashboardProps) {
  const t = translations[lang];
  const [projects, setProjects] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showCCTV, setShowCCTV] = useState(false);
  const [showIoT, setShowIoT] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [submittedExpenses, setSubmittedExpenses] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchExpenses()]).then(([p, e]) => {
      setProjects(p);
      setExpenses(e);
      setLoading(false);
    });
  }, []);

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PLANNED: t.statusPlanned,
      IN_PROGRESS: t.statusInProgress,
      VERIFICATION: t.statusVerification,
      COMPLETED: t.statusCompleted,
    };
    return map[status] || status;
  };

  const getExpenseStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      SUBMITTED: t.statusSubmitted,
      ACCOUNTS_VERIFIED: t.statusAccountsVerified,
      ADMIN_APPROVED: t.statusAdminApproved,
      PAID: t.statusPaid,
      REJECTED: t.statusRejected,
    };
    return map[status] || status;
  };

  const allExpenses = [...expenses, ...submittedExpenses];
  const totalSpent = allExpenses.filter(e => e.status === "PAID").reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Camera className="w-5 h-5" />, label: t.btnCameraUpload, action: () => setShowCamera(true), color: "leaf" },
          { icon: <Cctv className="w-5 h-5" />, label: t.btnLiveCctv, action: () => setShowCCTV(true), color: "teal" },
          { icon: <Radio className="w-5 h-5" />, label: t.btnIotSensors, action: () => setShowIoT(true), color: "amber" },
          { icon: <MessageSquare className="w-5 h-5" />, label: t.btnChatSupervisor, action: () => setShowChat(true), color: "cream" },
        ].map((btn, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={btn.action}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-forest-900/70 border border-forest-800 hover:border-leaf-500/40 transition-all text-cream-200 hover:text-white text-center cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-forest-950 border border-forest-700">
              {btn.icon}
            </div>
            <span className="text-xs font-semibold leading-tight">{btn.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Projects Section */}
      <section>
        <h2 className="text-xl font-serif font-bold text-cream-100 mb-4 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-leaf-400" />
          {t.sectionProjects}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const budget = parseFloat(proj.total_budget || 0);
            const subsidy = parseFloat(proj.allocated_subsidy || 0);
            const progressPct = 65;
            return (
              <Card key={proj.id} className="p-6 border border-forest-800 bg-forest-900/60 hover:border-leaf-500/30">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-leaf-400 uppercase">{proj.project_code}</span>
                    <h3 className="text-base font-bold font-serif text-cream-100 mt-0.5">{proj.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[proj.status] || "bg-forest-900 text-cream-300 border-forest-700"}`}>
                    {getStatusLabel(proj.status)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-cream-300 mb-1.5">
                    <span>{lang === "hi" ? "परियोजना प्रगति" : "Project Progress"}</span>
                    <span className="font-bold text-leaf-300">{progressPct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-forest-950 rounded-full overflow-hidden border border-forest-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-leaf-600 to-leaf-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="p-2.5 rounded-xl bg-forest-950 border border-forest-800">
                    <p className="text-cream-400 mb-0.5">{t.totalBudget}</p>
                    <p className="font-bold text-cream-100">₹{budget.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-forest-950 border border-forest-800">
                    <p className="text-cream-400 mb-0.5">{t.subsidyApproved}</p>
                    <p className="font-bold text-leaf-300">₹{subsidy.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-forest-950 border border-forest-800">
                    <p className="text-cream-400 mb-0.5">{t.farmArea}</p>
                    <p className="font-bold text-cream-100">{proj.land_area_acres} Acres</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-forest-950 border border-forest-800">
                    <p className="text-cream-400 mb-0.5">{t.cropType}</p>
                    <p className="font-bold text-cream-100">{proj.crop_type}</p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-3 border-t border-forest-800 flex items-center justify-between text-xs text-cream-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-leaf-400" />
                    <span className="font-mono">{proj.gps_lat?.toFixed(4)}°N, {proj.gps_lng?.toFixed(4)}°E</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-leaf-400" />
                    <span>Ends: {proj.target_completion}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Expenses Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-cream-100 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-leaf-400" />
            {t.sectionExpenses}
          </h2>
          <div className="px-3 py-1.5 rounded-full bg-leaf-950 text-leaf-300 text-xs font-bold border border-leaf-700/50">
            {t.spentToDate}: ₹{totalSpent.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="space-y-3">
          {allExpenses.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-forest-900/60 border border-forest-800 hover:border-forest-700"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-forest-950 border border-forest-800">
                  <IndianRupee className="w-4 h-4 text-leaf-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-cream-100">{exp.title}</p>
                  <p className="text-xs text-cream-400">{exp.category} • {exp.vendor_name} • {exp.expense_date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold font-serif text-cream-100">₹{parseFloat(exp.amount || 0).toLocaleString("en-IN")}</p>
                <p className={`text-[10px] font-bold ${expenseStatusColors[exp.status] || "text-cream-400"}`}>
                  {getExpenseStatusLabel(exp.status)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <CameraUploadModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        lang={lang}
        onUploadSuccess={(data) => setSubmittedExpenses(prev => [...prev, { ...data, id: `new-${Date.now()}`, status: "SUBMITTED" }])}
      />
      <CCTVPlayerModal isOpen={showCCTV} onClose={() => setShowCCTV(false)} lang={lang} />
      <IoTDashboardModal isOpen={showIoT} onClose={() => setShowIoT(false)} lang={lang} />
      <ChatDrawer isOpen={showChat} onClose={() => setShowChat(false)} lang={lang} />
    </div>
  );
}
