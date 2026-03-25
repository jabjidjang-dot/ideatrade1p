// idt1/tailwind.config.js
import { colors } from "./src/theme/theme.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        primary: colors.primary,
        accent: colors.accent,
        text: colors.text,
        border: colors.border,
      },
    },
  },
  plugins: [],
};
