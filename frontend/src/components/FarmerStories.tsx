"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { farmersData, FarmerStory } from "@/data/farmers";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { Quote, ChevronLeft, ChevronRight, MapPin, Sprout, Award } from "lucide-react";

export function FarmerStories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentFarmer = farmersData[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % farmersData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + farmersData.length) % farmersData.length);
  };

  return (
    <section className="py-24 relative bg-forest-950 border-t border-forest-900 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-leaf-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="cream">
              Grassroots Testimonies
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100">
              Stories from the <span className="italic text-leaf-300">Satpura Soil</span>
            </h2>
            <p className="text-cream-300 text-base sm:text-lg">
              Meet the smallholder pioneers who transitioned to organic farming and built thriving rural communities.
            </p>
          </div>

          {/* Carousel Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-forest-700 bg-forest-900/60 hover:bg-forest-800 text-cream-200 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-forest-700 bg-forest-900/60 hover:bg-forest-800 text-cream-200 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Next story"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Story Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFarmer.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-8 lg:p-12 border-2 border-leaf-500/30 bg-forest-900/80 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Farmer Image Frame */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-leaf-500/30 shadow-xl group">
                    <img
                      src={currentFarmer.image}
                      alt={currentFarmer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-white/10">
                      <div className="flex items-center gap-2 text-xs text-leaf-300 font-bold mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{currentFarmer.location}</span>
                      </div>
                      <h4 className="text-xl font-serif font-bold text-cream-100">
                        {currentFarmer.name}
                      </h4>
                      <p className="text-xs text-cream-300">
                        {currentFarmer.role} • {currentFarmer.experienceYears} Yrs Experience
                      </p>
                    </div>
                  </div>
                </div>

                {/* Farmer Content Story */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-leaf-500/20 text-leaf-300 inline-block border border-leaf-500/40">
                      <Quote className="w-6 h-6" />
                    </div>
                    <Badge variant="leaf">
                      {currentFarmer.impactMetric}
                    </Badge>
                  </div>

                  <blockquote className="text-xl sm:text-2xl font-serif italic text-cream-100 leading-relaxed">
                    "{currentFarmer.quote}"
                  </blockquote>

                  <p className="text-base text-cream-300 leading-relaxed">
                    {currentFarmer.bio}
                  </p>

                  <div className="pt-4 border-t border-forest-800 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-cream-300">
                      <Sprout className="w-4 h-4 text-leaf-400" />
                      <span>Crop: {currentFarmer.primaryCrop}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cream-300">
                      <Award className="w-4 h-4 text-leaf-400" />
                      <span>Farm Size: {currentFarmer.acreage}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {currentFarmer.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-forest-950 text-cream-200 text-xs font-semibold border border-forest-800"
                      >
                        ✓ {b}
                      </span>
                    ))}
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
