/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'surface-darkest': '#16251d',
        'surface-dark': '#2b3a34',
        'surface-mid': '#424f47',
        'surface-mid-dark': '#5a665f',
        'surface-mid-light': '#737e77',
        'surface-light-dark': '#8d9692',
        'surface-light' : '#b4b1ba',
        'primary': '#4ead61',
        'secondary': '#5bcf72'
      },
    },
  },
  plugins: [

  ],
});
