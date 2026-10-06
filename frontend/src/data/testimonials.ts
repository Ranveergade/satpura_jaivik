export interface Testimonial {
  id: string;
  type: "consumer" | "farmer" | "expert";
  author: string;
  role: string;
  location: string;
  avatar: string;
  quote: string;
  highlight: string;
  verified: boolean;
}

export const testimonialsData: Testimonial[] = [
  {
    id: "t1",
    type: "consumer",
    author: "Ananya Deshmukh",
    role: "Conscious Homemaker & Nutritionist",
    location: "Bhopal, MP",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    quote: "Switching to Satpura Jaivik rice and mustard oil brought back the authentic taste of clean, natural food. The QR code traceability on the bag showing the exact farmer in Hoshangabad gave me complete peace of mind for my family.",
    highlight: "Authentic taste & verified QR origin traceability",
    verified: true
  },
  {
    id: "t2",
    type: "farmer",
    author: "Bhurasingh Korku",
    role: "Organic Turmeric Cultivator",
    location: "Betul, MP",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    quote: "Earlier, traders took our turmeric at throwaway prices. Satpura Jaivik brought soil testing, bio-inputs, and guaranteed fair prices. Now our children attend good schools and our soil is healthier than ever.",
    highlight: "Fair price security & dignifying livelihoods",
    verified: true
  },
  {
    id: "t3",
    type: "expert",
    author: "Dr. Arvind Shrivastava",
    role: "Senior Agronomist & Soil Scientist",
    location: "Jabalpur Agriculture Institute",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    quote: "Satpura Jaivik is executing a true gold standard in regenerative agriculture. By building direct infrastructure between Satpura’s hyper-local farming clusters and urban markets, they are solving both ecological and economic crises.",
    highlight: "Gold standard in regenerative agriculture",
    verified: true
  }
];
