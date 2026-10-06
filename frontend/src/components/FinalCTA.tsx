"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Sprout, ArrowRight, CheckCircle2 } from "lucide-react";

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
      }, 4000);
    }
  };

  return (
    <section id="cta" className="py-24 relative overflow-hidden bg-forest-950">
      {/* Background Imagery with Deep Green Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600"
          alt="Satpura Landscape"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/85 to-forest-950" />
      </div>

      {/* Dynamic Animated Particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-leaf-500/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center">
          <Badge variant="leaf" className="px-4 py-1.5 text-xs font-semibold">
            <Sprout className="w-4 h-4 text-leaf-300" />
            Join the Agrarian Revolution
          </Badge>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold font-serif text-cream-100 leading-tight">
          Let’s grow a <br className="hidden sm:inline" />
          <span className="italic text-leaf-300">healthier future.</span>
        </h2>

        <p className="text-cream-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Be part of an ecosystem where farmers, communities, and consumers grow together through transparent, organic, and regenerative agriculture.
        </p>

        {/* Quick Newsletter Signup Form */}
        <div className="max-w-md mx-auto pt-4">
          {submitted ? (
            <div className="p-4 rounded-full bg-leaf-950 border border-leaf-500/50 text-leaf-300 text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-leaf-400" />
              <span>Thank you! Welcome to the Satpura Jaivik ecosystem.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 bg-forest-900/80 p-2 rounded-full border border-forest-700/80 backdrop-blur-xl">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3 rounded-full bg-transparent text-cream-100 placeholder:text-cream-400 text-sm focus:outline-none"
              />
              <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto shrink-0">
                Join Ecosystem
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>

        {/* Secondary CTAs */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-cream-300">
          <a href="#farmers" className="hover:text-leaf-300 transition-colors">
            For Farmers & Cooperatives →
          </a>
          <span className="text-forest-700">•</span>
          <a href="#products" className="hover:text-leaf-300 transition-colors">
            For Retail & Bulk Buyers →
          </a>
          <span className="text-forest-700">•</span>
          <a href="#sustainability" className="hover:text-leaf-300 transition-colors">
            Our Climate Protocol →
          </a>
        </div>

      </div>
    </section>
  );
}
