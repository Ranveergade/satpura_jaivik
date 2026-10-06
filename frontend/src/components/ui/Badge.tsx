"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "leaf" | "cream" | "soil" | "outline";
  children: React.ReactNode;
}

export function Badge({ className, variant = "leaf", children, ...props }: BadgeProps) {
  const variants = {
    leaf: "bg-leaf-950/80 text-leaf-300 border border-leaf-600/40 shadow-sm",
    cream: "bg-cream-950/80 text-cream-200 border border-cream-500/30 shadow-sm",
    soil: "bg-soil-950/80 text-soil-200 border border-soil-600/40 shadow-sm",
    outline: "bg-forest-900/40 text-cream-100 border border-white/10"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
