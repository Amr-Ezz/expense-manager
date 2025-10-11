/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",          // All TSX files in /app
    "./components/**/*.{ts,tsx}",   // All TSX files in /components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};