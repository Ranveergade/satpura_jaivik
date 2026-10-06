"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productsData, Product } from "@/data/products";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Modal } from "./ui/Modal";
import { ShieldCheck, MapPin, Star, Eye, Calendar, Sparkles, CheckCircle2 } from "lucide-react";

export function ProductShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const categories = ["All", "Grains", "Pulses", "Spices", "Millets", "Natural"];

  const filteredProducts = selectedCategory === "All"
    ? productsData
    : productsData.filter((p) => p.category === selectedCategory);

  return (
    <section id="products" className="py-24 relative bg-forest-950 border-t border-forest-900 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-leaf-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <Badge variant="leaf" className="mx-auto">
            100% Certified Produce
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-cream-100">
            Organic Harvest <span className="italic text-leaf-300">Showcase</span>
          </h2>
          <p className="text-cream-300 text-base sm:text-lg">
            Directly from Satpura’s bio-dynamic soil to your table. Grown naturally, stone-milled cleanly, and fully traceable.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center overflow-x-auto no-scrollbar gap-2 mb-12 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-leaf-500 text-forest-950 shadow-lg shadow-leaf-500/30 scale-105"
                  : "bg-forest-900/60 text-cream-300 hover:text-white border border-forest-800 hover:border-forest-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="h-full flex flex-col justify-between p-5 bg-forest-900/50 border border-forest-800 hover:border-leaf-500/40 group">
                  <div>
                    {/* Product Image Frame */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <Badge variant="leaf" className="text-[10px] bg-forest-950/80 backdrop-blur-md">
                          {product.category}
                        </Badge>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-amber-400/20">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      {/* Bottom Origin Overlay */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-cream-200 bg-forest-950/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-leaf-400" />
                        <span className="truncate max-w-[200px]">{product.origin}</span>
                      </div>
                    </div>

                    {/* Product Title & Info */}
                    <h3 className="text-xl font-serif font-bold text-cream-100 group-hover:text-leaf-300 transition-colors mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-leaf-400 font-medium mb-3">
                      Collective: {product.farmerGroup}
                    </p>
                    <p className="text-xs text-cream-300 line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Bottom Price & Details CTA */}
                  <div className="pt-4 border-t border-forest-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold font-serif text-cream-100">{product.price}</span>
                      <span className="text-xs text-cream-400 ml-1">/ {product.unit}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveModalProduct(product)}
                      className="gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Product Detail Modal */}
        <Modal
          isOpen={!!activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
          title={activeModalProduct?.name}
        >
          {activeModalProduct && (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-forest-700">
                <img
                  src={activeModalProduct.image}
                  alt={activeModalProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-forest-950/80 backdrop-blur-md text-xs text-leaf-300 border border-leaf-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Certified Organic</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif font-bold text-cream-100">
                    {activeModalProduct.price} <span className="text-sm font-normal text-cream-400">/ {activeModalProduct.unit}</span>
                  </span>
                  <div className="flex items-center gap-1 text-xs text-cream-300">
                    <Calendar className="w-4 h-4 text-leaf-400" />
                    <span>Harvested: {activeModalProduct.harvestDate}</span>
                  </div>
                </div>

                <p className="text-sm text-cream-200 leading-relaxed">
                  {activeModalProduct.description}
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-leaf-400 mb-2">
                    Nutritional & Ecological Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {activeModalProduct.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-cream-300">
                        <CheckCircle2 className="w-4 h-4 text-leaf-400 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-forest-800 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setActiveModalProduct(null);
                    const cta = document.getElementById("cta");
                    cta?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Request Bulk Order
                </Button>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </section>
  );
}
