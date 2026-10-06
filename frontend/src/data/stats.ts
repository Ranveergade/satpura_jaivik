export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  iconName: string;
}

export const impactStats: StatItem[] = [
  {
    id: "farmers",
    value: 10000,
    suffix: "+",
    label: "Farmers Empowered",
    description: "Partnered across the Satpura mountain belt",
    iconName: "Users"
  },
  {
    id: "products",
    value: 50,
    suffix: "+",
    label: "Organic Products",
    description: "100% lab tested and heirloom certified",
    iconName: "Sprout"
  },
  {
    id: "communities",
    value: 25,
    suffix: "+",
    label: "Rural Clusters",
    description: "Self-sustaining agrarian communities",
    iconName: "MapPin"
  },
  {
    id: "traceable",
    value: 100,
    suffix: "%",
    label: "Traceable Produce",
    description: "Direct batch verification from farm origin",
    iconName: "ShieldCheck"
  }
];
