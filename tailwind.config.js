/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    fontFamily: {
      display: ['\'Red Hat Display\'', 'serif'],
    },
    extend: {
      screens: {
        '2xl': '1320px',
      },
    },
  },
  plugins: [],
};
