"use client";

import React, { useState, useEffect } from "react";
import { Droplets, Thermometer, Wind, Zap, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Language, translations } from "@/lib/i18n";

interface IoTDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function IoTDashboardModal({ isOpen, onClose, lang }: IoTDashboardModalProps) {
  const t = translations[lang];
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [readings, setReadings] = useState({
    soilMoisture: 42.8,
    pH: 6.8,
    ec: 1.24,
    temperature: 28.4,
    humidity: 62.1,
  });

  // Simulate live sensor fluctuation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setReadings(prev => ({
        soilMoisture: +(prev.soilMoisture + (Math.random() - 0.5) * 2).toFixed(1),
        pH: +(prev.pH + (Math.random() - 0.5) * 0.1).toFixed(2),
        ec: +(prev.ec + (Math.random() - 0.5) * 0.05).toFixed(2),
        temperature: +(prev.temperature + (Math.random() - 0.5) * 0.5).toFixed(1),
        humidity: +(prev.humidity + (Math.random() - 0.5) * 1).toFixed(1),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const sensors = [
    {
      label: lang === "hi" ? "मृदा नमी" : "Soil Moisture",
      value: readings.soilMoisture,
      unit: "%",
      icon: <Droplets className="w-5 h-5 text-teal-400" />,
      color: "teal",
      min: 0, max: 100,
      status: readings.soilMoisture > 35 ? "Optimal" : "Needs Irrigation",
      statusColor: readings.soilMoisture > 35 ? "text-leaf-400" : "text-amber-400",
    },
    {
      label: lang === "hi" ? "मृदा pH" : "Soil pH",
      value: readings.pH,
      unit: "pH",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      color: "amber",
      min: 4, max: 9,
      status: readings.pH >= 6.5 && readings.pH <= 7.5 ? "Optimal for Crops" : "Needs Amendment",
      statusColor: "text-leaf-400",
    },
    {
      label: lang === "hi" ? "EC मान" : "Electrical Conductivity (EC)",
      value: readings.ec,
      unit: "mS/cm",
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      color: "blue",
      min: 0, max: 3,
      status: "Normal",
      statusColor: "text-leaf-400",
    },
    {
      label: lang === "hi" ? "तापमान" : "Air Temperature",
      value: readings.temperature,
      unit: "°C",
      icon: <Thermometer className="w-5 h-5 text-red-400" />,
      color: "red",
      min: 10, max: 45,
      status: "Growing Season Range",
      statusColor: "text-leaf-400",
    },
    {
      label: lang === "hi" ? "आर्द्रता" : "Humidity",
      value: readings.humidity,
      unit: "%",
      icon: <Wind className="w-5 h-5 text-purple-400" />,
      color: "purple",
      min: 0, max: 100,
      status: "Normal",
      statusColor: "text-leaf-400",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.btnIotSensors}>
      <div className="space-y-5">
        {/* Live Sensor Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sensors.map((s) => {
            const pct = Math.min(100, Math.max(0, ((s.value - s.min) / (s.max - s.min)) * 100));
            return (
              <div key={s.label} className="p-4 rounded-2xl bg-forest-950 border border-forest-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {s.icon}
                    <span className="text-xs font-bold text-cream-200">{s.label}</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${s.statusColor}`}>{s.status}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-serif font-bold text-cream-100">{s.value}</span>
                  <span className="text-xs text-cream-400">{s.unit}</span>
                  <span className="ml-auto text-[10px] font-mono text-leaf-400 animate-pulse">● LIVE</span>
                </div>
                <div className="w-full h-2 bg-forest-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-leaf-600 to-leaf-300 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Irrigation Controller */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 border border-leaf-500/30 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-cream-100">
              {lang === "hi" ? "ड्रिप सिंचाई नियंत्रक" : "Drip Irrigation Controller"}
            </p>
            <p className="text-xs text-cream-400">Satpura Krishi Automation System v2.1</p>
            <p className={`text-xs font-bold mt-1 ${irrigationOn ? "text-leaf-400" : "text-cream-400"}`}>
              {irrigationOn ? (lang === "hi" ? "✓ सिंचाई चालू — खेत में जल प्रवाह जारी" : "✓ ACTIVE — Water flow confirmed at field valves") : (lang === "hi" ? "⏸ सिंचाई बंद है" : "⏸ STANDBY — No active water flow")}
            </p>
          </div>
          <button
            onClick={() => setIrrigationOn(!irrigationOn)}
            className={`p-2 rounded-xl transition-all ${irrigationOn ? "bg-leaf-500/20 text-leaf-300 border border-leaf-500/40" : "bg-forest-900 text-cream-400 border border-forest-700"}`}
          >
            {irrigationOn ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
          </button>
        </div>
      </div>
    </Modal>
  );
}
