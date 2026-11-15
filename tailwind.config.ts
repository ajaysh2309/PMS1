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
        alstom: {
          navy: "#0A2A6B",
          blue: "#1F4FB2",
          red: "#E4002B",
          green: "#1E8E5A",
          amber: "#F2A900",
          sky: "#4DA3FF",
          bg: "#F4F6FA",
          border: "#D9DEE8",
          text: "#1B2430",
          muted: "#5B6677",
        },
      },
      fontFamily: {
        sans: ["Inter", "Source Sans 3", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
