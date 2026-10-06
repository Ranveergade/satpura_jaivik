"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, IndianRupee, CheckCircle2, Clock, XCircle,
  TrendingUp, FileText, AlertTriangle, Eye, ThumbsUp, ThumbsDown
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { fetchExpenses, approveExpense, rejectExpense } from "@/lib/api";
import { Card } from "@/components/ui/Card";

interface AccountsDashboardProps { lang: Language; }

export function AccountsDashboard({ lang }: AccountsDashboardProps) {
  const t = translations[lang];
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchExpenses().then(e => { setExpenses(e); setLoading(false); });
  }, []);

  const handleFinanceApprove = async (id: string) => {
    setActionLoading(id);
    await approveExpense(id, "ADMIN_APPROVED");
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: "ADMIN_APPROVED" } : e));
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    await rejectExpense(id, "Finance Audit Failed");
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: "REJECTED" } : e));
    setActionLoading(null);
  };

  const totalBudget = 4500000;
  const totalSpent = expenses.filter(e => e.status === "PAID").reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const pendingAmount = expenses.filter(e => e.status === "ACCOUNTS_VERIFIED").reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const utilizationPct = Math.round((totalSpent / totalBudget) * 100);

  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    const cat = e.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(e.amount || 0);
  });

  const filteredExpenses = filterStatus === "ALL" ? expenses : expenses.filter(e => e.status === filterStatus);
  const statusOptions = ["ALL", "SUBMITTED", "ACCOUNTS_VERIFIED", "ADMIN_APPROVED", "PAID", "REJECTED"];

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 col-span-1 sm:col-span-1 bg-forest-900/60 border border-forest-800">
          <p className="text-xs text-cream-400 mb-1">{t.totalBudget}</p>
          <p className="text-3xl font-serif font-bold text-cream-100">₹{(totalBudget / 100000).toFixed(1)}L</p>
          <div className="mt-3 w-full h-2 bg-forest-950 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${utilizationPct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-leaf-600 to-leaf-400 rounded-full"
            />
          </div>
          <p className="text-xs text-leaf-400 mt-1.5 font-bold">{utilizationPct}% {lang === "hi" ? "उपयोग किया" : "Utilized"}</p>
        </Card>
        <Card className="p-5 bg-forest-900/60 border border-forest-800">
          <p className="text-xs text-cream-400 mb-1">{t.spentToDate}</p>
          <p className="text-3xl font-serif font-bold text-red-300">₹{(totalSpent / 100000).toFixed(2)}L</p>
          <p className="text-xs text-cream-400 mt-2">{expenses.filter(e => e.status === "PAID").length} {lang === "hi" ? "भुगतान किए गए व्यय" : "paid transactions"}</p>
        </Card>
        <Card className="p-5 bg-forest-900/60 border border-forest-800">
          <p className="text-xs text-cream-400 mb-1">{lang === "hi" ? "भुगतान लंबित" : "Awaiting Payment"}</p>
          <p className="text-3xl font-serif font-bold text-amber-300">₹{(pendingAmount / 100000).toFixed(2)}L</p>
          <p className="text-xs text-cream-400 mt-2">{expenses.filter(e => e.status === "ACCOUNTS_VERIFIED").length} {lang === "hi" ? "अनुमोदित, भुगतान बकाया" : "approved, payment due"}</p>
        </Card>
      </div>

      {/* Category Breakdown */}
      <section>
        <h2 className="text-lg font-serif font-bold text-cream-100 mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-leaf-400" />
          {lang === "hi" ? "श्रेणी-वार व्यय" : "Expense by Category"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(categoryTotals).map(([cat, val]) => (
            <Card key={cat} className="p-4 bg-forest-900/60 border border-forest-800">
              <p className="text-[10px] font-mono text-leaf-400 uppercase tracking-wider">{cat}</p>
              <p className="text-lg font-bold text-cream-100 mt-1">₹{(val / 1000).toFixed(0)}K</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Expense Ledger */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-leaf-400" />
            {lang === "hi" ? "व्यय खाता बही" : "Expense Ledger"}
          </h2>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                  filterStatus === s
                    ? "bg-leaf-500 text-forest-950 border-leaf-400"
                    : "bg-forest-900 text-cream-400 border-forest-700 hover:border-leaf-500/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredExpenses.map(exp => {
            const canProcess = exp.status === "ACCOUNTS_VERIFIED";
            return (
              <motion.div
                key={exp.id}
                layout
                className={`p-4 rounded-2xl border transition-all ${canProcess ? "bg-amber-950/20 border-amber-700/40" : "bg-forest-900/60 border-forest-800"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {exp.status === "PAID" ? <CheckCircle2 className="w-4 h-4 text-leaf-400" /> :
                       exp.status === "REJECTED" ? <XCircle className="w-4 h-4 text-red-400" /> :
                       <Clock className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cream-100">{exp.title}</p>
                      <p className="text-xs text-cream-400">{exp.category} • {exp.vendor_name} • {exp.expense_date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold font-serif text-cream-100">₹{parseFloat(exp.amount || 0).toLocaleString("en-IN")}</p>
                    <p className="text-[10px] font-mono text-cream-400">{exp.status}</p>
                  </div>
                </div>
                {canProcess && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-amber-700/30">
                    <button
                      onClick={() => handleFinanceApprove(exp.id)}
                      disabled={actionLoading === exp.id}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-leaf-600 text-white text-xs font-bold hover:bg-leaf-500 transition-colors disabled:opacity-60"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> {lang === "hi" ? "भुगतान स्वीकृत करें" : "Approve Payment"}
                    </button>
                    <button
                      onClick={() => handleReject(exp.id)}
                      disabled={actionLoading === exp.id}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-900/60 text-red-300 text-xs font-bold border border-red-700/50 hover:bg-red-900 transition-colors disabled:opacity-60"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" /> {lang === "hi" ? "अस्वीकार करें" : "Reject"}
                    </button>
                    <button className="ml-auto flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-forest-800 text-cream-300 text-xs border border-forest-700">
                      <Eye className="w-3.5 h-3.5" /> {t.actionViewReceipt}
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
