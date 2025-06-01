/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#43da7a',
          500: '#43da7a',
        },
      },
    },
  },
  plugins: [],
};