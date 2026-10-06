"use client";

import React from "react";
import { motion } from "framer-motion";
import { whySatpuraCards } from "@/data/whySatpura";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Flame, TrendingUp, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-6 h-6 text-amber-400" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-leaf-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-teal-400" />,
  Zap: <Zap className="w-6 h-6 text-yellow-400" />,
};

export function WhySatpura() {
  return (
    <section id="why-satpura" className="py-24 relative overflow-hidden bg-forest-950">
      {/* Soft Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-leaf-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="cream" className="mx-auto">
            Our Purpose & Solution
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100 leading-tight">
            Farming should nourish <br className="hidden sm:inline" />
            <span className="italic text-leaf-300">more than the soil.</span>
          </h2>
          <p className="text-cream-300 text-base sm:text-lg">
            Conventional agriculture is broken by chemical dependency, middlemen exploitation, and consumer mistrust. Satpura Jaivik re-engineers the farm-to-fork equation.
          </p>
        </div>

        {/* Asymmetric Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {whySatpuraCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col justify-between p-8 border border-forest-800 bg-forest-900/40 relative group">
                {/* Background Ambient Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.highlightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div>
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-forest-950 border border-forest-700/60 shadow-inner">
                      {iconMap[card.iconName]}
                    </div>
                    <Badge variant="leaf" className="text-[10px]">
                      {card.impactTag}
                    </Badge>
                  </div>

                  {/* Problem Statement */}
                  <div className="mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400/90 block mb-1">
                      The Challenge
                    </span>
                    <h3 className="text-lg font-bold text-cream-200">
                      {card.problem}
                    </h3>
                  </div>

                  {/* Solution Statement */}
                  <div className="pt-4 border-t border-forest-800/80">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-leaf-300 block mb-1">
                      The Satpura Way
                    </span>
                    <h4 className="text-xl font-serif font-bold text-cream-100 mb-3 group-hover:text-leaf-200 transition-colors">
                      {card.solution}
                    </h4>
                    <p className="text-sm text-cream-300 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Micro CTA link */}
                <div className="mt-8 pt-4 flex items-center gap-1.5 text-xs font-semibold text-leaf-400 group-hover:text-leaf-300 transition-colors">
                  <span>Explore Impact Protocol</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
