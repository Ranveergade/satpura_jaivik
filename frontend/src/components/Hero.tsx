"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sprout, ShieldCheck, ArrowUpRight, Play, Leaf, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export function Hero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden bg-forest-950">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-leaf-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-soil-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center">
              <Badge variant="leaf" className="py-1.5 px-4 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-leaf-400" />
                Agritech & Organic Ecosystem
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-cream-100 font-serif leading-[1.1]">
              From Satpura’s Soil <br />
              <span className="bg-gradient-to-r from-leaf-300 via-cream-200 to-cream-400 bg-clip-text text-transparent italic font-serif">
                to Every Home.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-cream-300 font-normal leading-relaxed max-w-2xl">
              Satpura Jaivik connects farmers, sustainable agriculture, and conscious consumers through a transparent ecosystem built around healthier soil, healthier food, and healthier communities.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection("products")}
                className="group"
              >
                Explore Satpura Jaivik
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("why-satpura")}
                className="group"
              >
                <Play className="w-4 h-4 fill-current text-leaf-400" />
                Discover Our Mission
              </Button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-8 border-t border-forest-800/80 grid grid-cols-3 gap-4 max-w-lg">
              <div className="flex items-center gap-2 text-xs text-cream-300">
                <div className="p-1.5 rounded-lg bg-leaf-950/60 border border-leaf-700/40 text-leaf-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>100% Lab Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-cream-300">
                <div className="p-1.5 rounded-lg bg-leaf-950/60 border border-leaf-700/40 text-leaf-400">
                  <Sprout className="w-4 h-4" />
                </div>
                <span>Zero Chemical Residue</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-cream-300">
                <div className="p-1.5 rounded-lg bg-leaf-950/60 border border-leaf-700/40 text-leaf-400">
                  <Leaf className="w-4 h-4" />
                </div>
                <span>Direct Farmer Trade</span>
              </div>
            </div>
          </motion.div>

          {/* Right Cinematic Hero Imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-2 bg-gradient-to-b from-leaf-500/20 via-forest-800/40 to-forest-900/60 border border-leaf-500/30 shadow-2xl backdrop-blur-md">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
                {/* Main Hero Background Image */}
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000"
                  alt="Organic Farm in Satpura Region"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent opacity-80" />

                {/* Floating Badge 1 - Top Right */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 glass-panel px-4 py-3 rounded-2xl border border-leaf-400/30 shadow-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-leaf-500/20 flex items-center justify-center text-leaf-300">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-cream-300 font-medium">Satpura Belt</p>
                    <p className="text-xs font-bold text-cream-100">100% Organic Certified</p>
                  </div>
                </motion.div>

                {/* Floating Badge 2 - Bottom Left */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-leaf-300 font-semibold">
                        Traceable Batch #SJ-884
                      </span>
                      <h4 className="text-sm font-bold text-cream-100 font-serif">
                        Hoshangabad Rice Collective
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 bg-leaf-500/30 text-leaf-300 text-xs font-semibold rounded-full border border-leaf-400/40">
                      Verified
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
