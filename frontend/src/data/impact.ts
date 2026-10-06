export interface ImpactMetric {
  id: string;
  category: "soil" | "water" | "community" | "economic";
  title: string;
  value: string;
  change: string;
  period: string;
  description: string;
  details: string[];
}

export const impactMetricsData: ImpactMetric[] = [
  {
    id: "soil-health",
    category: "soil",
    title: "Organic Soil Carbon Density",
    value: "2.4%",
    change: "+1.1% vs regional baseline",
    period: "2023 - 2026",
    description: "Multi-year microbial regeneration restoring natural earthworm populations and topsoil moisture retention across Satpura farming belts.",
    details: [
      "Zero synthetic chemical fertilizers across 15,000+ acres",
      "Over 45,000 tons of natural compost & vermicompost enriched",
      "Microbial biodiversity index improved by 210%"
    ]
  },
  {
    id: "water-conservation",
    category: "water",
    title: "Agricultural Water Saved",
    value: "420M Litres",
    change: "-35% water intensity per crop cycle",
    period: "Annual Cumulative",
    description: "Implementation of drip irrigation, mulching, and climate-smart rainfed millet cropping in drought-vulnerable zones.",
    details: [
      "1,200 micro-check dams & farm ponds constructed",
      "Soil moisture sensors deployed across 350 farm clusters",
      "Rainwater harvesting coverage expanded by 80%"
    ]
  },
  {
    id: "farmer-income",
    category: "economic",
    title: "Average Farmer Income Increase",
    value: "+38%",
    change: "Direct transparent trade margin",
    period: "Year over Year",
    description: "Elimination of exploitative middlemen and direct price premiums paid for certified organic produce.",
    details: [
      "Guaranteed minimum floor price for transition farmers",
      "100% digital bank payout within 48 hours of harvest collection",
      "Zero transport burden for smallholder farmers"
    ]
  },
  {
    id: "community-empowerment",
    category: "community",
    title: "Women Agrarian Leadership",
    value: "42%",
    change: "Female-led organic cooperatives",
    period: "Current Active",
    description: "Empowering women smallholders through seed bank management, value-addition processing, and leadership roles.",
    details: [
      "18 women-led self-help processing hubs operational",
      "Financial literacy and digital payments training for 3,500+ women",
      "Community healthcare & clean water access initiatives"
    ]
  }
];
