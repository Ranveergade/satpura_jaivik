import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f2f7f4",
          100: "#e1ede6",
          200: "#c5ddcf",
          300: "#9ec4b0",
          400: "#72a48d",
          500: "#508770",
          600: "#3c6d59",
          700: "#305748",
          800: "#27463b",
          900: "#1b332b",
          950: "#0b1713",
        },
        leaf: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        cream: {
          50: "#fdfbf7",
          100: "#f7f2e8",
          200: "#efe6d5",
          300: "#e3d3b9",
          400: "#d4bc97",
          500: "#c5a477",
          600: "#b38c5d",
          700: "#96704b",
          800: "#7c5c3f",
          900: "#4a3525",
        },
        soil: {
          50: "#fdf8f5",
          100: "#f9eee7",
          200: "#f3dad0",
          300: "#e7bead",
          400: "#d89b83",
          500: "#c7775c",
          600: "#b45a40",
          700: "#964632",
          800: "#7c3c2d",
          900: "#5c2e23",
          950: "#361812",
        },
        sand: {
          50: "#faf9f6",
          100: "#f4f1ea",
          200: "#e6e0d3",
          300: "#d3c8b4",
          900: "#1c1917",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
        "beam": "beam 3s linear infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "0.4" },
        },
        beam: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "grain-pattern": "url('/images/grain.png')",
        "hero-gradient": "radial-gradient(circle at 50% 20%, rgba(45, 106, 79, 0.15), transparent 70%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
