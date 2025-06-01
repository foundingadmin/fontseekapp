/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#43DA7A',
          500: '#43DA7A',
        },
      },
    },
  },
  plugins: [],
};