"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ecosystemNodes, EcosystemNode } from "@/data/ecosystem";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { AnimatedBeam } from "./ui/AnimatedBeam";
import { Sprout, Cpu, Factory, Truck, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";

const iconComponents: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Factory: <Factory className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6" />,
};

export function Ecosystem() {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode>(ecosystemNodes[0]);

  return (
    <section id="ecosystem" className="py-24 relative bg-forest-950/90 border-t border-forest-900 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-leaf-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cream-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="leaf" className="mx-auto">
            Connected Value Chain
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100">
            The Satpura Jaivik <span className="italic text-leaf-300">Ecosystem</span>
          </h2>
          <p className="text-cream-300 text-base sm:text-lg">
            An end-to-end transparent loop uniting organic growers, technological quality assurance, solar micro-milling, cold logistics, and conscious households.
          </p>
        </div>

        {/* Desktop Node Stepper Navigation */}
        <div className="hidden lg:block mb-12 relative">
          {/* Connecting Beam */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 z-0">
            <AnimatedBeam duration={5} />
          </div>

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {ecosystemNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-300 text-center cursor-pointer ${
                    isSelected
                      ? "bg-forest-900 border-2 border-leaf-400 shadow-xl shadow-leaf-950/60 scale-105"
                      : "bg-forest-950/80 border border-forest-800 hover:border-forest-700 hover:bg-forest-900/40 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected
                        ? "bg-leaf-500 text-forest-950 shadow-md shadow-leaf-500/30"
                        : "bg-forest-800 text-leaf-300"
                    }`}
                  >
                    {iconComponents[node.icon]}
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-leaf-400 mb-1">
                    Stage {node.stepNumber}
                  </span>
                  <h4 className="text-xs font-bold text-cream-100 uppercase tracking-wider">
                    {node.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Node Selection Pills */}
        <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-3 mb-8 pb-2">
          {ecosystemNodes.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`flex-none px-5 py-3 rounded-2xl border text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  isSelected
                    ? "bg-leaf-500 text-forest-950 border-leaf-400 shadow-lg"
                    : "bg-forest-900/60 text-cream-200 border-forest-800"
                }`}
              >
                <span>{node.stepNumber}.</span>
                <span>{node.title}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Node Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-8 lg:p-12 border-2 border-leaf-500/30 bg-gradient-to-br from-forest-900/90 via-forest-950 to-forest-900/80 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left info */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-leaf-500/20 text-leaf-300 font-mono text-xs font-bold border border-leaf-500/40">
                      STEP {selectedNode.stepNumber} / 05
                    </span>
                    <span className="text-xs text-cream-400 uppercase tracking-widest font-mono">
                      {selectedNode.subtitle}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-serif font-bold text-cream-100">
                    {selectedNode.title}
                  </h3>

                  <p className="text-base sm:text-lg text-cream-300 leading-relaxed">
                    {selectedNode.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-leaf-400">
                      Key Ecosystem Pillar Standards:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedNode.keyFeatures.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-cream-200">
                          <CheckCircle2 className="w-4 h-4 text-leaf-400 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Visual Graphic */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-forest-950/80 border border-forest-800 p-8 flex flex-col items-center justify-center text-center shadow-inner group">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-leaf-500 to-forest-700 flex items-center justify-center text-white shadow-xl shadow-leaf-600/30 mb-6 group-hover:scale-110 transition-transform">
                      {iconComponents[selectedNode.icon]}
                    </div>

                    <h4 className="text-lg font-bold text-cream-100 mb-2">
                      {selectedNode.title}
                    </h4>
                    <p className="text-xs text-cream-400 mb-6">
                      Integrated into Satpura Jaivik Ledger
                    </p>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-leaf-300 bg-leaf-950/80 px-4 py-2 rounded-full border border-leaf-700/50">
                      <span>Interactive Stage</span>
                      <ArrowRight className="w-3.5 h-3.5 text-leaf-400" />
                    </div>
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
