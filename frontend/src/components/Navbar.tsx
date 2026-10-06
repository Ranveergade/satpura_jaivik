"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#why-satpura" },
    { name: "Ecosystem", href: "#ecosystem" },
    { name: "Farmers", href: "#farmers" },
    { name: "Products", href: "#products" },
    { name: "Sustainability", href: "#sustainability" },
    { name: "Impact", href: "#impact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-forest-950/80 backdrop-blur-xl border-b border-forest-800/80 py-3 shadow-2xl shadow-black/40"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-leaf-500 to-forest-700 flex items-center justify-center text-white shadow-lg shadow-leaf-600/30 group-hover:scale-105 transition-transform duration-300">
            <Sprout className="w-5 h-5 text-cream-100" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg tracking-wider text-cream-100 group-hover:text-leaf-300 transition-colors">
              SATPURA JAIVIK
            </span>
            <span className="text-[10px] text-cream-400 font-mono uppercase tracking-widest -mt-1">
              Organic Agriculture
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-forest-900/40 p-1.5 rounded-full border border-forest-800/60 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-xs font-semibold text-cream-300 hover:text-white hover:bg-forest-800/60 rounded-full transition-all duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/dashboard"
            className="px-4 py-2 rounded-full text-xs font-bold bg-leaf-500 hover:bg-leaf-400 text-forest-950 transition-all duration-300 shadow-md flex items-center gap-1.5"
          >
            Launch PWA Portal
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-cream-200 hover:text-white bg-forest-900/60 border border-forest-800"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-forest-950/95 border-b border-forest-800 backdrop-blur-2xl px-6 py-6 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-base font-medium text-cream-200 hover:text-leaf-400 border-b border-forest-900/50"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const cta = document.getElementById("cta");
                    cta?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Join the Ecosystem
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
