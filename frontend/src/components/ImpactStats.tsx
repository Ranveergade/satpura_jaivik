"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { impactStats } from "@/data/stats";
import { Users, Sprout, MapPin, ShieldCheck } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5 text-leaf-400" />,
  Sprout: <Sprout className="w-5 h-5 text-leaf-400" />,
  MapPin: <MapPin className="w-5 h-5 text-leaf-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-leaf-400" />,
};

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const steps = 50;
      const increment = value / steps;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-cream-100">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function ImpactStats() {
  return (
    <section className="relative z-20 py-10 bg-forest-900/80 border-y border-forest-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {impactStats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-forest-950/40 border border-forest-800/60 hover:border-leaf-500/30 transition-all group"
            >
              <div className="mb-3 p-3 rounded-xl bg-forest-900 border border-forest-700/50 group-hover:scale-110 transition-transform">
                {iconMap[stat.iconName] || <Sprout className="w-5 h-5 text-leaf-400" />}
              </div>
              
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              
              <h3 className="mt-2 text-sm font-semibold text-cream-200">
                {stat.label}
              </h3>
              <p className="mt-1 text-xs text-cream-400">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
