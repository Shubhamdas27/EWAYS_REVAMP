/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'admin': '0 10px 25px rgba(0, 86, 179, 0.5)',
      }
    },
  },
  plugins: [],
};
