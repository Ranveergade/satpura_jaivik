"use client";

import React from "react";
import { Sprout, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-950 border-t border-forest-800 text-cream-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-leaf-500 to-forest-700 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5 text-cream-100" />
              </div>
              <span className="font-serif font-bold text-xl tracking-wider text-cream-100">
                SATPURA JAIVIK
              </span>
            </div>

            <p className="text-sm text-cream-300 leading-relaxed max-w-sm">
              “From Satpura’s Soil to Every Home.” Connecting organic farmers, sustainable agriculture, and conscious households through a 100% transparent ecosystem.
            </p>

            <div className="space-y-2 pt-2 text-xs text-cream-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-leaf-400" />
                <span>Satpura Agrarian Belt, Hoshangabad & Betul, MP, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-leaf-400" />
                <span>contact@satpurajaivik.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-leaf-400" />
                <span>+91 755 2400 890</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-leaf-400">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-cream-100 transition-colors">Home Overview</a></li>
              <li><a href="#why-satpura" className="hover:text-cream-100 transition-colors">Our Purpose</a></li>
              <li><a href="#ecosystem" className="hover:text-cream-100 transition-colors">Supply Chain Loop</a></li>
              <li><a href="#farmers" className="hover:text-cream-100 transition-colors">Farmer Empowerment</a></li>
              <li><a href="#products" className="hover:text-cream-100 transition-colors">Organic Produce</a></li>
            </ul>
          </div>

          {/* Impact & Tech */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-leaf-400">
              Trust & Tech
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#traceability" className="hover:text-cream-100 transition-colors">Batch Traceability</a></li>
              <li><a href="#sustainability" className="hover:text-cream-100 transition-colors">Soil Carbon Protocol</a></li>
              <li><a href="#impact" className="hover:text-cream-100 transition-colors">Impact Dashboard</a></li>
              <li><a href="#cta" className="hover:text-cream-100 transition-colors">Partner Cooperatives</a></li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-leaf-400">
              Certifications
            </h4>
            <div className="space-y-2 text-xs text-cream-300">
              <p>• NPOP Organic Certified</p>
              <p>• FSSAI Accredited Batching</p>
              <p>• PGS-India Participatory Guarantee</p>
              <p>• 100% Non-GMO Verified</p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>© {currentYear} SATPURA JAIVIK. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Cultivated with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> in the Satpura Mountain Range
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-cream-100 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-cream-100 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
