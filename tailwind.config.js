/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0A',
        midnight: '#0B132B',
        champagne: '#C5A059',
        gold: '#D4AF37',
        purewhite: '#FFFFFF',
        offwhite: '#F5F5F5'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
