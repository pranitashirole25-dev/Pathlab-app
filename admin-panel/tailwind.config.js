/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0F172A',
        glassBg: 'rgba(30, 41, 59, 0.7)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        primary: '#38BDF8',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171'
      }
    },
  },
  plugins: [],
}
