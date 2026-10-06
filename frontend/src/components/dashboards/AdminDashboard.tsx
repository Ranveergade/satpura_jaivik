"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Users, FolderKanban, BarChart3, IndianRupee,
  CheckCircle2, Clock, AlertTriangle, Eye, TrendingUp,
  Download, FileSpreadsheet, Layers, Activity
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { fetchProjects, fetchExpenses, fetchUsers } from "@/lib/api";
import { Card } from "@/components/ui/Card";

interface AdminDashboardProps { lang: Language; }

export function AdminDashboard({ lang }: AdminDashboardProps) {
  const t = translations[lang];
  const [projects, setProjects] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchExpenses(), fetchUsers()]).then(([p, e, u]) => {
      setProjects(p);
      setExpenses(e);
      setUsers(u);
      setLoading(false);
    });
  }, []);

  const totalBudget = projects.reduce((s, p) => s + parseFloat(p.total_budget || 0), 0);
  const totalSubsidy = projects.reduce((s, p) => s + parseFloat(p.allocated_subsidy || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const approvalPending = expenses.filter(e => e.status === "ADMIN_APPROVED").length;

  const projectsByStatus = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const usersByRole = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: lang === "hi" ? "कुल परियोजनाएं" : "Total Projects", value: projects.length, icon: <FolderKanban className="w-5 h-5" />, color: "text-leaf-400", bg: "bg-leaf-900/20" },
          { label: lang === "hi" ? "कुल बजट" : "Total Budget", value: `₹${(totalBudget / 100000).toFixed(1)}L`, icon: <IndianRupee className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-900/20" },
          { label: lang === "hi" ? "सब्सिडी आवंटित" : "Subsidy Allocated", value: `₹${(totalSubsidy / 100000).toFixed(1)}L`, icon: <TrendingUp className="w-5 h-5" />, color: "text-teal-400", bg: "bg-teal-900/20" },
          { label: lang === "hi" ? "भुगतान लंबित" : "Payments Pending", value: approvalPending, icon: <Clock className="w-5 h-5" />, color: "text-red-400", bg: "bg-red-900/20" },
        ].map((kpi, i) => (
          <Card key={i} className={`p-5 border border-forest-800 ${kpi.bg}`}>
            <div className={`${kpi.color} mb-2`}>{kpi.icon}</div>
            <p className="text-2xl font-serif font-bold text-cream-100">{kpi.value}</p>
            <p className="text-[11px] text-cream-400 mt-0.5">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Project Status Overview */}
      <section>
        <h2 className="text-xl font-serif font-bold text-cream-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-leaf-400" />
          {lang === "hi" ? "परियोजना स्थिति अवलोकन" : "Project Status Overview"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { status: "PLANNED", color: "text-cream-300", bg: "bg-cream-900/40", border: "border-cream-700/40" },
            { status: "IN_PROGRESS", color: "text-leaf-300", bg: "bg-leaf-900/40", border: "border-leaf-700/40" },
            { status: "VERIFICATION", color: "text-amber-300", bg: "bg-amber-900/40", border: "border-amber-700/40" },
            { status: "COMPLETED", color: "text-teal-300", bg: "bg-teal-900/40", border: "border-teal-700/40" },
          ].map(({ status, color, bg, border }) => (
            <Card key={status} className={`p-4 border ${border} ${bg}`}>
              <p className={`text-3xl font-serif font-bold ${color}`}>{projectsByStatus[status] || 0}</p>
              <p className="text-xs text-cream-400 mt-1">{status.replace("_", " ")}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* User Distribution */}
      <section>
        <h2 className="text-xl font-serif font-bold text-cream-100 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-leaf-400" />
          {lang === "hi" ? "भूमिका अनुसार उपयोगकर्ता" : "Users by Role"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {["FARMER", "SUPERVISOR", "ACCOUNTS", "ADMIN", "SUPER_ADMIN"].map(role => (
            <Card key={role} className="p-4 bg-forest-900/60 border border-forest-800 text-center">
              <p className="text-2xl font-serif font-bold text-cream-100">{usersByRole[role] || 0}</p>
              <p className="text-[10px] font-mono text-leaf-400 mt-1">{role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-cream-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-leaf-400" />
            {t.sectionProjects}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 border border-forest-700 text-cream-300 text-xs font-bold hover:border-leaf-500/40 transition-colors">
            <Download className="w-4 h-4" />
            {lang === "hi" ? "एक्सपोर्ट CSV" : "Export CSV"}
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-forest-800">
          <table className="w-full text-sm">
            <thead className="bg-forest-900/80 text-cream-300 text-xs">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">{lang === "hi" ? "परियोजना" : "Project"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "hi" ? "किसान" : "Farmer"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "hi" ? "बजट" : "Budget"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "hi" ? "सब्सिडी" : "Subsidy"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "hi" ? "स्थिति" : "Status"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "hi" ? "फसल" : "Crop"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800">
              {projects.map(proj => (
                <tr key={proj.id} className="bg-forest-900/40 hover:bg-forest-900/70 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-cream-100">{proj.project_code}</p>
                    <p className="text-cream-400 text-xs">{proj.title}</p>
                  </td>
                  <td className="px-4 py-3 text-cream-300">
                    {proj.farmer?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-cream-100 font-mono">
                    ₹{parseFloat(proj.total_budget || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-leaf-300 font-mono">
                    ₹{parseFloat(proj.allocated_subsidy || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      proj.status === "IN_PROGRESS" ? "bg-leaf-900/60 text-leaf-300 border-leaf-700/40" :
                      proj.status === "COMPLETED" ? "bg-teal-900/60 text-teal-300 border-teal-700/40" :
                      "bg-cream-900/60 text-cream-300 border-cream-700/40"
                    }`}>{proj.status}</span>
                  </td>
                  <td className="px-4 py-3 text-cream-300 text-xs">{proj.crop_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
