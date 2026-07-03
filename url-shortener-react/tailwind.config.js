/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #4f46e5, #2563eb)", // Premium Indigo-to-Blue gradient
        "custom-gradient-2": "linear-gradient(to left, #4f46e5, #2563eb)",
        "card-gradient": "linear-gradient(to bottom, #ffffff, #f8fafc)",
      },
      colors: {
        accent: "#2563EB",
        accentHover: "#1D4ED8",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
        border: "#E5E7EB",
        background: "#FFFFFF",
        surface: "#FAFAFA",
        navbarColor: "#ffffff",
        btnColor: "#0f172a", 
        linkColor: "#2563eb", 
        accentColor: "#475569", 
        premiumIndigo: "#4f46e5",
        premiumBlue: "#2563eb",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        custom: "0 10px 40px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)", 
        right: "4px 0px 10px -5px rgba(0, 0, 0, 0.03)",
        "glow-blue": "0 0 30px rgba(59, 130, 246, 0.08), 0 10px 40px rgba(59, 130, 246, 0.03)",
        "glow-indigo": "0 0 30px rgba(99, 102, 241, 0.08), 0 10px 40px rgba(99, 102, 241, 0.03)",
        "glow-slate": "0 0 30px rgba(15, 23, 42, 0.05), 0 10px 40px rgba(15, 23, 42, 0.02)",
        "glow-premium": "0 20px 50px rgba(79, 70, 229, 0.06), 0 2px 4px rgba(79, 70, 229, 0.01)",
      },
      fontFamily: {
        roboto: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        montserrat: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },

  variants: {
    extend: {
      backgroundImage: ["responsive"],
    },
  },

  plugins: [],
};