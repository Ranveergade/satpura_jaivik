"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-leaf-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-98 cursor-pointer";
    
    const variants = {
      primary: "bg-gradient-to-r from-forest-600 via-leaf-600 to-forest-700 text-white shadow-lg shadow-forest-900/40 hover:shadow-leaf-600/30 hover:brightness-110 border border-leaf-500/30",
      secondary: "bg-cream-100 text-forest-950 hover:bg-cream-200 shadow-md hover:shadow-cream-100/20 border border-cream-200",
      outline: "border border-forest-500/40 text-cream-100 hover:border-leaf-400 hover:bg-forest-900/50 backdrop-blur-sm",
      ghost: "text-cream-200 hover:text-white hover:bg-forest-900/40",
      gold: "bg-gradient-to-r from-cream-400 via-cream-300 to-cream-500 text-forest-950 font-semibold shadow-lg hover:brightness-105 border border-cream-200/50"
    };

    const sizes = {
      sm: "px-4 py-2 text-xs font-semibold gap-1.5",
      md: "px-6 py-3 text-sm font-semibold gap-2",
      lg: "px-8 py-4 text-base font-bold gap-2.5"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
