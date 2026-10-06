"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { impactMetricsData, ImpactMetric } from "@/data/impact";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { BarChart3, CheckCircle2, TrendingUp, ShieldCheck, Leaf, ArrowRight } from "lucide-react";

export function ImpactDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<ImpactMetric>(impactMetricsData[0]);

  return (
    <section id="impact" className="py-24 relative bg-forest-950/90 border-t border-forest-900 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-leaf-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="leaf" className="mx-auto">
            Live Impact Telemetry
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100">
            Climate & Social <span className="italic text-leaf-300">Dashboard</span>
          </h2>
          <p className="text-cream-300 text-base sm:text-lg">
            Real-time ecological metrics tracking soil microbial restoration, water preservation, and economic upliftment across Satpura agrarian clusters.
          </p>
        </div>

        {/* Dashboard Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Metrics Selector Column */}
          <div className="lg:col-span-4 space-y-3">
            {impactMetricsData.map((item) => {
              const isSelected = selectedMetric.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedMetric(item)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border cursor-pointer ${
                    isSelected
                      ? "bg-forest-900 border-leaf-400 shadow-xl shadow-leaf-950/50 scale-[1.02]"
                      : "bg-forest-950/60 border-forest-800 hover:border-forest-700 hover:bg-forest-900/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-leaf-400">
                      {item.category} Impact
                    </span>
                    <span className="text-xs font-bold text-cream-300 bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                      {item.period}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-cream-100 mb-2">
                    {item.title}
                  </h4>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-serif font-bold text-leaf-300">
                      {item.value}
                    </span>
                    <span className="text-xs text-cream-400">
                      {item.change}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Live Visualizer Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMetric.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <Card className="p-8 lg:p-10 border-2 border-leaf-500/30 bg-gradient-to-br from-forest-900/90 via-forest-950 to-forest-900/70 shadow-2xl h-full flex flex-col justify-between">
                  <div>
                    {/* Top Panel Header */}
                    <div className="flex items-center justify-between border-b border-forest-800 pb-6 mb-6">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-leaf-400 font-semibold block mb-1">
                          Active Telemetry Stream
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-cream-100">
                          {selectedMetric.title}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-3xl sm:text-4xl font-serif font-bold text-leaf-300 block">
                          {selectedMetric.value}
                        </span>
                        <span className="text-xs text-cream-400">
                          {selectedMetric.change}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-base text-cream-200 leading-relaxed mb-8">
                      {selectedMetric.description}
                    </p>

                    {/* Progress Visualizer Meter */}
                    <div className="p-6 rounded-2xl bg-forest-950/80 border border-forest-800 space-y-4 mb-8">
                      <div className="flex items-center justify-between text-xs font-mono text-cream-300">
                        <span>SATURATION INDEX</span>
                        <span className="text-leaf-300 font-bold">92% OF TARGET MET</span>
                      </div>
                      
                      <div className="w-full h-3 bg-forest-900 rounded-full overflow-hidden p-0.5 border border-forest-800">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-leaf-600 via-leaf-400 to-cream-300 rounded-full shadow-[0_0_12px_#52B788]"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-cream-400">
                        <span>Baseline (2023)</span>
                        <span>Current Audit (2026)</span>
                        <span>Target Goal (2028)</span>
                      </div>
                    </div>

                    {/* Key Verification Bullet Points */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-leaf-400">
                        Empirical Proof Parameters:
                      </h4>
                      <div className="space-y-2">
                        {selectedMetric.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-cream-200">
                            <CheckCircle2 className="w-4 h-4 text-leaf-400 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-forest-800/80 mt-8 flex items-center justify-between text-xs text-cream-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-leaf-400" />
                      Third-Party Audited Dataset
                    </span>
                    <span className="font-mono">Configurable Schema Data</span>
                  </div>

                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
