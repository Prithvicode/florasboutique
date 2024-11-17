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
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
