/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terracotta: "#B4532A",
        copper: "#A85A2A",
        cream: "#FFF3EA",
        ivory: "#FFF9F5",
        blush: "#FBE7DC",
        cocoa: "#4A2C1A",
        taupe: "#7A6255",
        olive: "#74651F",
        sage: "#7C8B63"
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(74, 44, 26, 0.12)"
      }
    }
  },
  plugins: []
};
