"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { Droplets, Trees, Sprout, Sun, RefreshCw, HeartHandshake } from "lucide-react";

export function Sustainability() {
  const pillars = [
    {
      title: "Soil Carbon Regeneration",
      icon: <Sprout className="w-5 h-5 text-leaf-400" />,
      description: "Restoring natural humus and microbial earthworm ecology to store atmospheric carbon back into living soil."
    },
    {
      title: "Agricultural Water Conservation",
      icon: <Droplets className="w-5 h-5 text-teal-400" />,
      description: "Smart drip networks and rainfed millet cropping reducing agricultural water draw by over 35%."
    },
    {
      title: "Forest Boundary Biodiversity",
      icon: <Trees className="w-5 h-5 text-emerald-400" />,
      description: "Buffer zone farming surrounding Satpura Tiger Reserve protecting wild pollinators and native plant species."
    },
    {
      title: "Solar Micro-Milling Infrastructure",
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      description: "Clean village processing powered by 100% renewable off-grid solar micro-grids."
    },
    {
      title: "Zero Synthetic Chemicals",
      icon: <RefreshCw className="w-5 h-5 text-leaf-300" />,
      description: "100% replacement of chemical fertilizers with bio-dynamic vermicompost and indigenous bio-inputs."
    },
    {
      title: "Community Equity & Prosperity",
      icon: <HeartHandshake className="w-5 h-5 text-cream-300" />,
      description: "42% female-led rural processing hubs guaranteeing equitable financial distribution across Satpura villages."
    }
  ];

  return (
    <section id="sustainability" className="py-24 relative overflow-hidden bg-forest-950">
      {/* Background Hero Banner Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600"
          alt="Satpura Landscape Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/90 to-forest-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="leaf" className="mx-auto">
            Ecological Responsibility
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100 leading-tight">
            Better farming is not just about what we grow. <br />
            <span className="italic text-leaf-300">It is about what we leave behind.</span>
          </h2>
          <p className="text-cream-300 text-base sm:text-lg">
            Our climate-positive agricultural framework repairs fragile ecosystems while cultivating clean, nutrient-dense organic produce.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 border border-forest-800 bg-forest-900/60 hover:border-leaf-500/40">
                <div className="p-3 rounded-2xl bg-forest-950 border border-forest-700/60 inline-block mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold font-serif text-cream-100 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-cream-300 leading-relaxed">
                  {pillar.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
