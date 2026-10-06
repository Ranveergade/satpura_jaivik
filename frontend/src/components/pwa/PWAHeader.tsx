"use client";

import React from "react";
import { Wifi, MapPin, RefreshCw, ShieldCheck } from "lucide-react";
import { Language, translations } from "@/lib/i18n";

interface PWAHeaderProps {
  lang: Language;
}

export function PWAHeader({ lang }: PWAHeaderProps) {
  const t = translations[lang];

  return (
    <div className="bg-forest-900/60 border-b border-forest-800/80 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Status indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-leaf-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-leaf-400 animate-ping" />
            <Wifi className="w-3.5 h-3.5" />
            <span>{t.onlineStatus}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-cream-300 font-mono">
            <MapPin className="w-3.5 h-3.5 text-leaf-400" />
            <span>{t.gpsActive}</span>
          </div>
        </div>

        {/* Security & Audit badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-cream-400 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-leaf-400" />
            <span>Immutable Audit Trail Active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
