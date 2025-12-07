// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    // Adjust these paths to match where you use Tailwind classes
    "./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}",
    "./pages/**/*.{html,js,ts,jsx,tsx}",
    "./components/**/*.{html,js,ts,jsx,tsx}",
    "./app/**/*.{html,js,ts,jsx,tsx}",
    "./index.html",
    "./*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Put your customizations here later if needed
    },
  },
  plugins: [],
};

export default config;
