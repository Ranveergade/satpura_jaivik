"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Crown, TrendingUp, Users, FolderKanban, IndianRupee,
  BarChart3, Leaf, Award, Shield, Globe, Map, Activity
} from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { fetchProjects, fetchExpenses, fetchUsers } from "@/lib/api";
import { Card } from "@/components/ui/Card";

interface ManagementDashboardProps { lang: Language; }

export function ManagementDashboard({ lang }: ManagementDashboardProps) {
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
  const totalExpenses = expenses.filter(e => e.status === "PAID").reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const utilizationPct = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
  const farmerCount = users.filter(u => u.role === "FARMER").length;
  const completedProjects = projects.filter(p => p.status === "COMPLETED").length;
  const totalAcres = projects.reduce((s, p) => s + parseFloat(p.land_area_acres || 0), 0);
  const roi = totalSubsidy > 0 ? ((totalBudget - totalExpenses) / totalSubsidy * 100).toFixed(1) : "—";

  const execSummary = [
    { label: lang === "hi" ? "कुल बजट" : "Total Budget", value: `₹${(totalBudget / 100000).toFixed(1)}L`, change: "+12%", positive: true },
    { label: lang === "hi" ? "व्यय दक्षता" : "Expenditure Efficiency", value: `${utilizationPct}%`, change: "-3%", positive: false },
    { label: lang === "hi" ? "सब्सिडी उपयोग" : "Subsidy Utilization", value: `₹${(totalSubsidy / 100000).toFixed(1)}L`, change: "+8%", positive: true },
    { label: lang === "hi" ? "लाभार्थी किसान" : "Beneficiary Farmers", value: farmerCount, change: "+2", positive: true },
  ];

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-forest-900 via-forest-950 to-leaf-950 border border-leaf-500/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-leaf-400 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-amber-400" />
            <span className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider">
              {lang === "hi" ? "प्रबंधन कार्यपट्ट" : "Management Executive View"}
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-cream-100 mb-2">
            {lang === "hi" ? "सतपुड़ा जैविक FPO" : "Satpura Jaivik FPO"}
          </h2>
          <p className="text-cream-400 text-sm">
            {lang === "hi"
              ? `${projects.length} सक्रिय परियोजनाएं • ${totalAcres.toFixed(1)} एकड़ • ${farmerCount} किसान लाभार्थी`
              : `${projects.length} Active Projects • ${totalAcres.toFixed(1)} Acres under Management • ${farmerCount} Farmer Beneficiaries`}
          </p>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {execSummary.map((kpi, i) => (
          <Card key={i} className="p-5 bg-forest-900/60 border border-forest-800">
            <p className="text-xs text-cream-400 mb-1">{kpi.label}</p>
            <p className="text-2xl font-serif font-bold text-cream-100">{kpi.value}</p>
            <p className={`text-xs font-bold mt-1 ${kpi.positive ? "text-leaf-400" : "text-red-400"}`}>
              {kpi.change} {lang === "hi" ? "पिछले माह से" : "vs last month"}
            </p>
          </Card>
        ))}
      </div>

      {/* Programme Health */}
      <section>
        <h2 className="text-xl font-serif font-bold text-cream-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-leaf-400" />
          {lang === "hi" ? "कार्यक्रम स्वास्थ्य संकेतक" : "Programme Health Indicators"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Leaf className="w-6 h-6 text-leaf-400" />,
              label: lang === "hi" ? "जैविक प्रमाणीकरण" : "Organic Certification",
              value: "4/6",
              sub: lang === "hi" ? "परियोजनाएं जैविक मानक पर" : "Projects on organic standard",
              pct: 67,
              color: "from-leaf-600 to-leaf-400"
            },
            {
              icon: <Award className="w-6 h-6 text-amber-400" />,
              label: lang === "hi" ? "सब्सिडी अनुपालन" : "Subsidy Compliance",
              value: "100%",
              sub: lang === "hi" ? "सभी दस्तावेज अपलोड किए गए" : "All docs uploaded and verified",
              pct: 100,
              color: "from-amber-600 to-amber-400"
            },
            {
              icon: <Shield className="w-6 h-6 text-teal-400" />,
              label: lang === "hi" ? "लेखापरीक्षा तत्परता" : "Audit Readiness",
              value: "92%",
              sub: lang === "hi" ? "निरीक्षण के लिए तैयार" : "Ready for government inspection",
              pct: 92,
              color: "from-teal-600 to-teal-400"
            },
          ].map((item, i) => (
            <Card key={i} className="p-5 bg-forest-900/60 border border-forest-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-forest-950">{item.icon}</div>
                <p className="text-sm font-bold text-cream-100">{item.label}</p>
              </div>
              <p className="text-3xl font-serif font-bold text-cream-100 mb-1">{item.value}</p>
              <p className="text-xs text-cream-400 mb-3">{item.sub}</p>
              <div className="w-full h-2 bg-forest-950 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.15 }}
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Regional Map Placeholder */}
      <section>
        <h2 className="text-xl font-serif font-bold text-cream-100 mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-leaf-400" />
          {lang === "hi" ? "भूमि वितरण मानचित्र" : "Land Distribution Map"}
        </h2>
        <div className="p-8 rounded-3xl bg-forest-950/60 border border-forest-800 text-center">
          <Globe className="w-16 h-16 text-forest-700 mx-auto mb-4" />
          <p className="text-cream-300 font-semibold">
            {lang === "hi" ? "GIS मानचित्र इंटीग्रेशन आ रहा है" : "GIS Map Integration — Coming in Phase 2"}
          </p>
          <p className="text-cream-400 text-sm mt-2">
            {lang === "hi"
              ? "Google Maps / Mapbox के माध्यम से सभी परियोजना भूखंडों का दृश्य"
              : "Visual overview of all project plots via Google Maps / Mapbox"}
          </p>
        </div>
      </section>
    </div>
  );
}
