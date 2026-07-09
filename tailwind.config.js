/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '.mobile-root',
  theme: {
    extend: {
      colors: {
        background: '#F8F5F1',
        primary: '#2F2A25',
        secondary: '#6E665E',
        accent: '#B68D5A',
        clay: '#8A6545',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
