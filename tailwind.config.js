/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  safelist: [
  "bg-status-success-bg",
  "text-status-success",
  "bg-status-warning-bg",
  "text-status-warning",
  "bg-status-danger-bg",
  "text-status-danger",
  "bg-status-info-bg",
  "text-status-info",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F3D5C",
          light: "#2C6E8E",
        },
        accent: "#0D9488",
        bg: "#F4F7F9",
        surface: "#FFFFFF",
        text: {
          DEFAULT: "#16232E",
          muted: "#5A6B78",
        },
        border: "#DCE4E8",
        status: {
          success: "#15803D",
          "success-bg": "#F0FDF4",
          warning: "#B45309",
          "warning-bg": "#FFFBEB",
          danger: "#B91C1C",
          "danger-bg": "#FEF2F2",
          info: "#1D4ED8",
          "info-bg": "#EFF6FF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,35,46,0.06)",
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};