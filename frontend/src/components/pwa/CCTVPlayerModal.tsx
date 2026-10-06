"use client";

import React, { useState, useEffect } from "react";
import { Cctv, X, RefreshCw, Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Language, translations } from "@/lib/i18n";

interface CCTVPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const cameras = [
  {
    id: "cam1",
    name: "Camera 01 - North Gateway",
    vendor: "Hikvision AgriSurv 4K",
    status: "ONLINE",
    img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "cam2",
    name: "Camera 02 - South Plot Boundary",
    vendor: "CP PLUS FarmEye",
    status: "ONLINE",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "cam3",
    name: "Camera 03 - Storage Unit (Offline)",
    vendor: "Dahua ProFarm",
    status: "OFFLINE",
    img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1200",
  },
];

export function CCTVPlayerModal({ isOpen, onClose, lang }: CCTVPlayerModalProps) {
  const t = translations[lang];
  const [activeCamera, setActiveCamera] = useState(cameras[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCamera = (cam: typeof cameras[0]) => {
    if (cam.status === "OFFLINE") return;
    setIsLoading(true);
    setTimeout(() => { setActiveCamera(cam); setIsLoading(false); }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.btnLiveCctv}>
      <div className="space-y-4">
        {/* Live Feed */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-forest-950 border border-leaf-500/30">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-leaf-400 border-t-transparent animate-spin" />
            </div>
          ) : (
            <img src={activeCamera.img} alt="CCTV Feed" className="w-full h-full object-cover" />
          )}
          {/* Live badge overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 backdrop-blur-md text-white text-xs font-bold border border-red-400/40 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <Cctv className="w-3.5 h-3.5" /> LIVE
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-forest-950/80 backdrop-blur-md border border-white/10 text-xs text-cream-200">
            <span className="font-bold">{activeCamera.name}</span>
            <span className="text-cream-400 font-mono">{activeCamera.vendor}</span>
          </div>
        </div>

        {/* Camera Selector */}
        <div>
          <p className="text-xs font-mono font-bold text-leaf-400 uppercase tracking-wider mb-2">Select Camera Feed</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => handleSelectCamera(cam)}
                disabled={cam.status === "OFFLINE"}
                className={`p-3 rounded-xl text-left text-xs transition-all ${
                  activeCamera.id === cam.id
                    ? "bg-leaf-500/20 border-2 border-leaf-400 text-cream-100"
                    : cam.status === "OFFLINE"
                    ? "bg-forest-950/60 border border-forest-800 text-cream-400 opacity-50 cursor-not-allowed"
                    : "bg-forest-900/60 border border-forest-800 text-cream-300 hover:border-leaf-500/40"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${cam.status === "ONLINE" ? "bg-leaf-400" : "bg-red-400"}`} />
                  <span className="font-bold text-[10px]">{cam.status}</span>
                </div>
                <p className="font-semibold">{cam.name}</p>
                <p className="text-cream-400 text-[10px]">{cam.vendor}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
