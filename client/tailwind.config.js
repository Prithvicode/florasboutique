import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        p1: "#000000",
        s1: "#FFF5E1",
      },
      fontFamily: {
        ovo: ["Ovo", "serif"],
      },
      keyframes: {
        cartSlideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        cartSlideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        slideIn: "cartSlideIn 0.3s ease-out",
        slideOut: "cartSlideOut 0.3s ease-in",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
