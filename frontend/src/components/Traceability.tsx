"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { traceabilitySteps, TraceabilityStep } from "@/data/traceability";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { ShieldCheck, Trees, Sun, Cog, ShieldAlert, Truck, Home, ArrowRight, CheckCircle2 } from "lucide-react";

const stepIcons: Record<string, React.ReactNode> = {
  Trees: <Trees className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Cog: <Cog className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
};

export function Traceability() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = traceabilitySteps[activeStepIndex];

  return (
    <section id="traceability" className="py-24 relative bg-forest-950 border-t border-forest-900 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-leaf-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="cream" className="mx-auto">
            100% Supply Chain Transparency
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100">
            Know where your <span className="italic text-leaf-300">food comes from.</span>
          </h2>
          <p className="text-cream-300 text-base sm:text-lg">
            Track every batch from Satpura’s organic farm plots straight to your dining table via transparent digital ledger verification.
          </p>
        </div>

        {/* Timeline Stepper Nodes */}
        <div className="mb-12 relative">
          {/* Progress bar background line */}
          <div className="absolute top-7 left-6 right-6 h-1 bg-forest-800 rounded-full hidden md:block" />
          {/* Active Progress Line */}
          <div
            className="absolute top-7 left-6 h-1 bg-gradient-to-r from-leaf-500 to-leaf-300 rounded-full transition-all duration-500 hidden md:block"
            style={{ width: `${(activeStepIndex / (traceabilitySteps.length - 1)) * 92}%` }}
          />

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative z-10">
            {traceabilitySteps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPassed = idx < activeStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-forest-900 border-2 border-leaf-400 shadow-lg scale-105"
                      : isPassed
                      ? "bg-forest-900/60 border border-leaf-700/50 text-leaf-300"
                      : "bg-forest-950/80 border border-forest-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                      isActive
                        ? "bg-leaf-500 text-forest-950 font-bold shadow-md shadow-leaf-500/30"
                        : isPassed
                        ? "bg-leaf-950 text-leaf-400 border border-leaf-700/50"
                        : "bg-forest-800 text-cream-400"
                    }`}
                  >
                    {stepIcons[step.iconName] || <CheckCircle2 className="w-5 h-5" />}
                  </div>

                  <span className="text-[10px] font-mono font-bold text-leaf-400">
                    STAGE {step.stepNumber}
                  </span>
                  <span className="text-xs font-bold text-cream-100 text-center truncate max-w-[120px]">
                    {step.stageName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Step Detail Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-8 lg:p-12 border-2 border-leaf-500/30 bg-forest-900/80 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Image Frame */}
                <div className="lg:col-span-6 relative">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-leaf-500/30 shadow-xl">
                    <img
                      src={currentStep.image}
                      alt={currentStep.stageName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cream-100 bg-forest-950/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        {currentStep.location}
                      </span>
                      <span className="text-xs font-bold text-leaf-300 bg-leaf-950/90 px-3 py-1.5 rounded-full border border-leaf-700/50 backdrop-blur-md">
                        Verified Ledger
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information Column */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-leaf-500/20 text-leaf-300 font-mono text-xs font-bold border border-leaf-500/40">
                      STEP {currentStep.stepNumber} OF 06
                    </span>
                    <span className="text-xs text-cream-400 font-mono">
                      Batch #SJ-2026-X
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-serif font-bold text-cream-100">
                    {currentStep.stageName}
                  </h3>

                  <p className="text-base text-cream-300 leading-relaxed">
                    {currentStep.details}
                  </p>

                  <div className="p-4 rounded-2xl bg-forest-950/80 border border-forest-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-cream-400 uppercase tracking-wider block">
                        {currentStep.metricsLabel}
                      </span>
                      <span className="text-lg font-bold font-serif text-leaf-300">
                        {currentStep.metricsValue}
                      </span>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-leaf-400" />
                  </div>

                  {/* Step Control Buttons */}
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      disabled={activeStepIndex === 0}
                      onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-full border border-forest-700 text-xs font-semibold text-cream-300 disabled:opacity-40 hover:bg-forest-800"
                    >
                      ← Previous Stage
                    </button>
                    <button
                      disabled={activeStepIndex === traceabilitySteps.length - 1}
                      onClick={() => setActiveStepIndex((prev) => Math.min(traceabilitySteps.length - 1, prev + 1))}
                      className="px-5 py-2 rounded-full bg-leaf-600 text-forest-950 text-xs font-bold disabled:opacity-40 hover:bg-leaf-500"
                    >
                      Next Stage →
                    </button>
                  </div>

                </div>

              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
