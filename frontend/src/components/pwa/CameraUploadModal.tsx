"use client";

import React, { useState } from "react";
import { Camera, MapPin, Clock, Upload, CheckCircle2, X } from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface CameraUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onUploadSuccess?: (data: any) => void;
}

export function CameraUploadModal({ isOpen, onClose, lang, onUploadSuccess }: CameraUploadModalProps) {
  const t = translations[lang];
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("LABOUR");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const sampleBills = [
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
  ];

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setCapturedImage(sampleBills[Math.floor(Math.random() * sampleBills.length)]);
      setIsCapturing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUploadSuccess?.({
      title: title || "Agri Bio-Input Bill",
      category,
      amount: amount || "4500",
      vendor: vendor || "Satpura Kisan Bio Center",
      bill_image_url: capturedImage || sampleBills[0],
      gps_lat: 22.7512,
      gps_lng: 77.7245,
      timestamp: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.uploadBillTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Camera capture Simulator */}
        <div className="relative aspect-video rounded-2xl bg-forest-950 border-2 border-dashed border-leaf-500/40 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img src={capturedImage} alt="Captured Bill" className="w-full h-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-forest-950/80 text-cream-100 hover:bg-forest-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : isCapturing ? (
            <div className="flex flex-col items-center gap-2 text-leaf-400">
              <div className="w-8 h-8 rounded-full border-2 border-leaf-400 border-t-transparent animate-spin" />
              <span className="text-xs font-bold font-mono">Opening Camera & EXIF GPS Tagging...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-full bg-leaf-500/20 text-leaf-300 inline-block">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-xs text-cream-300">
                Tap button to simulate instant camera capture with automatic GPS location tagging.
              </p>
              <Button type="button" variant="primary" size="sm" onClick={handleCapture}>
                <Camera className="w-4 h-4 mr-1" />
                {t.captureFromCamera}
              </Button>
            </div>
          )}
        </div>

        {/* Auto metadata tags */}
        <div className="p-3 rounded-xl bg-forest-950 border border-forest-800 space-y-1 text-[11px] font-mono text-cream-300">
          <div className="flex items-center gap-1.5 text-leaf-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.autoGpsTagging}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cream-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.autoTimestampTagging}</span>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-cream-300 font-bold block mb-1">Bill Title / Item</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Drip Irrigation Pipes"
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-forest-800 text-cream-100 text-xs focus:outline-none focus:border-leaf-500"
            />
          </div>

          <div>
            <label className="text-xs text-cream-300 font-bold block mb-1">{t.selectCategory}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-forest-800 text-cream-100 text-xs focus:outline-none focus:border-leaf-500"
            >
              <option value="LABOUR">{t.catLabour}</option>
              <option value="SEEDS">{t.catSeeds}</option>
              <option value="FERTILIZER">{t.catFertilizer}</option>
              <option value="IRRIGATION">{t.catIrrigation}</option>
              <option value="MACHINERY">{t.catMachinery}</option>
              <option value="TRANSPORT">{t.catTransport}</option>
              <option value="CONSTRUCTION">{t.catConstruction}</option>
              <option value="MISC">{t.catMisc}</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-cream-300 font-bold block mb-1">{t.enterAmount}</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="4500"
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-forest-800 text-cream-100 text-xs focus:outline-none focus:border-leaf-500"
            />
          </div>

          <div>
            <label className="text-xs text-cream-300 font-bold block mb-1">{t.vendorName}</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. Satpura Kisan Center (GST: 23AAAAA...)"
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-forest-800 text-cream-100 text-xs focus:outline-none focus:border-leaf-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Submit Expense
          </Button>
        </div>

      </form>
    </Modal>
  );
}
