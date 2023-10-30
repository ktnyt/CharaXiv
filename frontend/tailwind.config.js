/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      blue: {
        ...colors.blue,
        450: "#4d94f8",
        550: "#2f73f0",
      },
      green: {
        ...colors.green,
        450: "#34d16d",
        550: "#1bb353",
      },
      yellow: {
        ...colors.yellow,
        450: "#f8ad17",
        550: "#e78808",
      },
      red: {
        ...colors.red,
        450: "#f35a5a",
        550: "#e53434",
      },
      purple: {
        ...colors.purple,
        450: "#b16cf9",
        550: "#9b43f0",
      },
      nord: {
        0: "#f9fafb",
        50: "#eceff1",
        100: "#e0e4e8",
        150: "#d4d9df",
        200: "#c8ced5",
        250: "#bdc4cc",
        300: "#b1b9c3",
        350: "#a6afb9",
        400: "#9ca5b0",
        450: "#919ba7",
        500: "#87919e",
        550: "#7d8794",
        600: "#737d8b",
        650: "#6a7382",
        700: "#616a78",
        750: "#58616f",
        800: "#4f5866",
        850: "#464f5c",
        900: "#3e4653",
        950: "#363d4a",
        1000: "#2f3541",
      },
    },
  },
  plugins: [],
};
