/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5145E5",
        "primary-dark": "#4338CA",
        background: "#F5F6FF",
        surface: "#FFFFFF",
        text: {
          primary: "#111827",
          secondary: "#64748B",
        },
        border: "#E2E8F0",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
}
