export interface EcosystemNode {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  keyFeatures: string[];
  icon: string;
  color: string;
}

export const ecosystemNodes: EcosystemNode[] = [
  {
    id: "farmers",
    stepNumber: "01",
    title: "FARMERS & SOIL",
    subtitle: "Organic cultivation & bio-inputs",
    description: "Smallholder farmers in the Satpura belt cultivate heirloom crops using natural compost, Jeevamrut, rainwater harvesting, and organic crop rotation.",
    keyFeatures: [
      "100% Non-GMO heirloom seeds",
      "Bio-dynamic soil testing & organic inputs",
      "Fair price floor guarantee"
    ],
    icon: "Sprout",
    color: "#52B788"
  },
  {
    id: "satpura-platform",
    stepNumber: "02",
    title: "SATPURA JAIVIK HUB",
    subtitle: "Technology & Quality Assurance",
    description: "Digital platform providing farmers with real-time weather alerts, agronomist advice, batch tracking, and direct harvest scheduling.",
    keyFeatures: [
      "IoT moisture & soil monitoring",
      "Lab testing for zero chemical residue",
      "Transparent direct digital payments"
    ],
    icon: "Cpu",
    color: "#74C69D"
  },
  {
    id: "processing",
    stepNumber: "03",
    title: "CLEAN PROCESSING",
    subtitle: "Solar drying & cold milling",
    description: "Micro-processing centers situated near village clusters run on solar energy to clean, sun-dry, wood-press oil, and hygienically pack produce.",
    keyFeatures: [
      "Solar powered micro-mills",
      "Traditional wood-ghani oil extraction",
      "Zero chemical bleaching or refining"
    ],
    icon: "Factory",
    color: "#D4BC97"
  },
  {
    id: "distribution",
    stepNumber: "04",
    title: "DISTRIBUTION & LOGISTICS",
    subtitle: "Cold-chain & farm-fresh delivery",
    description: "Direct-to-consumer logistics network ensuring produce travels efficiently from rural Satpura directly to city households within days.",
    keyFeatures: [
      "Eco-friendly paper & jute packaging",
      "Shortened supply chain (< 48 hrs)",
      "Batch tracking QR code assigned"
    ],
    icon: "Truck",
    color: "#A06A42"
  },
  {
    id: "consumers",
    stepNumber: "05",
    title: "CONSCIOUS CONSUMERS",
    subtitle: "Healthy homes & transparent trust",
    description: "Families enjoy nutrient-rich, unadulterated organic produce while directly empowering rural Indian agrarian communities with every bite.",
    keyFeatures: [
      "100% Traceable batch QR code",
      "Chemical-free pure family health",
      "Direct impact on rural livelihoods"
    ],
    icon: "HeartHandshake",
    color: "#508770"
  }
];
