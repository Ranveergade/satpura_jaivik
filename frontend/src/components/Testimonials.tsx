"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonialsData, Testimonial } from "@/data/testimonials";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { Quote, Star, ShieldCheck } from "lucide-react";

export function Testimonials() {
  const [filter, setFilter] = useState<"all" | "consumer" | "farmer" | "expert">("all");

  const filtered = filter === "all"
    ? testimonialsData
    : testimonialsData.filter((t) => t.type === filter);

  return (
    <section className="py-24 relative bg-forest-950/90 border-t border-forest-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <Badge variant="leaf" className="mx-auto">
            Community Voice
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100">
            Trusted Across <span className="italic text-leaf-300">The Ecosystem</span>
          </h2>
          <p className="text-cream-300 text-base sm:text-lg">
            Hear from conscious consumers, organic farmers, and senior agronomists about their experience with Satpura Jaivik.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {[
            { label: "All Voices", value: "all" },
            { label: "Consumers", value: "consumer" },
            { label: "Farmers", value: "farmer" },
            { label: "Agri Experts", value: "expert" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === tab.value
                  ? "bg-leaf-500 text-forest-950 shadow-md scale-105"
                  : "bg-forest-900/60 text-cream-300 hover:text-white border border-forest-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col justify-between p-8 border border-forest-800 bg-forest-900/50 hover:border-leaf-500/30">
                  <div>
                    {/* Top Stars & Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <Badge variant="cream" className="text-[10px]">
                        {item.type}
                      </Badge>
                    </div>

                    <p className="text-sm text-cream-200 leading-relaxed italic mb-6">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Author Profile */}
                  <div className="pt-6 border-t border-forest-800/80 flex items-center gap-4">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-leaf-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-cream-100">{item.author}</h4>
                        {item.verified && (
                          <ShieldCheck className="w-4 h-4 text-leaf-400" />
                        )}
                      </div>
                      <p className="text-xs text-cream-400">{item.role}</p>
                      <p className="text-[10px] text-leaf-400">{item.location}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
