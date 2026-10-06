"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck, Users, MapPin, Calendar, IndianRupee,
  Camera, Cctv, Radio, MessageSquare, ChevronRight,
  CheckCircle2, Clock, AlertCircle, XCircle, TrendingUp, Eye, ThumbsUp, ThumbsDown
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { fetchProjects, fetchExpenses, approveExpense, rejectExpense } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CameraUploadModal } from "@/components/pwa/CameraUploadModal";
import { CCTVPlayerModal } from "@/components/pwa/CCTVPlayerModal";
import { IoTDashboardModal } from "@/components/pwa/IoTDashboardModal";
import { ChatDrawer } from "@/components/pwa/ChatDrawer";

interface SupervisorDashboardProps { lang: Language; }

const expenseStatusIcons: Record<string, React.ReactNode> = {
  SUBMITTED: <Clock className="w-4 h-4 text-amber-400" />,
  ACCOUNTS_VERIFIED: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
  ADMIN_APPROVED: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
  PAID: <CheckCircle2 className="w-4 h-4 text-leaf-400" />,
  REJECTED: <XCircle className="w-4 h-4 text-red-400" />,
};

export function SupervisorDashboard({ lang }: SupervisorDashboardProps) {
  const t = translations[lang];
  const [projects, setProjects] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showCCTV, setShowCCTV] = useState(false);
  const [showIoT, setShowIoT] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchExpenses()]).then(([p, e]) => {
      setProjects(p);
      setExpenses(e);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (expId: string) => {
    setActionLoading(expId);
    await approveExpense(expId, "ACCOUNTS_VERIFIED");
    setExpenses(prev => prev.map(e => e.id === expId ? { ...e, status: "ACCOUNTS_VERIFIED" } : e));
    setActionLoading(null);
  };

  const handleReject = async (expId: string) => {
    setActionLoading(expId);
    await rejectExpense(expId, "Rejected by Supervisor");
    setExpenses(prev => prev.map(e => e.id === expId ? { ...e, status: "REJECTED" } : e));
    setActionLoading(null);
  };

  const pendingExpenses = expenses.filter(e => e.status === "SUBMITTED");
  const totalValue = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: lang === "hi" ? "सक्रिय परियोजनाएं" : "Active Projects", value: projects.filter(p => p.status === "IN_PROGRESS").length, icon: <ClipboardCheck className="w-5 h-5" />, color: "text-leaf-400" },
          { label: lang === "hi" ? "लंबित व्यय" : "Pending Expenses", value: pendingExpenses.length, icon: <Clock className="w-5 h-5" />, color: "text-amber-400" },
          { label: lang === "hi" ? "कुल व्यय मूल्य" : "Total Expense Value", value: `₹${(totalValue / 100000).toFixed(1)}L`, icon: <IndianRupee className="w-5 h-5" />, color: "text-teal-400" },
          { label: lang === "hi" ? "किसान" : "Farmers", value: projects.length, icon: <Users className="w-5 h-5" />, color: "text-purple-400" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 bg-forest-900/60 border border-forest-800">
            <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
            <p className="text-2xl font-serif font-bold text-cream-100">{stat.value}</p>
            <p className="text-[11px] text-cream-400 mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Camera className="w-5 h-5" />, label: t.btnCameraUpload, action: () => setShowCamera(true) },
          { icon: <Cctv className="w-5 h-5" />, label: t.btnLiveCctv, action: () => setShowCCTV(true) },
          { icon: <Radio className="w-5 h-5" />, label: t.btnIotSensors, action: () => setShowIoT(true) },
          { icon: <MessageSquare className="w-5 h-5" />, label: t.btnChatSupervisor, action: () => setShowChat(true) },
        ].map((btn, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={btn.action}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-forest-900/70 border border-forest-800 hover:border-leaf-500/40 transition-all text-cream-200 text-center cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-forest-950 border border-forest-700">{btn.icon}</div>
            <span className="text-xs font-semibold leading-tight">{btn.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Expenses for Review */}
      <section>
        <h2 className="text-xl font-serif font-bold text-cream-100 mb-4 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-leaf-400" />
          {t.sectionExpenses}
          {pendingExpenses.length > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              {pendingExpenses.length} {lang === "hi" ? "लंबित" : "Pending"}
            </span>
          )}
        </h2>

        <div className="space-y-3">
          {expenses.map((exp) => {
            const isPending = exp.status === "SUBMITTED";
            return (
              <motion.div
                key={exp.id}
                layout
                className={`p-4 rounded-2xl border transition-all ${
                  isPending
                    ? "bg-amber-950/20 border-amber-700/40 hover:border-amber-500/50"
                    : "bg-forest-900/60 border-forest-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{expenseStatusIcons[exp.status] || <Clock className="w-4 h-4 text-cream-400" />}</div>
                    <div>
                      <p className="text-sm font-bold text-cream-100">{exp.title}</p>
                      <p className="text-xs text-cream-400 mt-0.5">{exp.category} • {exp.vendor_name} • {exp.expense_date}</p>
                      {exp.notes && <p className="text-xs text-cream-300 mt-1 italic">"{exp.notes}"</p>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold font-serif text-cream-100">
                      ₹{parseFloat(exp.amount || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] font-mono text-cream-400 mt-0.5">{exp.status}</p>
                  </div>
                </div>
                {isPending && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-700/30">
                    <button
                      onClick={() => handleApprove(exp.id)}
                      disabled={actionLoading === exp.id}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-leaf-600 text-white text-xs font-bold hover:bg-leaf-500 transition-colors disabled:opacity-60"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {t.actionApprove}
                    </button>
                    <button
                      onClick={() => handleReject(exp.id)}
                      disabled={actionLoading === exp.id}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-900/60 text-red-300 text-xs font-bold border border-red-700/50 hover:bg-red-900 transition-colors disabled:opacity-60"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      {t.actionReject}
                    </button>
                    <button
                      className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest-800 text-cream-300 text-xs font-bold border border-forest-700 hover:bg-forest-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t.actionViewReceipt}
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Projects Overview */}
      <section>
        <h2 className="text-xl font-serif font-bold text-cream-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-leaf-400" />
          {t.sectionProjects}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.slice(0, 4).map((proj) => (
            <Card key={proj.id} className="p-5 bg-forest-900/60 border border-forest-800 hover:border-leaf-500/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono text-leaf-400">{proj.project_code}</span>
                  <h3 className="text-sm font-bold text-cream-100 mt-0.5">{proj.title}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  proj.status === "IN_PROGRESS" ? "bg-leaf-900/60 text-leaf-300 border-leaf-700/40" :
                  proj.status === "COMPLETED" ? "bg-teal-900/60 text-teal-300 border-teal-700/40" :
                  "bg-cream-900/60 text-cream-300 border-cream-700/40"
                }`}>{proj.status}</span>
              </div>
              <div className="flex gap-4 text-xs text-cream-400">
                <span><MapPin className="w-3 h-3 inline mr-1 text-leaf-400" />{proj.land_area_acres} Acres</span>
                <span><Calendar className="w-3 h-3 inline mr-1 text-leaf-400" />Due: {proj.target_completion}</span>
                <span><IndianRupee className="w-3 h-3 inline mr-1 text-leaf-400" />₹{(parseFloat(proj.total_budget || 0) / 100000).toFixed(1)}L</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <CameraUploadModal isOpen={showCamera} onClose={() => setShowCamera(false)} lang={lang} />
      <CCTVPlayerModal isOpen={showCCTV} onClose={() => setShowCCTV(false)} lang={lang} />
      <IoTDashboardModal isOpen={showIoT} onClose={() => setShowIoT(false)} lang={lang} />
      <ChatDrawer isOpen={showChat} onClose={() => setShowChat(false)} lang={lang} />
    </div>
  );
}
