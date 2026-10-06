export interface ProblemSolutionCard {
  id: string;
  problem: string;
  solution: string;
  description: string;
  impactTag: string;
  iconName: string;
  highlightColor: string;
}

export const whySatpuraCards: ProblemSolutionCard[] = [
  {
    id: "soil-degradation",
    problem: "Soil Degradation & Chemical Overuse",
    solution: "Regenerative Bio-Dynamic Agriculture",
    description: "Decades of intensive chemical farming depleted soil organic carbon. We restore microbial life using traditional organic inputs, neem extracts, and vermicompost.",
    impactTag: "+120% Earthworm Biomass",
    iconName: "Flame",
    highlightColor: "from-amber-500/20 to-emerald-500/10"
  },
  {
    id: "uncertain-income",
    problem: "Uncertain Farmer Income & Middlemen Exploitation",
    solution: "Direct Farmer Trade & Fair Price Floor",
    description: "Smallholders lose up to 60% of value to intermediaries. Satpura Jaivik guarantees direct farm-gate collection with transparent digital payouts within 48 hours.",
    impactTag: "Guaranteed +35% Fair Premium",
    iconName: "TrendingUp",
    highlightColor: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: "consumer-distrust",
    problem: "Lack of Transparency & Adulterated Produce",
    solution: "100% QR-Traceable Batch Transparency",
    description: "Consumers pay premium prices for 'organic' claims without proof. Every Satpura Jaivik package includes a QR code showing farm origin, harvest date, and lab reports.",
    impactTag: "230 Lab Parameter Verified",
    iconName: "ShieldCheck",
    highlightColor: "from-blue-500/20 to-emerald-500/10"
  },
  {
    id: "supply-chain",
    problem: "Complex, Opaque Supply Chain Latency",
    solution: "Hyper-Local Processing & Shortened Route",
    description: "Long transit delays reduce crop fresh value and increase food waste. Our rural solar micro-milling hubs process crops right at the village cluster boundary.",
    impactTag: "48-Hour Harvest-to-Pack",
    iconName: "Zap",
    highlightColor: "from-yellow-500/20 to-emerald-500/10"
  }
];
