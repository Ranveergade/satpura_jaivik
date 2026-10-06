export interface Product {
  id: string;
  name: string;
  category: "Grains" | "Pulses" | "Spices" | "Millets" | "Natural";
  origin: string;
  certifiedOrganic: boolean;
  farmerGroup: string;
  description: string;
  price: string;
  unit: string;
  rating: number;
  image: string;
  benefits: string[];
  harvestDate: string;
}

export const productsData: Product[] = [
  {
    id: "p1",
    name: "Heirloom Champa Rice",
    category: "Grains",
    origin: "Hoshangabad Valley, Satpura Range",
    certifiedOrganic: true,
    farmerGroup: "Satpura Narmada Organic Collective",
    description: "Aromatic traditional long-grain rice grown naturally using ancient bio-fertilizers and zero chemical pesticides.",
    price: "₹185",
    unit: "per kg",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    benefits: ["Rich in essential micronutrients", "Glycemic-friendly natural starch", "Grown with rainwater harvesting"],
    harvestDate: "August 2026"
  },
  {
    id: "p2",
    name: "Wild Turmeric (Kasturi Haldi)",
    category: "Spices",
    origin: "Betul Forest Ridge, MP",
    certifiedOrganic: true,
    farmerGroup: "Korku Tribal Farming Union",
    description: "High-curcumin wild turmeric stone-ground in micro-batches to preserve natural therapeutic oils.",
    price: "₹240",
    unit: "250g pack",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
    benefits: ["Curcumin content > 6.2%", "Anti-inflammatory & antioxidant powerhouse", "Handpicked by indigenous farmers"],
    harvestDate: "July 2026"
  },
  {
    id: "p3",
    name: "Organic Kodo Millet",
    category: "Millets",
    origin: "Chhindwara Plateau",
    certifiedOrganic: true,
    farmerGroup: "Satpura Millet Growers Association",
    description: "Ancient superfood grain rich in dietary fiber, grown naturally with zero artificial irrigation.",
    price: "₹145",
    unit: "per kg",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    benefits: ["Gluten-free & high fiber", "Low glycemic index for sustained energy", "Drought-resilient climate smart crop"],
    harvestDate: "August 2026"
  },
  {
    id: "p4",
    name: "Sun-Dried Red Tur Dal",
    category: "Pulses",
    origin: "Pipariya Agrarian Belt",
    certifiedOrganic: true,
    farmerGroup: "Narmada Valley Farmers Producer Co.",
    description: "Unpolished, solar-dried split pigeon peas packed with plant protein and clean earthy flavor.",
    price: "₹190",
    unit: "per kg",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    benefits: ["100% Unpolished & unadulterated", "Proteins preserved via low-temp sun drying", "No synthetic shine additives"],
    harvestDate: "September 2026"
  },
  {
    id: "p5",
    name: "Cold-Pressed Mustard Oil",
    category: "Natural",
    origin: "Itarsi Organic Farms",
    certifiedOrganic: true,
    farmerGroup: "Satpura Oilseed Guild",
    description: "Kachi Ghani wood-pressed yellow mustard oil retaining natural pungent aroma and omega-3 fatty acids.",
    price: "₹310",
    unit: "1 Litre bottle",
    rating: 4.95,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800",
    benefits: ["Traditional wood ghani cold pressing", "Zero chemical refining or bleaching", "Heart-friendly balance of MUFA"],
    harvestDate: "August 2026"
  },
  {
    id: "p6",
    name: "Raw Forest Honey",
    category: "Natural",
    origin: "Satpura Tiger Reserve buffer forest",
    certifiedOrganic: true,
    farmerGroup: "Tribal Bee Protection Collective",
    description: "Single-origin raw multifloral forest honey harvested sustainably without harming wild bee colonies.",
    price: "₹450",
    unit: "500g Jar",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
    benefits: ["Unheated & unfiltered natural enzymes", "Sourced from wild floral flora", "Ethical non-destructive harvesting"],
    harvestDate: "September 2026"
  }
];
