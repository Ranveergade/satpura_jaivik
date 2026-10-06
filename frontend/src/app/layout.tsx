import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Satpura Jaivik | From Satpura's Soil to Every Home",
  description: "Satpura Jaivik connects farmers, sustainable agriculture, and conscious consumers through a transparent ecosystem built around healthier soil, healthier food, and healthier communities.",
  keywords: ["Organic Farming", "Satpura Jaivik", "Agritech India", "Sustainable Agriculture", "Direct Farmer Trade", "Organic Produce", "Traceable Food"],
  authors: [{ name: "Satpura Jaivik Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <body className="bg-forest-950 text-cream-100 antialiased font-sans selection:bg-forest-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
