/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  

    extend: {
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        customBlue: "#1E3A8A",
        customGreen: "#16A34A",
        customOrange: "#E3902F",
        customRed: "#B91C1C",
        customGray: "#4B5563",
      },
      boxShadow: {
        favShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  
  plugins: [],
};


