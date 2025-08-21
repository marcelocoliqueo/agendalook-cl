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
        // Colores exactos del HTML de referencia
        brand: '#0ea5e9', // sky-500
        'brand-600': '#0284c7', // sky-600
        accent: '#22c55e', // emerald-500
        ink: '#0f172a', // slate-900
        bg: '#f8fafc', // slate-50
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Ubuntu', 'Helvetica Neue', 'Arial'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config; 