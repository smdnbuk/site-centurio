/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-surface-variant":        "#A0A0A0",
        "surface-container-low":     "#242424",
        "surface-container-high":    "#333333",
        "primary-fixed-dim":         "#D4AF37",
        "surface-container":         "#2A2A2A",
        "surface":                   "#1A1A1A",
        "surface-container-lowest":  "#121212",
        "on-surface":                "#E1E1E1",
        "primary":                   "#D4AF37",
        "secondary":                 "#8E8E8E",
        "on-primary":                "#1A1A1A",
        "surface-container-highest": "#404040",
        "outline-variant":           "#404040",
        "outline":                   "#666666",
        "tertiary":                  "#D4AF37",
        "primary-container":         "#2A2100",
        "secondary-container":       "#333333",
        "background":                "#1c1c1e"
      },
      fontFamily: {
        "headline": ["Cormorant Garamond", "serif"],
        "body":     ["Manrope", "sans-serif"],
        "label":    ["Manrope", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0px", "lg": "0px", "xl": "0px", "full": "9999px" },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
}
