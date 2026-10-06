export interface TraceabilityStep {
  id: string;
  stepNumber: string;
  stageName: string;
  location: string;
  details: string;
  metricsLabel: string;
  metricsValue: string;
  iconName: string;
  image: string;
}

export const traceabilitySteps: TraceabilityStep[] = [
  {
    id: "farm-origin",
    stepNumber: "01",
    stageName: "Farm & Soil Preparation",
    location: "Sohagpur Cluster, Hoshangabad",
    details: "Soil enriched with organic vermicompost & jeevamrut. Seed batch #SJ-2026-CH04 registered on Satpura Jaivik ledger.",
    metricsLabel: "Soil Organic Carbon",
    metricsValue: "2.4% (Optimal)",
    iconName: "Trees",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "harvest",
    stepNumber: "02",
    stageName: "Natural Harvest & Sun-Drying",
    location: "Betul Ridge Organic Fields",
    details: "Crops hand-harvested at peak maturity and naturally sun-dried on clean solar floors to retain essential nutrients.",
    metricsLabel: "Moisture Content",
    metricsValue: "11.8% (Preserved)",
    iconName: "Sun",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "processing",
    stepNumber: "03",
    stageName: "Solar Milling & Extraction",
    location: "Pipariya Village Micro-Hub",
    details: "Hygienic stone-milling & wood-pressing conducted without high-heat processing or chemical refining.",
    metricsLabel: "Purity Index",
    metricsValue: "99.9% Pure",
    iconName: "Cog",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "quality-check",
    stepNumber: "04",
    stageName: "Zero-Chemical Residue Lab Audit",
    location: "Satpura Quality Assurance Lab",
    details: "Independent 230-parameter chemical residue screening confirming 0.00 ppm synthetic pesticide residue.",
    metricsLabel: "Chemical Residue",
    metricsValue: "0.00 PPM",
    iconName: "ShieldAlert",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "distribution",
    stepNumber: "05",
    stageName: "Eco-Packaging & Direct Shipping",
    location: "Bhopal Central Logistics Depot",
    details: "Sealed in biodegradable paper pouch with unique QR code linking directly to farmer Rameshwar's field log.",
    metricsLabel: "Supply Duration",
    metricsValue: "36 Hours from Mill",
    iconName: "Truck",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "home",
    stepNumber: "06",
    stageName: "Your Dining Table",
    location: "Conscious Household",
    details: "Nutritious, pure organic produce arrives at your doorstep with verified farm-to-table transparency.",
    metricsLabel: "Impact Delivered",
    metricsValue: "100% Honest Food",
    iconName: "Home",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800"
  }
];
