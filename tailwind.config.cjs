/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,svelte}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
      textColor: {
        default: "var(--color-text)",
        title: "var(--color-text-title)",
        description: "var(--color-text-description)",
      },
      backgroundColor: {
        default: "var(--color-background)",
        secondary: "var(--color-background-secondary)",
        card: "var(--color-background-card)",
        "card-header": "var(--color-background-card-header)",
      },
      borderColor: {
        default: "var(--color-border)",
      },
    },
  },
  plugins: [],
};
