import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#070b13",
        surface: "#0e1523",
        panel: "#111b2d",
        line: "#1d2b42",
        ink: "#e6edf8",
        muted: "#91a0ba",
        orbit: "#44d7b6",
        cyan: "#4cc9f0",
        amber: "#f7b955",
        danger: "#fa5f72"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(68,215,182,.1), 0 18px 50px rgba(0,0,0,.28)"
      }
    }
  },
  plugins: []
};

export default config;
