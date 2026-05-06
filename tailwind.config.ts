import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e141d",
        surface: "#0e141d",
        "surface-dim": "#0e141d",
        "surface-bright": "#343944",
        "surface-container-lowest": "#080e17",
        "surface-container-low": "#161c25",
        "surface-container": "#1a2029",
        "surface-container-high": "#242a34",
        "surface-container-highest": "#2f353f",
        "on-surface": "#dde2f0",
        "on-surface-variant": "#c1c6d7",
        "on-background": "#dde2f0",
        outline: "#8b90a0",
        "outline-variant": "#414755",
        primary: "#adc6ff",
        "on-primary": "#002e69",
        "primary-container": "#4b8eff",
        "on-primary-container": "#00285c",
        secondary: "#a6e6ff",
        "on-secondary": "#003543",
        "secondary-container": "#14d1ff",
        tertiary: "#c2c1ff",
        "tertiary-container": "#8382ff",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        success: "#7be57b",
        warning: "#ffc278",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-base": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "1.0", letterSpacing: "0.08em", fontWeight: "700" }],
        "data-mono": ["14px", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "500" }],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      spacing: {
        "base-unit": "8px",
        gutter: "24px",
        "panel-padding": "20px",
        margin: "32px",
        "stack-gap": "12px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [forms],
};

export default config;
