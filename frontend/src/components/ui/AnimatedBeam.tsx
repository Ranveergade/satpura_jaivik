"use client";

import React from "react";
import { motion } from "framer-motion";

export interface AnimatedBeamProps {
  className?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedBeam({ className = "", duration = 4, delay = 0 }: AnimatedBeamProps) {
  return (
    <div className={`relative w-full h-1 bg-forest-800/50 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "easeInOut",
          delay,
        }}
        className="h-full w-1/3 bg-gradient-to-r from-transparent via-leaf-400 to-transparent shadow-[0_0_12px_#52B788]"
      />
    </div>
  );
}
