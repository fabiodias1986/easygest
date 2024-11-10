/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#e6f2ff',
          100: '#baddff',
          200: '#8ec8ff',
          300: '#62b3ff',
          400: '#36a0ff',
          500: '#0a8dff',
          600: '#0070cc',
          700: '#005299',
          800: '#003566',
          900: '#001733',
        },
      },
    },
  },
  plugins: [],
}