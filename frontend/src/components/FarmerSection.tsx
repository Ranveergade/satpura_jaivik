"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { ShieldCheck, ArrowRight, Heart, Award, Sparkles, Check } from "lucide-react";

export function FarmerSection() {
  const floatingCards = [
    { title: "Organic Certified", icon: <Award className="w-4 h-4 text-leaf-400" />, desc: "Zero Synthetic Chemicals", delay: 0 },
    { title: "Direct Market Access", icon: <ArrowRight className="w-4 h-4 text-leaf-400" />, desc: "Eliminated Middlemen", delay: 1 },
    { title: "Fairer Value Floor", icon: <Heart className="w-4 h-4 text-leaf-400" />, desc: "+35% Guaranteed Premium", delay: 2 },
    { title: "Traceable Produce", icon: <ShieldCheck className="w-4 h-4 text-leaf-400" />, desc: "Lab Residue Audit", delay: 3 },
  ];

  return (
    <section id="farmers" className="py-24 relative bg-forest-950 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-leaf-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Image with Layered Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image frame */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-leaf-500/30 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000"
                  alt="Satpura Organic Farmer Spotlight"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass-panel border border-white/10">
                  <Badge variant="leaf" className="mb-2">
                    Farmer Partner Spotlight
                  </Badge>
                  <h4 className="text-xl font-serif font-bold text-cream-100">
                    Sunita Gond
                  </h4>
                  <p className="text-xs text-cream-300">
                    Tribal Herbal & Spices Lead, Betul Forest Ridge
                  </p>
                </div>
              </div>

              {/* Layered Floating Badge 1 - Top Right */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="hidden sm:flex absolute -top-4 -right-4 glass-panel p-4 rounded-2xl border border-leaf-400/40 shadow-xl items-center gap-3 z-20"
              >
                <div className="p-2.5 rounded-xl bg-leaf-500/20 text-leaf-300">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-cream-100">Organic Certified</p>
                  <p className="text-[10px] text-cream-300">Lab Residue Tested</p>
                </div>
              </motion.div>

              {/* Layered Floating Badge 2 - Mid Left */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="hidden sm:flex absolute top-1/2 -left-6 -translate-y-1/2 glass-panel p-4 rounded-2xl border border-white/10 shadow-xl items-center gap-3 z-20"
              >
                <div className="p-2.5 rounded-xl bg-soil-500/20 text-soil-300">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-cream-100">Direct Market Access</p>
                  <p className="text-[10px] text-cream-300">Fair Floor Value</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Right Column Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-6"
          >
            <Badge variant="cream">
              Rural Empowerment
            </Badge>

            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100 leading-tight">
              Empowering the people <br />
              <span className="italic text-leaf-300">who grow what we eat.</span>
            </h2>

            <p className="text-cream-300 text-base sm:text-lg leading-relaxed">
              Real sustainability starts at the grassroots. Satpura Jaivik provides organic farmers with bio-inputs, agronomist support, digital soil mapping, and direct market access—eliminating middlemen and securing dignified livelihoods.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-800">
                <div className="flex items-center gap-2 font-bold text-cream-100 text-sm mb-1">
                  <Check className="w-4 h-4 text-leaf-400" />
                  Sustainable Farming Training
                </div>
                <p className="text-xs text-cream-400">
                  Hands-on workshops on vermicomposting & Jeevamrut preparation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-800">
                <div className="flex items-center gap-2 font-bold text-cream-100 text-sm mb-1">
                  <Check className="w-4 h-4 text-leaf-400" />
                  Transparent Pricing
                </div>
                <p className="text-xs text-cream-400">
                  Guaranteed minimum floor price with prompt digital payouts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-800">
                <div className="flex items-center gap-2 font-bold text-cream-100 text-sm mb-1">
                  <Check className="w-4 h-4 text-leaf-400" />
                  Agritech Soil Sensors
                </div>
                <p className="text-xs text-cream-400">
                  IoT moisture guidance to optimize crop watering cycles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-800">
                <div className="flex items-center gap-2 font-bold text-cream-100 text-sm mb-1">
                  <Check className="w-4 h-4 text-leaf-400" />
                  Community Seed Banks
                </div>
                <p className="text-xs text-cream-400">
                  Preserving indigenous heirloom seeds for future generations.
                </p>
              </div>
            </div>

            {/* Floating Pills Showcase */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {floatingCards.map((card, i) => (
                <div key={i} className="p-3 rounded-2xl bg-forest-900/40 border border-forest-800 text-center">
                  <div className="flex justify-center mb-1">{card.icon}</div>
                  <p className="text-[11px] font-bold text-cream-100">{card.title}</p>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
