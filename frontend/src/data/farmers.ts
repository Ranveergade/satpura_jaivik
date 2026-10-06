export interface FarmerStory {
  id: string;
  name: string;
  role: string;
  location: string;
  experienceYears: number;
  primaryCrop: string;
  bio: string;
  quote: string;
  image: string;
  badges: string[];
  acreage: string;
  impactMetric: string;
}

export const farmersData: FarmerStory[] = [
  {
    id: "f1",
    name: "Rameshwar Patel",
    role: "Master Organic Cultivator",
    location: "Sohagpur, Hoshangabad",
    experienceYears: 22,
    primaryCrop: "Heirloom Champa Rice & Pulses",
    bio: "Transitioned 14 acres of ancestral farmland from heavy chemical dependence to 100% regenerative bio-dynamic agriculture. Now leads a cluster of 80 neighboring farms.",
    quote: "When soil is alive, crops don't fight diseases—they thrive naturally. Satpura Jaivik gave us direct market access so our hard work receives genuine value.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
    badges: ["Soil Health Champion", "Zero-Pesticide Certified", "Seed Saver"],
    acreage: "14 Acres",
    impactMetric: "+45% Income Stability"
  },
  {
    id: "f2",
    name: "Sunita Gond",
    role: "Tribal Spices & Medicinal Plants Lead",
    location: "Betul Forest Region",
    experienceYears: 16,
    primaryCrop: "Wild Turmeric & Herbal Spices",
    bio: "Pioneered sustainable forest-edge cultivation of medicinal wild turmeric using traditional indigenous wisdom combined with modern soil moisture sensors.",
    quote: "Our forest gives us treasures. By packaging our produce under Satpura Jaivik, consumers receive pure spices and our tribal youth find proud livelihoods here.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    badges: ["Forest Protection Guild", "Indigenous Seed Custodian"],
    acreage: "8 Acres",
    impactMetric: "3x Price Realization"
  },
  {
    id: "f3",
    name: "Vikram Sahu",
    role: "Millets & Dryland Farming Specialist",
    location: "Chhindwara Plateau",
    experienceYears: 14,
    primaryCrop: "Kodo & Little Millet",
    bio: "Specializes in climate-resilient rainfed millets. Created community seed banks preserving 12 rare indigenous millet varieties indigenous to the Satpura hills.",
    quote: "Water scarcity used to devastate our village. Growing organic millets with Satpura Jaivik requires 70% less water while yielding superfood nutrition for India.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    badges: ["Water Conservation Award", "Millet Master"],
    acreage: "18 Acres",
    impactMetric: "70% Water Saved"
  }
];
