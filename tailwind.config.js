/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "375px",
        md: "768px",
        lg: "1440px",
      },
      colors: {
        "medium-gray": "#827F92",
        "off-white": "#E8E7EF",
        "light-green": "#A3FFAB",
        "soft-yellow": "#F6CD68",
        "dark-gray-blue": "#24232B",
        "very-dark-blue": "#18161F",
      },
    },
  },
  plugins: [],
};
